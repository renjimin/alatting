#!/usr/bin/env python
# coding=utf-8


__author__ = 'lyhapple'


TRUE_FALSE = (
    (True, u'是'),
    (False, u'否')
)


class DataStatus(object):
    UNUSABLE = 0
    USABLE = 1
    DELETED = -1
    STATUS = (
        (UNUSABLE, u'禁用'),
        (USABLE, u'启用'),
        (DELETED, u'删除'),
    )
