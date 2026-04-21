import React, { useState } from 'react'
import { Form, Button, Row, Col, Container, Card, Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

function SignupScreen() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        first_name: '',
        last_name: '',
        phone: '',
        address: ''
    })
    
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const { username, email, password, confirmPassword, first_name, last_name, phone, address } = formData

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

    const submitHandler = async (e) => {
        e.preventDefault()
        
        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        setLoading(true)
        setError('')

        try {
            const { data } = await axios.post('http://127.0.0.1:8001/users/api/signup/', {
                username, email, password, first_name, last_name, phone, address
            })
            
            localStorage.setItem('userInfo', JSON.stringify(data))
            navigate('/products')
            window.location.reload()
        } catch (err) {
            setError(err.response && err.response.data.error ? err.response.data.error : 'An error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Container className="py-5">
            <Row className="justify-content-md-center">
                <Col xs={12} md={8} lg={6}>
                    <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
                        <div className="bg-primary py-4 text-center text-white">
                            <i className="fas fa-user-plus fa-4x mb-2"></i>
                            <h2 className="fw-bold">Create an account</h2>
                            <p className="mb-0 opacity-75">Join the culinary adventure!</p>
                        </div>
                        <Card.Body className="p-4 p-md-5">
                            {error && <Alert variant="danger" className="rounded-3">{error}</Alert>}
                            
                            <Form onSubmit={submitHandler}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="first_name">
                                            <Form.Label className="text-muted small fw-bold">First Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="first_name"
                                                value={first_name}
                                                onChange={onChange}
                                                className="bg-light border-0"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="last_name">
                                            <Form.Label className="text-muted small fw-bold">Last Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="last_name"
                                                value={last_name}
                                                onChange={onChange}
                                                className="bg-light border-0"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3" controlId="username">
                                    <Form.Label className="text-muted small fw-bold">Username *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="username"
                                        value={username}
                                        onChange={onChange}
                                        className="bg-light border-0"
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="email">
                                    <Form.Label className="text-muted small fw-bold">Email *</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={email}
                                        onChange={onChange}
                                        className="bg-light border-0"
                                        required
                                    />
                                </Form.Group>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="password">
                                            <Form.Label className="text-muted small fw-bold">Password *</Form.Label>
                                            <Form.Control
                                                type="password"
                                                name="password"
                                                value={password}
                                                onChange={onChange}
                                                className="bg-light border-0"
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="confirmPassword">
                                            <Form.Label className="text-muted small fw-bold">Confirm *</Form.Label>
                                            <Form.Control
                                                type="password"
                                                name="confirmPassword"
                                                value={confirmPassword}
                                                onChange={onChange}
                                                className="bg-light border-0"
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3" controlId="phone">
                                    <Form.Label className="text-muted small fw-bold">Phone</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="phone"
                                        value={phone}
                                        onChange={onChange}
                                        className="bg-light border-0"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4" controlId="address">
                                    <Form.Label className="text-muted small fw-bold">Address</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        name="address"
                                        value={address}
                                        onChange={onChange}
                                        className="bg-light border-0"
                                    />
                                </Form.Group>

                                <Button 
                                    type="submit" 
                                    variant="primary" 
                                    className="w-100 py-3 rounded-pill shadow fw-bold mt-2"
                                    disabled={loading}
                                >
                                    {loading ? 'Creating...' : "Register"}
                                </Button>
                            </Form>

                            <Row className="py-3 mt-4 text-center border-top">
                                <Col>
                                    <span className="text-muted">Already have an account? </span>
                                    <Link to="/login" className="text-primary fw-bold text-decoration-none">
                                        Login
                                    </Link>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default SignupScreen
