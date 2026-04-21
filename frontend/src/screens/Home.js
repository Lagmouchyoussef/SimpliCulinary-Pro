import React from 'react'
import { Container, Row, Col, Button, Card } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import axios from 'axios'

function Home() {
  const [email, setEmail] = React.useState('');
  const [subscribed, setSubscribed] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (email) {
      setLoading(true);
      try {
        await axios.post('http://127.0.0.1:8001/api/newsletter/', { email });
        setSubscribed(true);
        setEmail('');
      } catch (error) {
        console.error("Subscription error", error);
        alert("An error occurred while sending the email.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section shadow-lg" style={{ background: 'linear-gradient(135deg, #0061f2 0%, #00cfd5 100%)' }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={7} className="hero-content">
              <h1 className="display-3 fw-bold mb-3 text-white">
                Culinary Excellence
              </h1>
              <p className="lead mb-5 text-white opacity-75">
                Discover an exclusive selection of high-precision equipment to transform your kitchen into a true chef's workshop.
              </p>
              <div className="d-flex gap-3">
                <LinkContainer to="/products">
                  <Button variant="light" className="btn-premium py-3 px-5 shadow fw-bold">
                    Explore the collection
                  </Button>
                </LinkContainer>
                <LinkContainer to="/signup">
                  <Button variant="outline-light" className="btn-premium py-3 px-5 fw-bold">
                    Join
                  </Button>
                </LinkContainer>
              </div>
            </Col>
            <Col lg={5} className="d-none d-lg-block">
                {/* Decorative image or empty space if the image is in the background */}
            </Col>
          </Row>
        </Container>
      </section>

      {/* Featured Categories */}
      <Container className="py-5">
        <h2 className="text-center fw-bold mb-5">Why choose <span className="text-primary">E-Vente</span>?</h2>
        <Row className="g-4">
          <Col md={4}>
            <Card className="card-premium h-100 text-center p-4">
              <Card.Body>
                <div className="bg-primary bg-opacity-10 rounded-circle p-4 d-inline-block mb-4">
                  <i className="fas fa-gem fa-2x text-primary"></i>
                </div>
                <h4 className="fw-bold mb-3">Premium Quality</h4>
                <p className="text-muted">Products selected from the world's best brands.</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="card-premium h-100 text-center p-4">
              <Card.Body>
                <div className="bg-success bg-opacity-10 rounded-circle p-4 d-inline-block mb-4">
                  <i className="fas fa-shipping-fast fa-2x text-success"></i>
                </div>
                <h4 className="fw-bold mb-3">Fast Delivery</h4>
                <p className="text-muted">Secure shipping within 48 hours nationwide.</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="card-premium h-100 text-center p-4">
              <Card.Body>
                <div className="bg-warning bg-opacity-10 rounded-circle p-4 d-inline-block mb-4">
                  <i className="fas fa-headset fa-2x text-warning"></i>
                </div>
                <h4 className="fw-bold mb-3">24/7 Support</h4>
                <p className="text-muted">A team of experts at your service to advise you.</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Newsletter Section */}
      <section className="bg-dark text-white py-5 rounded-5 mt-5 overflow-hidden position-relative">
        <Container className="text-center py-4 position-relative" style={{ zIndex: 1 }}>
          <h2 className="fw-bold mb-3">Subscribe to our Newsletter</h2>
          <p className="opacity-75 mb-4">Receive our latest offers and culinary tips directly in your mailbox.</p>
          
          <Row className="justify-content-center">
            <Col md={6}>
              {subscribed ? (
                <div className="bg-success bg-opacity-25 border border-success border-opacity-50 text-success p-3 rounded-pill animate__animated animate__fadeIn">
                  <i className="fas fa-check-circle me-2"></i> Thank you! You are now subscribed to our newsletter.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="d-flex gap-2">
                  <input 
                    type="email" 
                    className="form-control form-control-lg rounded-pill border-0 px-4" 
                    placeholder="Your email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                  <Button type="submit" variant="primary" className="btn-premium px-5" disabled={loading}>
                    {loading ? 'Sending...' : 'Subscribe'}
                  </Button>
                </form>
              )}
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  )
}

export default Home
