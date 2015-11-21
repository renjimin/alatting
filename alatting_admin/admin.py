from django.contrib import admin
from alatting_website.models import Person, Image, Music, Video, Category, Poster, PosterImage, PosterVideo, PosterLike, \
Comment, Address, PosterPage, Rating, PosterStatistics
from alatting_website.models import ActivityInvitation, BusinessMarketing, ProductSell, ExpertShow, Template, TemplateRegion


@admin.register(Person)
class PersonAdmin(admin.ModelAdmin):
    list_display = [pair[0].name for pair in Person._meta.get_concrete_fields_with_model()]


@admin.register(Image)
class ImageAdmin(admin.ModelAdmin):
    list_display = [pair[0].name for pair in Image._meta.get_concrete_fields_with_model()]


@admin.register(Music)
class MusicAdmin(admin.ModelAdmin):
    list_display = [pair[0].name for pair in Music._meta.get_concrete_fields_with_model()]


@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = [pair[0].name for pair in Video._meta.get_concrete_fields_with_model()]


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = [pair[0].name for pair in Category._meta.get_concrete_fields_with_model()]


@admin.register(Poster)
class PosterAdmin(admin.ModelAdmin):
    list_display = [pair[0].name for pair in Poster._meta.get_concrete_fields_with_model()]


@admin.register(PosterImage)
class PosterImageAdmin(admin.ModelAdmin):
    list_display = [pair[0].name for pair in PosterImage._meta.get_concrete_fields_with_model()]


@admin.register(PosterVideo)
class PosterVideoAdmin(admin.ModelAdmin):
    list_display = [pair[0].name for pair in PosterVideo._meta.get_concrete_fields_with_model()]


@admin.register(PosterLike)
class PosterLikeAdmin(admin.ModelAdmin):
    list_display = [pair[0].name for pair in PosterLike._meta.get_concrete_fields_with_model()]


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = [pair[0].name for pair in Comment._meta.get_concrete_fields_with_model()]


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = [pair[0].name for pair in Address._meta.get_concrete_fields_with_model()]


@admin.register(ActivityInvitation)
class ActivityInvitationAdmin(admin.ModelAdmin):
    list_display = [pair[0].name for pair in ActivityInvitation._meta.get_concrete_fields_with_model()]


@admin.register(BusinessMarketing)
class BusinessMarketingAdmin(admin.ModelAdmin):
    list_display = [pair[0].name for pair in BusinessMarketing._meta.get_concrete_fields_with_model()]


@admin.register(ProductSell)
class ProductSellAdmin(admin.ModelAdmin):
    list_display = [pair[0].name for pair in ProductSell._meta.get_concrete_fields_with_model()]


@admin.register(ExpertShow)
class ExpertShowAdmin(admin.ModelAdmin):
    list_display = [pair[0].name for pair in ExpertShow._meta.get_concrete_fields_with_model()]


@admin.register(Template)
class TemplateAdmin(admin.ModelAdmin):
    list_display = [pair[0].name for pair in Template._meta.get_concrete_fields_with_model()]


@admin.register(TemplateRegion)
class TemplateRegionAdmin(admin.ModelAdmin):
    list_display = [pair[0].name for pair in TemplateRegion._meta.get_concrete_fields_with_model()]


@admin.register(PosterPage)
class PosterPageAdmin(admin.ModelAdmin):
    list_display = [pair[0].name for pair in PosterPage._meta.get_concrete_fields_with_model()]


@admin.register(Rating)
class RatingAdmin(admin.ModelAdmin):
    list_display = [pair[0].name for pair in Rating._meta.get_concrete_fields_with_model()]


@admin.register(PosterStatistics)
class PosterRatingAdmin(admin.ModelAdmin):
    list_display = [pair[0].name for pair in PosterStatistics._meta.get_concrete_fields_with_model()]
