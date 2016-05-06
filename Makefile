help:
	@echo "server           run dev server"
	@echo "doc              run doc server"
	@echo "shell            open a python shell"
	@echo "dbshell          open a database shell"
	@echo "mkmigrate        makemigrations"
	@echo "migrate          migrate"
	@echo "cs               collect static files"

server:
	@python manage.py runserver 0.0.0.0:8000

doc:
	@mkdocs serve

shell:
	@python manage.py shell

dbshell:
	@python manage.py dbshell

mkmigrate:
	@python manage.py makemigrations

migrate:
	@python manage.py migrate

cs:
    @python manage.py collectstatic --noinput


.PHONY: server shell dbshell clean clean-build clean-pyc lint \
	tests migrate mkmigrate rq coverage
