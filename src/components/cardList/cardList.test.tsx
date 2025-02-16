import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { searchImages } from '../../api/nasaApi';
import CardList from './cardList';
import { mockNASAData } from '../../api/__mocks__/nasaApiMocks';
import { EMPTY_SEARCH, PAGE_SIZE } from '../../constants/constants';
import { PaginationInfo, SearchResultItem } from '../../types/types';

jest.mock('../../api/nasaApi');
const mockedSearchImages = jest.mocked(searchImages);
const MOCK_DELAY = 1000;
const createDelayedResponse = (
  data: { items: SearchResultItem[]; pagination: PaginationInfo },
  delay: number = MOCK_DELAY
): Promise<{ items: SearchResultItem[]; pagination: PaginationInfo }> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};
const mapMockDataToResponse = (
  items = mockNASAData.collection.items
): { items: SearchResultItem[]; pagination: PaginationInfo } => ({
  items: items.map((item) => ({
    nasaId: item.data[0].nasa_id,
    title: item.data[0].title,
    description: item.data[0].description,
    dateCreated: item.data[0].date_created,
    keywords: item.data[0].keywords,
    preview: new URL(item.links[0].href),
    href: new URL(item.links[0].href),
  })),
  pagination: {
    currentPage: 1,
    totalPages: 3,
    pageSize: PAGE_SIZE,
  },
});
describe('CardList', () => {
  afterAll(() => {
    const _dummyComponent = (): React.JSX.Element => {
      return <div>dummy</div>;
    };
    render(<_dummyComponent />);
  });

  const renderWithRouter = (searchTerm = EMPTY_SEARCH, page = '1') => {
    render(
      <MemoryRouter initialEntries={[`/search/${searchTerm}/${page}`]}>
        <Routes>
          <Route
            path="/search/:searchTerm/:currentPage"
            element={<CardList />}
          />
        </Routes>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading state initially', async () => {
    mockedSearchImages.mockImplementationOnce(() =>
      createDelayedResponse(mapMockDataToResponse())
    );
    await act(async () => {
      renderWithRouter();
    });
    expect(screen.getByLabelText('loading')).toBeInTheDocument();
  });

  it('displays cards when data is loaded successfully', async () => {
    mockedSearchImages.mockResolvedValueOnce(mapMockDataToResponse());

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Apollo 11 Mission Image')).toBeInTheDocument();
    });

    expect(screen.getByText('Saturn V Launch')).toBeInTheDocument();
  });

  it('shows nothing found message when no results', async () => {
    mockedSearchImages.mockResolvedValueOnce({
      items: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        pageSize: 10,
      },
    });

    renderWithRouter('nonexistent');

    await waitFor(() => {
      expect(screen.getByTestId('nothing-found')).toBeInTheDocument();
    });
  });

  it('shows error message when API call fails', async () => {
    const errorMessage = 'API Error';
    mockedSearchImages.mockRejectedValueOnce(new Error(errorMessage));

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
    });
  });

  it('shows pagination when there are multiple pages', async () => {
    mockedSearchImages.mockResolvedValueOnce(mapMockDataToResponse());

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByTestId('pagination')).toBeInTheDocument();
    });
  });

  it('calls searchImages with correct parameters', async () => {
    renderWithRouter('moon', '2');

    await waitFor(() => {
      expect(mockedSearchImages).toHaveBeenCalledWith({
        query: 'moon',
        page: 2,
        pageSize: 10,
      });
    });
  });
});
