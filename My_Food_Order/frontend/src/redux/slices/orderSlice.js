import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  paymentUrl: null,
  order: null,
  orders: [],
  loading: false,
  error: null,
  success: false,
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    orderRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    paymentSuccess: (state, action) => {
      state.loading = false;
      state.paymentUrl = action.payload;
    },
    createOrderSuccess: (state, action) => {
      state.loading = false;
      state.order = action.payload;
      state.success = true;
    },
    ordersSuccess: (state, action) => {
      state.loading = false;
      state.orders = action.payload;
    },
    orderDetailsSuccess: (state, action) => {
      state.loading = false;
      state.order = action.payload;
    },
    orderFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearOrderError: (state) => {
      state.error = null;
    },
    resetOrderSuccess: (state) => {
      state.success = false;
      state.paymentUrl = null;
    },
  },
});

export const {
  orderRequest,
  paymentSuccess,
  createOrderSuccess,
  ordersSuccess,
  orderDetailsSuccess,
  orderFail,
  clearOrderError,
  resetOrderSuccess,
} = orderSlice.actions;

export default orderSlice.reducer;
