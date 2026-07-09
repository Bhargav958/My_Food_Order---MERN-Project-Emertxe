import React, { useState } from "react";
import { Link } from "react-router-dom";


const Restaurant = ({ restaurant }) => {
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

  // const { isAuthenticated, user } = useSelector(
  //   (state) => state.auth || {}
  // );

  // const handleDelete = () => {
  //   if (!window.confirm("Delete this restaurant?")) return;

  //   dispatch(deleteRestaurant(restaurant._id))
  //     .unwrap()
  //     .then(() => {
  //       // optional: refetch (not needed since we updated state already)
  //       // dispatch(getRestaurants());
  //     })
  //     .catch((err) => {
  //       alert(err || "Unable to delete");
  //     });
  // };

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
