import React from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetProductsQuery,
} from '../../slices/productsApiSlice';
import { Row, Button, Col, Table } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Paginate from '../../components/Paginate';


const ProductListScreen = () => {

    const {pageNumber} = useParams()
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useGetProductsQuery({pageNumber});



  const [deleteProduct, { isLoading: deletionLoading }] =
    useDeleteProductMutation();

  const [createProduct, { isLoading: creatingLoading }] =
    useCreateProductMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id).unwrap();
        toast.success('Product deleted');
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const createProductHandler = async () => {
    if (
      window.confirm('Are you sure you want to create a sample product?')
    ) {
      try {
        const createdProduct = await createProduct().unwrap();
        toast.success('Sample product created');
        console.log('Product created:', createdProduct);
        refetch();
        // Optional: navigate(`/admin/product/${createdProduct._id}/edit`);
      } catch (err) {
        toast.error(err?.data?.message || 'Failed to create product');
      }
    }
  };

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-end">
          <Button
            className="btn-sm m-3"
            onClick={createProductHandler}
            disabled={creatingLoading}
          >
            <FaEdit /> Create Product
          </Button>
        </Col>
      </Row>

      {/* 🔄 Show global loading or mutation loading */}
      {isLoading || creatingLoading || deletionLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Table striped hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <Button
                      variant="light"
                      className="btn-sm"
                      as={Link}
                      to={`/admin/product/${product._id}/edit`}
                    >
                      <FaEdit /> Edit
                    </Button>

                    <Button
                      variant="danger"
                      className="btn-sm ms-2"
                      onClick={() => deleteHandler(product._id)}
                      disabled={deletionLoading}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate page={data.page} pages={data.pages} isAdmin={true}/>
        </>
      )}
    </>
  );
};

export default ProductListScreen;
