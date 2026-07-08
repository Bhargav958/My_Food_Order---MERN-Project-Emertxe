import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIndianRupeeSign, faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  deleteCartItem,
  updateCartItemQuantity,
} from "../redux/actions/cartActions";
import { processPayment } from "../redux/actions/orderActions";
import Message from "./Message";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { loading: orderLoading, error: orderError } = useSelector((state) => state.orders);

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.quantity * item.fooditem.price,
    0
  );

  const increaseQty = (item) => {
    if (item.quantity < item.fooditem.stock) {
      dispatch(
        updateCartItemQuantity({
          foodItemId: item.fooditem._id,
          quantity: item.quantity + 1,
        })
      );
    }
  };

  const decreaseQty = (item) => {
    if (item.quantity > 1) {
      dispatch(
        updateCartItemQuantity({
          foodItemId: item.fooditem._id,
          quantity: item.quantity - 1,
        })
      );
    }
  };

  const checkoutHandler = () => {
    if (!isAuthenticated) {
      navigate("/users/login?redirect=/cart");
      return;
    }

    dispatch(processPayment(cartItems));
  };

  return (
    <div className="container mt-4 cartt p-4">
      <h2>Cart</h2>

      {cartItems.length === 0 ? (
        <Message variant="info">
          Your cart is empty. <Link to="/">Browse restaurants</Link>
        </Message>
      ) : (
        <div className="row">
          {orderError && (
            <div className="col-12">
              <Message variant="danger">{orderError}</Message>
            </div>
          )}
          <div className="col-12 col-lg-8">
            {cartItems.map((item) => (
              <div className="row cart-item align-items-center" key={item.fooditem._id}>
                <div className="col-4 col-md-2">
                  <img
                    src={item.fooditem.images?.[0]?.url || "/images/template.jpeg"}
                    alt={item.fooditem.name}
                    className="img-fluid rounded"
                  />
                </div>

                <div className="col-8 col-md-3">
                  <strong>{item.fooditem.name}</strong>
                </div>

                <div className="col-6 col-md-2 mt-3 mt-md-0" id="card_item_price">
                  <FontAwesomeIcon icon={faIndianRupeeSign} size="xs" />
                  {item.fooditem.price}
                </div>

                <div className="col-6 col-md-3 mt-3 mt-md-0">
                  <div className="stockCounter d-flex align-items-center">
                    <button className="btn btn-danger minus" onClick={() => decreaseQty(item)}>
                      -
                    </button>
                    <input
                      type="number"
                      className="form-control text-center mx-2"
                      value={item.quantity}
                      readOnly
                    />
                    <button className="btn btn-primary plus" onClick={() => increaseQty(item)}>
                      +
                    </button>
                  </div>
                </div>

                <div className="col-12 col-md-2 mt-3 mt-md-0 text-md-right">
                  <button
                    id="delete_cart_item"
                    onClick={() => dispatch(deleteCartItem(item.fooditem._id))}
                    aria-label={`Remove ${item.fooditem.name}`}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="col-12 col-lg-4">
            <div id="order_summary">
              <h4>Order Summary</h4>
              <hr />
              <p>
                Items
                <span className="order-summary-values">{totalItems}</span>
              </p>
              <p>
                Total
                <span className="order-summary-values">
                  <FontAwesomeIcon icon={faIndianRupeeSign} size="xs" />
                  {totalPrice}
                </span>
              </p>
              <button
                className="btn btn-block"
                id="checkout_btn"
                onClick={checkoutHandler}
                disabled={orderLoading}
              >
                {orderLoading ? "Processing..." : "Checkout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
