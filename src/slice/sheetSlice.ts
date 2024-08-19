import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { API_BASE_URL } from "../assets/apiurl";
import CryptoJS from "crypto-js";

export type FinancialData = {
  [key: string]:
    | [number | string | null, number | string | null]
    | [number | string | null];
};

interface SheetData {
  balance_sheet: FinancialData[];
  income_statement: FinancialData[];
  cash_flow: FinancialData[];
  dividend: FinancialData[];
  revenue: FinancialData[];
}

interface SheetDataState {
  data: SheetData | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: SheetDataState = {
  data: null,
  status: "idle",
  error: null,
};

export const fetchSheetData = createAsyncThunk(
  "sheetData/fetchSheetData",
  async (
    { username, id }: { username?: string; id: string },
    { rejectWithValue }
  ) => {
    try {
      const currentDate = new Date();
      let secretKey = currentDate.toISOString().slice(0, 13);

      // 确保密钥长度为16字节
      secretKey = secretKey.padEnd(16, "0"); // 用 '0' 填充到16字节

      const nonce = "1234567890123456"; // 固定 nonce

      // 使用 CBC 模式和固定 IV 加密用户名
      const encryptedUsername = CryptoJS.AES.encrypt(
        username,
        CryptoJS.enc.Utf8.parse(secretKey),
        {
          iv: CryptoJS.enc.Utf8.parse(nonce),
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        }
      ).toString();
      const response = await fetch(`${API_BASE_URL}/api/sheet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stockId:id, username: encryptedUsername, nonce }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data: SheetData = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue("Failed to fetch sheet data");
    }
  }
);

const sheetDataSlice = createSlice({
  name: "sheetData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSheetData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchSheetData.fulfilled,
        (state, action: PayloadAction<SheetData>) => {
          state.data = action.payload;
          state.status = "succeeded";
          state.error = null;
        }
      )
      .addCase(fetchSheetData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default sheetDataSlice.reducer;
