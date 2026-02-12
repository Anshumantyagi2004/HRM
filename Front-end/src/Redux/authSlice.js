import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  userId: null,
  userRole: null,
  isAuthenticated: false,
  loading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.userId = action.payload.user.id || action.payload.user._id;
      state.userRole = action.payload.user.role;
      state.isAuthenticated = true;
      state.loading = false;
    },

    setUserFromSession: (state, action) => {
      state.user = action.payload.user;
      state.userId = action.payload.user._id;
      state.userRole = action.payload.user.role;
      state.isAuthenticated = true;
      state.loading = false;
    },

    logout: (state) => {
      state.user = null;
      state.userId = null;
      state.userRole = null;
      state.isAuthenticated = false;
      state.loading = false;
    },

    authLoading: (state) => {
      state.loading = true;
    },
  },
});

export const { loginSuccess, setUserFromSession, logout, authLoading } =
  authSlice.actions;

export default authSlice.reducer;
