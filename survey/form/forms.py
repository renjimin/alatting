from django import forms
from survey import *

class QuestionForm(forms.Form):
	qs_type = forms.ChoiceField(choices = QuestionChoices)

class ChoiceForm(forms.Form):
	choice_add = forms.CharField()