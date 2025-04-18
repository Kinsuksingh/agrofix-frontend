import React, { useState } from 'react';
import {
  Container, Row, Col, Card, Button, Image, Modal, Form, Spinner
} from 'react-bootstrap';
import { useCart } from '../../context/CartContext';
import { motion } from 'framer-motion';

function Cart() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPlacing, setIsPlacing] = useState(false);
  const [orderDone, setOrderDone] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'Cash on Delivery',
  });

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleConfirmOrder = async () => {
    setIsPlacing(true);
    setLoading(true);

    setTimeout(async () => {
      try {
        const payload = {
          buyer_name: formData.name,
          buyer_contact: formData.phone,
          delivery_address: formData.address,
          payment_method: formData.paymentMethod.toLowerCase().replace(/\s+/g, '_'),
          items: cartItems
        };

        const response = await fetch('https://agrofix-backend-beta.vercel.app/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (data.success) {
          clearCart();
          setShowModal(false);
          setIsPlacing(false);
          setOrderDone(true);

          setTimeout(() => {
            setOrderDone(false);
          }, 5000);
        } else {
          alert('❌ Failed to place order: ' + data.message);
        }
      } catch (error) {
        alert('🚨 Error placing order: ' + error.message);
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  if (cartItems.length === 0 && !orderDone) {
    return (
      <Container className="py-5 min-vh-100 d-flex flex-column align-items-center justify-content-center text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div style={{ fontSize: '3.5rem' }}>🥬🧺</div>
          <h4 className="mt-3 fw-bold">Your cart is empty</h4>
          <p className="text-muted">Looks like you're out of fresh picks. Why not stock up now?</p>
          <Button
            variant="success"
            className="mt-3 rounded-pill px-4 fw-semibold"
            onClick={() => window.location.href = '/'}
          >
            🛍️ Explore Fresh Veggies
          </Button>
        </motion.div>
      </Container>
    );
  }

  return (
    <Container className="py-5 min-vh-100">
      <h2 className="text-center mb-5 fw-bold">🛍️ Your Shopping Cart</h2>
      <Row>
        <Col md={8}>
          {cartItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-4"
            >
              <Card className="shadow-sm border-0 rounded-4 p-3">
                <Row className="align-items-center">
                  <Col xs={4} md={3}>
                    <Image src={item.image_url} alt={item.name} fluid rounded />
                  </Col>
                  <Col xs={8} md={6}>
                    <h5 className="fw-semibold">{item.name}</h5>
                    <div className="text-muted small">{item.price_details}</div>
                    <div className="d-flex align-items-center mt-2">
                      <Button
                        variant="outline-dark"
                        size="sm"
                        className="me-2 rounded-pill"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= item.min_order_kg}
                      >
                        −
                      </Button>
                      <span>{item.quantity} {item.unit_type}</span>
                      <Button
                        variant="outline-dark"
                        size="sm"
                        className="ms-2 rounded-pill"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </Col>
                  <Col md={3} className="text-end">
                    <div className="fw-bold mb-2">₹{item.price_per_kg * item.quantity}</div>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="rounded-pill"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </Button>
                  </Col>
                </Row>
              </Card>
            </motion.div>
          ))}
        </Col>

        <Col md={4}>
          <Card className="shadow-sm rounded-4 p-4">
            <h5 className="fw-bold mb-3">Order Summary</h5>
            <div className="d-flex justify-content-between mb-2">
              <span>Total Items</span>
              <span>{cartItems.length}</span>
            </div>
            <div className="d-flex justify-content-between mb-3">
              <span>Total Amount</span>
              <span className="fw-bold">₹{getCartTotal()}</span>
            </div>
            <Button
              variant="success"
              className="w-100 rounded-pill fw-semibold py-2"
              onClick={() => setShowModal(true)}
            >
              ✅ Place Order
            </Button>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delivery Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Delivery Address</Form.Label>
              <Form.Control
                name="address"
                as="textarea"
                rows={2}
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter your delivery address"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Payment Method</Form.Label>
              <Form.Select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
              >
                <option>Cash on Delivery</option>
                <option>UPI</option>
                <option>Card</option>
              </Form.Select>
            </Form.Group>

            <hr />
            <h6 className="fw-bold">Cart Summary:</h6>
            <ul className="list-unstyled small">
              {cartItems.map(item => (
                <li key={item.id}>
                  {item.name} — {item.quantity} {item.unit_type} × ₹{item.price_per_kg} = ₹{item.quantity * item.price_per_kg}
                </li>
              ))}
            </ul>
            <div className="fw-bold mt-2">Total: ₹{getCartTotal()}</div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button
            variant="primary"
            className="rounded-pill"
            onClick={handleConfirmOrder}
            disabled={loading}
          >
            {isPlacing ? <><Spinner animation="border" size="sm" /> Placing...</> : 'Confirm Order'}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={orderDone} onHide={() => setOrderDone(false)} centered backdrop="static">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Modal.Body className="text-center py-5">
            <div style={{ fontSize: '3.2rem' }}>🎉✅</div>
            <h4 className="mt-3 fw-bold">Your order has been placed!</h4>
            <p className="text-muted">Thank you for shopping with us. 🛒<br />Your veggies will arrive shortly!</p>
          </Modal.Body>
        </motion.div>
      </Modal>
    </Container>
  );
}

export default Cart;
