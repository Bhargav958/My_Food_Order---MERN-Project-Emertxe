import React, { useState } from "react";
import { Link } from "react-router-dom";


const Restaurant = ({ restaurant }) => {
  const [showAI, setShowAI] = useState(false);

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
    <div className="card restaurant-card p-3">

  <Link to={`/eats/stores/${restaurant._id}/menus`}>
    <img
      className="restaurant-image"
      src={restaurant.images?.[0]?.url}
      alt={restaurant.name}
    />
  </Link>

  <div className="restaurant-info">

    <h4>{restaurant.name}</h4>

    <p className="rest_address">
      {restaurant.address}
    </p>

    <div className="ratings">
      <div className="rating-outer">
        <div
          className="rating-inner"
          style={{
            width: `${(restaurant.ratings / 5) * 100}%`,
          }}
        ></div>
      </div>

      <span>
        ({restaurant.numOfReviews} Reviews)
      </span>
    </div>

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
