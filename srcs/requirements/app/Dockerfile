# syntax=docker/dockerfile:1
FROM python:3
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
WORKDIR /code
COPY conf/requirements.txt /code/
RUN pip install -r requirements.txt
COPY . /code/
# RUN cd .. && python manage.py migrate
EXPOSE 8000