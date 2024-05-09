
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchStocksData } from "../service/selectstockAPI";
import { fetchStocksPrice as fetchStocksPriceAPI } from "../service/stockpriceAPI"; // 重命名以避免冲突
// import { StockData } from "../pages/TradeArea";

export type Stock = {
  Code: string;
  Name: string;
  Trading: string;
  ETF: boolean;
};

interface StocksState {
  data: Stock[];
  prices?: any[];
  status: "idle" | "loading" | "succeeded" | "failed";
  pricesStatus?: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: StocksState = {
  data: [],
  prices: [],
  status: "idle",
  pricesStatus: "idle",
};

export const fetchStocks = createAsyncThunk("stocks/fetchStocks", async () => {
  return await fetchStocksData();
});

export const fetchStocksPrice = createAsyncThunk(
  "stocks/fetchStocksPrice",
  async (stockId: string) => {
    return await fetchStocksPriceAPI(stockId); // 调用修改后的 API 函数
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
      .addCase(fetchStocks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchStocks.rejected, (state) => {
        state.status = "failed";
      })
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

export default stocksSlice.reducer;
