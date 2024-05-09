import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ImageInfo {
    評價: string;
    評價分數:number;
    現價: number;
    準確率: string;
    合理價:number;
    長期評價:string;
    本益比:number;
    本淨比:number;
    殖利率:number;
    成長率:number;
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
    評價分數:0,
    現價: 0,
    準確率: '',
    合理價:0,
    長期評價:'',
    本益比:0,
    本淨比:0,
    殖利率:0,
    成長率:0,
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
