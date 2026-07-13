import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIndianRupeeSign } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  addItemToCart,
  deleteCartItem,
  updateCartItemQuantity,
} from "../redux/actions/cartActions";
import { getMenus } from "../redux/actions/menuActions";
import api from "../utils/api";

const Fooditem = ({ fooditem, restaurant }) => {
  const { user } = useSelector((state) => state.auth || {});
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

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${fooditem.name}?`)) {
      try {
        await api.delete(`/v1/eats/item/${fooditem._id}`);
        toast.success("Food item deleted successfully");
        dispatch(getMenus(restaurant));
      } catch (err) {
        toast.error(err.response?.data?.message || err.message || "Failed to delete item");
      }
    }
  };

  return (
    <div className="col-sm-12 col-md-6 col-lg-4 mb-3">
      <div className="menu-card">
        <img
            className="menu-image"
            src={fooditem.images?.[0]?.url || "/images/template.jpeg"}
            alt={fooditem.name}
            onError={(e)=>{
                e.target.src="/images/template.jpeg";
            }}
        />

        <div className="menu-content">
          <h5 className="card-title">{fooditem.name}</h5>

          <p className="menu-description">{fooditem.description}</p>

          {/* <p className="card-text">
            <FontAwesomeIcon icon={faIndianRupeeSign} size="xs" />
            {fooditem.price}
          </p> */}

          <div className="price-stock-row">

            <span className="menu-price">
                ₹{fooditem.price}
            </span>

            <span className={fooditem.stock > 0 ? "stock-pill available" : "stock-pill unavailable"}>
                {fooditem.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>

          </div>

          {/*BUTTON LOGIC */}
          {!showButtons ? (
            <button
              type="button"
              id="cart_btn"
              className="btn btn-primary mt-2"
              disabled={fooditem.stock === 0}
              onClick={addToCartHandler}
            >
              🛒 Add
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

          {user?.role === "admin" && (
            <div className="admin-actions d-flex gap-2 mt-3 pt-2 border-top">
              <Link to={`/admin/restaurant/${restaurant}/menu/edit-item/${fooditem._id}`} className="btn btn-warning btn-sm me-2" style={{ marginRight: "10px" }}>
                ✏️ Edit Item
              </Link>
              <button className="btn btn-danger btn-sm" onClick={handleDelete}>
                🗑️ Delete Item
              </button>
            </div>
          )}

          {/* <hr />

          <p>
            Status:{" "}
            
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default Fooditem;
