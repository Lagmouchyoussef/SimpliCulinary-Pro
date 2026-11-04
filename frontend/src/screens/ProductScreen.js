import React, { useState, useEffect, useCallback } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Row, Col } from 'react-bootstrap'
import axios from 'axios'
import { useCart } from '../context/CartContext'
import { API_URL, imageUrl } from '../config'
import Toast from '../components/Toast'

function ProductScreen() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [toast, setToast] = useState(null)
  const { updateCartCount } = useCart()
  const navigate = useNavigate()
  const closeToast = useCallback(() => setToast(null), [])

  useEffect(() => {
    setLoading(true)
    axios.get(`${API_URL}/products/api/${id}/`)
      .then(({ data }) => setProduct(data))
      .catch((error) => { console.error(error); setProduct(null) })
      .finally(() => setLoading(false))
  }, [id])

  const addToCartHandler = async (buyNow = false) => {
    try {
      await axios.post(`${API_URL}/cart/api/`, { product_id: id, quantity: qty })
      updateCartCount()
      if (buyNow === true) {
        // Straight to checkout; guests are asked to log in / sign up there (their cart is kept)
        navigate(localStorage.getItem('userInfo') ? '/checkout' : `/login?redirect=${encodeURIComponent('/checkout')}`)
        return
      }
      setToast({ type: 'success', title: 'Added to cart', message: `${product.name} added to cart!` })
    } catch (error) {
      console.error('Error adding to cart', error)
      setToast({ type: 'error', title: 'Something went wrong', message: (error.response && error.response.data && error.response.data.error) || 'We could not add this product. Please try again.' })
    }
  }

  if (loading) return <div className="text-center py-5"><div className="sc-spinner" role="status"><span className="visually-hidden">Loading…</span></div></div>
  if (!product) {
    return (
      <div className="sc-card sc-empty my-5">
        <div className="sc-empty-icon"><i className="fas fa-circle-question"></i></div>
        <h3>Product not found</h3>
        <Link to="/products" className="btn btn-primary px-4 mt-3">Back to shop</Link>
      </div>
    )
  }

  const img = imageUrl(product.image)
  const inStock = product.stock > 0
  const setQuantity = (n) => setQty(Math.min(Math.max(1, n), product.stock || 1))

  return (
    <>
      <nav aria-label="breadcrumb" className="pt-4 pb-3">
        <ol className="breadcrumb mb-0">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          <li className="breadcrumb-item"><Link to="/products">Shop</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
        </ol>
      </nav>

      <div className="sc-card sc-detail">
        <Row className="g-0">
          <Col lg={6}>
            <div className="sc-detail-media">
              {img ? <img src={img} alt={product.name} /> : <div className="sc-product-placeholder" style={{ minHeight: 380, fontSize: '6rem' }}><i className="fas fa-utensils"></i></div>}
            </div>
          </Col>
          <Col lg={6} className="p-4 p-lg-5 d-flex flex-column">
            <div className="d-flex flex-wrap align-items-center gap-2">
              <span className="sc-chip sc-chip-soft">{product.category_name || 'Premium'}</span>
              {inStock
                ? <span className="sc-stock in"><i className="fas fa-circle-check"></i> In stock{product.stock <= 5 ? ` — only ${product.stock} left` : ''}</span>
                : <span className="sc-stock out"><i className="fas fa-circle-xmark"></i> Out of stock</span>}
            </div>

            <h1 className="sc-detail-title">{product.name}</h1>
            <div className="sc-detail-price mb-3">{Number(product.price)} <small>MAD</small></div>
            <p className="text-muted fs-6 lh-lg mb-4">{product.description}</p>

            <div className="sc-buybox mt-auto">
              <div className="d-flex flex-wrap align-items-end gap-3">
                <div>
                  <label className="form-label" htmlFor="qty">Quantity</label>
                  <div className="sc-qty">
                    <button type="button" aria-label="Decrease quantity" onClick={() => setQuantity(qty - 1)}><i className="fas fa-minus"></i></button>
                    <input id="qty" type="number" value={qty} min="1" max={product.stock} onChange={(e) => setQuantity(Number(e.target.value))} />
                    <button type="button" aria-label="Increase quantity" onClick={() => setQuantity(qty + 1)}><i className="fas fa-plus"></i></button>
                  </div>
                </div>
                <div className="d-flex flex-wrap gap-2 flex-grow-1">
                  <button type="button" className="btn btn-outline-primary btn-lg flex-grow-1" onClick={() => addToCartHandler()} disabled={!inStock}>
                    <i className="fas fa-bag-shopping me-2"></i> Add to cart
                  </button>
                  <button type="button" className="btn btn-primary btn-lg flex-grow-1" onClick={() => addToCartHandler(true)} disabled={!inStock}>
                    Buy now <i className="fas fa-arrow-right ms-2"></i>
                  </button>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      <Row className="g-4 mt-2 pb-2">
        {[
          ['fa-shield-halved', 'Official warranty', '1-year manufacturer warranty included with every purchase.'],
          ['fa-rotate-left', 'Free returns', 'Not satisfied? Return your item within 30 days for a full refund.'],
          ['fa-lock', 'Secure payment', 'Your transactions are protected by industry-leading encryption.'],
        ].map(([icon, title, text]) => (
          <Col md={4} key={title}>
            <div className="sc-card sc-trust h-100">
              <i className={`fas ${icon}`}></i>
              <div><h5>{title}</h5><p>{text}</p></div>
            </div>
          </Col>
        ))}
      </Row>

      <Toast show={!!toast} onClose={closeToast} {...(toast || {})} />
    </>
  )
}

export default ProductScreen
