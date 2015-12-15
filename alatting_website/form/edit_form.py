__author__ = 'ubuntu'
from django import forms
from alatting_website.models import Poster, Template


class CreateForm(forms.ModelForm):
    template = forms.ModelChoiceField(queryset=Template.objects.all())

    class Meta:
        model = Poster
        fields = ('main_category', 'sub_category', 'data', 'html', 'css', 'script')

    def save(self, commit=True):
        self.instance.template = self.cleaned_data['template']
        return super(CreateForm, self).save(commit)
