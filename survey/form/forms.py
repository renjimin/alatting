from django import forms
from survey import *

class QuestionForm(forms.Form):
	q_text = forms.CharField()
	q_short_text = forms.CharField()
	q_type = forms.ChoiceField(choices = QuestionChoices)

class ChoiceForm(forms.Form):
	choice_add = forms.CharField()