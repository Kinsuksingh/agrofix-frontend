import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Link } from 'react-router-dom';
import { Wheat, ShoppingCart, LogIn } from "lucide-react";
import { FiBox } from 'react-icons/fi';
import { Badge } from 'react-bootstrap';
import { useCart } from '../../context/CartContext';

function NavigationBar() {
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Navbar
      className="fixed-top shadow-sm"
      style={{
        background: 'linear-gradient(90deg,rgb(209, 214, 206),rgb(212, 252, 214))',
        height: '64px',
      }}
    >
      <Container className="d-flex justify-content-between align-items-center px-3">
        {/* Brand */}
        <Navbar.Brand
          as={Link}
          to="/"
          className="d-flex align-items-center text-dark gap-2 fw-semibold"
          style={{ fontSize: '1rem' }}
        >
          <Wheat size={20} />
          <span className="d-none d-lg-inline">Agro Fresh</span>
        </Navbar.Brand>

        {/* Navigation Links */}
        <Nav className="d-flex flex-row align-items-center gap-4">
          {/* Products */}
          <Nav.Link
            as={Link}
            to="/"
            className="d-flex align-items-center gap-2 text-dark nav-icon"
            title="Fresh Picks"
          >
            <FiBox size={20} />
            <span className="d-none d-lg-inline small">Fresh Picks</span>
          </Nav.Link>

          {/* Cart */}
          <Nav.Link
            as={Link}
            to="/cart"
            className="d-flex align-items-center gap-2 text-dark nav-icon position-relative"
            title="Cart"
          >
            <div className="position-relative">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <Badge
                  pill
                  bg="danger"
                  className="position-absolute top-0 start-100 translate-middle"
                  style={{
                    fontSize: '0.6rem',
                    minWidth: '16px',
                    height: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    padding: '0 4px',
                  }}
                >
                  {totalItems}
                </Badge>
              )}
            </div>
            <span className="d-none d-lg-inline small">Cart</span>
          </Nav.Link>

          {/* Login */}
          <Nav.Link
            as={Link}
            to="/login"
            className="d-flex align-items-center gap-2 text-dark nav-icon"
            title="Login"
          >
            <LogIn size={20} />
            <span className="d-none d-lg-inline small">Login</span>
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
