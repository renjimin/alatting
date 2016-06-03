from django import forms
from survey import *

class QuestionForm(forms.Form):
	q_text = forms.CharField()
	q_short_text = forms.CharField()
	q_type = forms.ChoiceField(choices = QuestionChoices)

class ChoiceForm(forms.Form):
	c_text = forms.CharField()
	c_value = forms.CharField()

class ChoiceInputForm(forms.Form):
	c_text = forms.CharField()
	c_value = forms.CharField()
	c_input = forms.BooleanField(required=False)
	c_input_ph = forms.CharField(required=False)