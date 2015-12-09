from rest_framework import viewsets
from rest_framework import decorators
from alatting_website.models import Template
from alatting_website.serializer.template_serializer import TemplateSerializer, RetrieveTemplateSerializer


class TemplateViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Template.objects.all()
    serializer_class = TemplateSerializer

    def retrieve(self, request, *args, **kwargs):
        self.queryset = self.queryset.prefetch_related('template_regions')
        self.serializer_class = RetrieveTemplateSerializer
        return super(TemplateViewSet, self).retrieve(request, *args, **kwargs)
