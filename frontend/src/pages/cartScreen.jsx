import React from 'react';
import {
  Button,
  Card,
  Col,
  Form,
  Image,
  ListGroup,
  Row
} from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Message from '../components/Message';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../slices/cartSlice';

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = async(product,qty)=>{
    dispatch(addToCart({...product,qty}))
  }
  const removeCartHandler = async(id)=>{
    dispatch(removeFromCart(id))
  }
  return (
    <Row>
      <Col md={8}>
        <h1 style={{ marginBottom: '20px' }}>Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <Message>
            Your cart is empty <Link to="/">Go Back</Link>
          </Message>
        ) : (
          <ListGroup variant="flush">
            {cartItems.map((item) => (
              <ListGroup.Item key={item._id}>
                <Row>
                  <Col md={2}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>

                  <Col md={3}>
                    <Link to={`/product/${item._id}`}>{item.name}</Link>
                  </Col>

                  <Col md={2}>${item.price}</Col>

                  <Col md={2}>
                    <Form.Control
                      as="select"
                      value={item.qty}
                      onChange={(e) => addToCartHandler(item,Number(e.target.value))}
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>

                  <Col md={2}>
                    <Button type="button" variant="light" onClick={()=>removeCartHandler(item._id)}>
                      <FaTrash />
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
      <Card>
       <ListGroup variant='flush'> 
       <ListGroup.Item>
          <h2>
            subtotal ({cartItems.reduce((acc,items)=>acc+items.qty,0)})
          </h2>
          ${cartItems.reduce((acc,item)=>acc+item.price*item.qty,0)}
        </ListGroup.Item>
        <ListGroup.Item>
          <Button onClick={checkoutHandler} type='button' className='btn-block' disabled={cartItems.length<0}>
            Proceed to checkout
          </Button>
        </ListGroup.Item>
        </ListGroup> 
      </Card>
      </Col>
    </Row>
  );
};

export default CartScreen;
