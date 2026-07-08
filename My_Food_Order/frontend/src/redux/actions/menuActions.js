import api from "../../utils/api";

import {
  getMenusRequest,
  getMenusSuccess,
  getMenusFail,
} from "../slices/menuSlice";

export const getMenus = (id) => async (dispatch) => {
  try {
    dispatch(getMenusRequest());

    const response = await api.get(`/v1/eats/stores/${id}/menus`);
    const data =
      typeof response.data === "string"
        ? JSON.parse(response.data)
        : response.data;
    const menuDoc = data.data?.[0];

    dispatch(
      getMenusSuccess({
        menus: menuDoc?.menu || [],
        menuId: menuDoc?._id || null,
      })
    );
  } catch (error) {
    dispatch(getMenusFail(error.response?.data?.message || error.message));
  }
};
