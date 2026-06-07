#!/bin/sh
set -e

cd /var/www/html

# Cache config, routes, views for performance
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# Run database migrations
php artisan migrate --force

# Start all processes via supervisord
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
