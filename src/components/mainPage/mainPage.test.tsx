import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import MainPage from './mainPage';

jest.mock('../cardList/cardList', () => {
  return function DummyCardList() {
    return <div data-testid="card-list">CardList Component</div>;
  };
});

jest.mock('../search/search', () => {
  return function DummySearch() {
    return <div data-testid="search">Search Component</div>;
  };
});

const mockNavigate = jest.fn();
let mockParams = {
  searchTerm: 'moon',
  currentPage: '1',
  nasaId: undefined as string | undefined,
};

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate,
  useParams: () => mockParams,
}));

describe('MainPage Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  const renderWithRouter = (withNasaId: boolean = false) => {
    mockParams = {
      searchTerm: 'moon',
      currentPage: '1',
      nasaId: withNasaId ? 'banana' : undefined,
    };

    const route = withNasaId
      ? '/search?q=moon&page=1&details=banana'
      : '/search?q=moon&page=1';

    return render(
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/search" element={<MainPage />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('renders correctly without nasaId', () => {
    const { container } = renderWithRouter(false);
    expect(container).toMatchSnapshot();

    expect(container.querySelector('.main-page-container__detail')).toBeFalsy();
    expect(container.querySelector('.app-header__detail')).toBeFalsy();
    expect(container.querySelector('.main-page__detail')).toBeFalsy();
    expect(container.querySelector('.details-section')).toBeFalsy();
  });

  it('renders correctly with nasaId', () => {
    const { container } = renderWithRouter(true);
    expect(container).toMatchSnapshot();

    expect(
      container.querySelector('.main-page-container__detail')
    ).toBeTruthy();
    expect(container.querySelector('.app-header__detail')).toBeTruthy();
    expect(container.querySelector('.main-page__detail')).toBeTruthy();
    expect(container.querySelector('.details-section')).toBeTruthy();
  });

  it('displays the header title', () => {
    renderWithRouter();
    expect(screen.getByText('NASA Image search')).toBeInTheDocument();
  });

  it('renders Search component', () => {
    renderWithRouter();
    expect(screen.getByTestId('search')).toBeInTheDocument();
  });

  it('renders CardList component', () => {
    renderWithRouter();
    expect(screen.getByTestId('card-list')).toBeInTheDocument();
  });

  it('does not navigate when clicking container without nasaId', () => {
    const { container } = renderWithRouter(false);
    const mainContainer = container.querySelector('.main-page-container');
    if (mainContainer) {
      fireEvent.click(mainContainer);
    }
    expect(mockNavigate).not.toHaveBeenCalled();
  });
  afterAll(() => {
    const _dummyComponent = (): React.JSX.Element => {
      return <div>dummy</div>;
    };
    render(<_dummyComponent />);
  });
});
