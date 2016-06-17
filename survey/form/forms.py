from django import forms
from django.forms.formsets import BaseFormSet
from survey import *


class ChoiceForm(forms.Form):
	c_text = forms.CharField()