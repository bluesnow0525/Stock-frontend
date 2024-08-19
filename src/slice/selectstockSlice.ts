import { API_BASE_URL } from '../assets/apiurl';
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import CryptoJS from "crypto-js";

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
    const currentDate = new Date();
      let secretKey = currentDate.toISOString().slice(0, 13);

      // 确保密钥长度为16字节
      secretKey = secretKey.padEnd(16, '0');  // 用 '0' 填充到16字节

      const nonce = '1234567890123456';  // 固定 nonce

      // 使用 CBC 模式和固定 IV 加密用户名
      const encryptedUsername = CryptoJS.AES.encrypt(
        username,
        CryptoJS.enc.Utf8.parse(secretKey),
        { iv: CryptoJS.enc.Utf8.parse(nonce), mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
      ).toString();
    const response = await fetch(`${API_BASE_URL}/api/stocks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: encryptedUsername, nonce, type })
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