// AdminLogin.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Use the onLogin callback to check credentials
      const isSuccess = onLogin(credentials);
      
      if (isSuccess) {
        // Navigate to admin dashboard on successful login
        navigate('/admin');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="admin-login-container">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="admin-login-card shadow">
            <Card.Body>
              <div className="text-center mb-4">
                <h2 className="admin-title">Farm Fresh</h2>
                <h4 className="admin-subtitle">Admin Panel</h4>
              </div>
              
              {error && (
                <Alert variant="danger">{error}</Alert>
              )}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={credentials.username}
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
                    value={credentials.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    required
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button 
                    variant="success" 
                    type="submit" 
                    className="admin-login-button"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Logging in...' : 'Login to Admin Panel'}
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