import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Card,
  Badge,
  ListGroup,
  Alert,
  Spinner,
  Form,
  Nav,
} from "react-bootstrap";
import { motion } from "framer-motion";
import {
  HourglassSplit,
  CheckCircle,
  Box,
  Layers,
} from "react-bootstrap-icons";

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const [status, setStatus] = useState("all");
  const [statusCounts, setStatusCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("https://agrofix-backend-beta.vercel.app/api/admin/orders", {
          headers: {
            username: "admin1",
            password: "securepass123",
          },
        });
        const data = res.data.orders;
        setOrders(data);
        computeStatusCounts(data);
      } catch (err) {
        setError("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const computeStatusCounts = (orders) => {
    const counts = {
      all: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      confirmed: orders.filter((o) => o.status === "confirmed").length,
      delivered: orders.filter((o) => o.status === "delivered").length,
    };
    setStatusCounts(counts);
  };

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...orders];
    if (status !== "all") {
      filtered = filtered.filter((o) => o.status === status);
    }

    switch (sortBy) {
      case "oldest":
        filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case "amount-asc":
        filtered.sort((a, b) => a.total_amount - b.total_amount);
        break;
      case "amount-desc":
        filtered.sort((a, b) => b.total_amount - a.total_amount);
        break;
      case "status":
        filtered.sort((a, b) => a.status.localeCompare(b.status));
        break;
      default:
        break;
    }

    setFilteredOrders(filtered);
  }, [orders, status, sortBy]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="mt-4 text-center">
        {error}
      </Alert>
    );
  }

  return (
    <Container className="my-4">
      <motion.h2
        className="mb-4 text-center fw-bold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        📦 Admin Dashboard - Orders
      </motion.h2>

      {/* Status Filter */}
      <Nav variant="pills" className="mb-4 justify-content-center flex-wrap">
        <Nav.Item>
          <Nav.Link active={status === "all"} onClick={() => setStatus("all")}>
            <Layers className="me-1" />
            All <Badge bg="secondary" pill className="ms-1">{statusCounts.all}</Badge>
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link active={status === "pending"} onClick={() => setStatus("pending")}>
            <HourglassSplit className="me-1" />
            Pending <Badge bg="warning" pill className="ms-1">{statusCounts.pending}</Badge>
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link active={status === "confirmed"} onClick={() => setStatus("confirmed")}>
            <CheckCircle className="me-1" />
            Confirmed <Badge bg="info" pill className="ms-1">{statusCounts.confirmed}</Badge>
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link active={status === "delivered"} onClick={() => setStatus("delivered")}>
            <Box className="me-1" />
            Delivered <Badge bg="success" pill className="ms-1">{statusCounts.delivered}</Badge>
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {/* Sort Dropdown */}
      <Form className="text-end mb-4">
        <Form.Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{ maxWidth: "250px", marginLeft: "auto" }}
        >
          <option value="newest">🆕 Newest First</option>
          <option value="oldest">📅 Oldest First</option>
          <option value="amount-asc">💰 Amount: Low to High</option>
          <option value="amount-desc">💸 Amount: High to Low</option>
          <option value="status">📌 Status (A-Z)</option>
        </Form.Select>
      </Form>

      {/* Orders List */}
      {filteredOrders.map((order) => (
        <motion.div
          key={order.id}
          className="mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="shadow rounded-4">
            <Card.Body>
              <Card.Title className="d-flex justify-content-between align-items-center">
                <span>Order #{order.id}</span>
                <Badge
                  bg={
                    order.status === "pending"
                      ? "warning"
                      : order.status === "confirmed"
                      ? "info"
                      : "success"
                  }
                >
                  {order.status}
                </Badge>
              </Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                {new Date(order.created_at).toLocaleString()}
              </Card.Subtitle>

              <ListGroup className="mb-3">
                {order.cart_summary.map((item) => (
                  <ListGroup.Item key={item.id} className="d-flex justify-content-between">
                    <div>
                      <strong>{item.product_name}</strong> ({item.quantity} {item.unit_type})
                    </div>
                    <span>₹{item.total_price}</span>
                  </ListGroup.Item>
                ))}
              </ListGroup>

              <p><strong>Total:</strong> ₹{order.total_amount}</p>
              <p><strong>Buyer:</strong> {order.buyer_name}</p>
              <p><strong>Contact:</strong> {order.buyer_contact}</p>
              <p><strong>Address:</strong> {order.delivery_address}</p>
              <p><strong>Payment:</strong> {order.payment_method}</p>
            </Card.Body>
          </Card>
        </motion.div>
      ))}
    </Container>
  );
};

export default AdminOrdersPage;
