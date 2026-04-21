import React, { useState } from 'react'
import { Card, Button, Toast, ToastContainer, Badge } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useCart } from '../context/CartContext'

function Product({ product }) {
  const [showToast, setShowToast] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const { updateCartCount } = useCart();

  const addToCartHandler = async () => {
    try {
        await axios.post('http://127.0.0.1:8001/cart/api/', {
            product_id: product.id,
            quantity: 1
        })
        
        // Notification
        setShowToast(true)
        
        // GLOBAL COUNTER UPDATE
        updateCartCount()
        
    } catch (error) {
        console.error("Error adding to cart", error)
        alert("Could not add to cart.")
    }
  }

  const toggleFavorite = (e) => {
    e.preventDefault()
    setIsFavorite(!isFavorite)
  }

  return (
    <>
    <Card className="my-2 p-0 border-0 shadow-sm rounded-4 overflow-hidden product-card h-100 bg-white">
        <div className="position-relative overflow-hidden" style={{ height: '280px' }}>
            <Link to={`/products/${product.id}`}>
                <Card.Img 
                    src={product.image ? `http://127.0.0.1:8001${product.image}` : 'https://via.placeholder.com/250'} 
                    variant="top" 
                    className="product-image w-100 h-100 object-fit-cover transition-all"
                />
            </Link>
            <div className="position-absolute top-0 end-0 m-3">
                <Badge bg="white" className="text-primary rounded-pill shadow-sm py-2 px-3 fw-bold">
                    <i className="fas fa-star text-warning me-1"></i> 4.8
                </Badge>
            </div>
            {product.stock <= 5 && (
                <div className="position-absolute bottom-0 start-0 m-3">
                    <Badge bg="danger" className="rounded-pill px-3 py-2 shadow-sm">
                        Warning: {product.stock} left
                    </Badge>
                </div>
            )}
        </div>

        <Card.Body className="p-4 d-flex flex-column">
            <div className="mb-2 d-flex justify-content-between align-items-center">
                <span className="badge bg-primary bg-opacity-10 text-primary text-uppercase rounded-pill px-2 py-1" style={{ fontSize: '0.65rem', fontWeight: '800' }}>
                    {product.category_name || 'Premium'}
                </span>
                <i 
                    className={`${isFavorite ? 'fas fa-heart text-danger' : 'far fa-heart text-muted'} cursor-pointer favorite-icon`}
                    onClick={toggleFavorite}
                    style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                ></i>
            </div>

            <Link to={`/products/${product.id}`} className="text-decoration-none">
                <Card.Title as="h5" className="text-dark fw-bold mb-2 product-title">
                    {product.name}
                </Card.Title>
            </Link>
            
            <p className="text-muted small mb-4 line-clamp-2" style={{ fontSize: '0.85rem' }}>
                {product.description || "Exceptional equipment for professional results with every use."}
            </p>

            <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
                <div className="d-flex flex-column">
                    <small className="text-muted text-uppercase fw-bold" style={{ fontSize: '0.6rem' }}>Final Price</small>
                    <div className="h4 mb-0 fw-bold text-dark">
                        {product.price} <small className="fw-normal" style={{ fontSize: '0.8rem' }}>MAD</small>
                    </div>
                </div>
                <Button 
                    onClick={addToCartHandler}
                    variant="primary" 
                    className="rounded-4 p-3 shadow-sm btn-hover-scale"
                >
                    <i className="fas fa-shopping-basket"></i>
                </Button>
            </div>
        </Card.Body>
        
        <style dangerouslySetInnerHTML={{ __html: `
            .product-card { transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
            .product-card:hover { transform: translateY(-12px); box-shadow: 0 25px 50px rgba(0,0,0,0.1) !important; }
            .product-image { transition: transform 0.6s ease; }
            .product-card:hover .product-image { transform: scale(1.15); }
            .product-title { 
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;  
                overflow: hidden;
                height: 3rem;
            }
            .btn-hover-scale:active { transform: scale(0.9); }
            .favorite-icon:hover { transform: scale(1.2); }
            .favorite-icon:active { transform: scale(0.8); }
            .line-clamp-2 {
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;  
                overflow: hidden;
            }
        `}} />
    </Card>

    <ToastContainer position="bottom-end" className="p-3" style={{ zIndex: 1050 }}>
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide bg="success">
          <Toast.Header>
            <strong className="me-auto text-success">Success</strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            {product.name} added to cart!
          </Toast.Body>
        </Toast>
    </ToastContainer>
    </>
  )
}

export default Product
