import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ImageInfo {
  評價: string;
  評價分數: number;
  準確率: string;
  回測報酬: number,
}

interface ImageState {
  imageUrl: string;
  info: ImageInfo;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ImageState = {
  imageUrl: '',
  info: {
    評價: '',
    評價分數: 0,
    準確率: '',
    回測報酬: 0,
  },
  status: 'idle',
  error: null,
};

const imageSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    fetchStart(state) {
      state.status = 'loading';
      state.error = null;
    },
    fetchSuccess(state, action: PayloadAction<{ imageUrl: string; info: ImageInfo }>) {
      state.imageUrl = action.payload.imageUrl;
      state.info = action.payload.info;
      state.status = 'succeeded';
    },
    fetchFailure(state, action: PayloadAction<string>) {
      state.status = 'failed';
      state.error = action.payload;
    },
  },
});

export const { fetchStart, fetchSuccess, fetchFailure } = imageSlice.actions;

export default imageSlice.reducer;
