# coding=utf-8
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.views.generic import DetailView
from alatting_website.model.poster import Poster
from alatting_website.model.statistics import PosterLike, PosterSubscribe


class ProfileBaseView(DetailView):
    model = User

    def get_object(self, queryset=None):
        obj = self.request.user
        posters_created = []
        posters = Poster.objects.filter(creator=self.request.user)
        for poster_created in posters:
            posters_created.append(poster_created)
        obj.posters_created = posters_created
        obj.poster_count = Poster.objects.filter(
            creator=self.request.user
        ).count()
        obj.poster_likes_count = PosterLike.objects.filter(
            creator=self.request.user
        ).count()
        obj.poster_subscriptions_count = PosterSubscribe.objects.filter(
            follower=self.request.user
        ).count()
        obj.money = 340
        return obj


class AccountPosterBaseView(DetailView):
    model = Poster
    queryset = Poster.objects.all()

    def get_object(self, queryset=None):
        return get_object_or_404(Poster, pk=self.kwargs.get('poster_pk'))