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
import { useNavigate } from 'react-router-dom'; // ✅ Import useNavigate

function LoginForm() {
  const [role, setRole] = useState('user');
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    phoneNumber: '',
    password: '',
    name: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  const navigate = useNavigate(); // ✅ Setup navigate

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
      let endpoint = '';
      let payload = {};

      if (role === 'admin') {
        if (isSignup) {
          endpoint = '/api/admin/signup';
          payload = {
            name: formData.name,
            username: formData.username,
            password: formData.password,
          };
        } else {
          endpoint = '/api/admin/login';
          payload = {
            username: formData.username,
            password: formData.password,
          };
        }
      } else {
        if (isSignup) {
          endpoint = '/api/user/signup';
          payload = {
            username: formData.username,
            phoneNumber: formData.phoneNumber,
          };
        } else {
          endpoint = '/api/user/login';
          payload = {
            username: formData.username,
            phoneNumber: formData.phoneNumber,
          };
        }
      }

      const res = await axios.post(endpoint, payload);
      setMessage({ type: 'success', text: res.data.message });

      console.log('API Response:', res.data);

      // ✅ Redirect based on role
      setTimeout(() => {
        if (role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/user');
        }
      }, 1000); // Optional: delay to show success message

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
                Role: {role === 'admin' ? 'Admin' : 'User'}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setRole('user')}>User</Dropdown.Item>
                <Dropdown.Item onClick={() => setRole('admin')}>Admin</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          {message.text && (
            <Alert variant={message.type} className="text-center">
              {message.text}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            {isSignup && role === 'admin' && (
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            )}

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

            {role === 'admin' ? (
              <Form.Group className="mb-3">
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            ) : (
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
            )}

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
