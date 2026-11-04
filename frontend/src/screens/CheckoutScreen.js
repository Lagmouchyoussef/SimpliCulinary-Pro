import React, { useState, useEffect } from 'react'
import { Row, Col } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_URL } from '../config'
import { useCart } from '../context/CartContext'
import PaymentLogos from '../components/PaymentLogos'

const METHODS = [
  { id: 'card', label: 'Credit / debit card', icons: ['fa-cc-visa', 'fa-cc-mastercard', 'fa-cc-amex'] },
  { id: 'paypal', label: 'PayPal', icons: ['fa-cc-paypal'] },
  { id: 'google_pay', label: 'Google Pay', icons: ['fa-google-pay'] },
  { id: 'apple_pay', label: 'Apple Pay', icons: ['fa-cc-apple-pay'] },
  { id: 'crypto', label: 'Cryptocurrency', icons: ['fa-bitcoin', 'fa-ethereum'] },
]
const COINS = [['BTC', 'Bitcoin (BTC)'], ['ETH', 'Ethereum (ETH)'], ['USDT', 'Tether (USDT)'], ['USDC', 'USD Coin (USDC)']]

function CheckoutScreen() {
  const navigate = useNavigate()
  const { updateCartCount } = useCart()
  const [ready, setReady] = useState(false)
  const [cart, setCart] = useState({ items: [], total: 0 })
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    shipping_address: '', payment_method: 'card', crypto_coin: 'BTC',
    card_name: '', card_number: '', card_expiry: '', card_cvc: '',
  })

  useEffect(() => {
    async function init() {
      try {
        // The session cookie decides whether the visitor is logged in
        await axios.get(`${API_URL}/users/api/session/`)
      } catch (e) {
        localStorage.removeItem('userInfo')
        navigate(`/login?redirect=${encodeURIComponent('/checkout')}`, { replace: true })
        return
      }
      try {
        const { data } = await axios.get(`${API_URL}/cart/api/`)
        if (!data.items || data.items.length === 0) { navigate('/cart', { replace: true }); return }
        setCart(data)
        setReady(true)
      } catch (e) {
        setError('We could not load your cart. Please try again.')
        setReady(true)
      }
    }
    init()
  }, [navigate])

  const set = (name) => (e) => setForm({ ...form, [name]: e.target.value })
  const onNumber = (e) => setForm({ ...form, card_number: e.target.value.replace(/\D/g, '').slice(0, 19).replace(/(.{4})/g, '$1 ').trim() })
  const onExpiry = (e) => {
    const d = e.target.value.replace(/\D/g, '').slice(0, 4)
    setForm({ ...form, card_expiry: d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d })
  }

  const submit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const { data } = await axios.post(`${API_URL}/orders/api/create/`, form)
      setOrder(data)
      updateCartCount()
      window.scrollTo(0, 0)
    } catch (err) {
      if (err.response && err.response.status === 401) {
        navigate(`/login?redirect=${encodeURIComponent('/checkout')}`)
        return
      }
      setError((err.response && err.response.data && err.response.data.error) || 'Payment failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!ready) return <div className="text-center py-5"><div className="sc-spinner" role="status"><span className="visually-hidden">Loading…</span></div></div>

  if (order) {
    return (
      <Row className="justify-content-center py-5">
        <Col lg={7}>
          <div className="sc-card p-4 p-lg-5 text-center">
            <div className="sc-success-mark"><i className="fas fa-check"></i></div>
            <h1 className="h2 mb-2">Thank you for your order!</h1>
            <p className="text-muted mb-4">Your payment was successful and we are preparing your order for shipment.</p>
            <dl className="sc-kv text-start p-4 mb-4" style={{ background: 'var(--sc-soft)', borderRadius: 12 }}>
              <dt>Order number</dt><dd>#{order.id}</dd>
              <dt>Status</dt><dd><span className="sc-chip sc-chip-soft">{order.status}</span></dd>
              <dt>Total paid</dt><dd>{Number(order.total)} MAD</dd>
              <dt>Payment</dt><dd>{order.payment_details}</dd>
              <dt>Reference</dt><dd>{order.payment_reference}</dd>
              <dt>Shipping address</dt><dd>{order.shipping_address}</dd>
            </dl>
            <Link to="/products" className="btn btn-primary px-4">Continue shopping</Link>
          </div>
        </Col>
      </Row>
    )
  }

  return (
    <>
      <header className="sc-page-head">
        <div className="sc-steps mb-3" aria-label="Checkout progress">
          <span className="sc-step done"><span className="n"><i className="fas fa-check" style={{ fontSize: '.6rem' }}></i></span> Cart</span>
          <span className="sc-step-line"></span>
          <span className="sc-step current"><span className="n">2</span> Payment</span>
          <span className="sc-step-line"></span>
          <span className="sc-step"><span className="n">3</span> Confirmation</span>
        </div>
        <h1>Checkout</h1>
        <p>Enter your shipping address and choose how you want to pay.</p>
      </header>

      <form onSubmit={submit}>
        <Row className="g-4 align-items-start">
          <Col lg={7}>
            {error && <div className="alert alert-danger" role="alert"><i className="fas fa-circle-exclamation me-2"></i>{error}</div>}

            <div className="sc-card p-4 mb-4">
              <h2 className="h5 mb-3">1. Shipping address</h2>
              <textarea className="form-control" rows={3} required value={form.shipping_address} onChange={set('shipping_address')} placeholder="Street, number, city, postal code, country" aria-label="Shipping address" />
            </div>

            <div className="sc-card p-4">
              <h2 className="h5 mb-3">2. Payment method</h2>
              {METHODS.map((m) => (
                <React.Fragment key={m.id}>
                  <label className={`sc-method ${form.payment_method === m.id ? 'active' : ''}`}>
                    <span className="d-flex align-items-center gap-3">
                      <input type="radio" name="payment_method" value={m.id} checked={form.payment_method === m.id} onChange={set('payment_method')} />
                      <span className="sc-method-title">{m.label}</span>
                    </span>
                    <PaymentLogos icons={m.icons} />
                  </label>
                  {form.payment_method === m.id && m.id === 'card' && (
                    <div className="sc-method-panel">
                      <Row className="g-3">
                        <Col xs={12}>
                          <label className="form-label" htmlFor="card_name">Name on card</label>
                          <input id="card_name" className="form-control" required value={form.card_name} onChange={set('card_name')} autoComplete="cc-name" />
                        </Col>
                        <Col xs={12}>
                          <label className="form-label" htmlFor="card_number">Card number</label>
                          <input id="card_number" className="form-control" required inputMode="numeric" placeholder="1234 5678 9012 3456" value={form.card_number} onChange={onNumber} autoComplete="cc-number" />
                        </Col>
                        <Col xs={6}>
                          <label className="form-label" htmlFor="card_expiry">Expiry (MM/YY)</label>
                          <input id="card_expiry" className="form-control" required placeholder="MM/YY" value={form.card_expiry} onChange={onExpiry} autoComplete="cc-exp" />
                        </Col>
                        <Col xs={6}>
                          <label className="form-label" htmlFor="card_cvc">CVC</label>
                          <input id="card_cvc" className="form-control" required inputMode="numeric" maxLength={4} placeholder="123" value={form.card_cvc} onChange={set('card_cvc')} autoComplete="cc-csc" />
                        </Col>
                      </Row>
                      <p className="small text-muted mt-3 mb-0"><i className="fas fa-lock me-1"></i> Card details are never stored. Test card: 4242 4242 4242 4242, any future date, any CVC.</p>
                    </div>
                  )}
                  {form.payment_method === m.id && m.id === 'crypto' && (
                    <div className="sc-method-panel">
                      <label className="form-label" htmlFor="crypto_coin">Choose a coin</label>
                      <select id="crypto_coin" className="form-select" value={form.crypto_coin} onChange={set('crypto_coin')}>
                        {COINS.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
                      </select>
                    </div>
                  )}
                  {form.payment_method === m.id && !['card', 'crypto'].includes(m.id) && (
                    <div className="sc-method-panel"><p className="small text-muted mb-0">You will confirm the payment with {m.label} when you place the order.</p></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </Col>

          <Col lg={5}>
            <aside className="sc-card sc-summary">
              <h4>Order summary</h4>
              {cart.items.map((item) => (
                <div key={item.id} className="d-flex justify-content-between gap-3 py-2 small">
                  <span className="text-muted">{item.quantity} × {item.product_name}</span>
                  <strong>{Number(item.product_price) * item.quantity} MAD</strong>
                </div>
              ))}
              <div className="sc-summary-row mt-2"><span>Subtotal</span><strong>{Number(cart.total)} MAD</strong></div>
              <div className="sc-summary-row"><span>Shipping</span><strong className="text-success">Free</strong></div>
              <div className="sc-summary-total"><span>Total</span><strong>{Number(cart.total)} <small className="fs-6 text-muted">MAD</small></strong></div>
              <button type="submit" className="btn btn-primary btn-lg w-100 mt-4" disabled={submitting}>
                <i className="fas fa-lock me-2"></i> {submitting ? 'Processing…' : `Pay ${Number(cart.total)} MAD`}
              </button>
              <div className="sc-demo-note mt-3"><i className="fas fa-flask mt-1"></i><span>Demo mode: no real payment is processed and no money is charged.</span></div>
              <div className="d-flex justify-content-center mt-3"><PaymentLogos /></div>
            </aside>
          </Col>
        </Row>
      </form>
    </>
  )
}

export default CheckoutScreen
