import React from 'react';
import { Routes, Route,Navigate } from 'react-router-dom';
import NavigationBar from './components/Navbar/NavigationBar';
import Footer from './components/Footer/Footer';
import Products from './pages/products/Products';
import NotFound from './pages/notfound/notfound';
import LoginForm from './components/Login/LoginForm';
import Cart from './pages/cart/CartPage';
import UserOrdersPage from './pages/users/UserOrdersPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import { CartProvider } from './context/CartContext';
import AdminLogin from './pages/admin/AdminLogin';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  // Simple authentication state for admin (in a real app, use proper authentication)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = React.useState(false);
  
  const handleAdminLogin = (credentials) => {
    // In a real app, verify credentials against your backend
    if (credentials.username === 'admin1' && credentials.password === 'securepass123') {
      setIsAdminAuthenticated(true);
      return true;
    }
    return false;
  };
  
  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
  };

  return (
    <CartProvider>
      <div className="d-flex flex-column min-vh-100">
        <NavigationBar />
        <main className="flex-grow-1 pt-5 mt-4"> {/* Ensures space below fixed navbar */}
          <Routes>
            <Route path="/" element={<Products />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/user" element={<UserOrdersPage />} />
            <Route path="/admin" element={
              isAdminAuthenticated ? 
                <AdminDashboard onLogout={handleAdminLogout} /> : 
                <AdminLogin onLogin={handleAdminLogin} />
            } />
            <Route path="/admin/login" element={
              isAdminAuthenticated ? 
                <Navigate to="/admin" /> :
                <AdminLogin onLogin={handleAdminLogin} />
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </CartProvider>
  );
}

export default App;