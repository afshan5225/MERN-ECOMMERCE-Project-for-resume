import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <Nav className="justify-content-center mb-4">
      <Nav.Item className="mx-2">
        {step1 ? (
          <Link to="/login">Sign In</Link>
        ) : (
          <span className="text-muted">Sign In</span>
        )}
      </Nav.Item>

      <Nav.Item className="mx-2">
        {step2 ? (
          <Link to="/shipping">Shipping</Link>
        ) : (
          <span className="text-muted">Shipping</span>
        )}
      </Nav.Item>

      <Nav.Item className="mx-2">
        {step3 ? (
          <Link to="/payment">Payment</Link>
        ) : (
          <span className="text-muted">Payment</span>
        )}
      </Nav.Item>

      <Nav.Item className="mx-2">
        {step4 ? (
          <Link to="/placeorder">Place Order</Link>
        ) : (
          <span className="text-muted">Place Order</span>
        )}
      </Nav.Item>
    </Nav>
  );
};

export default CheckoutSteps;
