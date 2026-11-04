import React, { useState, useEffect } from 'react'
import { Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Product from '../components/Product'
import Toast from '../components/Toast'
import { API_URL } from '../config'

const FEATURES = [
  { icon: 'fa-award', title: 'Premium quality', text: 'Only the best brands and materials, selected for performance and long-term durability.' },
  { icon: 'fa-truck-fast', title: 'Fast, tracked delivery', text: 'Secure shipping within 48 hours nationwide, with live tracking on every order.' },
  { icon: 'fa-headset', title: 'Expert support', text: 'Our culinary specialists are on hand around the clock to help you choose and cook.' },
]

function Home() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [featured, setFeatured] = useState([])

  useEffect(() => {
    axios.get(`${API_URL}/products/api/`)
      .then(({ data }) => setFeatured(data.slice(0, 3)))
      .catch((error) => console.error('Error fetching products', error))
  }, [])

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      await axios.post(`${API_URL}/api/newsletter/`, { email })
      setToast({ type: 'success', title: 'Subscribed', message: 'Thank you! You are now subscribed.' })
      setEmail('')
    } catch (error) {
      console.error('Subscription error', error)
      setToast({ type: 'error', title: 'Something went wrong', message: 'Subscription failed. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Hero */}
      <section className="sc-hero">
        <div className="sc-hero-inner">
          <Row className="align-items-center g-5">
            <Col lg={8}>
              <span className="sc-eyebrow">Professional kitchen equipment</span>
              <h1>Cook with <em>precision.</em><br />Serve with pride.</h1>
              <p className="lead">Precision cookers, vacuum sealers and chef-grade tools — curated to turn your home kitchen into a true culinary workshop.</p>
              <div className="d-flex flex-wrap gap-3 mt-4">
                <Link to="/products" className="btn btn-accent btn-lg">Shop the collection <i className="fas fa-arrow-right ms-2"></i></Link>
                <Link to="/signup" className="btn btn-outline-light btn-ghost-light btn-lg">Create account</Link>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* Why us */}
      <section className="sc-section">
        <div className="sc-section-head">
          <span className="sc-eyebrow">Why SimpliCulinary</span>
          <h2>Built for people who love to cook</h2>
          <p>Every product is tested, certified and backed by a team that actually cooks with it.</p>
        </div>
        <Row className="g-4">
          {FEATURES.map((f) => (
            <Col md={4} key={f.title}>
              <div className="sc-card sc-feature">
                <div className="sc-feature-icon"><i className={`fas ${f.icon}`}></i></div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            </Col>
          ))}
        </Row>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="sc-section pt-0">
          <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
            <div>
              <span className="sc-eyebrow">Featured</span>
              <h2 className="mt-1 mb-1">Chef's picks</h2>
              <p className="text-muted mb-0">The best tools for your next masterpiece.</p>
            </div>
            <Link to="/products" className="btn btn-outline-primary px-4">View all products <i className="fas fa-arrow-right ms-2"></i></Link>
          </div>
          <Row className="g-4">
            {featured.map((p) => (
              <Col md={6} lg={4} key={p.id}><Product product={p} /></Col>
            ))}
          </Row>
        </section>
      )}

      {/* Newsletter */}
      <section className="sc-newsletter">
        <span className="sc-eyebrow">Newsletter</span>
        <h2 className="mt-2">Recipes, tips &amp; early access</h2>
        <p>Join our community of home chefs and get expert techniques and exclusive offers in your inbox.</p>
        <form onSubmit={handleSubscribe}>
          <input type="email" placeholder="Enter your email address" aria-label="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <button type="submit" className="btn btn-accent px-4" disabled={loading}>{loading ? 'Sending…' : 'Subscribe'}</button>
        </form>
      </section>

      <Toast show={!!toast} onClose={() => setToast(null)} {...(toast || {})} />
    </div>
  )
}

export default Home
