# Use the official Postgresimage as a base
FROM postgres:16.4

COPY ../core/tools/entrypoint.sh /docker-entrypoint-initdb.d/
RUN chmod +x /docker-entrypoint-initdb.d/entrypoint.sh \
	&& mkdir -p /var/lib/postgresql/data
# RUN chmod +x /var/lib/postgresql/data


EXPOSE 5432

# ENTRYPOINT ["/docker-entrypoint-initdb.d/entrypoint.sh"]