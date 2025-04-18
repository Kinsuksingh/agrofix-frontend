import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminLogin.css';

const AdminLogin = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleForm = () => {
    setIsSignup(!isSignup);
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const endpoint = isSignup ? '/api/admin/signup' : '/api/admin/login';
      const payload = isSignup
        ? { name: formData.name, username: formData.username, password: formData.password }
        : { username: formData.username, password: formData.password };

      const res = await axios.post(endpoint, payload);
      setMessage({ type: 'success', text: res.data.message });

      // Redirect to admin dashboard after successful login
      if (!isSignup) {
        setTimeout(() => {
          navigate('/admin');
        }, 1000);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong';
      setMessage({ type: 'danger', text: msg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="admin-login-container py-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="admin-login-card shadow rounded-4 p-4">
            <Card.Body>
              <div className="text-center mb-4">
                <h2 className="admin-title">Farm Fresh</h2>
                <h5 className="admin-subtitle fw-semibold">
                  {isSignup ? 'Admin Signup' : 'Admin Login'}
                </h5>
              </div>

              {message.text && (
                <Alert variant={message.type}>{message.text}</Alert>
              )}

              <Form onSubmit={handleSubmit}>
                {isSignup && (
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      required
                    />
                  </Form.Group>
                )}

                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter admin username"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    required
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button
                    type="submit"
                    variant="success"
                    className="admin-login-button rounded-pill"
                    disabled={isLoading}
                  >
                    {isLoading
                      ? isSignup
                        ? 'Creating Account...'
                        : 'Logging in...'
                      : isSignup
                      ? 'Sign Up'
                      : 'Login to Admin Panel'}
                  </Button>
                </div>

                <div className="text-center mt-3">
                  <Button
                    variant="link"
                    onClick={toggleForm}
                    className="text-muted"
                  >
                    {isSignup
                      ? 'Already have an account? Login'
                      : 'New Admin? Sign Up'}
                  </Button>
                </div>
              </Form>

              <div className="text-center mt-4">
                <small className="text-muted">
                  This area is restricted to authorized personnel only.
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminLogin;
