import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "./authService";

export const login = createAsyncThunk(
  'auth/login',
  async (user, thunkAPI) => {
    try {
      return await authService.loginUser(user);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const userFromStorage = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

const initialState = {
  user: userFromStorage,
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('user');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'success';
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
