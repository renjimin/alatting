from rest_framework import viewsets
from rest_framework import decorators
from alatting_website.models import Template
from alatting_website.serializer.template_serializer import TemplateSerializer


class TemplateViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Template.objects.all()
    serializer_class = TemplateSerializer

    def get_queryset(self):
        self.queryset = self.queryset.prefetch_related('template_regions').order_by('id')
        queryset = super(TemplateViewSet, self).get_queryset()
        return queryset

    @decorators.list_route(methods=('get',), serializer_class=TemplateSerializer)
    def html(self, request, *args, **kwargs):
        pass
