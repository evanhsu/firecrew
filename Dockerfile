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



FROM webdevops/php-nginx:8.0-alpine

# Install Laravel framework system requirements (https://laravel.com/docs/8.x/deployment#optimizing-configuration-loading)
RUN apk add oniguruma-dev postgresql-dev libxml2-dev

# If we need to install new PHP extensions in the future, this is how to do it
# https://github.com/docker-library/docs/blob/67b8e44b05b82cf39a35083f3f36027df5a264b9/php/README.md#how-to-install-more-php-extensions
# RUN docker-php-ext-install \
#         tokenizer \
#         xml

# Copy Composer binary from the Composer official Docker image
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

ENV WEB_DOCUMENT_ROOT /app/public
ENV APP_ENV production
WORKDIR /app
# Check the .dockerignore file for files that will be excluded
COPY . .
COPY ./.env.production ./.env
# Overwrite the /public folder with output from the frontend build above
COPY --from=frontend-build /app/public /app/public

RUN composer install --no-interaction --optimize-autoloader --no-dev

# Optimizing Configuration loading
# DISABLE this to allow env vars to be read from the system environment
# RUN php artisan config:cache

# Optimizing Route loading
RUN php artisan route:cache
RUN php artisan api:cache
# Optimizing View loading
RUN php artisan view:cache

RUN chown -R application:application .