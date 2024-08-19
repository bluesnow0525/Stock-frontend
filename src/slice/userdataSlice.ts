import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { API_BASE_URL } from "../assets/apiurl";
import CryptoJS from "crypto-js";

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
  "userData/fetchUserData",
  async (username: string, { rejectWithValue }) => {
    try {
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

      const response = await fetch(`${API_BASE_URL}/api/userdata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: encryptedUsername, nonce }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue("Failed to fetch user data");
    }
  }
);

const userDataSlice = createSlice({
  name: "userData",
  initialState: { data: null as UserData | null, status: "idle" },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchUserData.fulfilled,
        (state, action: PayloadAction<UserData>) => {
          state.data = action.payload;
          state.status = "succeeded";
        }
      )
      .addCase(fetchUserData.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default userDataSlice.reducer;
