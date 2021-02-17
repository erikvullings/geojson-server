# GeoJSON-server

A simple in-memory REST server for GeoJSON files based on [REST-EASY-LOKI](https://github.com/erikvullings/rest-easy-loki). It will automatically import a bunch of GeoJSON files where the GeoJSON data is exposed as an array, i.e.

```json
[
  { "id" : 1, "data": { "type": "FeatureCollection", "features": [] } },
  { "id" : 2, "data": { "type": "FeatureCollection", "features": [] } },
]
```

It also contains a small script that will bundle separate GeoJSON files with a numbered ID in the filename to a data array as described above. For example, if the `data` folder contains the `data/water` folder, and the `data/water` folder contains `data/water/water.1.json`, `data/water/water.2.json`, etc., this script will create a `output/water.json` file with the combined data.

NOTE: Since the filenames need to contain an ID that is extracted using the following regex `/(?:^.*\.|^)(\d*).*\.(?:geo)?json$/i`, your files need to follow some conventions, such as have the `json` or `geojson` extension, and the ID=123 needs to be exposed too, e.g. `name.123.json`, `123.json`, or `123.geojson` are OK, but not `1name123.json` (1 is taken as the ID here).

The GeoJSON data is exposed at `http://HOST:PORT/api/water/id/1`, where HOST is typically `localhost` and PORT is 3000 or as specified in the `.env` file.

## Configuration

The data you can import is specified in the `config.json` file. Basically, for each file that you want to import, you write an entry like

```json
{
  "collections": {
    "water": {
      "jsonImport": "./output/water.json",
      "unique": ["id"]
    }
  }
}
```

And in the `.env` file, you specify the port that you wish to use (see `.env.example` for an example).

```bash
LOKI_PORT=3366
LOKI_DB="./db/geojson.db"
DATA_FOLDER="./data"
OUTPUT_FOLDER="./output"
```

For other options, see [REST-EASY-LOKI](https://github.com/erikvullings/rest-easy-loki).

## Usage

This package contains the following scripts:

```bash
npm start             // starts the typescript compiler in watch mode, creating the bundler
npm run build         // builds the bundler
npm run clean         // removes the dist folder
npm run clean:db      // removes the `db` database folder
npm run bundle        // bundles the GeoJSON files in the `data` folder
npm run serve         // starts the REST server to serve the GeoJSON files
npm run serve:reload  // removes the `db` database folder and imports the data as specified in `config.json`
```
