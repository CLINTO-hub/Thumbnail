import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
  apikey: null,
  thumbnails: [],
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.apikey = action.payload.apikey;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.apikey = null;
    },
    setThumbnails: (state, action) => {
        state.thumbnails = action.payload; 
      },
  },
});


export const { login, logout,setThumbnails } = authSlice.actions;
export default authSlice.reducer;
