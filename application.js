const MESG = require('mesg-js').application()
const BigNumber = require('bignumber.js')

const TOKEN_PRICE = 0.5
const ERC20_ADDRESS = '0xd14A3D6b94016e455af5eB7F329bc572EA626c5F'
const ERC20_DECIMALS = BigNumber(10).pow(18)
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

MESG.whenEvent({ serviceID: process.env.MESG_STRIPE, eventKey: 'charged' }, {
  serviceID: process.env.MESG_ERC20,
  taskKey: 'transfer',
  inputs: (event, { metadata }) => ({
    contractAddress: ERC20_ADDRESS,
    privateKey: process.env.PRIVATE_KEY,
    gasLimit: 100000,
    to: metadata.address,
    value: BigNumber(metadata.tokens).multipliedBy(ERC20_DECIMALS).toString()
  })
})

MESG.whenEvent({ serviceID: process.env.MESG_ERC20, eventKey: 'transfer', filter: (event, data) => {
  return data.contractAddress.toUpperCase() === ERC20_ADDRESS.toUpperCase()
    && data.to && emails[data.to.toUpperCase()]
} }, {
  serviceID: process.env.MESG_EMAIL,
  taskKey: 'send',
  inputs: (event, { to, value, transactionHash }) => ({
    apiKey: process.env.SENDGRID_API_KEY,
    from: 'contact@mesg.com',
    to: emails[to.toUpperCase()],
    subject: `Your MESG tokens just arrived`,
    text: `Hello, you just received your ${BigNumber(value).dividedBy(ERC20_DECIMALS).toString()} MESG tokens. See the details of the transaction here https://ropsten.etherscan.io/tx/${transactionHash}`
  })
})
