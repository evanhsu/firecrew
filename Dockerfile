FROM node:20-bullseye AS frontend-build

# Install dependencies for the Laravel javascript frontend
WORKDIR /app
COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock
COPY ./.yarnrc.yml ./.yarnrc.yml
RUN ["corepack", "enable"]
RUN ["yarn", "install"]

# Build the Laravel js frontend.
COPY ./webpack.mix.js ./tsconfig.json ./
COPY ./resources ./resources
COPY ./.env.production ./.env
# This writes output files to the /public folder (/public/js, /public/fonts, etc)
RUN ["yarn", "production"]


# The webdevops image has all the php extensions + composer installed
# It's convenient for the build stage and can be used as the final image if image size isn't a concern.
# The image from this stage is about ~850MB
FROM webdevops/php-nginx:8.3-alpine AS php-build

# Install Laravel framework system requirements (https://laravel.com/docs/8.x/deployment#optimizing-configuration-loading)
RUN apk add oniguruma-dev postgresql-dev libxml2-dev

ENV WEB_DOCUMENT_ROOT=/app/public
ENV APP_ENV=production
WORKDIR /app
# Check the .dockerignore file for files that will be excluded
COPY . .

# Make the entrypoint.sh script executable
RUN chmod a+x ./entrypoint.sh

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
FROM trafex/php-nginx:3.6.0

USER root

# Install Laravel framework system requirements (https://laravel.com/docs/8.x/deployment#server-requirements)
RUN apk add \
        libxml2-dev \
        php83-tokenizer \
        php83-mbstring \
        php83-pdo_mysql
        # postgresql-dev \
        # php83-pdo_pgsql

COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./php.ini /etc/php83/conf.d/settings.ini

WORKDIR /var/www/html

COPY --from=php-build /app /var/www/html

RUN chown -R nobody:nobody .

EXPOSE 8080

USER nobody

# Does this override the desired behavior that the trafex/php-nginx image is intended to provide on container startup?
ENTRYPOINT [ "/var/www/html/entrypoint.sh" ]
