import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import DetailCard from './detailCard';
import { searchImages } from '../../api/nasaApi';
import { mockItem } from '../__mocks__/mocks';

jest.mock('../../api/nasaApi');
const mockedSearchImages = jest.mocked(searchImages);

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useParams: () => ({
    nasaId: 'test-nasa-id',
    searchTerm: 'moon',
    currentPage: '1',
  }),
}));

describe('DetailCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('triggers API call to fetch detailed information on mount', async () => {
    mockedSearchImages.mockResolvedValue({
      items: [mockItem],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        pageSize: 1,
      },
    });

    await act(async () => {
      render(
        <BrowserRouter>
          <DetailCard />
        </BrowserRouter>
      );
    });

    expect(mockedSearchImages).toHaveBeenCalledTimes(1);
    expect(mockedSearchImages).toHaveBeenCalledWith({ nasaId: 'test-nasa-id' });
  });

  it('displays loading indicator while fetching data', async () => {
    mockedSearchImages.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    await act(async () => {
      render(
        <BrowserRouter>
          <DetailCard />
        </BrowserRouter>
      );
    });

    expect(screen.getByLabelText('loading')).toBeInTheDocument();
  });

  it('displays detailed card data correctly after loading', async () => {
    mockedSearchImages.mockResolvedValue({
      items: [mockItem],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        pageSize: 1,
      },
    });

    await act(async () => {
      render(
        <BrowserRouter>
          <DetailCard />
        </BrowserRouter>
      );
    });

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    expect(screen.getByText(mockItem.title)).toBeInTheDocument();
    expect(screen.getByText(mockItem.description)).toBeInTheDocument();

    const image = screen.getByAltText(mockItem.title);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockItem.href.href);

    mockItem.keywords.forEach((keyword) => {
      expect(screen.getByText(keyword)).toBeInTheDocument();
    });
  });

  it('navigates back when clicking close button', async () => {
    mockedSearchImages.mockResolvedValue({
      items: [mockItem],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        pageSize: 1,
      },
    });

    await act(async () => {
      render(
        <BrowserRouter>
          <DetailCard />
        </BrowserRouter>
      );
    });

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    const closeButton = screen.getByText('x');
    expect(closeButton).toBeInTheDocument();

    const closeLink = closeButton.closest('a');
    expect(closeLink).toHaveAttribute('href', '/search/moon/1');
  });
  afterAll(() => {
    const _dummyComponent = (): React.JSX.Element => {
      return <div>dummy</div>;
    };
    render(<_dummyComponent />);
  });
});
