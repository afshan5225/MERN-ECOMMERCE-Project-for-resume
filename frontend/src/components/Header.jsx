import React from 'react';
import { Badge, Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../assets/logo.png";
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../slices/authSlice';
import { useLogoutMutation } from '../slices/userApiSlice';
import SearchBar from '../components/SearchBox'; // 🚀 Import the SearchBar

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <header>
      <Navbar bg="black" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          {/* Logo / Brand */}
          <Navbar.Brand as={Link} to="/">
            <img
              src={logo}
              alt="logo"
              style={{ height: "30px", marginRight: "10px" }}
            />
            MyShop
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            
            {/* 🚀 SearchBar */}
            <SearchBar />

            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/cart">
                <FaShoppingCart className="me-1" />
                Cart
                {cartItems.length > 0 && (
                  <Badge pill bg="success" style={{ marginLeft: '5px' }}>
                    {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                  </Badge>
                )}
              </Nav.Link>

              {userInfo ? (
                <NavDropdown title={userInfo.name} id="username">
                  <NavDropdown.Item as={Link} to="/profile">
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Nav.Link as={Link} to="/login">
                  <FaUser className="me-1" />
                  Sign In
                </Nav.Link>
              )}

              {userInfo && userInfo.isAdmin && (
                <NavDropdown title="Admin" id="adminmenu">
                  <NavDropdown.Item as={Link} to="/admin/productList">
                    Products
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/admin/userList">
                    Users
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/admin/orderList">
                    Orders
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
