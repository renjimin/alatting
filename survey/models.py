import os
from django.db import models
from django.conf import settings
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
        null=True
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
        qs_set = QuestionSet.objects.filter(questionnaire=self).order_by('sortid')
        return qs_set

    def questions(self):
        questions = []
        for questionset in self.questionsets():
            questions += questionset.questions()
        return questions

class QuestionSet(models.Model):
    "Which questions to display on a question page"
    questionnaire = models.ForeignKey(Questionnaire)
    sortid = models.IntegerField() # used to decide which order to display in
    heading = models.CharField(max_length=64)
   
    def questions(self):
        if not hasattr(self, "__qcache"):
            self.__qcache = \
                questions_ = Question.objects.filter(questionset=self.id).order_by('sortid')
        return self.__qcache

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
            return self.questionnaire.questionsets()[-1] == self
        except NameError:
            # should only occur if not yet saved
            return True

    def is_first(self):
        try:
            return self.questionnaire.questionsets()[0] == self
        except NameError:
            # should only occur if not yet saved
            return True

    def __str__(self):
        return '%s-%d' % (self.questionnaire.name, self.sortid)


class Question(models.Model):
    questionset = models.ForeignKey(QuestionSet)
    sortid = models.IntegerField()
    text = models.TextField(blank=True, verbose_name="Text")
    short_text = models.TextField(blank=True, verbose_name="shortText")
    required = models.BooleanField(default=False)
    regex = models.CharField(max_length=256, blank=True, null=True)
    errmsg = models.CharField(max_length=256, blank=True, null=True)
    type = models.CharField(u"Type of question", max_length=32,
        choices = QuestionChoices,
        help_text = u"Determines the means of answering the question. " \
        "An open question gives the user a single-line textfield, " \
        "multiple-choice gives the user a number of choices he/she can " \
        "choose from. If a question is multiple-choice, enter the choices " \
        "this user can choose from below'.")

    def questionnaire(self):
        return self.questionset.questionnaire

    def __str__(self):
        return '%s-%s' % (self.questionset, self.text)

    def choices(self):
        res = Choice.objects.filter(question=self).order_by('sortid')
        return res

    def get_type(self):
        "Get the type name"
        t = self.type
        return t

    def questioninclude(self):
        return "questionnaire/" + self.get_type() + ".html"

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

class Input(models.Model):
    placeholder = models.CharField(max_length=256, blank=True, null=True)
    question = models.ForeignKey(Question, blank=True, null=True)
    choice = models.ForeignKey(Choice, blank=True, null=True)
    InputChoices = [
        ('text', 'input type[text]'),
        ('textarea', 'input type[textarea]')
    ]
    type = models.CharField(
        max_length=32, choices=InputChoices
    )


class RunInfo(models.Model):
    "Store the active/waiting questionnaire runs here"
    subject = models.ForeignKey(User)
    poster = BigForeignKey(Poster,blank=True, null=True)
    questionset = models.ForeignKey(QuestionSet, blank=True, null=True) 
    created = models.DateTimeField(auto_now_add=True)

    def __unicode__(self):
        return "%s" % (self.pk)

    class Meta:
        verbose_name_plural = 'Run Info'


class Answer(models.Model):
    id = BigAutoField(primary_key=True)
    subject = models.ForeignKey(User, help_text = u'The user who supplied this answer')
    poster = BigForeignKey(Poster,blank=True, null=True)
    question = models.ForeignKey(Question, help_text = u"The question that this is an answer to")
    answer = models.TextField(blank=True, null=True)
    runid = models.CharField(max_length=32)


class RunInfoHistory(models.Model):
    subject = models.ForeignKey(User)
    poster = BigForeignKey(Poster,blank=True, null=True)
    completed = models.DateTimeField(auto_now_add=True)
    questionnaire = models.ForeignKey(Questionnaire)
    runid = models.CharField(max_length=32)

    def __unicode__(self):
        return "%s" % (self.subject, self.completed)

    def answers(self):
        "Returns the query for the answers."
        return Answer.objects.filter(subject=self.subject, runinfo=self.runinfo)

    class Meta:
        verbose_name_plural = 'Run Info History'