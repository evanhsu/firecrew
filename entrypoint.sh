#! /bin/bash


# Poll for a db connection

# Once db availability is established, run migrations
php artisan db:migrate --force

# Or maybe we can just keep retrying the artisan migrate command until we get a clean exit?