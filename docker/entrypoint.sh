#!/bin/bash

# Run migrations (be careful with this in production!)
# php artisan migrate --force

# Cache clearing
php artisan optimize:clear

exec "$@"
