import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Search from "./Search";
import "../../App.css";
import { logout } from "../../redux/actions/userActions";

const Header = () => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <nav className="navbar row sticky-top app-navbar">
        {/* logo */}
        <div className="col-12 col-md-3">
          <Link to="/">
            <img
              src="/images/logo_n.jpeg"
              alt="DOOD logo"
              className="logo"
              onError={(event) => {
                event.currentTarget.src = "/images/logo.webp";
              }}
            />
          </Link>
        </div>

        {/* search bar and search icon */}

        <div className="col-12 col-md-6 mt-2 mt-md-0">
          <Routes>
            <Route path="/" element={<Search />} />
            <Route path="/eats/stores/search/:keyword" element={<Search />} />
          </Routes>
        </div>

        {/* Login */}
        <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
          {/* ml-> margin left (3unit from left) */}
          <Link to="/cart" style={{ textDecoration: "none" }}>
            <span className="ml-3" id="cart">
              Cart
            </span>
            <span className="ml-1" id="cart_count">
             {cartCount}
            </span>
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/orders/me" className="ml-3 text-white">
                {user?.name?.split(" ")[0] || "Orders"}
              </Link>
              <button
                type="button"
                className="btn btn-link text-white ml-2"
                onClick={() => dispatch(logout())}
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/users/login" className="material-symbols-outlined web_logo">
              account_circle
            </Link>
          )}            
        </div>
      </nav>
    </>
  );
};

export default Header;
