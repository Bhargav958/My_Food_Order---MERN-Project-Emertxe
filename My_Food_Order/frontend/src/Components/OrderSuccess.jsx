import React, { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from "../redux/actions/orderActions";
import Loader from "./layout/Loader";
import Message from "./Message";

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const sessionId = searchParams.get("session_id");
  const { cartItems, restaurant } = useSelector((state) => state.cart);
  const { loading, error, order, success } = useSelector((state) => state.orders);

  useEffect(() => {
    if (sessionId && cartItems.length > 0 && !success) {
      dispatch(createOrder({ sessionId, cartItems, restaurant }));
    }
  }, [cartItems, dispatch, restaurant, sessionId, success]);

  // useEffect(() => {
  //   if (!sessionId || success) return;

  //   dispatch(
  //     createOrder({
  //       sessionId,
  //       cartItems,
  //       restaurant,
  //    })
  //   );
  // }, [dispatch, sessionId, success]);

  console.log(
  "loading:",
  loading,
  "success:",
  success,
  "order:",
  order
);

  if (loading) {
    return <Loader />;
  }

useEffect(() => {
  console.log("OrderSuccess mounted");
}, []);

  return (
    <div className="container mt-5 text-center bg-white rounded p-5">
      {error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <svg className="checkmark" viewBox="0 0 96 96">
            <circle className="checkmark__circle" cx="48" cy="48" r="45" />
            <path className="checkmark__check" fill="none" d="M26 50 l15 15 l30 -35" />
          </svg>
          <h2>Order Placed</h2>
          <p className="mt-3">
            {order?._id ? `Order ID: ${order._id}` : "Your payment was successful."}
          </p>
          <Link to="/orders/me" className="btn btn-primary mt-4" id="view_order_details">
            View Orders
          </Link>
        </>
      )}
    </div>
  );
};

export default OrderSuccess;
