import api from "../../utils/api"

import{
    getRestaurantsRequest,
    getRestaurantsSuccess,
    getRestaurantsFail,

    createRestaurantRequest,
    createRestaurantSuccess,
    createRestaurantFail,

    deleteRestaurantRequest,
    deleteRestaurantSuccess,
    deleteRestaurantFail,

} from "../slices/restaurantSlice"

//get
export const getRestaurants =(keyword="") => async(dispatch) =>{
    try{
     dispatch(getRestaurantsRequest());
     const response = await api.get(`/v1/eats/stores?keyword=${keyword}`);
     const data =
        typeof response.data === "string"
          ? JSON.parse(response.data)
          : response.data;
     dispatch(getRestaurantsSuccess({
        restaurants:data.restaurant,
        count:data.count
     }))
    }catch(error){
      dispatch(getRestaurantsFail(error.response?.data?.message || error.message))
    }
}

//create
export const createRestaurant = (restaurantData) => async(dispatch)=>{
    try{
       dispatch(createRestaurantRequest())

       const {data} = await api.post("/v1/eats/stores", restaurantData);

       dispatch(createRestaurantSuccess(data.data));

    }
    catch(error){
     dispatch(createRestaurantFail(error.response?.data?.message || error.message))
    }
}

//delete
export const deleteRestaurant = (id) => async(dispatch)=>{
    try{
       dispatch(deleteRestaurantRequest())

      await api.delete(`/v1/eats/stores/${id}`);

       dispatch(deleteRestaurantSuccess(id));

    }
    catch(error){
     dispatch(deleteRestaurantFail(error.response?.data?.message || error.message))
    }
}
