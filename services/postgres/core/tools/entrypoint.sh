# #!/bin/bash
# # entrypoint.sh

# # Wait for PostgreSQL to start up before running the script
# until psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c '\l'; do
#   echo "Waiting for PostgreSQL to start..."
#   sleep 1
# done

# # Create user and grant privileges
# psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" <<-EOSQL
#   CREATE USER myuser WITH PASSWORD 'mypassword';
#   GRANT ALL PRIVILEGES ON DATABASE postgres TO myuser;
# EOSQL