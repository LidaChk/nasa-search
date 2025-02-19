import { createSelector } from 'reselect';
import { RootState } from '../store';

const getSelectedItemsState = (state: RootState) => state.selectedItems.items;

export const getAllItems = createSelector(
  [getSelectedItemsState],
  (selectedItemsState) => selectedItemsState
);

export const isItemSelectedById = (
  id: string
): ((_state: RootState) => boolean) =>
  createSelector(
    [getSelectedItemsState],
    (selectedItemsState) =>
      selectedItemsState?.some((item) => item.nasaId === id) ?? false
  );
