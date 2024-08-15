import { API_BASE_URL } from '../assets/apiurl';
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface StocksPriceState {
  prices?: any[];
  pricesStatus: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: StocksPriceState = {
  prices: [],
  pricesStatus: "idle",
};

export const fetchStocksPrice = createAsyncThunk(
  "stocksPrice/fetchStocksPrice",
  async (stockId: string) => {
    const url = `${API_BASE_URL}/api/stockprice`;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: stockId })
    };

    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error('Failed to fetch stocks data');
    }
    return response.json();
  }
);

const stocksPriceSlice = createSlice({
  name: "stocksPrice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStocksPrice.pending, (state) => {
        state.pricesStatus = "loading";
      })
      .addCase(fetchStocksPrice.fulfilled, (state, action) => {
        state.pricesStatus = "succeeded";
        state.prices = action.payload;
      })
      .addCase(fetchStocksPrice.rejected, (state) => {
        state.pricesStatus = "failed";
      });
  },
});

export default stocksPriceSlice.reducer;

