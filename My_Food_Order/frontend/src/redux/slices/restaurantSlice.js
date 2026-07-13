import {createSlice} from "@reduxjs/toolkit"

//Intialstates
const initialState ={
    restaurants:[],
    count:0,
    loading:false,
    error:null,
    showVegOnly:false,
    pureVegRestaurantsCount:0,
    creating:false,
    createError:null,
    deleting:false,
    deleteError:null,
    updating:false,
    updateError:null
}

const restaurantSlice= createSlice({
    name:"restaurants",
    initialState,
    reducers:
    {
        //get
        getRestaurantsRequest:(state)=>{
            state.loading =true
        },
        getRestaurantsSuccess:(state,action)=>{
            state.loading=false // stop loading,
            state.restaurants = action.payload.restaurants, //store restaurants list
            state.count = action.payload.count;
        },
        getRestaurantsFail:(state,action)=>{
            state.loading=false,
            state.error = action.payload
        },

        //create
        createRestaurantRequest:(state)=>{
            state.creating=true
        },
        createRestaurantSuccess:(state,action)=>{
            state.creating=false,
            state.restaurants.push(action.payload),
            state.count += 1
        },
        createRestaurantFail:(state,action)=>{
            state.creating=false,
            state.createError = action.payload
        },

        //delete
        deleteRestaurantRequest:(state)=>{
            state.deleting=true
        },
        deleteRestaurantSuccess:(state,action)=>{
            state.deleting=false,
            state.restaurants = state.restaurants.filter(
                (restaurant) => restaurant._id !== action.payload
            )
            state.count -= 1

        },
        deleteRestaurantFail:(state,action)=>{
            state.deleting=false,
            state.deleteError = action.payload
        },

        //update
        updateRestaurantRequest:(state)=>{
            state.updating=true
        },
        updateRestaurantSuccess:(state,action)=>{
            state.updating=false,
            state.restaurants = state.restaurants.map((restaurant) =>
                restaurant._id === action.payload._id ? action.payload : restaurant
            );
        },
        updateRestaurantFail:(state,action)=>{
            state.updating=false,
            state.updateError = action.payload
        },

        //sort by ratings
        sortByRatings:(state)=>{
            state.restaurants.sort((a,b)=> b.ratings- a.ratings)
        },

        //sort by reviews
        sortByReviews:(state)=>{
         state.restaurants.sort((a,b)=> b.numOfReviews - a.numOfReviews)
        },

        //toggle
        toggleVegOnly:(state)=>{
               state.showVegOnly = !state.showVegOnly
        },
        clearError:(state)=>{
          state.error= null
        }

    }
})

export const {
    getRestaurantsRequest,
    getRestaurantsSuccess,
    getRestaurantsFail,

    createRestaurantRequest,
    createRestaurantSuccess,
    createRestaurantFail,

    deleteRestaurantRequest,
    deleteRestaurantSuccess,
    deleteRestaurantFail,

    updateRestaurantRequest,
    updateRestaurantSuccess,
    updateRestaurantFail,

    sortByRatings,
    sortByReviews,
    toggleVegOnly,
    clearError
} =restaurantSlice.actions
export default restaurantSlice.reducer
