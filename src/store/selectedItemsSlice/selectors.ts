import { createSelector } from 'reselect';
import { RootState } from '../store';
import { SearchResultItem } from '../../types/types';

const getSelectedItemsState = (state: RootState) => state.selectedItems.items;

export const getAllItems = (): ((_state: RootState) => SearchResultItem[]) =>
  createSelector(
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
