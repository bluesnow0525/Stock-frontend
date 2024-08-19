import { API_BASE_URL } from '../assets/apiurl';
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import CryptoJS from "crypto-js";

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
  async ({ username, id }: { username?: string; id: string }) => {
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
    const url = `${API_BASE_URL}/api/stockprice`;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: encryptedUsername, nonce, id: id })
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

