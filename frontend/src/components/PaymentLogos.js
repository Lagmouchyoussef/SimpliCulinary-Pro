import React from 'react'

const LOGOS = [
  ['fa-cc-visa', 'Visa'], ['fa-cc-mastercard', 'Mastercard'], ['fa-cc-amex', 'American Express'],
  ['fa-cc-paypal', 'PayPal'], ['fa-google-pay', 'Google Pay'], ['fa-cc-apple-pay', 'Apple Pay'],
  ['fa-bitcoin', 'Bitcoin'], ['fa-ethereum', 'Ethereum'],
]

function PaymentLogos({ icons }) {
  const list = icons ? LOGOS.filter(([c]) => icons.includes(c)) : LOGOS
  return (
    <span className="sc-pay-logos" aria-label="Accepted payment methods">
      {list.map(([cls, title]) => <i key={cls} className={`fab ${cls}`} title={title}></i>)}
    </span>
  )
}

export default PaymentLogos
