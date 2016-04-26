from django.apps import AppConfig
 
 
class AlattingWebsiteConfig(AppConfig):
    name = 'alatting_website'
    verbose_name = 'Alatting Website Application'
 
    def ready(self):
        import alatting_website.signals