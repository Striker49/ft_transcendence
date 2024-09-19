#!/bin/sh

postgres -D /usr/local/pgsql/data

postgres stop
exec postgres --datadir=/var/lib/postgres
