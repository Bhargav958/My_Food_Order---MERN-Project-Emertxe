import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../redux/actions/userActions";
import Message from "./Message";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get("redirect") || "/";

  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirect);
    }
  }, [isAuthenticated, navigate, redirect]);

  const submitHandler = (event) => {
    event.preventDefault();
    dispatch(signup({ name, email, phoneNumber, password, passwordConfirm }));
  };

  return (
    <div className="wrapper">
      <form className="shadow-lg bg-white rounded" onSubmit={submitHandler}>
        <h2 className="mb-4">Create Account</h2>
        {error && <Message variant="danger">{error}</Message>}

        <div className="form-group">
          <label htmlFor="name_field">Name</label>
          <input
            type="text"
            id="name_field"
            className="form-control"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email_field">Email</label>
          <input
            type="email"
            id="email_field"
            className="form-control"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone_field">Phone</label>
          <input
            type="tel"
            id="phone_field"
            className="form-control"
            value={phoneNumber}
            onChange={(event) => setPhoneNumber(event.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password_field">Password</label>
          <input
            type="password"
            id="password_field"
            className="form-control"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirm_password_field">Confirm Password</label>
          <input
            type="password"
            id="confirm_password_field"
            className="form-control"
            value={passwordConfirm}
            onChange={(event) => setPasswordConfirm(event.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-block py-3" disabled={loading}>
          {loading ? "Creating..." : "Sign Up"}
        </button>

        <Link to={`/users/login?redirect=${redirect}`} className="float-right mt-3">
          Already registered?
        </Link>
      </form>
    </div>
  );
};

export default Signup;
