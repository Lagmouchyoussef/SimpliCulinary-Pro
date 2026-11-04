import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col } from 'react-bootstrap'
import axios from 'axios'
import Product from '../components/Product'
import { API_URL } from '../config'

const SORTS = {
  newest: { label: 'Newest', fn: (a, b) => b.id - a.id },
  price_asc: { label: 'Price: low to high', fn: (a, b) => a.price - b.price },
  price_desc: { label: 'Price: high to low', fn: (a, b) => b.price - a.price },
  name: { label: 'Name', fn: (a, b) => a.name.localeCompare(b.name) },
}

function ListProduits() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('newest')

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data } = await axios.get(`${API_URL}/products/api/`)
        setProducts(data)
      } catch (error) {
        console.error('Error fetching products', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const categories = useMemo(
    () => ['All', ...new Set(products.map((p) => p.category_name).filter(Boolean))],
    [products]
  )

  const visible = useMemo(() => {
    const list = category === 'All' ? products : products.filter((p) => p.category_name === category)
    return [...list].sort(SORTS[sort].fn)
  }, [products, category, sort])

  return (
    <>
      <header className="sc-page-head">
        <span className="sc-eyebrow">The collection</span>
        <h1>Precision tools for <em>serious</em> home chefs</h1>
        <p>Each piece is selected for performance and durability, so every meal comes out exactly as planned.</p>
      </header>

      <div className="sc-toolbar">
        <div className="sc-filters" role="group" aria-label="Filter by category">
          {categories.map((cat) => (
            <button key={cat} type="button" onClick={() => setCategory(cat)} className={`sc-pill ${category === cat ? 'active' : ''}`}>
              {cat}
            </button>
          ))}
        </div>
        <div className="d-flex align-items-center gap-3">
          <span className="sc-result-count">{visible.length} <span>product{visible.length === 1 ? '' : 's'}</span></span>
          <label htmlFor="sort" className="form-label mb-0 text-muted">Sort by</label>
          <select id="sort" className="form-select form-select-sm rounded-pill w-auto" value={sort} onChange={(e) => setSort(e.target.value)}>
            {Object.entries(SORTS).map(([key, s]) => <option key={key} value={key}>{s.label}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="sc-spinner" role="status"><span className="visually-hidden">Loading…</span></div></div>
      ) : visible.length === 0 ? (
        <div className="sc-card sc-empty">
          <div className="sc-empty-icon"><i className="fas fa-magnifying-glass"></i></div>
          <h3>No products found</h3>
          <p className="text-muted mb-4">Try another category.</p>
          <button className="btn btn-primary px-4" onClick={() => setCategory('All')}>View all products</button>
        </div>
      ) : (
        <Row className="g-4">
          {visible.map((product) => (
            <Col key={product.id} md={6} lg={4}><Product product={product} /></Col>
          ))}
        </Row>
      )}
    </>
  )
}

export default ListProduits
