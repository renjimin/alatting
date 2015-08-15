from django.db import models

class Poster(models.Model):
    title = models.CharField(max_length=32)
