import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ImageInfo {
  評價: string;
  評價分數: number;
  現價: number;
  準確率: string;
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
    現價: 0,
    準確率: '',
    預期年化報酬率: '',
    高合理價: '',
    合理價: '',
    低合理價: '',
    長期評價: '',
    預估eps: '',
    淨值: '',
    殖利率: '',
    pb法估價: '',
    pe法估價: '',
    ddm法估價: '',
    de法估價: '',
    dcf法估價: '',
    peg法估價: '',
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
