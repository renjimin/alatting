__author__ = 'tianhuyang'


class Object(object):
    """
    enable attribute accessors
    """


class Utils:

    @classmethod
    def get_url(cls, request, path):
        url = request.scheme + '://' + request.get_host() + path
        return url

    @classmethod
    def get_current_url(cls, request):
        url = cls.get_url(request, request.path)
        return url

    @classmethod
    def create_object(cls):
        return Object()
