import React, { useState } from 'react'
import { Row, Col } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import axios from 'axios'
import { API_URL } from '../config'

function LoginScreen() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const redirect = new URLSearchParams(useLocation().search).get('redirect') || '/products'

  const submitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await axios.post(`${API_URL}/users/api/login/`, { username, password })
      localStorage.setItem('userInfo', JSON.stringify(data))
      window.location.assign(redirect) // full reload: refreshes header + cart counter
    } catch (err) {
      setError(err.response && err.response.data.error ? err.response.data.error : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Row className="justify-content-center py-5">
      <Col xs={12}>
        <div className="sc-auth">
          <Row className="g-0">
            <Col xs={12}>
              <div className="sc-auth-form">
                <h1>Log in</h1>
                <p className="text-muted mb-4">Enter your credentials to access your account.</p>
                {error && <div className="alert alert-danger" role="alert"><i className="fas fa-circle-exclamation me-2"></i>{error}</div>}
                <form onSubmit={submitHandler}>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="username">Username</label>
                    <div className="sc-input-icon">
                      <i className="fas fa-user"></i>
                      <input id="username" className="form-control" type="text" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} required autoComplete="username" />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="form-label" htmlFor="password">Password</label>
                    <div className="sc-input-icon">
                      <i className="fas fa-lock"></i>
                      <input id="password" className="form-control" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary btn-lg w-100" disabled={loading}>
                    {loading ? <><span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>Logging in…</> : 'Log in'}
                  </button>
                </form>
                <p className="mt-4 mb-0 text-center text-muted">New to SimpliCulinary? <Link to={`/signup?redirect=${encodeURIComponent(redirect)}`} className="fw-bold">Create an account</Link></p>
              </div>
            </Col>
          </Row>
        </div>
      </Col>
    </Row>
  )
}

export default LoginScreen
