#!/usr/bin/env python
# coding=utf-8


__author__ = 'lyhapple'


class DataStatus(object):
    UNUSABLE = 0
    USABLE = 1
    DELETED = -1
    STATUS = (
        (UNUSABLE, u'禁用'),
        (USABLE, u'启用'),
        (DELETED, u'删除'),
    )
