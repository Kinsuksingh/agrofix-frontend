import React, { useState, useEffect } from 'react';
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Card,
  Spinner,
  Dropdown,
  Badge,
  InputGroup,
  Nav
} from 'react-bootstrap';
import { Search, SortDown, Filter, Calendar, CurrencyRupee, Clock, Box, CheckCircle, HourglassSplit } from 'react-bootstrap-icons';

const UserOrdersPage = () => {
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [status, setStatus] = useState('all');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  
  // Keep track of counts by status
  const [statusCounts, setStatusCounts] = useState({
    all: 0,
    pending: 0,
    confirmed: 0,
    delivered: 0
  });

  const fetchOrders = async () => {
    if (!phone) return;

    setLoading(true);

    // We're now requesting all orders regardless of status filter
    // Status filtering will be done client-side
    let url = `https://agrofix-backend-beta.vercel.app/api/user/orders?phone=${phone}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      const fetchedOrders = data.orders || [];
      setOrders(fetchedOrders);
      
      // Calculate status counts once when orders are fetched
      const counts = {
        all: fetchedOrders.length,
        pending: fetchedOrders.filter(order => order.status === 'pending').length,
        confirmed: fetchedOrders.filter(order => order.status === 'confirmed').length,
        delivered: fetchedOrders.filter(order => order.status === 'delivered').length
      };
      setStatusCounts(counts);
      
      // Apply current filters and sorting
      sortAndFilterOrders(fetchedOrders, status, sortBy);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setOrders([]);
      setFilteredOrders([]);
      setStatusCounts({
        all: 0,
        pending: 0,
        confirmed: 0,
        delivered: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const sortAndFilterOrders = (ordersToProcess, currentStatus, currentSortOption) => {
    // First filter by status if needed
    let processed = [...ordersToProcess];
    
    if (currentStatus !== 'all') {
      processed = processed.filter(order => order.status === currentStatus);
    }
    
    // Then sort
    switch (currentSortOption) {
      case 'newest':
        processed.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'oldest':
        processed.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case 'highestAmount':
        processed.sort((a, b) => b.total_amount - a.total_amount);
        break;
      case 'lowestAmount':
        processed.sort((a, b) => a.total_amount - b.total_amount);
        break;
      case 'statusAsc':
        processed.sort((a, b) => a.status.localeCompare(b.status));
        break;
      case 'statusDesc':
        processed.sort((a, b) => b.status.localeCompare(a.status));
        break;
      default:
        processed.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    
    setFilteredOrders(processed);
  };

  // Re-sort and filter whenever relevant state changes
  useEffect(() => {
    if (orders.length > 0) {
      sortAndFilterOrders(orders, status, sortBy);
    }
  }, [orders, status, sortBy]); // Add dependencies here

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    fetchOrders();
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'confirmed': return 'info';
      case 'delivered': return 'success';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <HourglassSplit className="me-2" />;
      case 'confirmed': return <CheckCircle className="me-2" />;
      case 'delivered': return <Box className="me-2" />;
      default: return null;
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Container className="py-5" fluid="lg">
      <div className="bg-light p-4 rounded-4 shadow-sm mb-5">
        <h2 className="text-center mb-4 fw-bold">
          <span className="me-2">📦</span>
          Track Your Orders
        </h2>

        <Form onSubmit={handleSubmit} className="mb-3">
          <Row className="g-3 justify-content-center">
            <Col md={8} lg={6}>
              <InputGroup>
                <InputGroup.Text><Search /></InputGroup.Text>
                <Form.Control
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={loading}
                >
                  {loading ? <Spinner size="sm" animation="border" /> : 'Find Orders'}
                </Button>
              </InputGroup>
            </Col>
          </Row>
        </Form>
      </div>

      {submitted && orders.length > 0 && (
        <>
          <Nav variant="pills" className="mb-4 justify-content-center">
            <Nav.Item>
              <Nav.Link 
                active={status === 'all'} 
                onClick={() => setStatus('all')}
                className="d-flex align-items-center"
              >
                <span className="me-1">All</span>
                <Badge bg="secondary" pill>{statusCounts.all}</Badge>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                active={status === 'pending'} 
                onClick={() => setStatus('pending')}
                className="d-flex align-items-center"
              >
                <HourglassSplit className="me-1" />
                <span className="me-1">Pending</span>
                <Badge bg="warning" pill>{statusCounts.pending}</Badge>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                active={status === 'confirmed'} 
                onClick={() => setStatus('confirmed')}
                className="d-flex align-items-center"
              >
                <CheckCircle className="me-1" />
                <span className="me-1">Confirmed</span>
                <Badge bg="info" pill>{statusCounts.confirmed}</Badge>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                active={status === 'delivered'} 
                onClick={() => setStatus('delivered')}
                className="d-flex align-items-center"
              >
                <Box className="me-1" />
                <span className="me-1">Delivered</span>
                <Badge bg="success" pill>{statusCounts.delivered}</Badge>
              </Nav.Link>
            </Nav.Item>
          </Nav>

          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="mb-0">{filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} found</h5>
            <Dropdown>
              <Dropdown.Toggle variant="outline-dark" id="dropdown-sort" className="d-flex align-items-center">
                <SortDown className="me-2" /> Sort By: {
                  sortBy === 'newest' ? 'Newest First' : 
                  sortBy === 'oldest' ? 'Oldest First' : 
                  sortBy === 'highestAmount' ? 'Highest Amount' : 
                  sortBy === 'lowestAmount' ? 'Lowest Amount' :
                  sortBy === 'statusAsc' ? 'Status (A-Z)' :
                  'Status (Z-A)'
                }
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Header>By Date</Dropdown.Header>
                <Dropdown.Item onClick={() => setSortBy('newest')}><Calendar className="me-2" /> Newest First</Dropdown.Item>
                <Dropdown.Item onClick={() => setSortBy('oldest')}><Clock className="me-2" /> Oldest First</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Header>By Amount</Dropdown.Header>
                <Dropdown.Item onClick={() => setSortBy('highestAmount')}><CurrencyRupee className="me-2" /> Highest Amount</Dropdown.Item>
                <Dropdown.Item onClick={() => setSortBy('lowestAmount')}><CurrencyRupee className="me-2" /> Lowest Amount</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Header>By Status</Dropdown.Header>
                <Dropdown.Item onClick={() => setSortBy('statusAsc')}><Filter className="me-2" /> Status (A-Z)</Dropdown.Item>
                <Dropdown.Item onClick={() => setSortBy('statusDesc')}><Filter className="me-2" /> Status (Z-A)</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </>
      )}

      {loading && (
        <div className="text-center my-5 py-5">
          <Spinner animation="border" variant="primary" />
          <p className="text-muted mt-3">Fetching your orders...</p>
        </div>
      )}

      {!loading && submitted && filteredOrders.length === 0 && (
        <div className="text-center my-5 py-5 bg-light rounded-4">
          <div className="display-1 mb-3">😕</div>
          <h4>No orders found</h4>
          <p className="text-muted">We couldn't find any orders matching your criteria.</p>
          {status !== 'all' && (
            <Button 
              variant="outline-primary" 
              onClick={() => setStatus('all')}
              className="mt-2"
            >
              View All Orders
            </Button>
          )}
        </div>
      )}

      <div className="order-list">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="mb-4 shadow-sm border-0 rounded-4 overflow-hidden">
            <div className={`bg-${getStatusBadgeVariant(order.status)} bg-opacity-10 py-3 px-4 d-flex justify-content-between align-items-center`}>
              <div className="d-flex align-items-center">
                <h5 className="fw-bold mb-0 me-3">Order #{order.id}</h5>
                <Badge bg={getStatusBadgeVariant(order.status)} className="text-capitalize py-2 px-3 d-flex align-items-center">
                  {getStatusIcon(order.status)}
                  {order.status}
                </Badge>
              </div>
              <div className="text-end">
                <small className="text-muted d-block">ORDERED ON</small>
                <span>{formatDate(order.created_at)}</span>
              </div>
            </div>
            <Card.Body className="p-4">
              <Row className="mb-4">
                <Col md={6} className="mb-3 mb-md-0">
                  <div className="mb-3">
                    <small className="text-muted d-block text-uppercase">Delivery Address</small>
                    <p className="mb-0 fw-medium">{order.delivery_address}</p>
                  </div>
                </Col>
                <Col md={6}>
                  <div>
                    <small className="text-muted d-block text-uppercase">Payment Method</small>
                    <p className="mb-0 text-capitalize fw-medium">{order.payment_method.replace(/_/g, ' ')}</p>
                  </div>
                </Col>
              </Row>
              
              <Card className="bg-light border-0 rounded-3 p-4 mb-4">
                <h6 className="mb-3 fw-bold">Order Items</h6>
                {order.cart_summary.map((item, idx) => (
                  <div key={idx} className={`d-flex justify-content-between align-items-center ${idx !== order.cart_summary.length - 1 ? 'border-bottom pb-3 mb-3' : ''}`}>
                    <div>
                      <div className="fw-medium">{item.product_name}</div>
                      <small className="text-muted">{item.quantity} {item.unit_type} × ₹{item.price_per_kg}</small>
                    </div>
                    <div className="text-end">
                      <strong>₹{item.total_price}</strong>
                    </div>
                  </div>
                ))}
              </Card>
              
              <div className="d-flex justify-content-between align-items-center p-3 bg-primary bg-opacity-10 rounded-3">
                <span className="fw-bold fs-5">Total Amount</span>
                <span className="fw-bold fs-5 text-primary">₹{order.total_amount}</span>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    </Container>
  );
};

export default UserOrdersPage;