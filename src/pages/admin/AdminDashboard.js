// AdminDashboard.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  PlusCircle,
  Trash2,
  ListOrdered,
  RefreshCcw,
  BarChart2,
  Users,
  PieChart,
} from "lucide-react";
import {
  Button,
  Container,
  Row,
  Col,
  Card,
  Modal,
  Form,
  Alert,
  Spinner,
} from "react-bootstrap";
import axios from "axios";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [newStatus, setNewStatus] = useState("confirmed");
  const [statusLoading, setStatusLoading] = useState(false);

  const [status, setStatus] = useState(null);

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await axios.delete(`https://agrofix-backend-beta.vercel.app/api/products/${deleteId}`, {
        headers: {
          username: "admin1",
          password: "securepass123",
        },
      });
      setStatus({
        type: "success",
        message: `Product ID ${deleteId} deleted successfully.`,
      });
      setDeleteId("");
      setShowDeleteModal(false);
    } catch (error) {
      setStatus({
        type: "danger",
        message: "Failed to delete product. Please check the ID.",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    setStatusLoading(true);
    try {
      await axios.put(
        `https://agrofix-backend-beta.vercel.app/api/admin/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: {
            "Content-Type": "application/json",
            username: "adminuser",
            password: "adminpass",
          },
        }
      );
      setStatus({
        type: "success",
        message: `Order ${orderId} updated to "${newStatus}"`,
      });
      setOrderId("");
      setShowStatusModal(false);
    } catch (error) {
      setStatus({
        type: "danger",
        message: "Failed to update order status. Please check the order ID.",
      });
    } finally {
      setStatusLoading(false);
    }
  };

  return (
    <motion.div
      className="mt-5"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Container>
        <Card className="shadow-lg rounded-4 p-4">
          <div className="text-center mb-4">
            <h1 className="text-success fw-bold display-6">👨‍💼 Admin Dashboard</h1>
            <p className="text-muted">Manage products, orders, and more.</p>
          </div>

          {status && (
            <Alert
              variant={status.type}
              onClose={() => setStatus(null)}
              dismissible
            >
              {status.message}
            </Alert>
          )}

          {/* Buttons Row */}
          <Row className="mb-5 justify-content-center">
            <motion.div
              className="d-flex flex-wrap justify-content-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  variant="success"
                  size="lg"
                  className="d-flex align-items-center gap-2 px-4 py-3 rounded-4"
                  onClick={() => navigate("/admin/add-product")}
                >
                  <PlusCircle size={20} />
                  Add Product
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  variant="danger"
                  size="lg"
                  className="d-flex align-items-center gap-2 px-4 py-3 rounded-4"
                  onClick={() => setShowDeleteModal(true)}
                >
                  <Trash2 size={20} />
                  Delete Product
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  variant="primary"
                  size="lg"
                  className="d-flex align-items-center gap-2 px-4 py-3 rounded-4"
                  onClick={() => navigate("/admin/orders")}
                >
                  <ListOrdered size={20} />
                  View Orders
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  variant="warning"
                  size="lg"
                  className="d-flex align-items-center gap-2 px-4 py-3 rounded-4"
                  onClick={() => setShowStatusModal(true)}
                >
                  <RefreshCcw size={20} />
                  Update Status
                </Button>
              </motion.div>
            </motion.div>
          </Row>

          {/* Coming Soon Features */}
          <Row className="gy-4 justify-content-center">
            {[
              { title: "Sales Reports", icon: <BarChart2 size={32} />, color: "info" },
              { title: "User Management", icon: <Users size={32} />, color: "secondary" },
              { title: "Analytics", icon: <PieChart size={32} />, color: "dark" },
            ].map((feature, i) => (
              <Col md={4} key={i}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`border border-${feature.color} p-4 rounded-4 shadow-sm text-center`}
                >
                  <div className={`text-${feature.color} mb-2`}>{feature.icon}</div>
                  <h5 className={`fw-bold text-${feature.color}`}>{feature.title}</h5>
                  <p className="text-muted">Coming Soon 🚀</p>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Card>
      </Container>

      {/* Delete Product Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Enter Product ID to delete:</Form.Label>
            <Form.Control
              type="number"
              value={deleteId}
              onChange={(e) => setDeleteId(e.target.value)}
              placeholder="e.g. 9"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)} disabled={deleteLoading}>
            Cancel
          </Button>
          <Button
            variant="danger"
            disabled={!deleteId || deleteLoading}
            onClick={handleDelete}
          >
            {deleteLoading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />{" "}
                Deleting...
              </>
            ) : (
              "Confirm Delete"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Update Order Status Modal */}
      <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Order Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Order ID</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter Order ID"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Select New Status</Form.Label>
            <Form.Select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
              <option value="confirmed">Confirmed</option>
              <option value="delivered">Delivered</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowStatusModal(false)} disabled={statusLoading}>
            Cancel
          </Button>
          <Button
            variant="warning"
            disabled={!orderId || statusLoading}
            onClick={handleStatusUpdate}
          >
            {statusLoading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />{" "}
                Updating...
              </>
            ) : (
              "Update Status"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </motion.div>
  );
};

export default AdminDashboard;
