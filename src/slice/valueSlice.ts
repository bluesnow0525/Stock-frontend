import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { API_BASE_URL } from "../assets/apiurl";
import CryptoJS from "crypto-js";

type v_info = {
    預期年化報酬率: string;
    高合理價: string;
    合理價: string;
    低合理價: string;
    長期評價: string;
    預估eps: string;
    淨值: string;
    殖利率: string;
    pb法估價: string;
    pe法估價: string;
    ddm法估價: string;
    de法估價: string;
    dcf法估價: string;
    peg法估價: string;
    成分股: string[];
};

export const fetchValueData = createAsyncThunk(
  "valueData/fetchValueData",
  async ({ username, id }: { username?: string; id: string }, { rejectWithValue }) => {
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

      const response = await fetch(`${API_BASE_URL}/api/value_default`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: encryptedUsername, nonce, id: id }),
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

const valueDataSlice = createSlice({
  name: "valueData",
  initialState: { v_info: null as v_info | null, status: "idle" },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchValueData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchValueData.fulfilled,
        (state, action: PayloadAction<v_info>) => {
          state.v_info = action.payload;
          state.status = "succeeded";
        }
      )
      .addCase(fetchValueData.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default valueDataSlice.reducer;
