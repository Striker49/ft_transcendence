#!/bin/sh

if [ "$DATABASE" = "postgres" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $SQL_HOST $SQL_PORT; do
      sleep 0.1
    done

    echo "PostgreSQL started"
fi

# python manage.py flush --no-input
python manage.py makemigrations
python manage.py makemigrations profiles
python manage.py makemigrations users
python manage.py migrate --noinput

# Checks if static dir exists and creates it if it doesn't
if [ ! -d "/code/core/static" ]
then
python manage.py collectstatic
fi

exec "$@"