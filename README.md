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
