import React, { useEffect } from "react";
import {
  sortByRatings,
  sortByReviews,
  toggleVegOnly,
} from "../redux/slices/restaurantSlice";
import { getRestaurants } from "../redux/actions/restaurantAction";

import Restaurant from "./Restaurant";
import Loader from "./layout/Loader";
import Message from "./Message";
import { useDispatch, useSelector } from "react-redux";
// import CountRestaurant from "./CountRestaurant";
import { useParams } from "react-router-dom";

const Home = () => {
  const dispatch = useDispatch();
  const { keyword } = useParams();

  const {
    restaurants,
    loading: restaurantsLoading,
    error: restaurantsError,
    showVegOnly,
  } = useSelector((state) => state.restaurants);

  useEffect(() => {
    dispatch(getRestaurants(keyword));
  }, [dispatch, keyword]);

  const handleSortByRatings = () => {
    dispatch(sortByRatings());
  };

  const handleSortByReviews = () => {
    dispatch(sortByReviews());
  };

  const handleToggleVegOnly = () => {
    dispatch(toggleVegOnly());
  };
  return (
    <>
      {/* <CountRestaurant /> */}

      {restaurantsLoading ? (
        <Loader />
      ) : restaurantsError ? (
        <Message variant="danger">{restaurantsError}</Message>
      ) : (
        <>
          <section className="home-section">
            <div className="hero-section">
              <h1>🍔 <span>Delicious Food</span> Delivered Fast</h1>
              <p>Order from your favorite restaurants in minutes.</p>
            </div>

            {/* SORT BUTTONS */}
            <div className="sort">
              <button
                className={`sort_veg filter-chip${showVegOnly ? " active" : ""}`}
                onClick={handleToggleVegOnly}
              >
                {showVegOnly ? "🍽 Show All" : "🍃 Veg"}
              </button>

              <button className="sort_rev filter-chip" onClick={handleSortByReviews}>
                🔥 Popular
              </button>

              <button className="sort_rate filter-chip" onClick={handleSortByRatings}>
                ⭐ Top Rated
              </button>

              <button className="filter-chip" type="button">
                💰 Budget
              </button>
            </div>

            {/* RESTAURANTS */}
          <div className="row mt-4 restaurant-list">
    {restaurants?.filter((restaurant) => !showVegOnly || restaurant.isVeg).length > 0 ? (
    restaurants
      .filter((restaurant) => !showVegOnly || restaurant.isVeg)
      .map((restaurant) => (
        <Restaurant key={restaurant._id} restaurant={restaurant} />
      ))
  ) : (
    <Message variant="info">No restaurants Found.</Message>
  )}
</div>
          </section>
        </>
      )}
    </>
  );
};

export default Home;
