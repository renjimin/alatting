from django import forms
from django.forms.formsets import BaseFormSet
from survey import *
from django.utils import html


class ChoiceForm(forms.Form):
	c_text = forms.CharField(widget=forms.TextInput(attrs={'placeholder': '请输入'}))


class SubmitButtonWidget(forms.Widget):
	def render(self, name, value, attrs=None):
		return '<input type="submit" name="%s" value="%s">' % (html.escape(name), html.escape(value))

class SubmitButtonField(forms.Field):
	def __init__(self, *args, **kwargs):
		if not kwargs:
			kwargs = {}
		kwargs["widget"] = SubmitButtonWidget
		super(SubmitButtonField, self).__init__(*args, **kwargs)

	def clean(self, value):
		return value

class ChoiceInputForm(forms.Form):
	c_input_text = forms.CharField(widget=forms.TextInput(attrs={'placeholder': '请输入'}))
	c_input = SubmitButtonField(label="", initial=u"+加入输入框")
