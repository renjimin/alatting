from django import forms


class CaptureForm(forms.Form):
    url = forms.URLField(initial='http://127.0.0.1:8001/poster/1/')
