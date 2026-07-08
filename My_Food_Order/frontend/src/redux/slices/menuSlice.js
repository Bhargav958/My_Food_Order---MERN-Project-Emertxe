import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  menus: [],
  menuId: null,
  loading: false,
  error: null,
};

const menuSlice = createSlice({
  name: "menus",
  initialState,
  reducers: {
    getMenusRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getMenusSuccess: (state, action) => {
      state.loading = false;
      state.menus = action.payload.menus;
      state.menuId = action.payload.menuId;
    },
    getMenusFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearMenuErrors: (state) => {
      state.error = null;
    },
  },
});

export const {
  getMenusRequest,
  getMenusSuccess,
  getMenusFail,
  clearMenuErrors,
} = menuSlice.actions;

export default menuSlice.reducer;
