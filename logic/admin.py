from django.contrib import admin
from logic.models import Person, Image, Music, Video, Category, Poster, PosterImage, PosterVideo, PosterLike, Comment, Invite


@admin.register(Person)
class PersonAdmin(admin.ModelAdmin):
    list_display = [pair[0].name for pair in Person._meta.get_concrete_fields_with_model()]


@admin.register(Image)
class PersonAdmin(admin.ModelAdmin):
    list_display = [pair[0].name for pair in Image._meta.get_concrete_fields_with_model()]


@admin.register(Music)
class PersonAdmin(admin.ModelAdmin):
    list_display = [pair[0].name for pair in Music._meta.get_concrete_fields_with_model()]


@admin.register(Video)
class PersonAdmin(admin.ModelAdmin):
    list_display = [pair[0].name for pair in Video._meta.get_concrete_fields_with_model()]


@admin.register(Category)
class PersonAdmin(admin.ModelAdmin):
    list_display = [pair[0].name for pair in Category._meta.get_concrete_fields_with_model()]


@admin.register(Poster)
class PersonAdmin(admin.ModelAdmin):
    list_display = [pair[0].name for pair in Poster._meta.get_concrete_fields_with_model()]


@admin.register(PosterImage)
class PersonAdmin(admin.ModelAdmin):
    list_display = [pair[0].name for pair in PosterImage._meta.get_concrete_fields_with_model()]


@admin.register(PosterVideo)
class PersonAdmin(admin.ModelAdmin):
    list_display = [pair[0].name for pair in PosterVideo._meta.get_concrete_fields_with_model()]


@admin.register(PosterLike)
class PersonAdmin(admin.ModelAdmin):
    list_display = [pair[0].name for pair in PosterLike._meta.get_concrete_fields_with_model()]


@admin.register(Comment)
class PersonAdmin(admin.ModelAdmin):
    list_display = [pair[0].name for pair in Comment._meta.get_concrete_fields_with_model()]


@admin.register(Invite)
class PersonAdmin(admin.ModelAdmin):
    list_display = [pair[0].name for pair in Invite._meta.get_concrete_fields_with_model()]