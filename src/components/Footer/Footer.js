import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Facebook, Instagram, Mail, Phone } from 'lucide-react';

function Footer() {
  return (
    <footer
      style={{
        background: '#2f2f2f',
        color: '#ccc',
        paddingTop: '2rem',
        paddingBottom: '1rem',
        borderTop: '1px solid #444',
        marginTop: 'auto',
      }}
    >
      <Container>
        <Row className="text-center text-md-start">
          {/* Brand Info */}
          <Col md={4} className="mb-4 mb-md-0">
            <h5 className="fw-bold text-light">Agro Fresh</h5>
            <p style={{ fontSize: '0.9rem' }}>
              Fresh and organic vegetables delivered to your doorstep. Eat healthy, live fresh.
            </p>
          </Col>

          {/* Contact Info */}
          <Col md={4} className="mb-4 mb-md-0">
            <h6 className="fw-bold text-light">Contact Us</h6>
            <p className="mb-1"><Phone size={16} className="me-2" /> +91 98765 43210</p>
            <p><Mail size={16} className="me-2" /> support@agrofresh.com</p>
          </Col>

          {/* Social Links */}
          <Col md={4}>
            <h6 className="fw-bold text-light">Follow Us</h6>
            <div className="d-flex gap-3 justify-content-center justify-content-md-start">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-light">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-light">
                <Instagram size={20} />
              </a>
            </div>
          </Col>
        </Row>

        <hr className="my-4" style={{ borderColor: '#555' }} />

        <Row>
          <Col className="text-center small text-muted">
            © {new Date().getFullYear()} Agro Fresh. All rights reserved.
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
