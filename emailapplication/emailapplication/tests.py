from django.test import TestCase
from .models import User, Email
# Create your tests here.


class PostsTestCase(TestCase):
    def setUp(self):

        # Create users
        user1 = User.objects.create(username="Test1", password="password")

        # Create Posts
        Email.objects.create(user = user1, sender = user1, subject ="This is a test subject", body="This is a test body")
        Email.objects.create(user = user1, sender = user1, subject ="", body="This is a test body")
        Email.objects.create(user = user1, sender = user1, subject ="This is a test subject", body="")

    def test_valid_email(self):
        """Checking that valid email returns valid"""
        user1 = User.objects.get(username="Test1")
        email = Email.objects.get(user=user1, sender = user1, subject ="This is a test subject", body="This is a test body")
        self.assertTrue(email.is_valid_email())

    def test_invalid_subject(self):
        """Checking that invalid subject returns invalid"""
        user1 = User.objects.get(username="Test1")
        email = Email.objects.get(user=user1, sender = user1, subject ="", body="This is a test body")
        self.assertFalse(email.is_valid_email())

    def test_invalid_body(self):
        """Checking that invalid body returns invalid"""
        user1 = User.objects.get(username="Test1")
        email = Email.objects.create(user=user1, sender = user1, subject ="This is a test subject", body="")
        self.assertFalse(email.is_valid_email())