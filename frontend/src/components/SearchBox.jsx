import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searched, setSearched] = useState(false);  // track if search happened
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();

    const trimmed = searchTerm.trim();

    if (trimmed) {
      navigate(`/search/${trimmed}/page/1`);
      setSearched(true);  // mark that a search was submitted
    } else {
      navigate('/');
      setSearched(false);
    }
  };

  const goBack = () => {
    setSearchTerm('');
    setSearched(false);   // reset search status
    navigate(-1);
  };

  return (
    <Form onSubmit={submitHandler} className="my-3">
      <Row className="g-2 align-items-center">
        <Col xs={12} md={6} lg={8}>
          <Form.Control
            type="text"
            name="q"
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Products..."
            value={searchTerm}
          />
        </Col>

        <Col xs="auto">
          <Button type="submit" variant="primary">
            Search
          </Button>
        </Col>

        {searched && (
          <Col xs="auto">
            <Button
              type="button"
              variant="outline-dark"
              onClick={goBack}
            >
              Go Back
            </Button>
          </Col>
        )}
      </Row>
    </Form>
  );
};

export default SearchBar;
