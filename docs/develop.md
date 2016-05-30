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

*.  git clone git@github.com:alatting/alatting.git
*.  cd alatting
*.  copy alatting/settings_copy_for_reference.py to settings.py
*.  vi settings.py
*.  pip3 install -r requirements.txt
*.  python manage.py makemigrations
*.  python manage.py migrate
*.  python manage.py loaddata alatting_website/fixtures/initial_data.json
*.  python manage.py loaddata survey/fixtures/initial_data.json
*.  python manage.py runserver

Now, http://127.0.0.1:8000/admin can be used, default user/pwd is admin/admin


## API Document

    $ make doc

Now, you can visit http://127.0.0.1:8001 , and read REST API document
