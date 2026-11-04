import React, { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useCart } from '../context/CartContext'
import { API_URL, imageUrl } from '../config'
import Toast from './Toast'

function Product({ product }) {
  const [toast, setToast] = useState(null)
  const { updateCartCount } = useCart()
  const closeToast = useCallback(() => setToast(null), [])

  const addToCartHandler = async () => {
    try {
      await axios.post(`${API_URL}/cart/api/`, { product_id: product.id, quantity: 1 })
      setToast({ type: 'success', title: 'Added to cart', message: `${product.name} added to cart!` })
      updateCartCount()
    } catch (error) {
      console.error('Error adding to cart', error)
      setToast({ type: 'error', title: 'Something went wrong', message: (error.response && error.response.data && error.response.data.error) || 'We could not add this product. Please try again.' })
    }
  }

  const img = imageUrl(product.image)

  return (
    <>
      <article className="sc-product">
        <div className="sc-product-media">
          <span className="sc-chip">{product.category_name || 'Premium'}</span>
          {product.stock <= 0 ? (
            <span className="sc-chip sc-chip-warn sc-chip-right">Sold out</span>
          ) : product.stock <= 5 ? (
            <span className="sc-chip sc-chip-warn sc-chip-right">Only {product.stock} left</span>
          ) : null}
          <Link to={`/products/${product.id}`} tabIndex={-1} aria-hidden="true" style={{ display: 'block', height: '100%' }}>
            {img ? <img src={img} alt={product.name} loading="lazy" /> : <div className="sc-product-placeholder"><i className="fas fa-utensils"></i></div>}
          </Link>
        </div>
        <div className="sc-product-body">
          <h3 className="sc-product-title"><Link to={`/products/${product.id}`}>{product.name}</Link></h3>
          <p className="sc-product-desc">{product.description || 'Professional-grade equipment for confident home chefs.'}</p>
          <div className="sc-product-foot">
            <div>
              <span className="sc-price-label">Price</span>
              <span className="sc-price">{Number(product.price)}<small>MAD</small></span>
            </div>
            {product.stock > 0 ? (
              <button type="button" className="btn btn-primary btn-sm px-3" onClick={addToCartHandler} aria-label={`Add ${product.name} to cart`}>
                <i className="fas fa-bag-shopping me-1"></i> Add
              </button>
            ) : (
              <Link to={`/products/${product.id}`} className="btn btn-soft btn-sm px-3">Details</Link>
            )}
          </div>
        </div>
      </article>
      <Toast show={!!toast} onClose={closeToast} {...(toast || {})} />
    </>
  )
}

export default Product
