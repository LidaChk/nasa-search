import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Flyout from './flyout';
import selectedItemsReducer, {
  unselectAll,
} from '../../store/selectedItemsSlice/selectedItemsSlice';
import { SearchResultItem } from '../../types/types';

const mockItems: SearchResultItem[] = [
  {
    nasaId: '1',
    title: 'Test Image 1',
    description: 'Description 1',
    dateCreated: '2024-01-01',
    href: 'https://example.com/1',
    preview: 'https://example.com/preview/1',
    keywords: ['test'],
  },
  {
    nasaId: '2',
    title: 'Test Image 2',
    description: 'Description 2',
    dateCreated: '2024-01-02',
    href: 'https://example.com/2',
    preview: 'https://example.com/preview/2',
    keywords: ['test'],
  },
];

const createMockStore = (initialItems: SearchResultItem[] = []) => {
  return configureStore({
    reducer: {
      selectedItems: selectedItemsReducer,
    },
    preloadedState: {
      selectedItems: {
        items: initialItems,
      },
    },
  });
};

describe('Flyout', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      value: { assign: jest.fn() },
    });
  });
  beforeEach(() => {
    URL.createObjectURL = jest.fn(() => 'mock-url');
    URL.revokeObjectURL = jest.fn();
  });

  it('should not render when no items are selected', async () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <Flyout />
      </Provider>
    );

    expect(screen.queryByText('Selected items:')).not.toBeInTheDocument();
  });

  it('should render when items are selected', async () => {
    const store = createMockStore(mockItems);
    render(
      <Provider store={store}>
        <Flyout />
      </Provider>
    );

    await screen.findByText('Selected items: 2');
    expect(screen.getByText('Unselect all')).toBeInTheDocument();
    expect(screen.getByText('Download')).toBeInTheDocument();
  });

  it('should clear selection when clicking Unselect all', async () => {
    const store = createMockStore(mockItems);
    render(
      <Provider store={store}>
        <Flyout />
      </Provider>
    );

    await screen.findByText('Unselect all');

    act(() => {
      fireEvent.click(screen.getByText('Unselect all'));
    });

    expect(screen.queryByText('Selected items:')).not.toBeInTheDocument();
    expect(store.getState().selectedItems.items).toHaveLength(0);
  });
  it('should update count when items change', async () => {
    const store = createMockStore(mockItems);
    render(
      <Provider store={store}>
        <Flyout />
      </Provider>
    );

    await screen.findByText('Selected items: 2');

    act(() => {
      store.dispatch(unselectAll());
    });

    expect(screen.queryByText('Selected items:')).not.toBeInTheDocument();
  });

  it('should have correct CSS classes', async () => {
    const store = createMockStore(mockItems);
    render(
      <Provider store={store}>
        <Flyout />
      </Provider>
    );

    await screen.findByText(/Selected items:/);

    expect(screen.getByRole('button', { name: 'Unselect all' })).toHaveClass(
      'flyout__button',
      'flyout__button--unselect'
    );
    expect(screen.getByRole('button', { name: 'Download' })).toHaveClass(
      'flyout__button',
      'flyout__button--download'
    );
    expect(screen.getByText(/Selected items:/)).toHaveClass('flyout__info');
  });

  it('should generate and trigger download when clicking Download', async () => {
    const store = createMockStore(mockItems);
    render(
      <Provider store={store}>
        <Flyout />
      </Provider>
    );

    await screen.findByText('Download');

    act(() => {
      fireEvent.click(screen.getByText('Download'));
    });

    expect(URL.createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
    const blobCall = (URL.createObjectURL as jest.Mock).mock.calls[0][0];
    expect(blobCall).toBeInstanceOf(Blob);
    expect(blobCall.type).toBe('text/csv;charset=utf-8;');

    const downloadLink = screen.getByTestId('download-link');
    expect(downloadLink).toHaveAttribute('download', '2_items.csv');
    expect(downloadLink).toHaveAttribute('href', 'mock-url');
  });

  afterAll(() => {
    jest.restoreAllMocks();
    const _dummyComponent = (): React.JSX.Element => {
      return <div>dummy</div>;
    };
    render(<_dummyComponent />);
  });
});
