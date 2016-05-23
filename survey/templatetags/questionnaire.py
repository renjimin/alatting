from django import template
from django.utils.safestring import mark_safe
from django.utils.translation import ugettext as _
from django.core.urlresolvers import reverse

register = template.Library()


@register.filter(name="dictget")
def dictget(thedict, key):
    "{{ dictionary|dictget:variableholdingkey }}"
    return thedict.get(key, None)

@register.filter(name="choicesplit")
def choicesplit(value, sep = ":"):
    parts = value.split(sep)
    return (parts[0], sep.join(parts[1:]))