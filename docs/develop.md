# Alatting Project README

## Requirements 依赖

* python 3.4
* MySQL


## Virtual Environment 使用虚拟环境

* pip3 install virtualenv                      // make sure pip3 installed 
* virtualenv -p={path_of_python3.4} myproject  // -p parameter is optional
* cd myproject
* source bin/activate

## Run

1. git clone git@github.com:alatting/alatting.git
2. cd alatting
3. pip3 install -r requirements.txt
4. python manage.py makemigrations
5. python manage.py migrate
6. python manage.py loaddata alatting_website/fixtures/initial_data.json
7. python manage.py runserver 0.0.0.0:8000  或者 make server

Now, http://127.0.0.1:8000/admin can be used, default user/pwd is admin/admin
