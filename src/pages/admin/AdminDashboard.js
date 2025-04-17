// AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [view, setView] = useState('orders'); // 'orders' or 'products'
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  
  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    image_url: '',
    price_details: '',
    price_per_kg: 0,
    availability: true,
    stock_kg: 0,
    min_order_kg: 1,
    bulk_discount: '',
    category: '',
    unit_type: 'kg'
  });
  
  // Edit product form state
  const [editProduct, setEditProduct] = useState(null);
  
  // Authentication credentials
  const auth = {
    username: 'admin1',
    password: 'securepass123'
  };

  // Fetch orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/admin/orders', {
        auth: auth
      });
      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        setError('Failed to fetch orders');
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data.products || []);
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Load data when component mounts or view changes
  useEffect(() => {
    if (view === 'orders') {
      fetchOrders();
    } else if (view === 'products') {
      fetchProducts();
    }
  }, [view]);

  // Handle order status update
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/admin/orders/${orderId}/status`, 
        { status: newStatus },
        { auth: auth }
      );
      
      if (response.data.success) {
        // Update orders state
        setOrders(orders.map(order => 
          order.id === orderId 
            ? { ...order, status: newStatus } 
            : order
        ));
        alert(`Order #${orderId} status updated to ${newStatus}`);
      }
    } catch (err) {
      setError(`Failed to update order status: ${err.message}`);
    }
  };

  // Handle product form input changes
  const handleProductChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : 
               type === 'number' ? parseFloat(value) : value;
    
    if (editProduct) {
      setEditProduct({ ...editProduct, [name]: val });
    } else {
      setNewProduct({ ...newProduct, [name]: val });
    }
  };

  // Create new product
  const createProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:5000/api/products',
        newProduct,
        { auth: auth }
      );
      
      if (response.data.success) {
        alert('Product created successfully!');
        fetchProducts();
        setNewProduct({
          name: '',
          description: '',
          image_url: '',
          price_details: '',
          price_per_kg: 0,
          availability: true,
          stock_kg: 0,
          min_order_kg: 1,
          bulk_discount: '',
          category: '',
          unit_type: 'kg'
        });
      }
    } catch (err) {
      setError(`Failed to create product: ${err.message}`);
    }
  };

  // Update product
  const updateProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:5000/api/products/${editProduct.id}`,
        editProduct,
        { auth: auth }
      );
      
      if (response.data.success) {
        alert('Product updated successfully!');
        fetchProducts();
        setEditProduct(null);
      }
    } catch (err) {
      setError(`Failed to update product: ${err.message}`);
    }
  };

  // Delete product
  const deleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await axios.delete(
          `http://localhost:5000/api/products/${productId}`,
          { auth: auth }
        );
        
        if (response.data.success) {
          alert('Product deleted successfully!');
          fetchProducts();
        }
      } catch (err) {
        setError(`Failed to delete product: ${err.message}`);
      }
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  // Toggle order details
  const toggleOrderDetails = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Farm Fresh Admin</h1>
        <div className="nav-tabs">
          <button 
            className={view === 'orders' ? 'active' : ''} 
            onClick={() => setView('orders')}
          >
            Orders
          </button>
          <button 
            className={view === 'products' ? 'active' : ''} 
            onClick={() => setView('products')}
          >
            Products
          </button>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="admin-content">
          {view === 'orders' && (
            <div className="orders-section">
              <h2>Customer Orders</h2>
              <div className="orders-list">
                {orders.length === 0 ? (
                  <p>No orders found.</p>
                ) : (
                  orders.map(order => (
                    <div key={order.id} className={`order-card ${order.status}`}>
                      <div className="order-header" onClick={() => toggleOrderDetails(order.id)}>
                        <div className="order-basic-info">
                          <h3>Order #{order.id}</h3>
                          <span className={`status-badge ${order.status}`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="order-summary">
                          <p>
                            <strong>Customer:</strong> {order.buyer_name} ({order.buyer_contact})
                          </p>
                          <p>
                            <strong>Date:</strong> {formatDate(order.created_at)}
                          </p>
                          <p>
                            <strong>Total:</strong> ₹{order.total_amount}
                          </p>
                        </div>
                        <span className="expand-icon">{expandedOrder === order.id ? '▼' : '►'}</span>
                      </div>

                      {expandedOrder === order.id && (
                        <div className="order-details">
                          <div className="order-items">
                            <h4>Order Items</h4>
                            <table>
                              <thead>
                                <tr>
                                  <th>Product</th>
                                  <th>Quantity</th>
                                  <th>Price/Unit</th>
                                  <th>Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {order.cart_summary.map(item => (
                                  <tr key={item.id}>
                                    <td>{item.product_name}</td>
                                    <td>{item.quantity} {item.unit_type}</td>
                                    <td>₹{item.price_per_kg}</td>
                                    <td>₹{item.total_price}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          <div className="order-address">
                            <h4>Delivery Information</h4>
                            <p><strong>Address:</strong> {order.delivery_address}</p>
                            <p><strong>Payment Method:</strong> {order.payment_method.replace(/_/g, ' ')}</p>
                          </div>

                          <div className="order-actions">
                            <h4>Update Status</h4>
                            <div className="status-buttons">
                              <button 
                                className={order.status === 'pending' ? 'active' : ''}
                                onClick={() => updateOrderStatus(order.id, 'pending')}
                              >
                                Pending
                              </button>
                              <button 
                                className={order.status === 'confirmed' ? 'active' : ''}
                                onClick={() => updateOrderStatus(order.id, 'confirmed')}
                              >
                                Confirmed
                              </button>
                              <button 
                                className={order.status === 'shipped' ? 'active' : ''}
                                onClick={() => updateOrderStatus(order.id, 'shipped')}
                              >
                                Shipped
                              </button>
                              <button 
                                className={order.status === 'delivered' ? 'active' : ''}
                                onClick={() => updateOrderStatus(order.id, 'delivered')}
                              >
                                Delivered
                              </button>
                              <button 
                                className={order.status === 'cancelled' ? 'active' : ''}
                                onClick={() => updateOrderStatus(order.id, 'cancelled')}
                              >
                                Cancelled
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {view === 'products' && (
            <div className="products-section">
              <h2>Product Management</h2>
              
              {/* Add New Product Form */}
              <div className="product-form-container">
                <h3>{editProduct ? 'Edit Product' : 'Add New Product'}</h3>
                <form onSubmit={editProduct ? updateProduct : createProduct} className="product-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Product Name</label>
                      <input 
                        type="text" 
                        name="name" 
                        value={editProduct ? editProduct.name : newProduct.name}
                        onChange={handleProductChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Category</label>
                      <input 
                        type="text" 
                        name="category" 
                        value={editProduct ? editProduct.category : newProduct.category}
                        onChange={handleProductChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea 
                      name="description" 
                      value={editProduct ? editProduct.description : newProduct.description}
                      onChange={handleProductChange}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Image URL</label>
                      <input 
                        type="url" 
                        name="image_url" 
                        value={editProduct ? editProduct.image_url : newProduct.image_url}
                        onChange={handleProductChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Price Details</label>
                      <input 
                        type="text" 
                        name="price_details" 
                        value={editProduct ? editProduct.price_details : newProduct.price_details}
                        onChange={handleProductChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Price per KG (₹)</label>
                      <input 
                        type="number" 
                        name="price_per_kg" 
                        step="0.01"
                        min="0"
                        value={editProduct ? editProduct.price_per_kg : newProduct.price_per_kg}
                        onChange={handleProductChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Stock (kg)</label>
                      <input 
                        type="number" 
                        name="stock_kg" 
                        min="0"
                        value={editProduct ? editProduct.stock_kg : newProduct.stock_kg}
                        onChange={handleProductChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Minimum Order (kg)</label>
                      <input 
                        type="number" 
                        name="min_order_kg" 
                        min="0.1"
                        step="0.1"
                        value={editProduct ? editProduct.min_order_kg : newProduct.min_order_kg}
                        onChange={handleProductChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Bulk Discount</label>
                      <input 
                        type="text" 
                        name="bulk_discount" 
                        value={editProduct ? editProduct.bulk_discount : newProduct.bulk_discount}
                        onChange={handleProductChange}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Unit Type</label>
                      <select 
                        name="unit_type" 
                        value={editProduct ? editProduct.unit_type : newProduct.unit_type}
                        onChange={handleProductChange}
                      >
                        <option value="kg">Kilogram (kg)</option>
                        <option value="bunch">Bunch</option>
                        <option value="piece">Piece</option>
                        <option value="dozen">Dozen</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group checkbox-group">
                    <label>
                      <input 
                        type="checkbox" 
                        name="availability" 
                        checked={editProduct ? editProduct.availability : newProduct.availability}
                        onChange={handleProductChange}
                      />
                      Available for Purchase
                    </label>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn-primary">
                      {editProduct ? 'Update Product' : 'Add Product'}
                    </button>
                    {editProduct && (
                      <button 
                        type="button" 
                        className="btn-secondary"
                        onClick={() => setEditProduct(null)}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Products List */}
              <div className="products-list">
                <h3>Current Products</h3>
                {products.length === 0 ? (
                  <p>No products found.</p>
                ) : (
                  <table className="products-table">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price/kg</th>
                        <th>Stock</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(product => (
                        <tr key={product.id}>
                          <td>
                            <img 
                              src={product.image_url} 
                              alt={product.name} 
                              className="product-thumbnail" 
                            />
                          </td>
                          <td>{product.name}</td>
                          <td>{product.category}</td>
                          <td>₹{product.price_per_kg}</td>
                          <td>{product.stock_kg} {product.unit_type}</td>
                          <td>
                            <span className={`availability-badge ${product.availability ? 'available' : 'unavailable'}`}>
                              {product.availability ? 'Available' : 'Unavailable'}
                            </span>
                          </td>
                          <td>
                            <div className="product-actions">
                              <button 
                                className="btn-edit"
                                onClick={() => setEditProduct(product)}
                              >
                                Edit
                              </button>
                              <button 
                                className="btn-delete"
                                onClick={() => deleteProduct(product.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;