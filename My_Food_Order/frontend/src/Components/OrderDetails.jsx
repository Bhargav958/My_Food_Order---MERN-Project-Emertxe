import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getOrderDetails } from "../redux/actions/orderActions";
import Loader from "./layout/Loader";
import Message from "./Message";

const OrderDetails = () => {
  const { id } = useParams();

  const dispatch = useDispatch();

  const { order, loading, error } = useSelector(
    (state) => state.orders
  );

  useEffect(() => {
    dispatch(getOrderDetails(id));
  }, [dispatch, id]);

  if (loading) return <Loader />;
  if (error) return <Message variant="danger">{error}</Message>;
  if (!order) return null;

  return (
    <div className="container mt-4 bg-white rounded p-4">

      <h2>Order Details</h2>

      <hr />

      <h5>Order ID</h5>
      <p>{order._id}</p>

      <h5>Restaurant</h5>
      <p>{order.restaurant?.name}</p>

      <h5>Customer</h5>
      <p>{order.user?.name}</p>

      <h5>Email</h5>
      <p>{order.user?.email}</p>

      <h5>Delivery Address</h5>
      <p>
        {order.deliveryInfo?.address}
        <br />
        {order.deliveryInfo?.city}
      </p>

      <h5>Payment Status</h5>

      <span
        className={`badge ${
          order.paymentInfo?.status === "paid"
            ? "bg-success"
            : "bg-warning"
        }`}
      >
        {order.paymentInfo?.status}
      </span>

      <hr />

      <h4>Items</h4>

      {order.orderItems?.map((item) => (
        <div
          key={item._id}
          className="d-flex align-items-center border rounded p-2 mb-3"
        >
          <img
            src={item.image}
            alt={item.name}
            width="80"
            className="me-3"
          />

          <div className="flex-grow-1">
            <h5>{item.name}</h5>

            Qty : {item.quantity}

            <br />

            ₹{item.price}
          </div>
        </div>
      ))}

      <hr />

      <h5>Items Price : ₹{order.itemsPrice}</h5>

      <h5>Delivery : ₹{order.deliveryCharge}</h5>

      <h4>Total : ₹{order.finalTotal}</h4>

    </div>
  );
};

export default OrderDetails;