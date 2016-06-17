import os
from django.db import models
from django.conf import settings
from django.core.urlresolvers import reverse
from django.contrib.auth.models import User
from alatting_website.models import Category
from utils.db.fields import BigAutoField, \
    BigForeignKey
from alatting_website.model.poster import Poster
from survey import *


class Questionnaire(models.Model):
    name = models.CharField(max_length=128, unique=True)
    main_category = models.ForeignKey(
        Category,
        related_name='main_cat_qs',
        limit_choices_to={'parent__isnull': True},
        null=True
    )
    sub_category = models.ForeignKey(
        Category,
        related_name='sub_cat_qs',
        limit_choices_to={'parent__isnull': False},
        blank=True, null=True
    )
    ROLE_CHOICES = (
        ('creator', ' 服务提供者'),
        ('consumer', '服务使用者')
    )
    role = models.CharField(
        max_length=32, choices=ROLE_CHOICES, default='creator'
    )

    def __str__(self):
        return '%s' % (self.name)

    def questionsets(self):
        qs_set = QuestionSet.objects.filter(
            questionnaire=self).order_by('sortid')
        return qs_set

    def questionsets_count(self):
        res = QuestionSet.objects.filter(
            questionnaire=self).count()
        return res

    def questions(self):
        questions = []
        for questionset in self.questionsets():
            questions += questionset.questions()
        return questions


class QuestionSet(models.Model):

    "Which questions to display on a question page"
    questionnaire = models.ForeignKey(Questionnaire)
    sortid = models.IntegerField()  # 排序
    heading = models.CharField(max_length=64)

    def questions(self):
        res = Question.objects.filter(questionset=self.id).order_by('sortid')
        return res

    def questions_in_poster(self, poster_id):
        questions = Question.objects.filter(questionset=self.id).order_by('sortid')
        res=[]
        for question in questions:
            is_visible = False
            if question.audit_status in [0, 1]:
                if question.poster:
                    if question.poster.pk == poster_id:
                        is_visible = True
            if question.audit_status==2:
                is_visible = True
            if question.type in ['choice', 'choice-input', 'checkbox', 'checkbox-input']:
                if question.choices_count()==0:
                    is_visible = False
            if is_visible:
                res.append(question)
        return res

    def questions_count(self):
        res = Question.objects.filter(
            questionset=self.id).order_by('sortid').count()
        return res

    def next(self):
        qs = self.questionnaire.questionsets()
        retnext = False
        for q in qs:
            if retnext:
                return q
            if q == self:
                retnext = True
        return None

    def prev(self):
        qs = self.questionnaire.questionsets()
        last = None
        for q in qs:
            if q == self:
                return last
            last = q

    def is_last(self):
        try:
            return self.questionnaire.questionsets().latest('sortid') == self
        except NameError:
            return True

    def is_first(self):
        try:
            return self.questionnaire.questionsets()[0] == self
        except NameError:
            return True

    def changeform_link(self):
        if self.id:
            changeform_url = reverse(
                'admin:survey_questionset_change', args=(self.id,)
            )
            return u'<a href="%s" target="_blank">详情</a>' % changeform_url
        return u''
    changeform_link.allow_tags = True
    changeform_link.short_description = ''   # omit column header

    def __str__(self):
        return '%s-%d' % (self.questionnaire.name, self.sortid)


