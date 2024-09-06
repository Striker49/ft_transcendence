FROM alpine:3.19

# Install necessary packages
RUN apk update && \
    apk add --no-cache curl php82 php82-cgi php82-mysqli php82-pdo_mysql php82-fpm php82-phar php82-json php82-mbstring php82-curl php82-openssl mysql-client

# Download CLI, give permissions and move executable to image
RUN curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar && \
    chmod +x wp-cli.phar && \
    mv wp-cli.phar /usr/local/bin/wp

# Create symbolic link to php82
RUN ln -sf /usr/bin/php82 /usr/bin/php

# Create folder to store website files and put minimal privileges
RUN mkdir -p /var/www/html \
	&& chown -R nobody:nobody /var/www/html \
    && chown -R nobody:nobody /var/www

# Give permissions
RUN chmod -R 755 /var/www/html

# Copy conf and script in image
COPY conf/www.conf /etc/php82/php-fpm.d/www.conf
COPY tools/auto_config.sh /var/www/auto_config.sh

# Give script permissions
RUN chmod +x /var/www/auto_config.sh

# Create folder where socket files will be kept (php-fpm)
RUN mkdir -p /run/php

# Everything following will be done in /var/www/html
WORKDIR /var/www/html

# Expose port 9000
EXPOSE 9000

# Launch configuration script for WP on container start
CMD ["/var/www/auto_config.sh"]