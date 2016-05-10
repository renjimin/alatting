from django.db import models

# Create your models here.
from utils.db.fields import BigAutoField
from alatting_website.model.resource import Image


class SystemImage(models.Model):
    id = BigAutoField(primary_key=True)
    image = models.ForeignKey(Image, related_name='system_images')

    def __str__(self):
        return "{:d}".format(self.pk)