First of all you need to download the different services necessary to run this application
For each service make sure to update the `.envrc` file with the according serviceID

## Required services

#### ERC20 on Ropsten network
```
mesg-core service deploy https://github.com/mesg-foundation/service-ethereum-erc20#ropsten
```
Don't forget to update your `PRIVATE_KEY` on the `.envrc`. You can create an Ethereum address and have a private key on https://www.myetherwallet.com/.

#### Sending email with Sendgrid
```
mesg-core service deploy https://github.com/mesg-foundation/service-email-sendgrid.git
```
Don't forget to update your `SENDGRID_API_KEY` on the `.envrc`. You can create a API Key [here](https://app.sendgrid.com/settings/api_keys).

#### Receiving payment with Stripe
```
mesg-core service deploy https://github.com/mesg-foundation/service-stripe
```
Don't forget to update your `STRIPE_SECRET` on the `.envrv`. You can create a secret [here](https://dashboard.stripe.com/account/apikeys).
You also need to create a [webhook](https://dashboard.stripe.com/account/webhooks) that will redirect to your Stripe service `http://mesg-stripe-test.ngrok.io/stripe`

#### Receiving webhook
```
mesg-core service deploy https://github.com/mesg-foundation/service-webhook
```

## Start the application

When everything is setup, run `source .envrc`, install dependencies with `npm install` and then run the application with:

```
node application.js
```

This runs the backend with MESG.

For local development you need to expose your localhost using `./start`.

Last step run the website, go into the `website` folder and run `php -S 127.0.0.1:8200`.

Now you can access your website and start buying MESG Token on the testnet using Stripe.

You can use `4242 4242 4242 4242` as a test credit card with the code `123`.