import { API_BASE_URL } from '../assets/apiurl';
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export type Stock = {
  Code: string;
  Name: string;
  Category: string;
  Trading: string;
  ETF: boolean;
};

type StocksData = {
  all_stocks: Stock[];
};

interface StocksState {
  data: StocksData;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: StocksState = {
  data: {
    all_stocks: [],
  },
  status: "idle",
};

export const fetchStocks = createAsyncThunk(
  "stocks/fetchStocks", 
  async ({ username, type }: { username?: string; type: string }) => {
    const response = await fetch(`${API_BASE_URL}/api/stocks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, type })
    });
    if (!response.ok) {
        throw new Error('Failed to fetch stocks data');
    }
    return response.json();
  }
);

const stocksSlice = createSlice({
  name: "stocks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStocks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchStocks.fulfilled, (state, action: PayloadAction<StocksData>) => {
        state.data = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchStocks.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default stocksSlice.reducer;