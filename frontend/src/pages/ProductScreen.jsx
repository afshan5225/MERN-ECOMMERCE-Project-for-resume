import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap';
import { useCreateReviewMutation, useGetProductByIdQuery } from '../slices/productsApiSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../slices/cartSlice';
import { toast } from 'react-toastify';
import Rating from '../components/Ratings'; 

const ProductScreen = () => {
  const { id: productId } = useParams();
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: Product, isLoading, isError, error, refetch } = useGetProductByIdQuery(productId);
  const [createReview, { isLoading: isReviewLoading }] = useCreateReviewMutation();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
  document.title = Product?.name || "Product Details";
  }, [Product]);

  const addToCartHandler = () => {
    dispatch(addToCart({ ...Product, qty: Number(qty) }));
    navigate('/cart');
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();

      refetch();
      toast.success('Review submitted');
      setRating(0);
      setComment('');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      

      {isLoading ? (
        <Loader />
      ) : isError ? (
        <>
          <Message variant="danger">
            {error?.data?.message || error?.error || 'Something went wrong!'}
          </Message>
          <Link to="/" className="btn btn-primary mt-3">
            Go Back
          </Link>
        </>
      ) : !Product ? (
        <>
          <Message variant="warning">Product not found</Message>
          <Link to="/" className="btn btn-primary mt-3">
            Go Back
          </Link>
        </>
      ) : (
        <>
          <Link className="btn btn-light my-3" to="/">
            Go Back
          </Link>

          <Row>
            <Col md={5}>
              <Image src={Product.image} fluid />
            </Col>

            <Col md={4}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{Product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating value={Product.rating} text={`${Product.numReviews} reviews`} />
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Price: ${Product.price}</strong>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p>{Product.description}</p>
                </ListGroup.Item>
              </ListGroup>
            </Col>

            <Col md={3}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>Price: ${Product.price}</strong>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    Status: {Product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                  </ListGroup.Item>

                  {Product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Qty</Col>
                        <Col>
                          <Form.Control
                            as="select"
                            value={qty}
                            onChange={(e) => setQty(e.target.value)}
                          >
                            {[...Array(Product.countInStock).keys()].map((x) => (
                              <option key={x + 1} value={x + 1}>
                                {x + 1}
                              </option>
                            ))}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}

                  <ListGroup.Item>
                    <Button
                      className="btn-block w-100"
                      type="button"
                      disabled={Product.countInStock === 0}
                      onClick={addToCartHandler}
                    >
                      Add to Cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>

          <Row className="review mt-4">
            <Col md={6}>
              <h2>Reviews</h2>
              {Product.reviews.length === 0 && <Message>No reviews</Message>}
              <ListGroup variant="flush">
                {Product.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    {review.createdAt ? (
                      <p>{review.createdAt.substring(0, 10)}</p>
                    ) : (
                      <p>Date unavailable</p>
                    )}
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}

                <ListGroup.Item>
                  <h2>Write a review</h2>
                  {isReviewLoading && <Loader />}
                  {userInfo ? (
                    <Form onSubmit={submitHandler}>
                      <Form.Group controlId="rating" className="my-2">
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          as="select"
                          value={rating}
                          onChange={(e) => setRating(Number(e.target.value))}
                        >
                          <option value="">Select</option>
                          <option value="1">1 - Poor</option>
                          <option value="2">2 - Fair</option>
                          <option value="3">3 - Good</option>
                          <option value="4">4 - Very Good</option>
                          <option value="5">5 - Excellent</option>
                        </Form.Control>
                      </Form.Group>

                      <Form.Group controlId="comment" className="my-2">
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows="3"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        />
                      </Form.Group>

                      <Button
                        disabled={isReviewLoading}
                        type="submit"
                        variant="primary"
                      >
                        Submit
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      Please <Link to="/login">sign in</Link> to write a review
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProductScreen;
