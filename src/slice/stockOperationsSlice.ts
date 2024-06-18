// features/stockOperations/stockOperationsSlice.ts
import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  ActionReducerMapBuilder,
} from "@reduxjs/toolkit";
import { API_BASE_URL } from "../assets/apiurl";

export const buyStock = createAsyncThunk(
  "stock/buyStock",
  async (
    {
      quantity,
      stockname,
      username,
      stockId,
    }: {
      quantity: number;
      stockname: string;
      username: string;
      stockId: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/buy_stock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, stockId, stockname, quantity }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to buy stock");
      }
      return data;
    } catch (error) {
      // 确保从后端返回的消息被传递
      return rejectWithValue((error as Error).message || "Failed to buy stock");
    }
  }
);

export const sellStock = createAsyncThunk(
  "stock/sellStock",
  async (
    {
      quantity,
      username,
      stockId,
    }: {
      quantity: number;
      username: string;
      stockId: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/sell_stock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, stockId, quantity }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to sell stock");
      }
      return data;
    } catch (error) {
      // 确保从后端返回的消息被传递
      return rejectWithValue((error as Error).message || "Failed to buy stock");
    }
  }
);

const stockOperationsSlice = createSlice({
  name: "stockOperations",
  initialState: { status: "idle", message: "" },
  reducers: {},
  extraReducers: (builder: ActionReducerMapBuilder<any>) => {
    builder
      .addCase(buyStock.pending, (state) => {
        state.status = "loading";
      })
      .addCase(buyStock.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = "succeeded";
        state.message = action.payload.message;
      })
      .addCase(buyStock.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(sellStock.pending, (state) => {
        state.status = "loading";
      })
      .addCase(sellStock.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = "succeeded";
        state.message = action.payload.message;
      })
      .addCase(sellStock.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default stockOperationsSlice.reducer;
