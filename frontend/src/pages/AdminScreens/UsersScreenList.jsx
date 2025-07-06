import React from 'react';
import { Button, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useGetUsersQuery, useDeleteUserMutation } from '../../slices/userApiSlice';
import { FaCheck, FaEdit, FaTimes, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

const UsersScreenList = () => {
  const { data: users, isLoading, error, refetch } = useGetUsersQuery(); // ✅ include refetch
  const [deleteUser, { isLoading: deleting }] = useDeleteUserMutation(); // ✅ fix spelling

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteUser(id).unwrap(); // ✅ unwrap
        toast.success('User deleted successfully');
        refetch(); // ✅ refresh list
      } catch (error) {
        toast.error(error?.data?.message || error.error || 'Failed to delete user');
      }
    }
  };

  return (
    <>
      <h1>Users</h1>

      {isLoading || deleting ? ( // ✅ show loader if deleting or loading
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>
                <td className="text-center">
                  {user.isAdmin ? (
                    <FaCheck style={{ color: 'green' }} />
                  ) : (
                    <FaTimes style={{ color: 'red' }} />
                  )}
                </td>
                <td>
                  <Link to={`/admin/user/${user._id}/edit`}>
                    <Button variant="light" className="btn-sm">
                      <FaEdit /> Edit
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    className="btn-sm ms-2"
                    onClick={() => deleteHandler(user._id)}
                    disabled={deleting} // ✅ disable during delete
                  >
                    {deleting ? 'Deleting…' : <><FaTrash /> Delete</>}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default UsersScreenList;
