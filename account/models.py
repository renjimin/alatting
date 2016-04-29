from django.db import models
from django.contrib.auth.models import User
from utils.db.fields import (BigAutoField)


class LoginMessage(models.Model):
    id = BigAutoField(primary_key=True)
    username = models.CharField(max_length=255, default='')
    message = models.CharField(max_length=10, default='')
    created_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "{:s}".format(self.id)

class UserFriends(models.Model):
	id = BigAutoField(primary_key=True)
	#user1 follow user2
	user1 = models.ForeignKey(User, related_name='user1')
	user2 = models.ForeignKey(User, related_name='user2')
	
	def __str__(self):
		return "{:d}".format(self.pk)
