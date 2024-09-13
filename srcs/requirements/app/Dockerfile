# pull official base image
FROM python:3.12

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# set work directory
WORKDIR /code

RUN apt-get update && apt-get install -y netcat-openbsd

# install dependencies
COPY conf/requirements.txt /code/
RUN pip install --upgrade pip && pip install -r requirements.txt

# copy entrypoint.sh
COPY ./entrypoint.sh .
RUN sed -i 's/\r$//g' /code/entrypoint.sh
RUN chmod +x /code/entrypoint.sh

# copy project
COPY . /code/

# run entrypoint.sh
ENTRYPOINT ["/code/entrypoint.sh"]


