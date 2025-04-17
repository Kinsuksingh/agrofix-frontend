import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function NotFound() {
  const navigate = useNavigate();

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center vh-100 text-center">
      <h1 className="display-1 fw-bold text-danger">404</h1>
      <p className="fs-4 text-muted mb-4">Sorry, the page you’re looking for doesn’t exist.</p>
      <Button variant="dark" className="rounded-pill px-4 py-2" onClick={() => navigate('/')}>
        Go to Homepage
      </Button>
    </Container>
  );
}

export default NotFound;
