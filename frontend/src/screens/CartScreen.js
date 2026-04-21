import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap'
import axios from 'axios'
import { useCart } from '../context/CartContext'

function CartScreen() {
  const [cart, setCart] = useState({ items: [], total: 0 })
  const [loading, setLoading] = useState(true)
  const { updateCartCount } = useCart()

  const [checkoutSuccess, setCheckoutSuccess] = useState(false)

  const fetchCart = async () => {
    try {
      const { data } = await axios.get('http://127.0.0.1:8001/cart/api/')
      setCart(data)
    } catch (error) {
      console.error("Error fetching cart:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [])

  const removeFromCartHandler = async (id) => {
    try {
        await axios.delete(`http://127.0.0.1:8001/cart/api/item/${id}/`)
        // Reload cart locally
        fetchCart()
        // Update header counter
        updateCartCount()
    } catch (error) {
        console.error("Error deleting:", error)
        alert("Could not delete this item.")
    }
  }

  const checkoutHandler = async () => {
    try {
        setLoading(true)
        await axios.post('http://127.0.0.1:8001/orders/api/create/', {
            shipping_address: "React Delivery Address"
        })
        setCheckoutSuccess(true)
        setCart({ items: [], total: 0 })
        updateCartCount()
    } catch (error) {
        console.error("Payment error:", error)
        alert("An error occurred during payment.")
    } finally {
        setLoading(false)
    }
  }

  return (
    <Row>
      <Col md={8}>
        <h1 className="mb-4">My Cart</h1>
        {checkoutSuccess ? (
            <div className="alert alert-success py-5 text-center rounded-4 shadow-sm border-0">
                <i className="fas fa-check-circle fa-3x mb-3 text-success"></i>
                <h3>Order Placed!</h3>
                <p className="text-muted">Thank you for your trust. Your order is being prepared.</p>
                <Link to="/products" className="btn btn-success mt-3 px-4 rounded-pill">Continue Shopping</Link>
            </div>
        ) : loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : !cart.items || cart.items.length === 0 ? (
          <div className="alert alert-info py-5 text-center rounded-4 shadow-sm border-0">
            <i className="fas fa-shopping-basket fa-3x mb-3 text-muted opacity-50"></i>
            <h3>Your cart is empty</h3>
            <p className="text-muted">It seems you haven't added any delicacies yet!</p>
            <Link to="/products" className="btn btn-primary mt-3 px-4 rounded-pill">Continue Shopping</Link>
          </div>
        ) : (
          <ListGroup variant="flush">
            {cart.items.map(item => (
              <ListGroup.Item key={item.id} className="border-0 shadow-sm rounded-4 mb-3 p-3 bg-white">
                <Row className="align-items-center">
                  <Col md={2}>
                    <Image 
                      src={item.product_image ? `http://127.0.0.1:8001${item.product_image}` : 'https://via.placeholder.com/100'} 
                      alt={item.product_name} 
                      fluid 
                      rounded 
                      style={{ height: '80px', width: '80px', objectFit: 'cover' }}
                    />
                  </Col>
                  <Col md={3}>
                    <Link to={`/products/${item.product}`} className="text-dark fw-bold text-decoration-none">
                      {item.product_name}
                    </Link>
                  </Col>
                  <Col md={2} className="text-primary fw-bold">
                    {item.product_price} MAD
                  </Col>
                  <Col md={3}>
                    <div className="d-flex align-items-center">
                        <span className="me-2 text-muted">Qty: {item.quantity}</span>
                    </div>
                  </Col>
                  <Col md={2} className="text-end">
                    <Button 
                        type="button" 
                        variant="link" 
                        className="text-danger p-0"
                        onClick={() => removeFromCartHandler(item.id)}
                    >
                      <i className="fas fa-trash-alt"></i>
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>

      <Col md={4}>
        <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
          <Card.Header className="bg-primary text-white py-3 border-0">
            <h5 className="mb-0 fw-bold">Summary</h5>
          </Card.Header>
          <ListGroup variant="flush">
            <ListGroup.Item className="p-4">
              <div className="d-flex justify-content-between mb-2 text-primary h4">
                  <span>Total:</span>
                  <span className="fw-bold">{cart.total} MAD</span>
              </div>
            </ListGroup.Item>
            <ListGroup.Item className="p-4 border-0">
              <Button 
                type="button" 
                className="btn-primary btn-lg w-100 py-3 rounded-pill shadow" 
                disabled={!cart.items || cart.items.length === 0 || checkoutSuccess}
                onClick={checkoutHandler}
              >
                {loading ? 'Processing...' : 'Pay Now'} <i className="fas fa-arrow-right ms-2"></i>
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  )
}

export default CartScreen
