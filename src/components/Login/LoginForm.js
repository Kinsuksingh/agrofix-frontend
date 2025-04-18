import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  Form,
  Button,
  Card,
  Alert,
  Dropdown,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    phoneNumber: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleForm = () => {
    setIsSignup(!isSignup);
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      const endpoint = isSignup ? '/api/user/signup' : '/api/user/login';
      const payload = {
        username: formData.username,
        phoneNumber: formData.phoneNumber,
      };

      const res = await axios.post(endpoint, payload);
      setMessage({ type: 'success', text: res.data.message });

      setTimeout(() => {
        navigate('/user');
      }, 1000);
    } catch (error) {
      const msg = error.response?.data?.message || 'Something went wrong';
      setMessage({ type: 'danger', text: msg });
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="shadow-lg p-4" style={{ width: '100%', maxWidth: 480, borderRadius: '1rem' }}>
        <Card.Body>
          <h3 className="text-center mb-4 fw-semibold">
            {isSignup ? 'Create Account' : 'Welcome Back'}
          </h3>

          <div className="text-center mb-4">
            <Dropdown>
              <Dropdown.Toggle variant="outline-dark" className="rounded-pill px-4 py-2">
                Role: User
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item disabled>User</Dropdown.Item>
                <Dropdown.Item onClick={() => navigate('/adminlogin')}>
                  Admin Panel
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          {message.text && (
            <Alert variant={message.type} className="text-center">
              {message.text}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Button type="submit" variant="dark" className="w-100 rounded-pill py-2 mt-2">
              {isSignup ? 'Sign Up' : 'Login'}
            </Button>

            <div className="text-center mt-3">
              <Button variant="link" onClick={toggleForm} className="text-muted">
                {isSignup
                  ? 'Already have an account? Login'
                  : 'New here? Create an account'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default LoginForm;
