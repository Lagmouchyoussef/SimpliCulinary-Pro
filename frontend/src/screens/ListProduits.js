import React, { useState, useEffect } from 'react'
import { Row, Col, Container } from 'react-bootstrap'
import axios from 'axios'
import Product from '../components/Product'

function ListProduits() {
    const [products, setProducts] = useState([])
    const [filteredProducts, setFilteredProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [category, setCategory] = useState('All')

    useEffect(() => {
        async function fetchProducts() {
            try {
                const { data } = await axios.get('http://127.0.0.1:8001/products/api/')
                setProducts(data)
                setFilteredProducts(data)
            } catch (error) {
                console.error("Error fetching products", error)
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [])

    useEffect(() => {
        if (category === 'All') {
            setFilteredProducts(products)
        } else {
            setFilteredProducts(products.filter(p => p.category_name === category))
        }
    }, [category, products])

    return (
        <Container className="py-4">
            {/* Header Section */}
            <div className="text-center mb-5">
                <h6 className="text-primary text-uppercase fw-bold mb-2" style={{ letterSpacing: '2px' }}>Culinary Exclusivity</h6>
                <h1 className="display-4 fw-bold mb-4">Our Precision Collection</h1>
                <div className="d-flex justify-content-center gap-2 mb-4">
                    {['All', 'Appliances', 'Utensils', 'Accessories'].map(cat => (
                        <span 
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`badge border px-4 py-2 rounded-pill cursor-pointer transition-all ${category === cat ? 'bg-primary text-white shadow' : 'bg-light text-muted'}`}
                            style={{ cursor: 'pointer' }}
                        >
                            {cat}
                        </span>
                    ))}
                </div>
                <p className="text-muted mx-auto" style={{ maxWidth: '700px' }}>
                    Each piece is selected for its performance and durability, ensuring an unparalleled gastronomic experience.
                </p>
            </div>

            {/* Results Header */}
            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                <h5 className="mb-0 fw-bold">{filteredProducts.length} Products found</h5>
                <div className="d-flex gap-2 align-items-center">
                    <span className="small text-muted">Sort by:</span>
                    <select className="form-select form-select-sm border-0 bg-light rounded-pill px-3">
                        <option>Newest</option>
                        <option>Price: Low to High</option>
                        <option>Price: High to Low</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <Row className="g-4">
                    {filteredProducts.map(product => (
                        <Col key={product.id} sm={12} md={6} lg={4} xl={3} className="d-flex align-items-stretch">
                            <Product product={product} />
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    )
}

export default ListProduits
