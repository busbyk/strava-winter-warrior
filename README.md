# Strava Winter Warrior

An app to keep track of Strava activity data for a Winter Warrior running challenge. Could be used/modified for any Strava-based challenge.

## Getting started

### Create .env file

Should have the following env vars:

```
STRAVA_CLIENT_ID={YOUR_CLIENT_ID}
STRAVA_CLIENT_SECRET={YOUR_CLIENT_SECRET}
DB_USER={YOUR_DB_USER}
DB_PASSWORD={YOUR_DB_PASSWORD}
DB_NAME={YOUR_DB_NAME}
PORT=3000
```

### Set up a MongoDB instance

I recommend using the [MongoDB Cloud](https://www.mongodb.com/cloud) to get started. It has a free tier and is easy to set up.

Get your DB-specific env vars from here.

### Create a Strava app

Follow the Strava API's [Getting Started Guide](https://developers.strava.com/) to create an app and store the client id and secret in the .env file described above.

### Running the app

1. Run `npm run install-all` (installs dependencies for the server and client)
1. Run `npm start`
1. Visit http://localhost:3000 (or whatever you set your PORT to in your .env file)
