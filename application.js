const MESG = require('mesg-js').application()
const TOKEN_PRICE = 0.5
const emails = {}

MESG.whenEvent({ serviceID: process.env.MESG_WEBHOOK }, {
  serviceID: process.env.MESG_STRIPE,
  taskKey: 'charge',
  inputs: (event, { data }) => {
    emails[data.ethAddress.toUpperCase()] = data.email
    return {
      amount: data.number * TOKEN_PRICE * 100,
      currency: 'usd',
      email: data.email,
      metadata: {
        address: data.ethAddress,
        tokens: data.number
      },
      source: data.token,
      stripeSecretKey: process.env.STRIPE_SECRET
    }
  }
})

MESG.whenEvent({ serviceID: process.env.MESG_STRIPE, filter: 'charged' }, {
  serviceID: process.env.MESG_ERC20,
  taskKey: 'transfer',
  inputs: (event, { metadata }) => ({
    privateKey: process.env.PRIVATE_KEY,
    gasLimit: 100000,
    to: metadata.address,
    value: metadata.tokens
  })
})

MESG.whenEvent({ serviceID: process.env.MESG_ERC20, filter: 'transfer' }, {
  serviceID: process.env.MESG_EMAIL,
  taskKey: 'send',
  inputs: (event, { to, value, transactionHash }) => ({
    apiKey: process.env.SENDGRID_API_KEY,
    from: 'contact@mesg.com',
    to: emails[to.toUpperCase()],
    subject: `Your MESG tokens just arrived`,
    text: `Hello, you just received your ${value} MESG tokens. See the details of the transaction here https://ropsten.etherscan.io/tx/${transactionHash}`
  })
})