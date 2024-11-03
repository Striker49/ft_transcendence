# Use the latest official nginx image
FROM nginx:latest

COPY ../core/certs/localhost.pem /etc/nginx/ssl/nginx.crt
COPY ../core/certs/localhost-key.pem /etc/nginx/ssl/nginx.key

# # Generate a self-signed certificate
# RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
#     -keyout /etc/nginx/ssl/nginx.key \
#     -out /etc/nginx/ssl/nginx.crt \
#     -subj "/C=CA/ST=QC/L=Quebec/O=42 School/OU=transcendence/CN=transcendence"

# Copy custom nginx configuration file
COPY ../core/config/nginx.conf /etc/nginx/nginx.conf

# Expose ports (optional, depends on your docker-compose.yml settings)
EXPOSE 80 443

# Run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
