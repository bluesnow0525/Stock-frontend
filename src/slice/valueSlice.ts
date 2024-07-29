import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../assets/apiurl';

interface ValueInfo {
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

interface ValueState {
  v_info: ValueInfo;
  v_status: 'idle' | 'loading' | 'succeeded' | 'failed';
  v_error: string | null;
}

const initialState: ValueState = {
  v_info: {
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
  v_status: 'idle',
  v_error: null,
};

export const fetchValueData = createAsyncThunk(
  'valueData/fetchValueData',
  async (data: { option: string; years: number; growthRates: number[]; wacc: number; stockid: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/value`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result: ValueInfo = await response.json();
      return result;
    } catch (error) {
      return rejectWithValue('Failed to fetch value data');
    }
  }
);

const valueDataSlice = createSlice({
  name: 'valueData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchValueData.pending, (state) => {
        state.v_status = 'loading';
        state.v_error = null;
      })
      .addCase(fetchValueData.fulfilled, (state, action: PayloadAction<ValueInfo>) => {
        state.v_info = action.payload;
        state.v_status = 'succeeded';
        state.v_error = null;
      })
      .addCase(fetchValueData.rejected, (state, action) => {
        state.v_status = 'failed';
        state.v_error = action.payload as string;
      });
  },
});

export default valueDataSlice.reducer;
