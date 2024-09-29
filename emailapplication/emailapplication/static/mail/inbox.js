document.addEventListener('DOMContentLoaded', function() {
  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  // Waiting for email to be submitted
  document.querySelector('#compose-form').onsubmit = send_email;
  
  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#view-emails').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
  
} 

function send_email() {
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: document.querySelector('#compose-recipients').value,
      subject: document.querySelector('#compose-subject').value,
      body: document.querySelector('#compose-body').value
      })
    })
  .then(response => response.json())
  .then(result => {
    // Print result
    console.log(result);
    load_mailbox('sent')
    })
  return false;
  }

function load_mailbox(mailbox) {
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#view-emails').style.display = 'none';
  document.querySelector('#view-emails').innerHTML = '';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(result => {
    const listofemails = document.createElement('div');
    listofemails.className = "list-group";
    document.querySelector("#emails-view").append(listofemails);
    result.forEach(email => {
      const newelement = document.createElement('button');
      newelement.innerHTML = `<strong>${email.sender}</strong> sent <strong>${email.subject}</strong> at ${email.timestamp}`;
      newelement.type = "button";
      newelement.className = "list-group-item";
      if (email.read === false) {
          newelement.style.backgroundColor = "#C5C6D0"
        } else {
        newelement.style.backgroundColor = "white"
        }
      newelement.addEventListener('click', () => {
        view_email(email);
      })
      listofemails.append(newelement);
    });
  });
}

function view_email(email) {
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#view-emails').style.display = 'block';
  const archiveelement = document.createElement('button');
  if (email.archived === true) {
    archiveelement.innerHTML = "Unarchive?";  
  } else {
    archiveelement.innerHTML = "Archive?";
  }
  archiveelement.className = "btn btn-sm btn-outline-primary";
  archiveelement.style.margin = "0px 5px 15px 0px";
  const replyelement = document.createElement('button');
  replyelement.innerHTML = "Reply?"
  replyelement.className = "btn btn-sm btn-outline-primary";
  replyelement.style.margin = "0px 0px 15px 5px";
  document.querySelector('#view-emails').append(archiveelement);
  document.querySelector('#view-emails').append(replyelement);
  archiveelement.addEventListener('click', () => {
    archive_email(email);
  })
  replyelement.addEventListener('click', () => {
    reply_email(email);
  })
  create_email_view(email);
  fetch(`/emails/${email.id}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: false
    })
  })
}

function archive_email(email) {
  if (email.archived === true) {
    fetch(`/emails/${email.id}`, {
      method: 'PUT',
      body: JSON.stringify({
          archived: false
      })
    })  
  } else {
    fetch(`/emails/${email.id}`, {
      method: 'PUT',
      body: JSON.stringify({
          archived: true
      })
    })
  }
  return load_mailbox("inbox");
}

function create_email_view(email) {
  const newemail = document.createElement('div');
  newemail.className = "panel panel-default";
  document.querySelector('#view-emails').append(newemail);
  const newtitlepanel = document.createElement('div');
  newtitlepanel.className = "panel-heading";
  newemail.append(newtitlepanel);
  const newtitle = document.createElement('h3');
  newtitle.className = "panel-title";
  newtitle.innerHTML = `${email.subject}`;
  newtitlepanel.append(newtitle);
  const newemailcontent = document.createElement('div');
  newemailcontent.innerHTML = `${email.body}`;
  newemailcontent.className = "panel-body";
  newemail.append(newemailcontent);
}

function reply_email(email) {
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#view-emails').style.display = 'none';

  document.querySelector('#compose-recipients').value = `${email.sender}`;
  if (email.subject.substring(0,3) === "Re:") {
    document.querySelector('#compose-subject').value = `${email.subject}`;
  } else {
    document.querySelector('#compose-subject').value = `Re: ${email.subject}`;
  }
  document.querySelector('#compose-body').value = `On ${email.timestamp} ${email.sender} wrote: "${email.body}"`;
}