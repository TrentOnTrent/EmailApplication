from django.contrib import admin
from .models import EmailUser, Email

admin.site.register(EmailUser)
admin.site.register(Email)