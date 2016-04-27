#!/usr/bin/env python
# -*- coding: utf-8 -*-
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.defaultfilters import floatformat


def send_verify_email(email_address, verify_code):
    expiration_minute = floatformat(settings.EXPIRE_TIME / 60, 0)
    subject = u'注册验证码-来自云页网'
    from_email = settings.DEFAULT_FROM_EMAIL
    message_txt = u'''
    尊敬的客户，您好！

    感谢您注册云页网账号，您的注册码是：%s 。

    此注册码有效期为 %s 分钟，超时需重新发送验证码。


    武汉云页移动科技有限公司
    联系电话：027-87345335

    ''' % (verify_code, expiration_minute)
    email_message = EmailMultiAlternatives(
        subject,
        message_txt,
        from_email,
        [email_address]
    )
    if getattr(settings, 'REGISTRATION_EMAIL_HTML', True):
        # todo:发送HTML格式的邮件，目前只支持纯文本
        pass
    email_message.send()