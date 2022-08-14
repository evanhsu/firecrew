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

## Run database migrations

You'll need to apply the db schema when you first set up the application:

    php artisan db:migrate --force

In a production (kubernetes) environment, you can connect to an application pod like this:

    kubectl get pods

    NAME                            READY   STATUS    RESTARTS   AGE
    firecrew-app-787dcc958f-9pcpr   1/1     Running   0          73m
    mysql-594664c854-hwzrg          1/1     Running   0          4h21m

Then you can open a terminal inside the app pod:

    kubectl exec -it firecrew-app-787dcc958f-9pcpr -- /bin/sh

...and then you can run migrations.

## Or restore a db backup

Assuming you have a `.sql` backup file (e.g. from `mysqldump`),
copy it to the kubernetes pod and run the `SqlDumpSeeder` to apply it to the db:

(**Note** The seeder expects the db backup filename to be `firecrew.sql`)

    kubectl cp ./db_backup.sql <POD_NAME>:/var/www/html/database/seeders/firecrew.sql
    kubectl exec -it <POD_NAME> -- /bin/sh

    /var/www/html $ php artisan db:seed --class=SqlDumpSeeder

## Creating a db backup from the production server

    sudo -iu firecrew
    mysqldump --user=firecrew --databases firecrew --add-drop-table --comments --result-file=./db_backup.sql
