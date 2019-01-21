const { application } = require('mesg-js')
const BigNumber = require('bignumber.js')

const mesg = application({ endpoint: process.env.MESG_ENDPOINT })

const TOKEN_PRICE = 0.4
const ERC20_ADDRESS = '0xd14A3D6b94016e455af5eB7F329bc572EA626c5F'
const ERC20_DECIMALS = BigNumber(10).pow(18)
const emails = {}

const log = x => x.on('data', console.log).on('error', console.error)
log(mesg.listenResult({ serviceID: 'stripe' }))
log(mesg.listenResult({ serviceID: 'ethereum-erc20' }))

mesg.listenEvent({ serviceID: 'webhook' })
  .on('data', event => {
    console.log('Receiving webhook => Charging on Stripe')
    const data = JSON.parse(event.eventData).data
    emails[data.ethAddress.toUpperCase()] = data.email
    mesg.executeTask({
      serviceID: 'stripe',
      taskKey: 'charge',
      inputData: JSON.stringify({
        amount: data.number * TOKEN_PRICE * 100,
        currency: 'usd',
        email: data.email,
        metadata: {
          address: data.ethAddress,
          tokens: data.number
        },
        source: data.token,
        stripeSecretKey: process.env.STRIPE_SECRET
      })
    })
      .catch(console.error)
  })

mesg.listenEvent({ serviceID: 'stripe', eventKey: 'charged' })
  .on('data', event => {
    console.log('Stripe payment confirmed => Transfering ERC20')
    const metadata = JSON.parse(event.eventData).metadata
    mesg.executeTask({
      serviceID: 'ethereum-erc20',
      taskKey: 'transfer',
      inputData: JSON.stringify({
        contractAddress: ERC20_ADDRESS,
        privateKey: process.env.PRIVATE_KEY,
        gasLimit: 100000,
        to: metadata.address,
        value: (metadata.tokens * ERC20_DECIMALS).toString()
      })
    })
      .catch(console.error)
  })

mesg.listenEvent({ serviceID: 'ethereum-erc20', eventKey: 'transfer' })
  .on('data', event => {
    const transfer = JSON.parse(event.eventData)
    if (
      transfer.contractAddress.toUpperCase() === ERC20_ADDRESS.toUpperCase() &&
      transfer.to &&
      emails[transfer.to.toUpperCase()]
    ) {
      mesg.executeTask({
        serviceID: 'email-sendgrid',
        taskKey: 'send',
        inputData: JSON.stringify({
          apiKey: process.env.SENDGRID_API_KEY,
          from: 'contact@mesg.com',
          to: emails[transfer.to.toUpperCase()],
          subject: `Your MESG tokens just arrived`,
          text: `Hello, you just received your ${BigNumber(transfer.value).dividedBy(ERC20_DECIMALS).toString()} MESG tokens. See the details of the transaction here https://ropsten.etherscan.io/tx/${transfer.transactionHash}`
        })
      })
        .catch(console.error)
    }
  })
