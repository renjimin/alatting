# coding=utf-8
from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    只读及拥有者权限
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has an `creator` attribute.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.creator == request.user
