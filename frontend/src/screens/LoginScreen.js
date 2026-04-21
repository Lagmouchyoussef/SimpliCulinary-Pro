import React, { useState } from 'react'
import { Form, Button, Row, Col, Container, Card, Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

function LoginScreen() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const submitHandler = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const { data } = await axios.post('http://127.0.0.1:8001/users/api/login/', {
                username,
                password
            })
            
            // Stocker les infos user (optionnel: localStorage)
            localStorage.setItem('userInfo', JSON.stringify(data))
            
            // Redirect to home page or products
            navigate('/products')
            window.location.reload() // To update the header
        } catch (err) {
            setError(err.response && err.response.data.error ? err.response.data.error : 'An error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Container className="py-5">
            <Row className="justify-content-md-center">
                <Col xs={12} md={6}>
                    <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
                        <div className="bg-primary py-4 text-center text-white">
                            <i className="fas fa-user-circle fa-4x mb-2"></i>
                            <h2 className="fw-bold">Login</h2>
                            <p className="mb-0 opacity-75">Welcome back!</p>
                        </div>
                        <Card.Body className="p-4 p-md-5">
                            {error && <Alert variant="danger" className="rounded-3">{error}</Alert>}
                            
                            <Form onSubmit={submitHandler}>
                                <Form.Group className="mb-4" controlId="username">
                                    <Form.Label className="text-muted small fw-bold text-uppercase">Username</Form.Label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-0"><i className="fas fa-user text-primary"></i></span>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter your username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="bg-light border-0 py-2"
                                            required
                                        />
                                    </div>
                                </Form.Group>

                                <Form.Group className="mb-4" controlId="password">
                                    <Form.Label className="text-muted small fw-bold text-uppercase">Password</Form.Label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-0"><i className="fas fa-lock text-primary"></i></span>
                                        <Form.Control
                                            type="password"
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="bg-light border-0 py-2"
                                            required
                                        />
                                    </div>
                                </Form.Group>

                                <Button 
                                    type="submit" 
                                    variant="primary" 
                                    className="w-100 py-3 rounded-pill shadow fw-bold mt-2"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Logging in...</>
                                    ) : 'Login'}
                                </Button>
                            </Form>

                            <Row className="py-3 mt-4 text-center border-top">
                                <Col>
                                    <span className="text-muted">New customer? </span>
                                    <Link to="/signup" className="text-primary fw-bold text-decoration-none">
                                        Create an account
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

export default LoginScreen
