# coding=utf-8
import os
from django.conf import settings
from django.core.urlresolvers import reverse_lazy, reverse
from django.shortcuts import get_object_or_404, redirect, render_to_response
from django.views.generic import TemplateView, CreateView, View, UpdateView
from django.views.generic.list import ListView
from alatting_website.model.poster import Poster, PosterKeyword, PosterPage
from alatting_website.model.resource import Image
from alatting_website.models import Template, CategoryKeyword, Address
from poster.forms import PosterCreateForm
from poster.serializer.resource import AddressSerializer
from utils.file import handle_uploaded_file, get_image_path, \
    read_template_file_content, rotate_image


class CategoryKeywordsView(ListView):
    model = CategoryKeyword
    template_name = 'poster/keywords.html'
    queryset = CategoryKeyword.objects.all()

    def get_queryset(self):
        qs = super(CategoryKeywordsView, self).get_queryset()

        return qs.filter(
            category_id=self.request.GET.get('sub_category_id')
        ).order_by('verb', 'noun')


class PosterFormViewMixin(object):
    model = Poster
    form_class = PosterCreateForm

    def get_success_url(self):
        return '%s?poster_id=%s' % (
            reverse('poster:select_template'),
            self.object.id
        )

    def update_poster_keywords(self):
        keywords = self.request.POST.get('keywords', '').split(',')
        try:
            PosterKeyword.objects.filter(
                poster=self.object
            ).delete()
            for kid in keywords:
                keyword = get_object_or_404(CategoryKeyword, id=kid)
                PosterKeyword.objects.create(
                    poster=self.object,
                    category_keyword=keyword
                )
        except:
            pass

    def post_method(self, request):
        form = self.get_form()
        upfile = request.FILES.get('logo', None)
        if upfile:
            image_obj = Image()
            save_path = get_image_path(image_obj, upfile.name)
            full_path = handle_uploaded_file(save_path, upfile)
            image_obj.file = save_path
            image_obj.save()
            rotate_image(full_path)
            form.instance.logo_image = image_obj
        if form.is_valid():
            resp = self.form_valid(form)
            self.update_poster_keywords()
            return resp
        else:
            return self.form_invalid(form)


class CreateFormView(PosterFormViewMixin, CreateView):
    template_name = 'poster/create-form.html'

    def get_initial(self):
        req_get = self.request.GET
        main_category_id = req_get.get('main_category_id')
        sub_category_id = req_get.get('sub_category_id')
        keywords = req_get.get('category_keyword_id')
        cate = req_get.get('cate')
        subcate = req_get.get('subcate')
        return {
            'main_category_id': main_category_id,
            'sub_category_id': sub_category_id,
            'keywords': keywords,
            'cate': cate,
            'subcate': subcate
        }

    def form_valid(self, form):
        address = Address()
        address.address1 = self.request.POST.get('address_text')
        address.save()
        address.refresh_from_db()
        obj = form.instance
        obj.main_category_id = self.request.POST.get('main_category_id')
        obj.sub_category_id = self.request.POST.get('sub_category_id')
        obj.creator = self.request.user
        obj.status = Poster.STATUS_DRAFT
        obj.address = address
        obj.logo_title = ""
        return super(CreateFormView, self).form_valid(form)

    def post(self, request, *args, **kwargs):
        self.object = None
        return self.post_method(request)


class UpdateFormView(PosterFormViewMixin, UpdateView):
    template_name = 'poster/create-form.html'

    def get_initial(self):
        keywords = PosterKeyword.objects.filter(
            poster=self.object
        ).values_list('category_keyword_id', flat=True)

        return {
            'main_category_id': self.object.main_category_id,
            'sub_category_id': self.object.sub_category_id,
            'keywords': ','.join(str(key) for key in keywords),
            'cate': self.object.main_category.name,
            'subcate': self.object.sub_category.name,
            'address_text': self.object.address.address1
        }

    def form_valid(self, form):
        obj = form.instance
        address = Address.objects.filter(
            address1=obj.address
        ).first()
        address_text = self.request.POST.get('address_text', '')
        if address.address1 != address_text:
            address = Address()
            address.address1 = address_text
            address.save()
            address.refresh_from_db()
            obj.address = address
        return super(UpdateFormView, self).form_valid(form)

    def post(self, request, *args, **kwargs):
        self.object = self.get_object()
        return self.post_method(request)


class SelectTemplateView(ListView):
    model = Template
    template_name = 'poster/select-template.html'
    queryset = Template.objects.filter(
        data_status=Template.USABLE
    ).order_by('name')


class PosterPageCreateView(View):

    def post(self, request, *args, **kwargs):
        poster_id = request.POST.get('poster_id')
        template_id = request.POST.get('template_id')
        pages = PosterPage.objects.filter(
            poster_id=poster_id, template_id=template_id
        ).order_by('-index')
        template = get_object_or_404(Template, pk=template_id)
        if pages.exists():
            index = int(pages.first().index) + 1
        else:
            index = 0

        html = read_template_file_content(template.html_path())
        css = read_template_file_content(template.css_path())
        js = read_template_file_content(template.js_path())
        posterpage = PosterPage.objects.create(
            poster_id=poster_id,
            template_id=template_id,
            index=index,
            name="p%s_t%s_i%s" % (poster_id, template_id, index),
            temp_html=html,
            temp_css=css,
            temp_script=js
        )
        posterpage.check_and_create_static_file_dir()
        return redirect(reverse('poster:edit',
                                kwargs={
                                    'pk': posterpage.id,
                                    'poster_pk': poster_id
                                }))