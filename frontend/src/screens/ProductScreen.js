import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Row, Col, Image, ListGroup, Card, Button, Form, Toast, ToastContainer } from 'react-bootstrap'
import axios from 'axios'
import { useCart } from '../context/CartContext'

function ProductScreen() {
    const { id } = useParams()
    const [product, setProduct] = useState({})
    const [qty, setQty] = useState(1)
    const [showToast, setShowToast] = useState(false)
    const { updateCartCount } = useCart()

    useEffect(() => {
        async function fetchProduct() {
            const { data } = await axios.get(`http://127.0.0.1:8001/products/api/${id}/`)
            setProduct(data)
        }
        fetchProduct()
    }, [id])

    const addToCartHandler = async () => {
        try {
            await axios.post('http://127.0.0.1:8001/cart/api/', {
                product_id: id,
                quantity: qty
            })
            setShowToast(true)
            // Global counter update
            updateCartCount()
        } catch (error) {
            console.error("Error adding to cart", error)
        }
    }

    return (
        <div>
            <Link className="btn btn-light my-3 shadow-sm rounded-pill" to="/products">
                <i className="fas fa-arrow-left"></i> Back
            </Link>
            <Row>
                <Col md={6}>
                    <Image src={product.image ? `http://127.0.0.1:8001${product.image}` : 'https://via.placeholder.com/500'} alt={product.name} fluid className="rounded-4 shadow" />
                </Col>
                <Col md={3}>
                    <ListGroup variant="flush">
                        <ListGroup.Item className="border-0">
                            <h2 className="fw-bold">{product.name}</h2>
                        </ListGroup.Item>
                        <ListGroup.Item className="border-0 h4 text-primary">
                            <strong>{product.price} MAD</strong>
                        </ListGroup.Item>
                        <ListGroup.Item className="border-0 text-muted">
                            {product.description}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={3}>
                    <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
                        <ListGroup variant="flush">
                            <ListGroup.Item className="p-3">
                                <Row>
                                    <Col>Price:</Col>
                                    <Col><strong className="text-primary">{product.price} MAD</strong></Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item className="p-3">
                                <Row>
                                    <Col>Status:</Col>
                                    <Col>{product.stock > 0 ? <span className="text-success">In Stock</span> : <span className="text-danger">Out of Stock</span>}</Col>
                                </Row>
                            </ListGroup.Item>

                            {product.stock > 0 && (
                                <ListGroup.Item className="p-3">
                                    <Row className="align-items-center">
                                        <Col>Quantity</Col>
                                        <Col>
                                            <Form.Control 
                                                as="select" 
                                                value={qty} 
                                                onChange={(e) => setQty(e.target.value)}
                                                className="bg-light border-0"
                                            >
                                                {[...Array(product.stock).keys()].map((x) => (
                                                    <option key={x + 1} value={x + 1}>
                                                        {x + 1}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            )}

                            <ListGroup.Item className="p-3">
                                <Button 
                                    onClick={addToCartHandler}
                                    className="btn-primary btn-lg w-100 rounded-pill" 
                                    type="button" 
                                    disabled={product.stock === 0}
                                >
                                    <i className="fas fa-shopping-cart me-2"></i> Add to Cart
                                </Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>

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
        </div>
    )
}

export default ProductScreen
