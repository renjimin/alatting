# coding=utf-8
from django.contrib import admin
from account.models import UserCategory, Person
from poster.models import SystemImage, SystemBackground, SystemMusic, \
    ServiceBargain, Chat, ServiceComment
from alatting_website.model.poster import PosterKeyword
from alatting_website.model.statistics import PosterSubscribe
from alatting_website.models import (
    Image, Music, Video, Category,
    Poster, PosterImage, PosterVideo, PosterLike, PageText,
    Comment, Address, PosterPage, Rating, PosterStatistics, HistoryStatistics,
    ActivityInvitation, BusinessMarketing, ProductSell,
    ExpertShow, Template, TemplateRegion, PosterFun,
    BusinessCard, PosterMoreLink,
    CategoryKeyword)
from survey.models import (
    Questionnaire, QuestionSet, Question, Choice, Input,
    Answer, RunInfo, RunInfoHistory)


class AlattingAdminModelMixin(object):

    def get_list_display(self, request):
        fields = super(AlattingAdminModelMixin, self).get_list_display(request)
        if fields and fields[0] == '__str__':
            fields = self.model._meta.get_concrete_fields_with_model()
            return [pair[0].name for pair in fields]
        return fields


@admin.register(UserCategory)
class UserCategoryAdmin(AlattingAdminModelMixin, admin.ModelAdmin):
    pass


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
    list_display = ('id', 'unique_name', 'creator', 'url', 'logo_title',
                    'short_description', 'phone', 'mobile', 'email', 'address',
                    'lifetime_type', 'lifetime_timezone', 'created_at')
    list_display_links = ('id', 'unique_name')


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
    list_display = ('id', 'name', 'title', 'image', 'data_status')


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


@admin.register(SystemMusic)
class SystemMusicAdmin(AlattingAdminModelMixin, admin.ModelAdmin):
    pass


@admin.register(SystemBackground)
class SystemBackgroundAdmin(AlattingAdminModelMixin, admin.ModelAdmin):
    pass


class InputInline(admin.StackedInline):
    model = Input


@admin.register(Choice)
class ChoiceAdmin(admin.ModelAdmin):
    inlines = [InputInline, ]
    list_display = (
        'id', 'text', 'value', 'question', 'sortid')


class ChoiceInline(admin.StackedInline):
    model = Choice
    fields = ('question', 'sortid', 'value', 'text',
              'changeform_link')
    readonly_fields = ('changeform_link', )


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    inlines = [ChoiceInline, ]
    list_display = (
        'id', 'text', 'short_text', 'type', 'questionset', 'sortid', 'required')


class QuestionInline(admin.StackedInline):
    model = Question
    fields = ('questionset', 'sortid', 'text', 'short_text',
              'required', 'regex', 'errmsg', 'type', 'changeform_link')
    readonly_fields = ('changeform_link', )


@admin.register(QuestionSet)
class QuestionSetAdmin(admin.ModelAdmin):
    inlines = [QuestionInline, ]
    list_display = ('id', 'heading', 'questionnaire', 'sortid')


class QuestionSetLinkInline(admin.TabularInline):
    model = QuestionSet
    fields = ('questionnaire', 'sortid', 'heading', 'changeform_link')
    readonly_fields = ('changeform_link', )


@admin.register(Questionnaire)
class QuestionnaireAdmin(admin.ModelAdmin):
    inlines = [QuestionSetLinkInline, ]
    list_display = ('id', 'name', 'main_category', 'sub_category', 'role')


@admin.register(Answer)
class AnswerAdmin(AlattingAdminModelMixin, admin.ModelAdmin):
    pass


@admin.register(RunInfo)
class RunInfoAdmin(AlattingAdminModelMixin, admin.ModelAdmin):
    pass


@admin.register(RunInfoHistory)
class RunInfoHistoryAdmin(AlattingAdminModelMixin, admin.ModelAdmin):
    pass


@admin.register(ServiceBargain)
class ServiceBargainAdmin(AlattingAdminModelMixin, admin.ModelAdmin):
    pass


@admin.register(Chat)
class ChatAdmin(AlattingAdminModelMixin, admin.ModelAdmin):
    pass


@admin.register(ServiceComment)
class ServiceCommentAdmin(AlattingAdminModelMixin, admin.ModelAdmin):
    pass
