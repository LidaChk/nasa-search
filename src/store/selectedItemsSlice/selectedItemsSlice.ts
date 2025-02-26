import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SearchResultItem } from '../../types/types';

export interface SelectedItems {
  items: SearchResultItem[];
}

const initialState: SelectedItems = {
  items: [],
};

const selectedItemsSlice = createSlice({
  name: 'selectedItems',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<SearchResultItem>) => {
      state.items.push(action.payload);
    },
    removeItem: (state, action: PayloadAction<SearchResultItem>) => {
      state.items = state.items.filter(
        (item) => item.nasaId !== action.payload.nasaId
      );
    },
    unselectAll: (state) => {
      state.items = [];
    },
  },
});

export const { addItem, removeItem, unselectAll } = selectedItemsSlice.actions;
export default selectedItemsSlice.reducer;
