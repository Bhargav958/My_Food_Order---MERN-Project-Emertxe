import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
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




function App() {


  return (
    <>
      <ToastContainer />
      <Router>
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

              
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </>
  );
}

export default App;
