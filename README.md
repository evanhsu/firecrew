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

-   Once the `init` script is done, install the frontend dependencies with yarn and start the Vite dev server:

        yarn
        yarn dev

    The Vite dev server runs on port **5180** by default (5173 is often occupied by Cursor).
    Add these to your `.env` if not already present:

        VITE_PORT=5180
        VITE_DEV_SERVER_URL=http://localhost:5180

    If you are not running `yarn dev`, the app will use the pre-built assets in `public/build/`
    (run `yarn build` after frontend changes). Delete `public/hot` if it exists and you are
    not running the dev server — that file forces the browser to look for Vite instead of
    the built assets.

-   Create the isolated test database (once per environment):

        ./vendor/bin/sail mysql -e "CREATE DATABASE IF NOT EXISTS firecrew_test; GRANT ALL PRIVILEGES ON firecrew_test.* TO 'sail'@'%'; FLUSH PRIVILEGES;"

-   Now you can start up the backend with Laravel Sail:

        ./vendor/bin/sail up

-   And Now you can visit the site in your browser: http://localhost

-   To stop the backend:

          ./vendor/bin/sail stop

-   Tear down the containers:

          ./vendor/bin/sail down

(You can run pretty much any `docker compose` command through Laravel Sail)

Local Sail always reads the root `.env` file. The droplet deploy files (`.env.production`, `.env.dev`, and their `.sops` counterparts) are separate and are not used by Sail.

## Build the production image

The image does not embed an env file. Pusher keys and the map style are filled into `window.Laravel` from the container environment when the page is rendered, so the same image can run as either the droplet `firecrew` or `firecrew-dev` service.

Build it like this:

    docker build -t "firecrew-app:$(git rev-parse HEAD)" .

## Run the production image locally

You'll need to have a database container running in order for the app
to actually work. You can run the dev database from the Sail dev environment
like this:

    docker compose up mysql

This will create the mysql container and also a docker network named `firecrew_sail` (defined in `docker-compose.yml`). When you run the app
container, you'll need to connect it to this same network to allow it to
connect to the db.

Run the production image like this (it reuses your local `.env` for database and app settings):

    export IMAGE_TAG="$(git rev-parse HEAD)"
    docker build -t "firecrew-app:${IMAGE_TAG}" .
    docker run --rm -p 80:8080 \
        --network firecrew_sail \
        --env-file .env \
        "firecrew-app:${IMAGE_TAG}"

Then open http://localhost. The container entrypoint runs `php artisan migrate --force` before nginx starts.

## Encrypting and decrypting deploy env files with SOPS

