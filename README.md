# MESG Application Stripe to ERC20

[Website](https://mesg.com/) - [Docs](https://docs.mesg.com/) - [Chat](https://discordapp.com/invite/SaZ5HcE) - [Blog](https://medium.com/mesg)

MESG Application to buy Ethereum ERC20 tokens with using [Stripe](https://stripe.com/).

# Installation

## Install MESG Core

Make sure that [MESG Core](https://github.com/mesg-foundation/core) is installed and running on your computer.
You can run the following command to install and start the Core:

```bash
 npm install -g @mesg/cli
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

```bash
 mesg-cli process:dev application.yml \
     --env PROVIDER_ENDPOINT=$PROVIDER_ENDPOINT \
     --env STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY \
     --env SENDGRID_API_KEY=$SENDGRID_API_KEY \
     --env PRIVATE_KEY=$PRIVATE_KEY \
```

`SENDGRID_API_KEY` variable in the `.env` file. You can create an API Key [here](https://app.sendgrid.com/settings/api_keys).

`STRIPE_SECRET` variable in the `.env` file. You can create a secret [here](https://dashboard.stripe.com/account/apikeys).

`PROVIDER_ENDPOINT` variable in the `.env` file `https://ropsten.infura.io/v3/__PROJECT_ID__`. ERC20 token deployed on the Ropsten testnet of Ethereum.

`PRIVATE_KEY` in the `.env` by yours. You can create an Ethereum address and have a private key on https://www.myetherwallet.com/.

# Start the application

Make sure to update all variables in the `.env` file then run:

```bash
docker build website -t erc20-stripe-website
docker run -d -p 8080:80 erc20-stripe-website
```

Now you can access the website at the address `127.0.0.1:8080` and start buying MESG Token on the Ropsten testnet using Stripe.

Use `4242 4242 4242 4242` as a test credit card with the security code `123`. Use any expiration data.
