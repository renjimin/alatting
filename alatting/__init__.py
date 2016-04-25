# coding=utf-8

# This will make sure the app is always imported when
# Django starts so that shared_task will use this app.
from .celery import app as celery_app  # noqa

import rest_framework.fields
import rest_framework.exceptions

rest_framework.exceptions.NotAuthenticated.default_detail = (
    u'请登录后再操作。如果您已登录请刷新页面，谢谢！'
)
rest_framework.exceptions.PermissionDenied.default_detail = (
    u'抱歉，您无权进行此项操作！'
)

rest_framework.fields.BooleanField.default_error_messages = {
    'invalid': u'无效数据'}
rest_framework.fields.CharField.default_error_messages = {
    'max_length': u'字符串太大',  # {max_length}
    'min_length': u'字符串太短',  # {min_length}
    'blank': u'字符串不能为空'}
rest_framework.fields.ChoiceField.default_error_messages = {
    'invalid_choice': u'无效值'}  # "{input}".
rest_framework.fields.DateField.default_error_messages = {
    'invalid': u'日期格式错误',  # 应为{format}
    'datetime': u'格式应该为日期'}
rest_framework.fields.DateTimeField.default_error_messages = {
    'invalid': u'日期时间格式错误',  # 应为{format}
    'date': u'格式应该为日期时间'
}
rest_framework.fields.DecimalField.default_error_messages = {
    'max_value': u'数字太大',  # {max_value}
    'min_value': u'数字太小',  # {min_value}
    'invalid': u'需要数字格式',
    'max_string_length': u'数字太大',
    'max_digits': u'数字太大',  # {max_digits}
    'max_decimal_places': u'最多位数过长',  # {max_decimal_places}
    'max_whole_digits': u'数字太大'}  # {max_whole_digits}
rest_framework.fields.DictField.default_error_messages = {
    'not_a_dict': u'需要字典格式'}  # {input_type}
rest_framework.fields.DjangoImageField.default_error_messages = {
    'invalid_image': u'格式错误,请上传图片.'}
rest_framework.fields.EmailField.default_error_messages = {
    'invalid': u'请提供邮箱地址'}
rest_framework.fields.Field.default_error_messages = {
    'required': u'必填项',
    'null': u'不能为空'}
rest_framework.fields.FileField.default_error_messages = {
    'max_length': u'文件太大',  # 大小{length}超过{max_length}
    'empty': u'不能上传空文件',
    'required': u'必填项',
    'no_name': u'无效的文件名',
    'invalid': u'请上传文件'}
rest_framework.fields.FloatField.default_error_messages = {
    'max_string_length': u'数字长度太长',
    'max_value': u'数字太大',  # {max_value}
    'min_value': u'数字太小',  # {min_value}
    'invalid': u'请填写有效数字'}
rest_framework.fields.ImageField.default_error_messages = {
    'invalid_image': u'格式错误,请上传图片.'}
rest_framework.fields.IntegerField.default_error_messages = {
    'max_string_length': u'数字太大',
    'max_value': u'数字太大',  # {max_value}
    'min_value': u'数字太小',  # {min_value}
    'invalid': u'请填写整数'}
rest_framework.fields.ListField.default_error_messages = {
    'not_a_list': u'必须为数组'}
rest_framework.fields.ModelField.default_error_messages = {
    'max_length': u'数据太长'}  # {max_length}
rest_framework.fields.MultipleChoiceField.default_error_messages = {
    'not_a_list': u'必须为数组',
    'invalid_choice': u'无效选项'}
rest_framework.fields.NullBooleanField.default_error_messages = {
    'invalid': u'需要布尔类型'}
rest_framework.fields.RegexField.default_error_messages = {
    'invalid': u'格式不匹配'}
rest_framework.fields.SlugField.default_error_messages = {
    'invalid': u'格式错误,不能包含非法字符'}
rest_framework.fields.TimeField.default_error_messages = {
    'invalid': u'格式错误,正确格式为{format}.'}
rest_framework.fields.URLField.default_error_messages = {
    'invalid': u'请提供正确的URL地址'}
rest_framework.fields.UUIDField.default_error_messages = {
    'invalid': u'请提供正确的UUID数据'}
