import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface FavoritesState {
  isFavoriteAdded: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: FavoritesState = {
  isFavoriteAdded: false,
  status: 'idle',
  error: null,
};

// Add to favorites async thunk
export const addToFavorites = createAsyncThunk(
  'favorites/addToFavorites',
  async ({ username, stockId }: { username?: string; stockId: string }) => {
    const response = await fetch('http://localhost:5000/api/add_favorite_stock', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, stock_id: stockId }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to add stock to favorites');
    }
    return data.message;
  }
);

// Delete from favorites async thunk
export const deleteFavorites = createAsyncThunk(
  'favorites/deleteFavorites',
  async ({ username, stockId }: { username?: string; stockId: string }) => {
    const response = await fetch('http://localhost:5000/api/remove_favorite_stock', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, stock_id: stockId }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to remove stock from favorites');
    }
    return data.message;
  }
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addToFavorites.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addToFavorites.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = 'succeeded';
        state.isFavoriteAdded = true;
        alert(`股票加入自選: ${action.payload}`);
      })
      .addCase(addToFavorites.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
        alert(`加入失敗: ${state.error}`);
      })
      .addCase(deleteFavorites.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteFavorites.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = 'succeeded';
        state.isFavoriteAdded = false;
        alert(`股票移除自選: ${action.payload}`);
      })
      .addCase(deleteFavorites.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
        alert(`移除失敗: ${state.error}`);
      });
  },
});

export default favoritesSlice.reducer;
