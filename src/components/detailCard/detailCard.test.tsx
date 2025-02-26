import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { useGetImageDetailsQuery } from '../../store/nasaApi/nasaApi';
import { mockItem } from '../../__tests__/__mocks__/mocks';
import DetailCard from './detailCard';

jest.mock('../../store/nasaApi/nasaApi', () => ({
  useGetImageDetailsQuery: jest.fn(),
}));

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useSearchParams: () => [
    new URLSearchParams({
      q: 'moon',
      page: '1',
      details: 'test-nasa-id',
    }),
  ],
  useNavigate: jest.fn(),
}));

const mockedUseGetImageDetailsQuery = useGetImageDetailsQuery as jest.Mock;

describe('DetailCard Component', () => {
  const renderDetailCard = () => {
    render(
      <BrowserRouter>
        <DetailCard />
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('makes API call with correct parameters', () => {
    mockedUseGetImageDetailsQuery.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    renderDetailCard();

    expect(mockedUseGetImageDetailsQuery).toHaveBeenCalledWith('test-nasa-id', {
      skip: false,
    });
  });

  it('displays loading indicator while fetching data', () => {
    mockedUseGetImageDetailsQuery.mockReturnValue({
      data: null,
      isFetching: true,
      error: null,
    });

    renderDetailCard();

    expect(screen.getByLabelText('loading')).toBeInTheDocument();
  });

  it('displays detailed card data correctly after loading', () => {
    mockedUseGetImageDetailsQuery.mockReturnValue({
      data: mockItem,
      isLoading: false,
      error: null,
    });

    renderDetailCard();

    expect(screen.getByText(mockItem.title)).toBeInTheDocument();
    expect(screen.getByText(mockItem.description)).toBeInTheDocument();

    const image = screen.getByAltText(mockItem.title);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockItem.href);

    mockItem.keywords.forEach((keyword) => {
      expect(screen.getByText(keyword)).toBeInTheDocument();
    });
  });

  it('throws error when API call fails', () => {
    const errorMessage = 'API Error';
    mockedUseGetImageDetailsQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: { data: errorMessage },
    });

    expect(() => renderDetailCard()).toThrow(errorMessage);
  });

  it('displays close button with correct link', () => {
    mockedUseGetImageDetailsQuery.mockReturnValue({
      data: mockItem,
      isLoading: false,
      error: null,
    });

    renderDetailCard();

    const closeButton = screen.getByText('x');
    expect(closeButton).toBeInTheDocument();

    const closeLink = closeButton.closest('a');
    expect(closeLink).toHaveAttribute('href', '/search?q=moon&page=1');
  });

  it('skips query when nasaId is not provided', () => {
    jest.spyOn(URLSearchParams.prototype, 'get').mockImplementation((param) => {
      if (param === 'details') return null;
      return param === 'q' ? 'moon' : '1';
    });

    mockedUseGetImageDetailsQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });

    renderDetailCard();

    expect(mockedUseGetImageDetailsQuery).toHaveBeenCalledWith('', {
      skip: true,
    });
  });
  afterAll(() => {
    const _dummyComponent = (): React.JSX.Element => {
      return <div>dummy</div>;
    };
    render(<_dummyComponent />);
  });
});
