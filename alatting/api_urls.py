from rest_framework.routers import DefaultRouter
from alatting_website.view.comment_viewset import CommentViewSet
from alatting_website.view.statistics_viewset import (
    RatingViewSet, PosterLikeViewSet, StatisticsViewSet,
    PosterFunViewSet, PosterFavoritesViewSet
)
from alatting_website.view.template_viewset import TemplateViewSet
from alatting_website.view.edit_viewset import EditViewSet


router = DefaultRouter()
router.register(r'api/v1/posters/(?P<poster_id>\d+)/comments', CommentViewSet, 'comment')
router.register(r'api/v1/posters/(?P<poster_id>\d+)/likes', PosterLikeViewSet, 'like')
router.register(r'api/v1/posters/(?P<poster_id>\d+)/favorites', PosterFavoritesViewSet, 'favorite')
router.register(r'api/v1/posters/(?P<poster_id>\d+)/ratings', RatingViewSet, 'rating')
router.register(r'api/v1/posters/(?P<poster_id>\d+)/statistics', StatisticsViewSet, 'statistics')
router.register(r'api/v1/posters/(?P<poster_id>\d+)/funs', PosterFunViewSet, 'fun')
router.register(r'api/v1/posters/(?P<poster_id>\d+)/edits', EditViewSet, 'edit')
router.register(r'api/v1/templates', TemplateViewSet, 'template')


urlpatterns = router.urls
