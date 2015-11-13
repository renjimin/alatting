__author__ = 'tianhuyang'
from django import db

is_print = True
# is_print = False


class DatabaseMiddleware(object):
    """ Monitor the database execution. """

    def process_response(self, request, response):
        for query in db.connection.queries:
            if is_print:
                print(query['sql'])
        db.reset_queries()
        return response