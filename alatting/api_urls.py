__author__ = 'tianhuyang'
from rest_framework.routers import DefaultRouter
from alatting_website.view.comment_viewset import CommentViewSet


router = DefaultRouter()
router.register(r'api/posters/(?P<poster_id>\d+)/comments', CommentViewSet, 'comment')

urlpatterns = router.urls
