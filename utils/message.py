from django.core.cache import cache
from random import randint
__author__ = 'charlie'


def message_genarator(num):
    """产生验证码"""
    code_list = []
    for i in range(num):
        code_list.append(str(randint(0, 9)))
    return ''.join(code_list)


def cache_message(phonenumber):
    """生成验证码并缓存到cache系统（目前使用django自带的cache）"""
    message = message_genarator(4)
    msg_key = 'msg_{}'.format(phonenumber)
    cache.set(msg_key, message, 60)
    return message
