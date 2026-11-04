import React, { useState } from 'react'
import { Row, Col } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import axios from 'axios'
import { API_URL } from '../config'

const FIELDS = {
  first_name: { label: 'First name', placeholder: 'Jane', half: true },
  last_name: { label: 'Last name', placeholder: 'Doe', half: true },
  username: { label: 'Username *', placeholder: 'Choose a username', required: true },
  email: { label: 'Email *', placeholder: 'you@example.com', type: 'email', required: true },
  password: { label: 'Password *', placeholder: '••••••••', type: 'password', required: true, half: true },
  confirmPassword: { label: 'Confirm password *', placeholder: '••••••••', type: 'password', required: true, half: true },
  phone: { label: 'Phone number', placeholder: '+212 6 00 00 00 00' },
  address: { label: 'Address', placeholder: 'Street, city, postal code', textarea: true },
}

function SignupScreen() {
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', confirmPassword: '',
    first_name: '', last_name: '', phone: '', address: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const redirect = new URLSearchParams(useLocation().search).get('redirect') || '/products'

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const submitHandler = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    setError('')
    try {
      const { confirmPassword, ...payload } = formData
      const { data } = await axios.post(`${API_URL}/users/api/signup/`, payload)
      localStorage.setItem('userInfo', JSON.stringify(data))
      window.location.assign(redirect)
    } catch (err) {
      setError(err.response && err.response.data.error ? err.response.data.error : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const renderField = (name) => {
    const f = FIELDS[name]
    const common = { id: name, name, className: 'form-control', placeholder: f.placeholder, value: formData[name], onChange, required: f.required }
    return (
      <Col md={f.half ? 6 : 12} key={name} className="mb-3">
        <label className="form-label" htmlFor={name}>{f.label}</label>
        {f.textarea ? <textarea rows={3} {...common} /> : <input type={f.type || 'text'} {...common} />}
      </Col>
    )
  }

  return (
    <Row className="justify-content-center py-5">
      <Col xs={12}>
        <div className="sc-auth">
          <Row className="g-0">
            <Col xs={12}>
              <div className="sc-auth-form">
                <h1>Create your account</h1>
                <p className="text-muted mb-4">It only takes a minute.</p>
                {error && <div className="alert alert-danger" role="alert"><i className="fas fa-circle-exclamation me-2"></i>{error}</div>}
                <form onSubmit={submitHandler}>
                  <Row>{Object.keys(FIELDS).map(renderField)}</Row>
                  <button type="submit" className="btn btn-primary btn-lg w-100 mt-2" disabled={loading}>
                    {loading ? 'Creating account…' : 'Create account'}
                  </button>
                </form>
                <p className="mt-4 mb-0 text-center text-muted">Already have an account? <Link to={`/login?redirect=${encodeURIComponent(redirect)}`} className="fw-bold">Log in</Link></p>
              </div>
            </Col>
          </Row>
        </div>
      </Col>
    </Row>
  )
}

export default SignupScreen
