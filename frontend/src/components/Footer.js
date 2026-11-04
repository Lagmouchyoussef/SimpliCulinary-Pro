import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import PaymentLogos from './PaymentLogos'

function Footer() {
  return (
    <footer className="sc-footer">
      <Container>
        <Row className="g-5">
          <Col lg={5}>
            <Link to="/" className="sc-brand mb-3">
              <img src="/logo-mark.svg" alt="" width="42" height="42" />
              <span className="sc-brand-text">Simpli<b>Culinary</b></span>
            </Link>
            <p className="mt-3 pe-lg-5">Professional-grade kitchen equipment and expert guidance for home chefs who refuse to compromise on results.</p>
            <div className="sc-social">
              <a href="#instagram" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
              <a href="#facebook" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
              <a href="#x" aria-label="X (Twitter)"><i className="fab fa-x-twitter"></i></a>
              <a href="#youtube" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
            </div>
          </Col>
          <Col xs={6} lg={{ span: 2, offset: 1 }}>
            <h6>Shop</h6>
            <ul>
              <li><Link to="/products">All products</Link></li>
              <li><Link to="/products">New arrivals</Link></li>
              <li><Link to="/products">Special offers</Link></li>
            </ul>
          </Col>
          <Col xs={6} lg={3}>
            <h6>Support</h6>
            <ul>
              <li><a href="#help">Help center</a></li>
              <li><a href="#shipping">Shipping policy</a></li>
              <li><a href="#returns">Returns &amp; refunds</a></li>
            </ul>
          </Col>
        </Row>
        <div className="sc-footer-bottom">
          <span>&copy; 2026 SimpliCulinary. All rights reserved.</span>
          <PaymentLogos />
        </div>
      </Container>
    </footer>
  )
}

export default Footer
