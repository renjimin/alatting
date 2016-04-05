# Alatting Project README

## Required

* python 3.5.4
* MySQL


## Virtual Environment

* pip3 install virtualenv
* virtualenv -p={path_of_python3.5} myproject  // -p parameter not required
* cd myproject
* source bin/activate

## Run it

1. git clone git@github.com:alatting/alatting.git
2. cd alatting
3. pip3 install -r requirements.txt
4. python manage.py makemigrations
5. python manage.py migrate
6. python manage.py loaddata alatting_website/fixtures/initial_data.json
7. python manage.py runserver

Now, http://127.0.0.1:8000/admin can be used, default user/pwd is admin/admin
