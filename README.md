# PoCake Demo for Salt and Straw
Progressive web app for short order restaurants
This demo was made for Salt and Straw, an awesome ice cream shop who always have a crazy line up!

#### Development
`yarn && yarn startDev` will kick off the dev server front (port 3000) and back (port 8888)
NB: you will need to create a `server.env` file with the following values:
```
STRIPE_PRIV_KEY=<stripe priv key>
AIRTABLE_KEY=<airtable API key>
VAPID_PUBLIC_KEY=<gen vapid keys (see ./dispatchPush.js)>
VAPID_PRIVATE_KEY=<gen vapid keys (see ./dispatchPush.js)>
```
and put it in the root of this project. You'll need a Stripe account and an airtable account to make full use of the back end on this app. Also note that Push notifications only work in production environments.

Likewise, the .env file included here will need to be updated with your Stripe pub key and the same vapid pub key you generate for the server.

#### Production
This project is set up to use NOW v2 and `yarn deploy` will push the files to now for building and alias it using now.json params.
See zeit.co for documentation on using NOW and I highly recommend you do if you don't yet!

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
