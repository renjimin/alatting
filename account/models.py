from django.db import models
from utils.db.fields import (BigAutoField)

# Create your models here.

class LoginMessage(models.Model):
    id = BigAutoField(primary_key=True)
    phonenumber = models.CharField(max_length=12)
    message = models.CharField(max_length=10)
    created_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "{:s}_{:s}".format(self.phonenumber, self.message)

