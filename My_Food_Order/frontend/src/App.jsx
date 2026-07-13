import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { loadUser } from "./redux/actions/userActions";
import "react-toastify/dist/ReactToastify.css";
import Home from "./Components/Home";
import Header from "./Components/layout/Header";
import Footer from "./Components/layout/Footer";
import Menu from "./Components/Menu";
import Cart from "./Components/Cart";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import OrderSuccess from "./Components/OrderSuccess";
import MyOrders from "./Components/MyOrders";
import Profile from "./Components/Profile";
import OrderDetails from "./Components/OrderDetails";
import ScrollToTopButton from "./Components/layout/ScrollToTopButton";
import RestaurantForm from "./Components/RestaurantForm";
import FoodItemForm from "./Components/FoodItemForm";
import ScrollToTop from "./Components/layout/ScrollToTop";



function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      dispatch(loadUser());
    }
  }, [dispatch]);

  return (
    <>
      <ToastContainer />
      <Router>
        <ScrollToTop />
        <div className="App">
          <Header />
          <div className="container container-fluids">
            <Routes>
              <Route path="/" element={<Home />} exact />
              <Route
                path="/eats/stores/search/:keyword"
                element={<Home />}
                exact
              />
              <Route path="/eats/stores/:id/menus" element={<Menu />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/users/login" element={<Login />} />
              <Route path="/users/signup" element={<Signup />} />
              <Route path="/success" element={<OrderSuccess />} />
              <Route path="/orders/me" element={<MyOrders />} />
              <Route path="/profile" element={<Profile />}/>
              <Route path="/orders/:id" element={<OrderDetails />} />
              <Route path="/admin/restaurant/new" element={<RestaurantForm />} />
              <Route path="/admin/restaurant/edit/:id" element={<RestaurantForm />} />
              <Route path="/admin/restaurant/:id/menu/new-item" element={<FoodItemForm />} />
              <Route path="/admin/restaurant/:id/menu/edit-item/:foodId" element={<FoodItemForm />} />
            </Routes>
          </div>
          <ScrollToTopButton />
          <Footer />
        </div>
      </Router>
    </>
  );
}

export default App;
