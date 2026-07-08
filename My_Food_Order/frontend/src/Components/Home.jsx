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
          <section>
            {/* SORT BUTTONS */}
            <div className="sort">
              <button className="sort_veg p-3" onClick={handleToggleVegOnly}>
                {showVegOnly ? "Show All" : "Pure Veg"}
              </button>

              <button className="sort_rev p-3" onClick={handleSortByReviews}>
                Sort By Reviews
              </button>

              <button className="sort_rate p-3" onClick={handleSortByRatings}>
                Sort By Ratings
              </button>
            </div>

            {/* RESTAURANTS */}
          <div className="row mt-4">
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