class Question(models.Model):
    questionset = models.ForeignKey(QuestionSet)
    sortid = models.IntegerField()
    text = models.TextField(blank=True, verbose_name="Text")
    short_text = models.TextField(blank=True, verbose_name="shortText")
    required = models.BooleanField(default=True)
    regex = models.CharField(max_length=256, blank=True, null=True)
    errmsg = models.CharField(max_length=256, blank=True, null=True)
    placeholder = models.CharField(max_length=256, blank=True, null=True,
                                   default="请输入")
    type = models.CharField(max_length=32,
                            choices=QuestionChoices,
                            help_text=u"问题类型，例如单选、多选、单选选项中包含输入框、单行文本框、多行文本框")
    AUDIT_STATUS_UN_PASS = 0
    AUDIT_STATUS_AUDITING = 1
    AUDIT_STATUS_PASS = 2
    AUDIT_STATUS_CHOICES = (
        (AUDIT_STATUS_UN_PASS, u'不通过'),
        (AUDIT_STATUS_AUDITING, u'审核中'),
        (AUDIT_STATUS_PASS, u'通过')
    )
    audit_status = models.PositiveSmallIntegerField(
        verbose_name=u'审核状态',
        default=AUDIT_STATUS_PASS,
        choices=AUDIT_STATUS_CHOICES
    )
    poster = BigForeignKey(Poster, blank=True, null=True)

    def questionnaire(self):
        return self.questionset.questionnaire

    def __str__(self):
        return '%s-%s' % (self.questionset, self.text)

    def choices(self):
        res = Choice.objects.filter(question=self).order_by('sortid')
        return res

    def choices_count(self):
        res = Choice.objects.filter(question=self).order_by('sortid').count()
        return res

    def get_type(self):
        t = self.type
        return t

    def questioninclude(self):
        return "questionnaire/" + self.get_type() + ".html"

    def changeform_link(self):
        if self.id and self.type in ['choice', 'choice-input', 'checkbox', 'checkbox-input']:
            changeform_url = reverse(
                'admin:survey_question_change', args=(self.id,)
            )
            return u'<a href="%s" target="_blank">选项详情</a>' % changeform_url
        return u''
    changeform_link.allow_tags = True
    changeform_link.short_description = ''   # omit column header


class Choice(models.Model):
    question = models.ForeignKey(Question)
    sortid = models.IntegerField()
    value = models.CharField(u"Short Value", max_length=64)
    text = models.CharField(u"Choice Text", max_length=200)

    def inputs(self):
        inp = Input.objects.filter(choice=self)
        return inp

    def __str__(self):
        return '(%s) %d. %s' % (self.question.text, self.sortid, self.text)

    def changeform_link(self):
        if self.id and self.question.type in ['choice-input', 'checkbox-input']:
            changeform_url = reverse(
                'admin:survey_choice_change', args=(self.id,)
            )
            return u'<a href="%s" target="_blank">选项输入框</a>' % changeform_url
        return u''
    changeform_link.allow_tags = True
    changeform_link.short_description = ''   # omit column header


class Input(models.Model):
    placeholder = models.CharField(max_length=256, default='')
    choice = models.OneToOneField(Choice, blank=True, null=True)
    InputChoices = [
        ('text', 'input type[text]'),
        ('textarea', 'input type[textarea]')
    ]
    type = models.CharField(
        max_length=32, choices=InputChoices, default='text'
    )


class RunInfo(models.Model):

    "Store the active/waiting questionnaire runs here"
    subject = models.ForeignKey(User)
    poster = BigForeignKey(Poster, blank=True, null=True)
    questionset = models.ForeignKey(QuestionSet, blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "%s" % self.pk

    class Meta:
        verbose_name_plural = 'Run Info'


class Answer(models.Model):
    id = BigAutoField(primary_key=True)
    subject = models.ForeignKey(User, help_text=u'谁在回答问题')
    poster = BigForeignKey(Poster, blank=True, null=True)
    question = models.ForeignKey(Question, help_text=u" 回答的哪道问题")
    answer = models.TextField(blank=True, null=True)
    runid = models.CharField(max_length=32)


class RunInfoHistory(models.Model):
    subject = models.ForeignKey(User)
    poster = BigForeignKey(Poster, blank=True, null=True)
    completed = models.DateTimeField(auto_now_add=True)
    questionnaire = models.ForeignKey(Questionnaire)
    runid = models.CharField(max_length=32)
    isactive = models.BooleanField(default=False)

    def __str__(self):
        return "%s_%s" % (self.subject, self.completed)

    def answers(self):
        return Answer.objects.filter(
            subject=self.subject, runinfo=self.runinfo
        )

    class Meta:
        verbose_name_plural = 'Run Info History'
