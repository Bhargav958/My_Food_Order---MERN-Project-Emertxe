import api from "../../utils/api";
import {
  authRequest,
  authSuccess,
  authFail,
  profileSuccess,
  logoutSuccess,
} from "../slices/userSlice";

const persistAuth = ({ token, data }) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(data.user));
};

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch(authRequest());

    const { data } = await api.post("/v1/users/login", { email, password });
    persistAuth(data);
    dispatch(authSuccess({ token: data.token, user: data.data.user }));
  } catch (error) {
    dispatch(authFail(error.response?.data?.message || error.message));
  }
};

export const signup = (userData) => async (dispatch) => {
  try {
    dispatch(authRequest());

    const { data } = await api.post("/v1/users/signup", userData);
    persistAuth(data);
    dispatch(authSuccess({ token: data.token, user: data.data.user }));
  } catch (error) {
    dispatch(authFail(error.response?.data?.message || error.message));
  }
};

export const loadUser = () => async (dispatch) => {
  try {
    dispatch(authRequest());

    const { data } = await api.get("/v1/users/me");
    localStorage.setItem("user", JSON.stringify(data.user));
    dispatch(profileSuccess(data.user));
  } catch (error) {
    dispatch(authFail(error.response?.data?.message || error.message));
  }
};

export const logout = () => async (dispatch) => {
  try {
    await api.get("/v1/users/logout");
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(logoutSuccess());
  }
};
