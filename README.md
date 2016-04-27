# Alatting Project README

## Requirements

* python 3.4
* MySQL


## Virtual Environment

* pip3 install virtualenv                      // make sure pip3 installed 
* virtualenv -p={path_of_python3.4} venv  // -p parameter is optional
* cd venv
* source bin/activate


## Run it

1.  git clone git@github.com:alatting/alatting.git
2.  cd alatting
3.  copy frontend/src/www/js/api-config-copy-reference.js to api-config.js
4.  edit api-config.js
5.  copy alatting/settings_copy_for_reference.py to settings.py
6.  edit settings.py
7.  pip3 install -r requirements.txt
8.  python manage.py makemigrations
9.  python manage.py migrate
10. python manage.py loaddata alatting_website/fixtures/initial_data.json
11. python manage.py runserver

Now, http://127.0.0.1:8000/admin can be used, default user/pwd is admin/admin


## API Document

    $ make doc

Now, you can visit http://127.0.0.1:8001 , and read REST API document
