# MESG Application Stripe to ERC20
[Website](https://mesg.com/) - [Docs](https://docs.mesg.com/) - [Chat](https://discordapp.com/invite/SaZ5HcE) - [Blog](https://medium.com/mesg)

MESG Application to buy Ethereum ERC20 tokens with using [Stripe](https://stripe.com/).

# Installation

## Install MESG Core

Make sure that [MESG Core](https://github.com/mesg-foundation/core) is installed and running on your computer.
You can run the following command to install and start the Core:
```
bash <(curl -fsSL https://mesg.com/install)
```

## Download source

Download the source code of the application. You can clone this repository by using the following command:

```
git clone https://github.com/mesg-foundation/application-stripe-to-erc20.git
```

## Create configuration file

Copy the `.env.example` to `.env`.

This file contains required configurations needed for the application.
You need to replace the `...` by the right value.

## Deploy the required MESG Services

You need to deploy the MESG Services that the application is using.

### ERC20 on Ropsten network

The application is using an ERC20 token deployed on the Ropsten testnet of Ethereum.

Deploy the service by running the following command:

```
mesg-core service deploy https://github.com/mesg-foundation/service-ethereum-erc20 --env PROVIDER_ENDPOINT=https://ropsten.infura.io/v3/8f6874c7a41d44239939b96f7c969080
```

Also, update the `PRIVATE_KEY` in the `.env` by yours.
You can create an Ethereum address and have a private key on https://www.myetherwallet.com/.

### Sending email with SendGrid

Deploy the SendGrid service by running the following command:

```
mesg-core service deploy https://github.com/mesg-foundation/service-email-sendgrid.git
```

Don't forget to update the `SENDGRID_API_KEY` variable in the `.env` file. You can create an API Key [here](https://app.sendgrid.com/settings/api_keys).

### Receiving payment with Stripe

Deploy the Stripe service by running the following command:

```
mesg-core service deploy https://github.com/mesg-foundation/service-stripe
```

Don't forget to update the `STRIPE_SECRET` variable in the `.env` file. You can create a secret [here](https://dashboard.stripe.com/account/apikeys).
You also need to create a [webhook](https://dashboard.stripe.com/account/webhooks) that will redirect to your Stripe service `http://mesg-stripe-test.ngrok.io/stripe`.

### Receiving webhook

Deploy the Webhook service by running the following command:

```
mesg-core service deploy https://github.com/mesg-foundation/service-webhook
```

# Start the application

Make sure to update all variables in the `.env` file then run:

```
./start local
docker-compose up --build
```

Now you can access the website at the address `127.0.0.1:8080` and start buying MESG Token on the Ropsten testnet using Stripe.

Use `4242 4242 4242 4242` as a test credit card with the security code `123`. Use any expiration data.
