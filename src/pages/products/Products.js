import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
  Badge,
} from 'react-bootstrap';

import { useCart } from '../../context/CartContext';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart} = useCart();
  const [quantities, setQuantities] = useState({});


  useEffect(() => {
    axios
      .get('/api/products')
      .then((res) => {
        if (res.data.success) {
          setProducts(res.data.data);
          const initialQuantities = {};
          res.data.data.forEach((product) => {
            initialQuantities[product.id] = product.min_order_kg;
          });
          setQuantities(initialQuantities);
        } else {
          setError('Failed to load products');
        }
      })
      .catch(() => {
        setError('Error fetching products');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleIncrease = (id, stock) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.min(prev[id] + 1, stock),
    }));
  };

  const handleDecrease = (id, min) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(prev[id] - 1, min),
    }));
  };

  const handleAddToCart = (product) => {
    const quantity = quantities[product.id];
    addToCart(product, quantity);
  };



  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
        <Spinner animation="border" variant="success" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-5" style={{ background: '#f8f9fa' }}>
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold" style={{ fontSize: '2rem', letterSpacing: '0.5px' }}>
            🛒 Fresh & Organic Products
          </h2>
        </div>

        <Row>
          {products.map((product) => (
            <Col key={product.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                <div style={{ height: '180px', overflow: 'hidden' }}>
                  <Card.Img
                    src={product.image_url}
                    alt={product.name}
                    style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                  />
                </div>
                <Card.Body className="d-flex flex-column p-3">
                  <Card.Title className="fw-semibold fs-5 mb-1">{product.name}</Card.Title>
                  <Card.Text className="text-muted mb-2" style={{ fontSize: '0.9rem' }}>
                    {product.description}
                  </Card.Text>

                  <div className="mb-2 small">
                    <div><strong>{product.price_details}</strong></div>
                    <div className="text-muted">Min Order: {product.min_order_kg} {product.unit_type}</div>
                    {product.bulk_discount && (
                      <Badge bg="success" className="mt-1">{product.bulk_discount}</Badge>
                    )}
                  </div>

                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => handleDecrease(product.id, product.min_order_kg)}
                    >
                      −
                    </Button>
                    <span className="mx-2 fw-semibold">
                      {quantities[product.id]} {product.unit_type}
                    </span>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => handleIncrease(product.id, product.stock_kg)}
                    >
                      +
                    </Button>
                  </div>

                  <Button
                    variant={product.availability ? 'outline-success' : 'secondary'}
                    className="mt-auto rounded-circle mx-auto d-block"
                    disabled={!product.availability}
                    onClick={() => handleAddToCart(product)}
                    title="Add to Cart"
                    style={{ width: '42px', height: '42px', padding: 0 }}
                  >
                    🛒
                  </Button>
                </Card.Body>
                <Card.Footer className="text-muted text-center small bg-white border-0 rounded-bottom-4">
                  Stock: {product.stock_kg} {product.unit_type}
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </Container>
  );
}

export default Products;
