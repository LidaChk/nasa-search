import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { AppRoutes } from './AppRoutes';
import * as useLocalStorageHook from '../hooks/useLocalStorage';

jest.mock('../components/mainPage/mainPage', () => {
  return function DummyMainPage(): React.JSX.Element {
    return <div data-testid="main-page">Main Page</div>;
  };
});

jest.mock('../components/detailCard/detailCard', () => {
  return function DummyDetailCard(): React.JSX.Element {
    return <div data-testid="detail-card">Detail Card</div>;
  };
});

jest.mock('../components/nothingFound/nothingFound', () => {
  return function DummyNothingFound({
    message,
  }: {
    message: string;
  }): React.JSX.Element {
    return <div data-testid="nothing-found">{message}</div>;
  };
});

describe('AppRoutes', () => {
  const renderWithRouter = (initialRoute: string) => {
    window.history.pushState({}, '', initialRoute);
    return render(
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should redirect to search page with localStorage term when accessing root', () => {
    jest
      .spyOn(useLocalStorageHook, 'default')
      .mockReturnValue(['testTerm', jest.fn()]);
    renderWithRouter('/');

    expect(window.location.pathname).toBe('/search');
    expect(window.location.search).toBe('?q=testTerm&page=1');
  });

  it('should redirect to search page with empty term when localStorage is empty', () => {
    jest.spyOn(useLocalStorageHook, 'default').mockReturnValue(['', jest.fn()]);
    renderWithRouter('/');

    expect(window.location.pathname).toBe('/search');
    expect(window.location.search).toBe('?q=&page=1');
  });

  it('should render MainPage when accessing search route', () => {
    jest.spyOn(useLocalStorageHook, 'default').mockReturnValue(['', jest.fn()]);
    renderWithRouter('/search');

    expect(screen.getByTestId('main-page')).toBeInTheDocument();
  });

  it('should render NothingFound component for unknown routes', () => {
    jest.spyOn(useLocalStorageHook, 'default').mockReturnValue(['', jest.fn()]);
    renderWithRouter('/unknown-route');

    expect(screen.getByTestId('nothing-found')).toBeInTheDocument();
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('should preserve search parameters when redirecting', () => {
    jest
      .spyOn(useLocalStorageHook, 'default')
      .mockReturnValue(['searchTerm', jest.fn()]);
    renderWithRouter('/');

    const searchParams = new URLSearchParams(window.location.search);
    expect(searchParams.get('q')).toBe('searchTerm');
    expect(searchParams.get('page')).toBe('1');
  });
});
