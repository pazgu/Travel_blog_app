import { configureStore, createSlice } from "@reduxjs/toolkit";
/*
In this page I decided to use Redux reducers instaed of local state management with react hooks
in order to manage the state of the entire application in a single store,
which makes it easier to maintain and debug
*/
const authSlice = createSlice({ //creates a slice of the Redux store
  name: "authentication",
  initialState: { isLoggedIn: false },
  reducers: {
    login(stste) {
      stste.isLoggedIn = true;
    },
    logout(stste) {
      localStorage.removeItem("userId"); //so after logout the id of the user will be deleted from the local storage
      stste.isLoggedIn = false;
    }, //defining 2 reducers to handle login and logout actions
  },
});

export const authActions = authSlice.actions; //export the action creators

export const store = configureStore({ 
  reducer: authSlice.reducer, //export the reducer function from the slice
});
