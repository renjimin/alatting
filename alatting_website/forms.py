__author__ = 'tianhuyang'
from django import forms


class CaptureForm(forms.Form):
    url = forms.URLField(initial='http://alatting.com:8000/poster/1/')
