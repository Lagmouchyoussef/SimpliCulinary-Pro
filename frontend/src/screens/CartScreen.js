import React, { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Row, Col } from 'react-bootstrap'
import axios from 'axios'
import { useCart } from '../context/CartContext'
import { API_URL, imageUrl } from '../config'
import Toast from '../components/Toast'
import PaymentLogos from '../components/PaymentLogos'

function CartScreen() {
  const [cart, setCart] = useState({ items: [], total: 0 })
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const { updateCartCount } = useCart()
  const navigate = useNavigate()
  const isLoggedIn = !!localStorage.getItem('userInfo')
  const closeToast = useCallback(() => setToast(null), [])

  const fetchCart = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/cart/api/`)
      setCart(data)
    } catch (error) {
      console.error('Error fetching cart:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCart() }, [])

  const removeFromCartHandler = async (id) => {
    try {
      await axios.delete(`${API_URL}/cart/api/item/${id}/`)
      fetchCart()
      updateCartCount()
    } catch (error) {
      console.error('Error deleting:', error)
      setToast({ type: 'error', title: 'Something went wrong', message: 'Could not remove this item.' })
    }
  }

  const checkoutHandler = () => {
    // Guests must log in or create an account first; the cart is kept and merged on login
    navigate(isLoggedIn ? '/checkout' : `/login?redirect=${encodeURIComponent('/checkout')}`)
  }

  const isEmpty = !cart.items || cart.items.length === 0

  return (
    <>
      <header className="sc-page-head">
        <div className="sc-steps mb-3" aria-label="Checkout progress">
          <span className="sc-step current"><span className="n">1</span> Cart</span>
          <span className="sc-step-line"></span>
          <span className="sc-step"><span className="n">2</span> Payment</span>
          <span className="sc-step-line"></span>
          <span className="sc-step"><span className="n">3</span> Confirmation</span>
        </div>
        <h1>Your shopping cart</h1>
        <p>Review your selection and proceed to checkout.</p>
      </header>

      <Row className="g-4 align-items-start">
        <Col lg={8}>
          {loading ? (
            <div className="text-center py-5"><div className="sc-spinner" role="status"><span className="visually-hidden">Loading…</span></div></div>
          ) : isEmpty ? (
            <div className="sc-card sc-empty">
              <div className="sc-empty-icon"><i className="fas fa-bag-shopping"></i></div>
              <h3>Your cart is empty</h3>
              <p className="text-muted mb-4">Discover our exceptional products and start your culinary journey.</p>
              <Link to="/products" className="btn btn-primary btn-lg px-5">Start shopping</Link>
            </div>
          ) : (
            <>
              {cart.items.map((item) => {
                const img = imageUrl(item.product_image)
                return (
                  <article key={item.id} className="sc-card sc-cart-item">
                    <div className="sc-cart-thumb">{img ? <img src={img} alt={item.product_name} /> : <i className="fas fa-utensils"></i>}</div>
                    <div className="sc-cart-info">
                      <div className="d-flex justify-content-between align-items-start gap-3">
                        <div>
                          <h2 className="h6 mb-1"><Link className="sc-cart-name" to={`/products/${item.product}`}>{item.product_name}</Link></h2>
                          <p className="text-muted small mb-0">{Number(item.product_price)} MAD / unit</p>
                        </div>
                        <span className="sc-price">{Number(item.product_price) * item.quantity}<small>MAD</small></span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mt-auto pt-3">
                        <span className="text-muted small">Quantity: <strong className="text-dark">{item.quantity}</strong></span>
                        <button type="button" className="sc-link-danger" onClick={() => removeFromCartHandler(item.id)}>
                          <i className="fas fa-trash-can me-1"></i> Remove
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
              <Link to="/products" className="btn btn-soft mt-2"><i className="fas fa-arrow-left me-2"></i> Continue shopping</Link>
            </>
          )}
        </Col>

        <Col lg={4}>
          <aside className="sc-card sc-summary">
            <h4>Order summary</h4>
            <div className="sc-summary-row"><span>Subtotal</span><strong>{Number(cart.total)} MAD</strong></div>
            <div className="sc-summary-row"><span>Shipping</span><strong className="text-success">Free</strong></div>
            <div className="sc-summary-total"><span>Total</span><strong>{Number(cart.total)} <small className="fs-6 text-muted">MAD</small></strong></div>
            <button type="button" className="btn btn-primary btn-lg w-100 mt-4" disabled={isEmpty || loading} onClick={checkoutHandler}>
              Checkout <i className="fas fa-arrow-right ms-2"></i>
            </button>
            {!isLoggedIn && !isEmpty && <p className="small text-muted text-center mt-3 mb-0"><i className="fas fa-user me-1"></i> You will be asked to log in or create an account to pay.</p>}
            <p className="small text-muted text-center mt-3 mb-2"><i className="fas fa-lock me-1"></i> Secure checkout guaranteed</p>
            <div className="d-flex justify-content-center"><PaymentLogos /></div>
          </aside>
          <div className="sc-promo mt-3"><i className="fas fa-truck-fast"></i> Free shipping on all orders over 5,000 MAD</div>
        </Col>
      </Row>

      <Toast show={!!toast} onClose={closeToast} {...(toast || {})} />
    </>
  )
}

export default CartScreen
