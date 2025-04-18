import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Alert,
  Image,
} from "react-bootstrap";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "Fresh Spinach",
    description: "Organic, farm-fresh spinach leaves.",
    image_url: "https://via.placeholder.com/150",
    price_details: "₹30 per bunch",
    price_per_kg: "60.0",
    availability: true,
    stock_kg: "100",
    min_order_kg: "1",
    bulk_discount: "10% off on 10kg+",
    category: "Leafy Green",
    unit_type: "kg",
  });

  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...product,
        price_per_kg: parseFloat(product.price_per_kg),
        stock_kg: parseFloat(product.stock_kg),
        min_order_kg: parseFloat(product.min_order_kg),
      };

      await axios.post("/api/products", payload, {
        headers: {
          "Content-Type": "application/json",
          username: "admin1",
          password: "securepass123",
        },
      });

      setStatus({ type: "success", message: "✅ Product added successfully!" });

      // Optionally reset form
      setProduct({
        name: "",
        description: "",
        image_url: "",
        price_details: "",
        price_per_kg: "",
        availability: true,
        stock_kg: "",
        min_order_kg: "",
        bulk_discount: "",
        category: "",
        unit_type: "kg",
      });
    } catch (error) {
      console.error(error);
      setStatus({ type: "danger", message: "❌ Failed to add product." });
    }
  };

  return (
    <Container className="mt-5 mb-5 p-4 bg-white rounded shadow-sm">
      <h2 className="mb-4 text-success text-center">📦 Add New Product</h2>

      {status && (
        <Alert variant={status.type} className="text-center">
          {status.message}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="productName">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={product.name}
                onChange={handleChange}
                placeholder="Enter product name"
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="productCategory">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                name="category"
                value={product.category}
                onChange={handleChange}
                placeholder="e.g., Leafy Green"
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3" controlId="productDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={product.description}
            onChange={handleChange}
            placeholder="Write a short description"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="imageURL">
          <Form.Label>Image URL</Form.Label>
          <Form.Control
            type="url"
            name="image_url"
            value={product.image_url}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
        </Form.Group>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="priceDetails">
              <Form.Label>Price Details</Form.Label>
              <Form.Control
                type="text"
                name="price_details"
                value={product.price_details}
                onChange={handleChange}
                placeholder="e.g., ₹30 per bunch"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="pricePerKg">
              <Form.Label>Price per KG</Form.Label>
              <Form.Control
                type="number"
                name="price_per_kg"
                value={product.price_per_kg}
                onChange={handleChange}
                placeholder="60.0"
                step="0.01"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="stockKg">
              <Form.Label>Stock (KG)</Form.Label>
              <Form.Control
                type="number"
                name="stock_kg"
                value={product.stock_kg}
                onChange={handleChange}
                placeholder="50"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="minOrderKg">
              <Form.Label>Minimum Order (KG)</Form.Label>
              <Form.Control
                type="number"
                name="min_order_kg"
                value={product.min_order_kg}
                onChange={handleChange}
                placeholder="1"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="bulkDiscount">
              <Form.Label>Bulk Discount</Form.Label>
              <Form.Control
                type="text"
                name="bulk_discount"
                value={product.bulk_discount}
                onChange={handleChange}
                placeholder="10% off on 10kg+"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="unitType">
              <Form.Label>Unit Type</Form.Label>
              <Form.Select
                name="unit_type"
                value={product.unit_type}
                onChange={handleChange}
              >
                <option value="kg">KG</option>
                <option value="bunch">Bunch</option>
                <option value="unit">Unit</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3" controlId="availabilityCheckbox">
          <Form.Check
            type="checkbox"
            label="Available"
            name="availability"
            checked={product.availability}
            onChange={handleChange}
          />
        </Form.Group>

        <div className="text-center">
          <Button variant="success" type="submit" size="lg">
            ✅ Add Product
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default AddProduct;
