// src/features/userData/userDataSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../assets/apiurl';
// import { RootState } from '../store';

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
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
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
    status: 'idle',
    error: null,
  };

export const fetchValueData = createAsyncThunk(
    'valueData/fetchValueData',
    async (stockId: string, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/value`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ stockId }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: ValueInfo = await response.json();
            return data;
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
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchValueData.fulfilled, (state, action: PayloadAction<ValueInfo>) => {
                state.v_info = action.payload;
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(fetchValueData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export default valueDataSlice.reducer;
