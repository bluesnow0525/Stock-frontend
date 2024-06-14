// src/features/userData/userDataSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// import { RootState } from '../store';

type Stock = {
    stock_id: string;
    name: string;
    quantity: number;
    price_per_unit: number;
    recent_price: number;
};

type Transaction = {
    transaction_id: number;
    stock_id: string;
    transaction_type: string;
    quantity: number;
    price_per_unit: number;
    timestamp: string;
    sold_price: number;
    sold_timestamp: string;
    profit_loss: number;
};
type UserData = {
    assets: number;
    stocks: Stock[];
    transactions: Transaction[];
};

export const fetchUserData = createAsyncThunk(
  'userData/fetchUserData',
  async (username: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:5000/api/userdata?username=${username}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data: UserData = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue('Failed to fetch user data');
    }
  }
);

const userDataSlice = createSlice({
  name: 'userData',
  initialState: { data: null as UserData | null, status: 'idle' },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserData.fulfilled, (state, action: PayloadAction<UserData>) => {
        state.data = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchUserData.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export default userDataSlice.reducer;
