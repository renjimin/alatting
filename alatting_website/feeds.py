from django.contrib.syndication.views import Feed
from django.core.urlresolvers import reverse
from alatting_website.models import Poster, PosterPage

class PosterUpdateFeed(Feed):
	title = "Poster Updates"
	link = "/rss/"
	description = "Updates on Posters."

	def items(self):
		return Poster.objects.all()

	def item_title(self, item):
		return item.logo_title

	def item_description(self, item):
		return item.short_description

	# item_link is only needed if NewsItem has no get_absolute_url method.
	def item_link(self, item):
		return reverse('website:poster', kwargs={'pk': item.pk})