[SOPS](https://github.com/getsops/sops) (Secrets OPerationS) keeps secrets in git without storing the plaintext. You edit a normal dotenv file on your machine, encrypt it, and commit only the encrypted copy. GitHub Actions decrypts that file during deploy and writes the plaintext onto the droplet.

This repo uses two pairs of files:

| Role                                 | Production             | Dev             |
| ------------------------------------ | ---------------------- | --------------- |
| Plaintext (gitignored, never commit) | `.env.production`      | `.env.dev`      |
| Encrypted (committed)                | `.env.production.sops` | `.env.dev.sops` |

`.sops.yaml` names the **age public key** that is allowed to encrypt these files. Anyone with that public key can create a new encrypted file. Only the matching **age private key** can decrypt. GitHub Actions stores that private key as the `SOPS_AGE_KEY` repository secret. On your laptop you put the same private key in your shell environment.

### Install sops

On macOS with Homebrew:

    brew install sops

Confirm it runs:

    sops --version

### Put the age private key in your `.zshrc`

The private key is a single line that starts with `AGE-SECRET-KEY-`. Get a copy from whoever already has deploy access (or from the same place you stored the GitHub `SOPS_AGE_KEY` secret). Do not commit this key and do not paste it into a chat or a ticket.

Add it to `~/.zshrc` so every new terminal can decrypt:

    export SOPS_AGE_KEY='AGE-SECRET-KEY-paste-the-full-key-here'

Reload your shell:

    source ~/.zshrc

Check that sops can see it (this prints nothing when the variable is set, and an empty line when it is not):

    printenv SOPS_AGE_KEY | wc -c

A real key is a few dozen characters. If the count is `1` (just a newline), the variable is missing.

Alternatively, you can write the key somewhere (`~/.config/sops/age/keys.txt` is a common convention) and then set `SOPS_AGE_KEY_FILE=~/.config/sops/age/keys.txt` in `.zshrc`.

### Why the commands pass `--input-type dotenv`

SOPS guesses the file format from the filename. It treats a name that ends in `.env` as dotenv. Our files are named `.env.production` and `.env.production.sops`, which do **not** end in `.env`, so you must tell sops the type on every encrypt and decrypt:

    --input-type dotenv --output-type dotenv

Without those flags, encrypt stores the whole file as one opaque blob and later decrypts are harder to review in git.

### Decrypt (read the secrets onto your laptop)

From the firecrew repo root:

    sops -d --input-type dotenv --output-type dotenv .env.production.sops > .env.production
    sops -d --input-type dotenv --output-type dotenv .env.dev.sops > .env.dev

You now have plaintext files next to the encrypted ones. They are gitignored. Open them in your editor when you need to read or change values.

### Encrypt (write the secrets back for git)

After you create or edit a plaintext file:

    sops -e --input-type dotenv --output-type dotenv .env.production > .env.production.sops
    sops -e --input-type dotenv --output-type dotenv .env.dev > .env.dev.sops

Commit only the `.sops` file. Leave the plaintext on disk for local reference if you want, or delete it; the next decrypt will recreate it.

### Change or add a single value

Two workable approaches:

**1. Edit through sops (opens your editor, re-encrypts on save)**

This avoids leaving a plaintext file on disk if you close the editor cleanly:

    sops --input-type dotenv --output-type dotenv .env.production.sops

SOPS decrypts into a temp file, opens `$EDITOR` (or `SOPS_EDITOR` / `EDITOR`), and when you save and quit it writes the encrypted file back. Add or change a line the same way you would in any `.env` file, for example:

    MYSQL_ATTR_SSL_CA=/certs/ca-certificate.crt

or:

    MAIL_FROM_ADDRESS=support@firecrew.us

Then commit `.env.production.sops`. Use `.env.dev.sops` when the change is for the dev site only.

**2. Decrypt, edit in your editor, re-encrypt**

    sops -d --input-type dotenv --output-type dotenv .env.production.sops > .env.production

Edit `.env.production`, then:

    sops -e --input-type dotenv --output-type dotenv .env.production > .env.production.sops

Commit `.env.production.sops`. The plaintext `.env.production` stays gitignored.

A value only takes effect on the droplet after the next deploy of that environment (or after you manually install the env file and restart the container). Changing `DB_PASSWORD` in the env file is how you set that MySQL user's password: the deploy workflow runs `create-app-users.sh`, which reads the password from the env file and applies it on the managed database.

## Deploying to the droplet

There is no container registry. GitHub Actions builds the image, streams it to the droplet with `docker save` / `docker load`, decrypts the matching SOPS env file onto `/opt/stack/env/`, and restarts one Compose service. Infra for that droplet lives in the `smirksoftware-infra` repository. See **Encrypting and decrypting deploy env files with SOPS** above for how to edit those files before you deploy.

Triggers for `.github/workflows/deploy.yml`:

-   A push to `main` deploys **dev** (`firecrew-dev`, `FIRECREW_DEV_TAG`, `.env.dev.sops`).
-   A published GitHub release deploys **prod** (`firecrew`, `FIRECREW_TAG`, `.env.production.sops`).
-   **Run workflow** can target either environment. Leave the sha input empty to build the tip of the branch you selected.

Repository secrets and variables the workflow needs:

| Kind     | Name              | What it is                                                               |
| -------- | ----------------- | ------------------------------------------------------------------------ |
| Secret   | `SSH_PRIVATE_KEY` | Private half of the droplet `deploy` user key                            |
| Secret   | `SOPS_AGE_KEY`    | Age private key that decrypts `.env.production.sops` and `.env.dev.sops` |
| Variable | `DROPLET_HOST`    | Reserved IP only (no `deploy@`)                                          |

To read that IP from OpenTofu state (same Spaces credentials the infra repo uses):

    export INFRA_ROOT="${INFRA_ROOT:-$HOME/Development/smirksoftware-infra}"
    export AWS_DEFAULT_REGION=us-east-1
    cd "$INFRA_ROOT/tofu"
    tofu init
    export DROPLET_HOST="$(tofu output -raw reserved_ip)"
    echo "$DROPLET_HOST"

To ship an image from your laptop the same way Actions does (after `DROPLET_HOST` is set as above):

    export DROPLET_SSH="deploy@${DROPLET_HOST}"
    export IMAGE_TAG="$(git rev-parse HEAD)"
    docker build -t "firecrew-app:${IMAGE_TAG}" .
    sops -d --input-type dotenv --output-type dotenv .env.production.sops \
      | ssh "$DROPLET_SSH" "umask 077; cat > /opt/stack/env/firecrew.env"
    ssh "$DROPLET_SSH" "sudo /opt/stack/scripts/create-app-users.sh"
    docker save "firecrew-app:${IMAGE_TAG}" | ssh "$DROPLET_SSH" docker load
    ssh "$DROPLET_SSH" \
      "/opt/stack/scripts/set-image-tag.sh FIRECREW_TAG firecrew firecrew-app '${IMAGE_TAG}'"

For a manual **dev** deploy, use `.env.dev.sops`, `/opt/stack/env/firecrew-dev.env`, `FIRECREW_DEV_TAG`, and the `firecrew-dev` service name instead.

## Run database migrations

The container entrypoint runs migrations on every start:

    php artisan migrate --force

You do not need a separate migrate step for a normal deploy. To run artisan on the droplet against the live container:

    export INFRA_ROOT="${INFRA_ROOT:-$HOME/Development/smirksoftware-infra}"
    cd "$INFRA_ROOT/tofu"
    export DROPLET_SSH="deploy@$(tofu output -raw reserved_ip)"
    ssh "$DROPLET_SSH" \
      'docker compose -f /opt/stack/docker-compose.yml exec firecrew php artisan migrate --force'

Use `firecrew-dev` instead of `firecrew` when you mean the dev site.

### Laravel 13 upgrade: inventory removal

Before deploying to production, take a full database backup. The deploy entrypoint runs `php artisan migrate --force`, which includes `drop_inventory_tables` to remove the legacy inventory schema (`items`, `people`, `vips`, `log_entries`, and related tables).

### Running tests

Create the isolated test database once (must run as **root** — `sail mysql` always connects as `sail`):

    docker compose exec mysql mysql -uroot -ppassword -e "CREATE DATABASE IF NOT EXISTS firecrew_test; GRANT ALL PRIVILEGES ON firecrew_test.* TO 'sail'@'%'; FLUSH PRIVILEGES;"

Run the test suite:

    ./vendor/bin/sail test

To open a shell inside a running app container on the droplet:

    export INFRA_ROOT="${INFRA_ROOT:-$HOME/Development/smirksoftware-infra}"
    cd "$INFRA_ROOT/tofu"
    export DROPLET_SSH="deploy@$(tofu output -raw reserved_ip)"
    ssh "$DROPLET_SSH" \
      'docker compose -f /opt/stack/docker-compose.yml exec firecrew sh'

## Or restore a db backup

Nightly dumps land in DigitalOcean Spaces under `s3://smirksoftware-backups/firecrew.us/prod/` (production) and `s3://smirksoftware-backups/firecrew.us/dev/` (dev). Restoring replaces the data in that database. The operator steps live in `smirksoftware-infra`; the short path from this laptop is:

    export INFRA_ROOT="${INFRA_ROOT:-$HOME/Development/smirksoftware-infra}"
    export AWS_DEFAULT_REGION=us-east-1
    cd "$INFRA_ROOT/tofu"
    tofu init
    export DROPLET_SSH="deploy@$(tofu output -raw reserved_ip)"

SSH to the droplet, source the backup credentials, list dumps, then stream one into MySQL:

    ssh "$DROPLET_SSH"
    set -a && source /opt/stack/backup.env && set +a
    export BACKUP_PREFIX="s3://smirksoftware-backups/firecrew.us/prod"
    export DB_NAME="firecrew"
    docker run --rm -e AWS_ACCESS_KEY_ID -e AWS_SECRET_ACCESS_KEY -e AWS_DEFAULT_REGION=us-east-1 \
      amazon/aws-cli s3 ls "${BACKUP_PREFIX}/" \
      --endpoint-url "$AWS_S3_ENDPOINT"

Pick a dump from that listing, then:

    export DUMP_OBJECT="${BACKUP_PREFIX}/dump_2026_11_14-07_00_00.sql.gz"
    docker run --rm -e AWS_ACCESS_KEY_ID -e AWS_SECRET_ACCESS_KEY -e AWS_DEFAULT_REGION=us-east-1 \
      amazon/aws-cli s3 cp "$DUMP_OBJECT" - \
      --endpoint-url "$AWS_S3_ENDPOINT" \
    | gzip -dc \
    | docker run --rm -i --network host -e MYSQL_PWD="$DB_PASSWORD" \
        -v /opt/stack/certs/ca-certificate.crt:/ca.crt:ro \
        mysql:8 \
        mysql --host="$DB_HOST" --port="$DB_PORT" --user="$DB_USER" \
          --ssl-mode=REQUIRED --ssl-ca=/ca.crt \
          "$DB_NAME"

Change only the timestamp in `DUMP_OBJECT` (and `BACKUP_PREFIX` / `DB_NAME` for `firecrew.us/dev` → `firecrew_dev`). See the smirksoftware-infra README for the full restore runbook.

If you have a local `.sql` dump and want the old Laravel seeder path instead, copy it into a running container as `database/seeders/firecrew.sql` and run:

    php artisan db:seed --class=SqlDumpSeeder

## Creating a db backup

The droplet already runs a nightly `mysqldump` into Spaces at 07:00 UTC. To take an on-demand dump of production Firecrew and copy it to your laptop:

    export INFRA_ROOT="${INFRA_ROOT:-$HOME/Development/smirksoftware-infra}"
    cd "$INFRA_ROOT/tofu"
    export DROPLET_SSH="deploy@$(tofu output -raw reserved_ip)"
    ssh "$DROPLET_SSH" 'sudo systemctl start backup.service'
    ssh "$DROPLET_SSH" 'sudo tail -n 50 /var/log/smirksoftware-backup.log'

Then list and download the newest object (this uses the Spaces keys from `/opt/stack/backup.env` on the droplet):

    ssh "$DROPLET_SSH" 'set -a && source /opt/stack/backup.env && set +a && \
      docker run --rm -e AWS_ACCESS_KEY_ID -e AWS_SECRET_ACCESS_KEY -e AWS_DEFAULT_REGION=us-east-1 \
        amazon/aws-cli s3 ls s3://smirksoftware-backups/firecrew.us/prod/ \
        --endpoint-url "$AWS_S3_ENDPOINT"'

To dump only the production Firecrew database from the droplet into a file you can `scp`:

    export INFRA_ROOT="${INFRA_ROOT:-$HOME/Development/smirksoftware-infra}"
    cd "$INFRA_ROOT/tofu"
    export DROPLET_SSH="deploy@$(tofu output -raw reserved_ip)"
    ssh "$DROPLET_SSH" 'set -a && source /opt/stack/backup.env && set +a && \
      docker run --rm --network host \
        -e MYSQL_PWD="$DB_PASSWORD" \
        -v /opt/stack/certs/ca-certificate.crt:/ca.crt:ro \
        mysql:8 \
        mysqldump --host="$DB_HOST" --port="$DB_PORT" --user="$DB_USER" \
          --ssl-mode=REQUIRED --ssl-ca=/ca.crt \
          --databases firecrew --add-drop-table --comments' \
      > ./firecrew.sql

That writes `firecrew.sql` on your laptop. The `doadmin` credentials come from `backup.env`; the application user passwords stay in the app env files.
