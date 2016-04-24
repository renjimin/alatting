__author__ = 'charlie'
__all__ = ["what"]
import re


def what(inputvalue):
    for tf in tests:
        res = tf(inputvalue)
        if res:
            return res

tests = []

def test_email(inputvalue):
    """判断输入是一个邮箱"""
    if len(inputvalue) > 7:
        if re.match("^.+\\@(\\[?)[a-zA-Z0-9\\-\\.]+\\.([a-zA-Z]{2,3}|[0-9]{1,3})(\\]?)$", inputvalue) != None:
            return 'email'

tests.append(test_email)

def test_phonenumer(inputvalue):
    """判断输入是一个手机号"""
    if len(inputvalue) == 11:
        if re.match("^1[3|4|5|7|8]\d{9}$", inputvalue) != None:
            return 'phonenumber'

tests.append(test_phonenumer)