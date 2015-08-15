from django.contrib import admin
from front.models import Poster


class PosterAdmin(admin.ModelAdmin):
    pass


admin.site.register(Poster, PosterAdmin)