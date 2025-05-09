import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import NavigationBar from './components/Navbar/NavigationBar';
import Footer from './components/Footer/Footer';
import Products from './pages/products/Products';
import NotFound from './pages/notfound/notfound';
import LoginForm from './components/Login/LoginForm';
import Cart from './pages/cart/CartPage';
import UserOrdersPage from './pages/users/UserOrdersPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import { CartProvider } from './context/CartContext';
import AdminLogin from './pages/admin/AdminLogin'
import AddProduct from './pages/admin/AddProduct';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import 'bootstrap/dist/css/bootstrap.min.css';

// Create a ScrollToTop component
function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

function App() {
  return (
    <CartProvider>
      <div className="d-flex flex-column min-vh-100">
        <ScrollToTop /> {/* Add the ScrollToTop component here */}
        <NavigationBar />
        <main className="flex-grow-1 pt-5 mt-4"> {/* Ensures space below fixed navbar */}
          <Routes>
            <Route path="/" element={<Products />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/user" element={<UserOrdersPage />} />
            <Route path="/admin" element={<AdminDashboard/>} />
            <Route path="/adminlogin" element={<AdminLogin/>} />
            <Route path="/admin/add-product" element={<AddProduct />} />
            <Route path="/admin/orders" element={<AdminOrdersPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </CartProvider>
  );
}

export default App;