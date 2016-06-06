from django import forms
from django.forms.formsets import BaseFormSet
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

class BaseChoiceFormSet(BaseFormSet):
	def __init__(self, *args, **kwargs):
		super(BaseChoiceFormSet, self).__init__(*args, **kwargs)
		for form in self.forms:
			form.empty_permitted = False
			
	def clean(self):
		"""
		Adds validation to check that no two ChoiceForms/ChoiceInputForms have the same 
		c_text or c_value, and that all ChoiceForms/ChoiceInputForms have both a c_text
		and c_value.
		"""
		if any(self.errors):
			return

		c_texts = []
		c_values = []
		duplicates = False

		for form in self.forms:
			if form.cleaned_data:
				c_text = form.cleaned_data['c_text']
				c_value = form.cleaned_data['c_value']

				# Check that no two ChoiceForms/ChoiceInputForms have the same c_text or c_value
				if c_text and c_value:
					if c_text in c_texts:
						duplicates = True
					c_texts.append(c_text)

					if c_value in c_values:
						duplicates = True
					c_values.append(c_value)

				if duplicates:
					raise forms.ValidationError(
						'选项必须有不同的文字描述和答案',
						code='duplicate_choices'
					)

				# Check that all links have both an anchor and URL
				if c_text and not c_value:
					raise forms.ValidationError(
						'选择必须包含答案',
						code='missing_c_value'
					)
				elif c_value and not c_text:
					raise forms.ValidationError(
						'选择必须包含文字描述',
						code='missing_c_text'
					)