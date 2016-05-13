from django.db import models
from alatting_website.models import Category
import os
from django.conf import settings

class Survey(models.Model):
	name = models.CharField(max_length=64, unique=True)
	main_category = models.ForeignKey(
		Category,
		related_name='main_cat_surveys',
		limit_choices_to={'parent__isnull': True},
		null=True
	)
	sub_category = models.ForeignKey(
		Category,
		related_name='sub_cat_surveys',
		limit_choices_to={'parent__isnull': False},
		null=True
	)
	
	def __str__(self):
		return "{:s}".format(self.name)

	def get_template_static_dir_path(self, with_root=False):
		dir_root = os.path.join(settings.BASE_DIR, 'survey',
								'templates', 'survey_template')
		full_path = os.path.join(dir_root, self.name)
		if with_root:
			return full_path
		else:
			return full_path.replace(settings.BASE_DIR, '')

	def html_path(self):
		return os.path.join(self.get_template_static_dir_path(), 'index.html')

	def css_path(self):
		return os.path.join(self.get_template_static_dir_path(), 'index.css')

	def js_path(self):
		return os.path.join(self.get_template_static_dir_path(), 'index.js')

	def static_file_exists(self):
		html = os.path.join(settings.BASE_DIR, self.html_path()[1:])
		css = os.path.join(settings.BASE_DIR, self.css_path()[1:])
		js = os.path.join(settings.BASE_DIR, self.js_path()[1:])
		return all([
			os.path.exists(html),
			os.path.exists(css),
			os.path.exists(js)
		])