import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIndianRupeeSign } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import {
  addItemToCart,
  deleteCartItem,
  updateCartItemQuantity,
} from "../redux/actions/cartActions";

const Fooditem = ({ fooditem, restaurant }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [showButtons, setShowButtons] = useState(false);

  const addToCartHandler = () => {
    dispatch(addItemToCart({ fooditem, quantity: 1, restaurant }));
    setShowButtons(true);
    setQuantity(1);
  };

  const increaseQty = () => {
    if (quantity < fooditem.stock) {
      const nextQuantity = quantity + 1;
      setQuantity(nextQuantity);
      dispatch(
        updateCartItemQuantity({
          foodItemId: fooditem._id,
          quantity: nextQuantity,
        })
      );
    }
  };

  const decreaseQty = () => {
    if (quantity > 1) {
      const nextQuantity = quantity - 1;
      setQuantity(nextQuantity);
      dispatch(
        updateCartItemQuantity({
          foodItemId: fooditem._id,
          quantity: nextQuantity,
        })
      );
    } else {
      dispatch(deleteCartItem(fooditem._id));
      setShowButtons(false);
      setQuantity(1);
    }
  };

  return (
    <div className="col-sm-12 col-md-6 col-lg-3 my-3">
      <div className="card p-3 rounded">
        <img
          className="card-img-top mx-auto food-image"
          src={fooditem.images?.[0]?.url || "/images/placeholder.png"}
          alt={fooditem.name}
        />

        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{fooditem.name}</h5>

          <p className="fooditem_des">{fooditem.description}</p>

          <p className="card-text">
            <FontAwesomeIcon icon={faIndianRupeeSign} size="xs" />
            {fooditem.price}
          </p>

          {/*BUTTON LOGIC */}
          {!showButtons ? (
            <button
              type="button"
              id="cart_btn"
              className="btn btn-primary mt-2"
              disabled={fooditem.stock === 0}
              onClick={addToCartHandler}
            >
              Add to Cart
            </button>
          ) : (
            <div className="stockCounter d-flex align-items-center mt-2">
              <button
                className="btn btn-danger"
                onClick={decreaseQty}
              >
                -
              </button>

              <input
                type="number"
                className="form-control text-center mx-2"
                value={quantity}
                readOnly
                style={{ width: "60px" }}
              />

              <button
                className="btn btn-primary"
                onClick={increaseQty}
              >
                +
              </button>
            </div>
          )}

          <hr />

          <p>
            Status:{" "}
            <span
              className={
                fooditem.stock > 0 ? "greenColor" : "redColor"
              }
            >
              {fooditem.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Fooditem;
