#!/bin/sh

echo "Running database migrations..."
php artisan migrate --force && \
# Run the main container command
# This is the startup command in the trafex/php-nginx docker image.
# We replaced it with a custom entrypoint.sh script so that we could run migrations beforehand,
# but now we want to let the php-nginx image startup like normal.
/usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
