# Use the official Postgresimage as a base
FROM postgres:16.4

COPY /tools/script.sh /script.sh
RUN chmod +x /script.sh


EXPOSE 5432

# ENTRYPOINT ["/script.sh"]
