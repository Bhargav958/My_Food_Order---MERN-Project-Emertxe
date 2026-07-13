import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteRestaurant } from "../redux/actions/restaurantAction";


const Restaurant = ({ restaurant }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth || {});
  const [showAI, setShowAI] = useState(false);
  const rating = Number(restaurant.ratings || 0).toFixed(1);
  const reviewCount = restaurant.numOfReviews || 0;
  const deliveryTime = restaurant.deliveryTime || restaurant.timeToDeliver || "30-35 mins";
  const deliveryFee =
    restaurant.deliveryFee === 0 || restaurant.freeDelivery
      ? "Free Delivery"
      : restaurant.deliveryFee
        ? `₹${restaurant.deliveryFee} Delivery`
        : "Free Delivery";
  const location =
    [restaurant.area, restaurant.city].filter(Boolean).join(", ") ||
    restaurant.address
      ?.split(",")
      .map((part) => part.trim())
      .filter(Boolean)
      .slice(-2)
      .join(", ");

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this restaurant?")) {
      dispatch(deleteRestaurant(restaurant._id));
    }
  };

  return (
    <div className="col-12 my-3">
    <div className="restaurant-card">

  <Link to={`/eats/stores/${restaurant._id}/menus`} className="restaurant-image-link">
    <img
      className="restaurant-image"
      src={restaurant.images?.[0]?.url || "/images/template.jpeg"}
      alt={restaurant.name}
    />
  </Link>

  <div className="restaurant-info">

    <h4 className="restaurant-name">{restaurant.name}</h4>

    <div className="restaurant-meta">
      <span className="rating-pill">⭐ {rating}</span>
      <span className="meta-separator">•</span>
      <span>{reviewCount} Reviews</span>
    </div>

    <div className="restaurant-delivery">
      <span className="delivery-time">🟢 {deliveryTime}</span>
      <span className="meta-separator">•</span>
      <span className="delivery-fee">🛵 {deliveryFee}</span>
    </div>

    {location && (
      <p className="rest_address">
        📍 {location}
      </p>
    )}

    {user?.role === "admin" && (
      <div className="admin-actions mt-2 mb-3">
        <Link to={`/admin/restaurant/edit/${restaurant._id}`} className="btn btn-warning btn-sm me-2" style={{ marginRight: "10px" }}>
          ✏️ Edit
        </Link>
        <button className="btn btn-danger btn-sm" onClick={handleDelete}>
          🗑️ Delete
        </button>
      </div>
    )}

    {restaurant.reviewSentiment && (
  <>


    <button
      className="ai-btn"
      onClick={() => setShowAI(!showAI)}
    >
      {showAI
        ? "➖ Hide Summary"
        : "💬 View Review Summary"}
    </button>

  
  </>
)}

  </div>

    {showAI && (
      <div className="ai-insights-box">

      <div className="ai-status">
      Review Summary : 
          😊 <strong>
            {restaurant.reviewSentiment}
          </strong>
       
        </div>

        <ul>
          {(restaurant.reviewSummaryBullets || []).map(
            (point, index) => (
              <li key={index}>{point}</li>
            )
          )}
        </ul>

        <div className="mentions">
          {(restaurant.reviewTopMentions || []).map(
            (item, index) => (
              <span
                key={index}
                className="mention-tag"
              >
                #{item}
              </span>
            )
          )}
        </div>

      </div>
    )}

</div>
    </div>
  );
};

export default Restaurant;
