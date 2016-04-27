from django.db import models
from utils.db.fields import (BigAutoField)

# Create your models here.

class LoginMessage(models.Model):
    id = BigAutoField(primary_key=True)
    username = models.CharField(max_length=254)
    message = models.CharField(max_length=10)
    created_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "{:s}".format(self.id)

