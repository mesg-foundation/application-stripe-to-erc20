const stripe = Stripe('pk_test_eLD6pXDft0h72iczauwlxyDK');
const PRICE_PER_TOKEN = 0.4

const submitToken = async data => {
  const response = await fetch(`http://${window.location.hostname}:3000/webhook`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  const res = await response.json()
  console.log(res)
}

const calculatePrice = number => number * PRICE_PER_TOKEN

const updatePrice = () => {
  const number = document.querySelector('#example1-tokens').value
  const price = calculatePrice(number)
  document.querySelector('#amount').innerText = price
  document.querySelector('#tokens').innerText = number
}

const registerElements = (elements) => {
  const example = document.querySelector('.example1')
  const form = example.querySelector('form')
  const resetButton = example.querySelector('a.reset')
  const error = form.querySelector('.error')
  const errorMessage = error.querySelector('.message')

  const enableInputs = () => Array.prototype.forEach.call(
    form.querySelectorAll("input[type='text'], input[type='email'], input[type='tel']"),
    input => input.removeAttribute('disabled')
  )

  const disableInputs = () => Array.prototype.forEach.call(
    form.querySelectorAll("input[type='text'], input[type='email'], input[type='tel']"),
    input => input.setAttribute('disabled', 'true')
  )

  const triggerBrowserValidation = () => {
    var submit = document.createElement('input')
    submit.type = 'submit'
    submit.style.display = 'none'
    form.appendChild(submit)
    submit.click()
    submit.remove()
  }

  var savedErrors = {}
  elements.forEach((element, idx) => {
    element.on('change', (event) => {
      if (event.error) {
        error.classList.add('visible')
        savedErrors[idx] = event.error.message
        errorMessage.innerText = event.error.message
        return
      }
      savedErrors[idx] = null
      const nextError = Object.keys(savedErrors)
        .sort()
        .reduce((maybeFoundError, key) => maybeFoundError || savedErrors[key], null)

      if (nextError) {
        errorMessage.innerText = nextError
      } else {
        error.classList.remove('visible')
      }
    })
  })

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    var plainInputsValid = true
    Array.prototype.forEach.call(form.querySelectorAll('input'), input => {
      if (input.checkValidity && !input.checkValidity()) {
        plainInputsValid = false
        return
      }
    })
    if (!plainInputsValid) {
      triggerBrowserValidation()
      return
    }

    example.classList.add('submitting')
    disableInputs()

    const email = form.querySelector('#example1-email').value
    const address = form.querySelector('#example1-address').value
    const number = form.querySelector('#example1-tokens').value
    const result = await stripe.createToken(elements[0])
    example.classList.remove('submitting')
    if (!result.token) { return enableInputs() }
    submitToken({
      token: result.token.id,
      ethAddress: address,
      number,
      email
    })
    example.classList.add('submitted')
  })

  resetButton.addEventListener('click', (e) => {
    e.preventDefault()
    form.reset()
    elements.forEach(element => element.clear())
    error.classList.remove('visible')
    enableInputs()
    example.classList.remove('submitted')
  })
}

(function() {
  const elements = stripe.elements({
    fonts: [{ cssSrc: 'https://fonts.googleapis.com/css?family=Roboto' }]
  });

  const card = elements.create('card', {
    iconStyle: 'solid',
    style: {
      base: {
        iconColor: '#c4f0ff',
        color: '#fff',
        fontWeight: 500,
        fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
        fontSize: '16px',
        fontSmoothing: 'antialiased',
        ':-webkit-autofill': {
          color: '#fce883'
        },
        '::placeholder': {
          color: '#87BBFD'
        }
      },
      invalid: {
        iconColor: '#FFC7EE',
        color: '#FFC7EE'
      }
    }
  });
  card.mount('#example1-card')

  registerElements([card])
  updatePrice()
  document.querySelector('select').addEventListener('change', updatePrice)
})()