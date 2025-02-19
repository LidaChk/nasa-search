import { SearchResultItem } from '../../types/types';
import selectedItemsReducer, {
  addItem,
  removeItem,
  unselectAll,
  SelectedItems,
} from './selectedItemsSlice';

describe('selectedItemsSlice', () => {
  let initialState: SelectedItems;
  let testItem: SearchResultItem;

  beforeEach(() => {
    initialState = { items: [] };
    testItem = {
      nasaId: 'test_id',
      title: 'Test Item',
      description: 'Test description',
      dateCreated: '2024-01-01',
      keywords: ['test', 'keywords'],
      preview: 'https://example.com/preview.jpg',
      href: 'https://example.com',
    };
  });

  it('should handle adding an item', () => {
    const actual = selectedItemsReducer(initialState, addItem(testItem));
    expect(actual.items).toEqual([testItem]);
  });

  it('should handle adding a duplicate item', () => {
    const stateWithItem = selectedItemsReducer(initialState, addItem(testItem));
    const actual = selectedItemsReducer(stateWithItem, addItem(testItem));
    expect(actual.items).toEqual([testItem, testItem]); // This assumes the slice allows duplicates
  });

  it('should handle removing an item', () => {
    const stateWithItem = selectedItemsReducer(initialState, addItem(testItem));
    const actual = selectedItemsReducer(stateWithItem, removeItem(testItem));
    expect(actual.items).toEqual([]);
  });

  it('should handle removing a non-existent item', () => {
    const stateWithItem = selectedItemsReducer(initialState, addItem(testItem));
    const nonExistentItem: SearchResultItem = {
      nasaId: 'non_existent_id',
      title: 'Non-existent Item',
      description: 'Non-existent description',
      dateCreated: '2024-01-01',
      keywords: ['non-existent', 'keywords'],
      preview: 'https://example.com/non-existent-preview.jpg',
      href: 'https://example.com/non-existent',
    };
    const actual = selectedItemsReducer(
      stateWithItem,
      removeItem(nonExistentItem)
    );
    expect(actual.items).toEqual([testItem]);
  });

  it('should handle unselecting all items', () => {
    const stateWithItem = selectedItemsReducer(initialState, addItem(testItem));
    const actual = selectedItemsReducer(stateWithItem, unselectAll());
    expect(actual.items).toEqual([]);
  });

  it('should handle unselecting all items on empty state', () => {
    const actual = selectedItemsReducer(initialState, unselectAll());
    expect(actual.items).toEqual([]);
  });
});
