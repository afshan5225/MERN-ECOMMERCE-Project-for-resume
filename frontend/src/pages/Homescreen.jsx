import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Products from '../components/Products.jsx';
import { useGetProductsQuery } from '../slices/productsApiSlice.js';
import Loader from '../components/Loader.jsx';
import Message from '../components/Message.jsx';
import { useParams } from 'react-router-dom';
import Paginate from '../components/Paginate.jsx';
import ProductCarousel from '../components/ProductCarousal.jsx';



const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();

  const { data, isLoading, isError, error } = useGetProductsQuery({
    pageNumber,
    keyword,
  });

  return (
    <>
      {/* ✅ Show Carousel when not searching */}
      {!keyword && <ProductCarousel />}



      <h1>Latest Products</h1>

      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {error?.data?.message || error?.error || 'Something went wrong!'}
        </Message>
      ) : data && data.products && data.products.length > 0 ? (
        <>
          <Row>
            {data.products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={3}>
                <Products product={product} />
              </Col>
            ))}
          </Row>

          <Paginate
            pages={data.pages}
            page={data.page}
            isAdmin={false}
            keyword={keyword ? keyword : ''}
          />
        </>
      ) : (
        <Message variant="info">No products found.</Message>
      )}
    </>
  );
};

export default HomeScreen;
