import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { useSearchImagesQuery } from '../../store/nasaApi/nasaApi';
import CardList from './cardList';
import { mockNASAData } from '../../store/nasaApi/__mocks__/nasaApiMocks';
import { PAGE_SIZE } from '../../constants/constants';
import { PaginationInfo, SearchResultItem } from '../../types/types';

jest.mock('../../store/nasaApi/nasaApi', () => ({
  useSearchImagesQuery: jest.fn(),
}));

const mockedUseSearchImagesQuery = useSearchImagesQuery as jest.Mock;

const mapMockDataToResponse = (
  items = mockNASAData.collection.items
): { items: SearchResultItem[]; pagination: PaginationInfo } => ({
  items: items.map((item) => ({
    nasaId: item.data[0].nasa_id,
    title: item.data[0].title,
    description: item.data[0].description,
    dateCreated: item.data[0].date_created,
    keywords: item.data[0].keywords,
    preview: item.links[0].href,
    href: item.links[0].href,
  })),
  pagination: {
    currentPage: 1,
    totalPages: 3,
    pageSize: PAGE_SIZE,
  },
});

describe('CardList', () => {
  const renderWithRouter = (searchTerm = '', page = '1') => {
    render(
      <MemoryRouter initialEntries={[`/search?q=${searchTerm}&page=${page}`]}>
        <Routes>
          <Route path="/search" element={<CardList />} />
        </Routes>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading state initially', () => {
    mockedUseSearchImagesQuery.mockReturnValue({
      data: undefined,
      isFetching: true,
      isError: false,
    });

    renderWithRouter();
    expect(screen.getByLabelText('loading')).toBeInTheDocument();
  });

  it('displays cards when data is loaded successfully', () => {
    mockedUseSearchImagesQuery.mockReturnValue({
      data: mapMockDataToResponse(),
      isFetching: false,
      isError: false,
    });

    renderWithRouter();

    expect(screen.getByText('Apollo 11 Mission Image')).toBeInTheDocument();
    expect(screen.getByText('Saturn V Launch')).toBeInTheDocument();
  });

  it('shows nothing found message when no results', () => {
    mockedUseSearchImagesQuery.mockReturnValue({
      data: {
        items: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          pageSize: 10,
        },
      },
      isFetching: false,
      isError: false,
    });

    renderWithRouter('nonexistent');

    expect(screen.getByTestId('nothing-found')).toBeInTheDocument();
  });

  it('shows error message when API call fails', () => {
    mockedUseSearchImagesQuery.mockReturnValue({
      data: undefined,
      isFetching: false,
      isError: true,
      error: { data: 'API Error' },
    });

    renderWithRouter();

    expect(screen.getByText(/API Error/i)).toBeInTheDocument();
  });

  it('shows pagination when there are multiple pages', () => {
    mockedUseSearchImagesQuery.mockReturnValue({
      data: mapMockDataToResponse(),
      isFetching: false,
      isError: false,
    });

    renderWithRouter();

    expect(screen.getByTestId('pagination')).toBeInTheDocument();
  });

  it('calls useSearchImagesQuery with correct parameters', () => {
    renderWithRouter('moon', '2');

    expect(mockedUseSearchImagesQuery).toHaveBeenCalledWith({
      query: 'moon',
      page: 2,
    });
  });
  afterAll(() => {
    const _dummyComponent = (): React.JSX.Element => {
      return <div>dummy</div>;
    };
    render(<_dummyComponent />);
  });
});
