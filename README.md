# Firecrew

A web app for wildland fire crews to post their location and assignments for national coordination.

## Getting Started

-   Clone this repo
-   Switch into the project folder
-   Run the `init` script:

         ./init

    This script will create a `.env` file for your local dev environment, build the docker containers, and run `composer install` inside the application docker container to install PHP/Laravel dependencies.

    **The `init` script only needs to be run when you first pull down the project**

    Once Laravel Sail is installed, you can perform subsequent composer tasks inside the docker container with Sail's `composer` command. For example:

        ./vendor/bin/sail composer install

    or

        ./vendor/bin/sail composer require some/package

    or

        ./vendor/bin/sail composer dump-autoload

    etc

-   Once the `init` script is done, install the frontend dependencies with yarn and then start up the webpack dev server:

        yarn
        yarn dev

-   Now you can start up the backend with Laravel Sail:

        ./vendor/bin/sail up

-   And Now you can visit the site in your browser: http://localhost

-   To stop the backend:

          ./vendor/bin/sail stop

-   Tear down the containers:

          ./vendor/bin/sail down

(You can run pretty much any `docker compose` command through Laravel Sail)

## Build the production image

Build the image like this

    docker build -t firecrew-app .

## Run the production image locally

You'll need to have a database container running in order for the app
to actually work. You can run the dev database from the Sail dev environment
like this:

    docker compose up mysql

This will create the mysql container and also a docker network named `firecrew_sail` (defined in `docker-compose.yml`). When you run the app
container, you'll need to connect it to this same network to allow it to
connect to the db.

Run the production image like this:

    docker run -p 80:8080 \
        --network firecrew_sail \
        -e DB_DATABASE=firecrew \
        -e DB_USERNAME=sail \
        -e DB_PASSWORD=password \
        -e APP_KEY=base64:JBaRbt7KFN7OJHhTsXWYnEjZmweUjsJkCdILJpVaxI8= \
        firecrew-app

## Pushing a new tag to the container registry

You'll need the DigitalOcean CLI: https://docs.digitalocean.com/reference/doctl/how-to/install/

After you've built a new image, get the first 7 characters of the git commit
hash like this (we're going to use this as the tag for this docker image):

    git rev-parse --short HEAD

Now tag the image (referencing it by the name: `firecrew-app`):

    docker tag firecrew-app registry.digitalocean.com/firecrew/firecrew-app:<GIT_SHA>

Now push the image to the container registry:

    docker push registry.digitalocean.com/firecrew/firecrew-app:<GIT_SHA>

Because of the storage limitations of the free-tier container registry,
**you may need to delete images before you can push a new one.**
