import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyOrders } from "../redux/actions/orderActions";
import Loader from "./layout/Loader";
import Message from "./Message";
import { Link } from "react-router-dom";

const MyOrders = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(getMyOrders());
  }, [dispatch]);

  return (
    <div className="container mt-4 bg-white rounded p-4">
      <h2>My Orders</h2>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : orders.length === 0 ? (
        <Message variant="info">No orders found.</Message>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Order</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  {/* <td>{order._id}</td> */}
                  <td><Link to={`/orders/${order._id}`}> {order._id} </Link></td>
                  <td>{order.orderItems?.length || 0}</td>
                  <td>₹{order.finalTotal}</td>
                  <td>{order.orderStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
