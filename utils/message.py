# from django.core.cache import cache
from random import randint
__author__ = 'charlie'


def message_genarator(num):
    """产生验证码"""
    code_list = []
    for i in range(num):
        code_list.append(str(randint(0, 9)))
    return ''.join(code_list)


def get_message(phonenumber):
    """生成四位验证码"""
    message = message_genarator(4)
    # msg_key = 'message'.format(phonenumber)
    # cache.set(msg_key, message, 60)
    return message
