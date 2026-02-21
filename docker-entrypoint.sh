#!/bin/sh
set -e

# Generate app key if not set
php artisan key:generate --force --ansi || true

# Run package discovery and caching (safe now that env & services exist)
php artisan package:discover --ansi
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# Optional: migrate if you want auto-migrations on start
# php artisan migrate --force --no-interaction

# Start PHP-FPM
exec php-fpm