// vipSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../assets/apiurl';

interface VIPState {
  vip: boolean;
  status: 'idle' | 'loading' | 'failed';
  message: string;
}

const initialState: VIPState = {
  vip: false,
  status: 'idle',
  message: '',
};

export const toggleVIPStatus = createAsyncThunk(
  'vip/toggleVIPStatus',
  async ({ username, vip_code }: { username: string; vip_code: string }) => {
    const response = await fetch(`${API_BASE_URL}/api/addvip`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, vip_code }),
    });
    const data = await response.json();
    if (response.ok) {
      return { vip: data.message.includes("valid"), message: data.message };
    } else {
      throw new Error(data.message);
    }
  }
);

const vipSlice = createSlice({
  name: 'vip',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(toggleVIPStatus.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(toggleVIPStatus.fulfilled, (state, action) => {
        state.status = 'idle';
        state.vip = action.payload.vip;
        state.message = action.payload.message;
      })
      .addCase(toggleVIPStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.message = action.error.message || 'Failed to update status.';
      });
  },
});

export default vipSlice.reducer;
