import { createSlice } from "@reduxjs/toolkit";

const cartFromStorage = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : { cartItems: [], restaurant: null };

const saveCart = (state) => {
  localStorage.setItem(
    "cart",
    JSON.stringify({
      cartItems: state.cartItems,
      restaurant: state.restaurant,
    })
  );
};

const initialState = {
  cartItems: cartFromStorage.cartItems || [],
  restaurant: cartFromStorage.restaurant || null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { fooditem, quantity, restaurant } = action.payload;

      if (state.restaurant && state.restaurant !== restaurant) {
        state.cartItems = [];
      }

      state.restaurant = restaurant;

      const existingItem = state.cartItems.find(
        (item) => item.fooditem._id === fooditem._id
      );

      if (existingItem) {
        existingItem.quantity = Math.min(
          (fooditem.stock || 1),
          existingItem.quantity + quantity
        );
      } else {
        state.cartItems.push({ fooditem, quantity });
      }

      saveCart(state);
    },
    updateCartQuantity: (state, action) => {
      const { foodItemId, quantity } = action.payload;
      const item = state.cartItems.find(
        (cartItem) => cartItem.fooditem._id === foodItemId
      );

      if (item) {
        item.quantity = Math.min(item.fooditem.stock || 1, Math.max(1, quantity));
      }

      saveCart(state);
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.fooditem._id !== action.payload
      );

      if (state.cartItems.length === 0) {
        state.restaurant = null;
      }

      saveCart(state);
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.restaurant = null;
      saveCart(state);
    },
  },
});

export const {
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
