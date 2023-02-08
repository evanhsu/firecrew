# The Map

The map view is built as a completely separate react project so that it can use a
newer version of NodeJS, React, and the ArcGIS SDK without needing to upgrade the
entire rest of the legacy frontend (which still uses React 15 at the time of this
writing).

## Production Build

In the `/map-frontend` folder:

    yarn build

this will create a `bundle.js` in the `map-frontend/dist/` folder.
But we're not done yet. This bundle needs to be moved into the Laravel
project so that it can be bundled into the Laravel build:

The Laravel webpack config will copy the 'map-frontend' bundle into Laravel
project when it runs

From the root project folder, run:

    yarn prod

This will build the legacy frontend (Summary page + Inventory stuff) and also copy the
`map-frontend/dist/` folder into the Laravel project.

## Dev Workflow

1. In the `/map-frontend` folder, run

    npx webpack --watch

2. In the project root, run

    yarn watch

3. You can visit in-browser at http://firecrew.test

It's clunky, but it works for now.
