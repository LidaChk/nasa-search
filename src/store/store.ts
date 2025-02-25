import { configureStore } from '@reduxjs/toolkit';
import { nasaApi } from './nasaApi/nasaApi';
import selectedItemsSlice from './selectedItemsSlice/selectedItemsSlice';

export const store = configureStore({
  reducer: {
    [nasaApi.reducerPath]: nasaApi.reducer,
    selectedItems: selectedItemsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(nasaApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
