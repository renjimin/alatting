__author__ = 'tianhuyang'
from django import db


class DatabaseMiddleware(object):
    """ Monitor the database execution. """

    def process_response(self, request, response):
        for query in db.connection.queries:
            print(query['sql'])
        db.reset_queries()
        return response