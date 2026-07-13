import api from "../../utils/api";
import {
  orderRequest,
  paymentSuccess,
  createOrderSuccess,
  ordersSuccess,
  orderFail,
  orderDetailsSuccess
} from "../slices/orderSlice";
import { clearCart } from "../slices/cartSlice";


const toApiItems = (cartItems) =>
  cartItems.map((item) => ({
    foodItem: item.fooditem,
    fooditem: item.fooditem,
    quantity: item.quantity,
  }));

export const processPayment = (cartItems) => async (dispatch) => {
  try {
    dispatch(orderRequest());

    const { data } = await api.post("/v1/payment/process", {
      items: toApiItems(cartItems),
    });

    dispatch(paymentSuccess(data.url));
    window.location.href = data.url;
  } catch (error) {
    dispatch(orderFail(error.response?.data?.message || error.message));
  }
};

export const createOrder =({ sessionId, cartItems, restaurant }) =>
  async (dispatch) => {
    try {
      dispatch(orderRequest());

      const { data } = await api.post("/v1/eats/orders/new", {
        session_id: sessionId,
        items: toApiItems(cartItems),
        restaurant,
      });

      dispatch(createOrderSuccess(data.order));
      dispatch(clearCart());

      return data.order;   // <-- ADD THIS
    } catch (error) {
      dispatch(orderFail(error.response?.data?.message || error.message));
      throw error;         // <-- ADD THIS
    }
  };

export const getMyOrders = () => async (dispatch) => {
  try {
    dispatch(orderRequest());

    const { data } = await api.get("/v1/eats/orders/me/myOrders");
    dispatch(ordersSuccess(data.orders));
  } catch (error) {
    dispatch(orderFail(error.response?.data?.message || error.message));
  }
};

export const getOrderDetails = (id) => async (dispatch) => {
  try {
    dispatch(orderRequest());

    const { data } = await api.get(`/v1/eats/orders/${id}`);

    dispatch(orderDetailsSuccess(data.order));
  } catch (error) {
    dispatch(orderFail(error.response?.data?.message || error.message));
  }
};