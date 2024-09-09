// valuationSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { API_BASE_URL } from "../assets/apiurl";

interface EvaluationRange {
  method: string;
  range: string;
}

interface ValuationState {
  evaluations: Record<string, string>;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// 這裡假設我們有一個函數 `getDefaultEvaluations` 來初始化值
const getDefaultEvaluations = (v_info: any): Record<string, string> => ({
  pb法估價: v_info.pb法估價,
  pe法估價: v_info.pe法估價,
  ddm法估價: v_info.ddm法估價,
  de法估價: v_info.de法估價,
  dcf法估價: v_info.dcf法估價,
  peg法估價: v_info.peg法估價,
});

const initialState: ValuationState = {
  evaluations: getDefaultEvaluations({}), // 可以在應用初始化時提供 v_info
  status: 'idle',
  error: null,
};

// 定義一個異步的 thunk，用來發送 POST 請求
export const fetchEvaluationRange = createAsyncThunk(
  'valuation/fetchEvaluationRange',
  async ({ stock_id, method, parameters }: { stock_id: string; method: string; parameters: object }) => {
    const response = await fetch(`${API_BASE_URL}/api/value_change`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ stock_id, method, parameters }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch evaluation range');
    }

    const data = await response.json(); // 假設返回格式為 { "dcf法估價": "120~180" }
    return { method, range: data[method] }; // 根據返回的 method 更新範圍
  }
);

const valuationSlice = createSlice({
  name: 'valuation',
  initialState,
  reducers: {
    setDefaultEvaluations: (state, action: PayloadAction<Record<string, string>>) => {
      state.evaluations = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvaluationRange.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEvaluationRange.fulfilled, (state, action: PayloadAction<EvaluationRange>) => {
        const { method, range } = action.payload;
        state.evaluations[method] = range; // 只更新對應的 method 值
        state.status = 'succeeded';
      })
      .addCase(fetchEvaluationRange.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch evaluation range';
      });
  },
});

export const { setDefaultEvaluations } = valuationSlice.actions;

export default valuationSlice.reducer;
