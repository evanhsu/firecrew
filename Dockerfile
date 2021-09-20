FROM node:16-bullseye AS frontend-build
WORKDIR /app

COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock
RUN ["yarn", "install"]

# Only copy files required for the frontend build (all code should be in the /resources folder)
COPY ./webpack.mix.js ./webpack.mix.js
COPY ./resources ./resources
COPY ./.env.production ./.env
# This writes output files to the /public folder (/public/js, /public/fonts, etc)
RUN ["yarn", "production"]



# The webdevops image has all the php extensions + composer installed
# It's convenient for the build stage and can be used as the final image if image size isn't a concern.
# The image from this stage is about ~850MB
FROM webdevops/php-nginx:8.0-alpine AS php-build

# Install Laravel framework system requirements (https://laravel.com/docs/8.x/deployment#optimizing-configuration-loading)
RUN apk add oniguruma-dev postgresql-dev libxml2-dev

ENV WEB_DOCUMENT_ROOT /app/public
ENV APP_ENV production
WORKDIR /app
# Check the .dockerignore file for files that will be excluded
COPY . .
COPY ./.env.production ./.env
# Overwrite the /public folder with output from the frontend build above
COPY --from=frontend-build /app/public /app/public

RUN composer install --no-interaction --optimize-autoloader --no-dev

# Build static files for Laravel to improve performance
RUN php artisan route:cache
RUN php artisan api:cache
RUN php artisan view:cache
# RUN php artisan config:cache # DISABLE this to allow env vars to be read from the system environment

# chown not necessary if this container isn't the final stage
# RUN chown -R application:application .



# Copy everything to a much smaller php-nginx container (~240MB)
FROM trafex/php-nginx:2.1.0

USER root

# Install Laravel framework system requirements (https://laravel.com/docs/8.x/deployment#server-requirements)
RUN apk add \
        libxml2-dev \
        php8-tokenizer \
        php8-mbstring \
        php8-pdo_mysql
        # postgresql-dev \
        # php8-pdo_pgsql

COPY ./nginx.conf /etc/nginx/nginx.conf

WORKDIR /var/www/html

COPY --from=php-build /app /var/www/html

RUN chown -R nobody:nobody .

USER nobody