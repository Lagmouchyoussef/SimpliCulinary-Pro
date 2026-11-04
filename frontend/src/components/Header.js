import React from 'react'
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import axios from 'axios'
import { useCart } from '../context/CartContext'
import { API_URL } from '../config'

function Header() {
  const { cartCount } = useCart();
  const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;

  const logoutHandler = async () => {
    try { await axios.post(`${API_URL}/users/api/logout/`) } catch (e) { console.error(e) }
    localStorage.removeItem('userInfo');
    window.location.href = '/';
  };

  return (
    <header>
      <Navbar expand="lg" sticky="top" collapseOnSelect className="sc-nav" aria-label="Main navigation">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand as="a" className="sc-brand p-0" aria-label="SimpliCulinary — home">
              <img src="/logo-mark.svg" alt="" width="42" height="42" />
              <span>
                <span className="sc-brand-text">Simpli<b>Culinary</b></span>
              </span>
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="main-navbar" className="border-0 shadow-none">
            <i className="fas fa-bars-staggered fa-lg"></i>
          </Navbar.Toggle>
          <Navbar.Collapse id="main-navbar">
            <Nav className="mx-lg-auto gap-lg-1">
              <LinkContainer to="/" exact="true">
                <Nav.Link>Home</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/products">
                <Nav.Link>Shop</Nav.Link>
              </LinkContainer>
            </Nav>
            <Nav className="align-items-lg-center gap-2 mt-3 mt-lg-0">
              <LinkContainer to="/cart">
                <Nav.Link className="sc-cart-btn p-0" aria-label="Shopping cart">
                  <i className="fas fa-bag-shopping"></i>
                  <span className="sc-cart-count">{cartCount}</span>
                </Nav.Link>
              </LinkContainer>

              {userInfo ? (
                <NavDropdown
                  align="end"
                  id="user-menu"
                  title={<span className="sc-user-chip"><span className="sc-avatar">{userInfo.username.charAt(0)}</span>{userInfo.username}</span>}
                >
                  <LinkContainer to="/cart">
                    <NavDropdown.Item><i className="fas fa-bag-shopping me-2 text-muted"></i> My cart</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={logoutHandler} className="text-danger">
                    <i className="fas fa-arrow-right-from-bracket me-2"></i> Log out
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <>
                  <Link to="/login" className="btn btn-outline-primary px-4">Log in</Link>
                  <Link to="/signup" className="btn btn-primary px-4">Sign up</Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default Header
