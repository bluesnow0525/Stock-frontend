// features/assets/assetsSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchAssets = createAsyncThunk(
  'assets/fetchAssets',
  async (username: string) => {
    const response = await fetch(`http://localhost:5000/api/assets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    });
    if (!response.ok) {
      throw new Error('Failed to fetch assets');
    }
    return response.json();
  }
);

const assetsSlice = createSlice({
  name: 'assets',
  initialState: { assets: 0, status: 'idle' },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssets.fulfilled, (state, action) => {
        state.assets = action.payload.assets;
      });
  }
});

export default assetsSlice.reducer;
