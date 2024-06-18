// src/features/userData/userDataSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../assets/apiurl';
// import { RootState } from '../store';

export type FinancialData = {
    [key: string]: [number | string | null, number | string | null] | [number | string | null];
};

interface SheetData {
    balance_sheet: FinancialData[];
    income_statement: FinancialData[];
    cash_flow: FinancialData[];
    dividend: FinancialData[];
}

interface SheetDataState {
    data: SheetData | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: SheetDataState = {
    data: null,
    status: 'idle',
    error: null
};

export const fetchSheetData = createAsyncThunk(
    'sheetData/fetchSheetData',
    async (stockId: string, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/sheet`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ stockId }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: SheetData = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue('Failed to fetch sheet data');
        }
    }
);

const sheetDataSlice = createSlice({
    name: 'sheetData',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSheetData.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchSheetData.fulfilled, (state, action: PayloadAction<SheetData>) => {
                state.data = action.payload;
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(fetchSheetData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export default sheetDataSlice.reducer;
