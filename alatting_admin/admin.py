from django.contrib import admin
from poster.models import SystemImage, SystemBackground
from alatting_website.model.poster import PosterKeyword
from alatting_website.model.statistics import PosterSubscribe
from alatting_website.models import (
    Person, Image, Music, Video, Category,
    Poster, PosterImage, PosterVideo, PosterLike, PageText,
    Comment, Address, PosterPage, Rating, PosterStatistics, HistoryStatistics,
    ActivityInvitation, BusinessMarketing, ProductSell,
    ExpertShow, Template, TemplateRegion, PosterFun,
    BusinessCard, PosterMoreLink,
    CategoryKeyword)
from survey.models import (
    Questionnaire, QuestionSet, Question, Choice)


class AlattingAdminModelMixin(object):
    def get_list_display(self, request):
        fields = super(AlattingAdminModelMixin, self).get_list_display(request)
        if fields and fields[0] == '__str__':
            fields = self.model._meta.get_concrete_fields_with_model()
            return [pair[0].name for pair in fields]
        return fields


@admin.register(Person)
class PersonAdmin(AlattingAdminModelMixin, admin.ModelAdmin):
    pass


@admin.register(Image)
class ImageAdmin(AlattingAdminModelMixin, admin.ModelAdmin):
    pass


@admin.register(Music)
class MusicAdmin(AlattingAdminModelMixin, admin.ModelAdmin):
    pass


@admin.register(Video)
class VideoAdmin(AlattingAdminModelMixin, admin.ModelAdmin):
    pass


@admin.register(Category)
class CategoryAdmin(AlattingAdminModelMixin, admin.ModelAdmin):
    pass


@admin.register(Poster)
class PosterAdmin(AlattingAdminModelMixin, admin.ModelAdmin):
    pass


@admin.register(PosterImage)
class PosterImageAdmin(AlattingAdminModelMixin, admin.ModelAdmin):
    pass


@admin.register(PosterVideo)
class PosterVideoAdmin(AlattingAdminModelMixin, admin.ModelAdmin):
    pass


@admin.register(PosterLike)
class PosterLikeAdmin(AlattingAdminModelMixin, admin.ModelAdmin):
    pass


@admin.register(Comment)
class CommentAdmin(AlattingAdminModelMixin, admin.ModelAdmin):
    pass


@admin.register(Address)
class AddressAdmin(AlattingAdminModelMixin, admin.ModelAdmin):
    pass


@admin.register(ActivityInvitation)
class ActivityInvitationAdmin(AlattingAdminModelMixin, admin.ModelAdmin):
    pass


@admin.register(BusinessMarketing)
class BusinessMarketingAdmin(AlattingAdminModelMixin, admin.ModelAdmin):
    pass


@admin.register(ProductSell)
class ProductSellAdmin(AlattingAdminModelMixin, admin.ModelAdmin):
    pass


@admin.register(ExpertShow)
class ExpertShowAdmin(AlattingAdminModelMixin, admin.ModelAdmin):
    pass


@admin.register(Template)
class TemplateAdmin(AlattingAdminModelMixin, admin.ModelAdmin):
    list_display = ('id', 'name', 'image')


@admin.register(TemplateRegion)
class TemplateRegionAdmin(AlattingAdminModelMixin, admin.ModelAdmin):
    pass


@admin.register(PosterPage)
class PosterPageAdmin(AlattingAdminModelMixin, admin.ModelAdmin):
    list_display = ('id', 'poster', 'template', 'index', 'name')


@admin.register(Rating)
class RatingAdmin(AlattingAdminModelMixin, admin.ModelAdmin):
    pass


@admin.register(PosterStatistics)
class PosterRatingAdmin(AlattingAdminModelMixin, admin.ModelAdmin):
    pass


@admin.register(HistoryStatistics)
class PosterRatingAdmin(AlattingAdminModelMixin, admin.ModelAdmin):
    pass


@admin.register(PosterFun)
class PosterFunAdmin(AlattingAdminModelMixin, admin.ModelAdmin):
    pass


@admin.register(PageText)
class PageTextAdmin(AlattingAdminModelMixin, admin.ModelAdmin):
    pass


@admin.register(BusinessCard)
class BusinessCardAdmin(AlattingAdminModelMixin, admin.ModelAdmin):
    pass


@admin.register(PosterMoreLink)
class PosterMoreLinkAdmin(AlattingAdminModelMixin, admin.ModelAdmin):
    pass


@admin.register(CategoryKeyword)
class CategoryKeywordAdmin(AlattingAdminModelMixin, admin.ModelAdmin):
    pass


@admin.register(PosterSubscribe)
class PosterSubscribeAdmin(AlattingAdminModelMixin, admin.ModelAdmin):
    pass


@admin.register(PosterKeyword)
class PosterKeywordAdmin(AlattingAdminModelMixin, admin.ModelAdmin):
    pass


@admin.register(SystemImage)
class SystemImageAdmin(AlattingAdminModelMixin, admin.ModelAdmin):
    pass


@admin.register(SystemBackground)
class SystemBackgroundAdmin(AlattingAdminModelMixin, admin.ModelAdmin):
    pass


@admin.register(Questionnaire)
class QuestionnaireAdmin(AlattingAdminModelMixin, admin.ModelAdmin):
    pass


@admin.register(QuestionSet)
class QuestionSetAdmin(AlattingAdminModelMixin, admin.ModelAdmin):
    pass


@admin.register(Question)
class QuestionAdmin(AlattingAdminModelMixin, admin.ModelAdmin):
    pass


@admin.register(Choice)
class ChoiceAdmin(AlattingAdminModelMixin, admin.ModelAdmin):
    pass
