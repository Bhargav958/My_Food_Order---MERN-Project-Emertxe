import {
  addToCart,
  updateCartQuantity,
  removeFromCart,
} from "../slices/cartSlice";

export const addItemToCart =
  ({ fooditem, quantity = 1, restaurant }) =>
  (dispatch) => {
    dispatch(addToCart({ fooditem, quantity, restaurant }));
  };

export const updateCartItemQuantity =
  ({ foodItemId, quantity }) =>
  (dispatch) => {
    dispatch(updateCartQuantity({ foodItemId, quantity }));
  };

export const deleteCartItem = (foodItemId) => (dispatch) => {
  dispatch(removeFromCart(foodItemId));
};
