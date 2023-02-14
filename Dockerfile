FROM node:16-bullseye AS frontend-build

# Install dependencies for the standalone Map view javascript frontend
WORKDIR /app/map-frontend
COPY ./map-frontend/package.json ./package.json
COPY ./map-frontend/yarn.lock ./yarn.lock
RUN ["yarn", "install"]

# Build the map-frontend first - the "Laravel Mix" config in the
# next step will copy the bundled output from this build to the /public folder
COPY ./map-frontend .
RUN ["yarn", "build"]

# Docker layer caching isn't optimal here because we build the entire map frontend
# before installing dependencies for the "Laravel frontend". If the map-frontend is
# changed at all, we'll need to rebuild the entire Laravel frontend as well.

# Install dependencies for the Laravel javascript frontend
WORKDIR /app
COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock
RUN ["yarn", "install"]

# Build the Laravel js frontend. The Mix config also includes a step to move
# the other js frontend (map-frontend) to the public folder alongside the bundle
# that's built during this step.
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

# Make the entrypoint.sh script executable
RUN chmod a+x ./entrypoint.sh

COPY ./.env.production ./.env
# Overwrite the /public folder with output from the frontend build above
COPY --from=frontend-build /app/public /app/public
COPY --from=frontend-build /app/mix-manifest.json /app/public/mix-manifest.json

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
COPY ./php.ini /etc/php8/conf.d/settings.ini

WORKDIR /var/www/html

COPY --from=php-build /app /var/www/html

RUN chown -R nobody:nobody .

EXPOSE 8080

USER nobody

# Does this override the desired behavior that the trafex/php-nginx image is intended to provide on container startup?
ENTRYPOINT [ "/var/www/html/entrypoint.sh" ]
