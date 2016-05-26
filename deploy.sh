#!/bin/bash

. ~/venv/bin/activate

version(){
    python manage.py help
}

version