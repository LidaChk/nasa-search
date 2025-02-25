import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useNavigate, useSearchParams } from 'react-router';
import Search from './search';
import useLocalStorage from '../../hooks/useLocalStorage';

jest.mock('react-router', () => ({
  useNavigate: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock('../../hooks/useLocalStorage', () => jest.fn());

describe('Search', () => {
  const mockNavigate = jest.fn();
  const mockSetSearchTermLS = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useLocalStorage as jest.Mock).mockReturnValue(['', mockSetSearchTermLS]);
  });

  describe('Component Rendering', () => {
    it('renders search form with all required elements', () => {
      (useSearchParams as jest.Mock).mockReturnValue([
        new URLSearchParams({}),
        jest.fn(),
      ]);
      render(<Search />);

      expect(screen.getByRole('searchbox')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /search/i })
      ).toBeInTheDocument();
      expect(screen.getByRole('form')).toHaveAttribute('aria-label', 'search');
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('initializes with empty input when no searchTerm param', () => {
      (useSearchParams as jest.Mock).mockReturnValue([
        new URLSearchParams({}),
        jest.fn(),
      ]);
      render(<Search />);

      expect(screen.getByRole('searchbox')).toHaveValue('');
    });
  });

  describe('Input Handling', () => {
    it('initializes input value from URL parameter', () => {
      const testTerm = 'test query';
      (useSearchParams as jest.Mock).mockReturnValue([
        new URLSearchParams({
          q: testTerm,
          page: '1',
        }),
        jest.fn(),
      ]);
      render(<Search />);

      expect(screen.getByRole('searchbox')).toHaveValue(testTerm);
    });

    it('updates input value when typing', () => {
      (useSearchParams as jest.Mock).mockReturnValue([
        new URLSearchParams({}),
        jest.fn(),
      ]);
      render(<Search />);

      const searchInput = screen.getByRole('searchbox');
      fireEvent.change(searchInput, { target: { value: 'new search' } });

      expect(searchInput).toHaveValue('new search');
    });

    it('handles special characters in input', () => {
      (useSearchParams as jest.Mock).mockReturnValue([
        new URLSearchParams({
          q: '',
          page: '1',
        }),
        jest.fn(),
      ]);
      render(<Search />);

      const searchInput = screen.getByRole('searchbox');
      fireEvent.change(searchInput, { target: { value: '@#$%^&*' } });

      expect(searchInput).toHaveValue('@#$%^&*');
    });
  });

  describe('Form Submission', () => {
    it('navigates to search results and updates localStorage on form submission', () => {
      const newSearch = 'new search';
      (useSearchParams as jest.Mock).mockReturnValue([
        new URLSearchParams({
          q: '',
          page: '1',
        }),
        jest.fn(),
      ]);
      (useLocalStorage as jest.Mock).mockReturnValue([
        'old term',
        mockSetSearchTermLS,
      ]);

      render(<Search />);
      const searchInput = screen.getByRole('searchbox');
      const form = screen.getByRole('form');

      fireEvent.change(searchInput, { target: { value: `  ${newSearch}  ` } });
      fireEvent.submit(form);

      expect(mockSetSearchTermLS).toHaveBeenCalledWith(newSearch);
      expect(mockNavigate).toHaveBeenCalledWith({
        pathname: '/search',
        search: `?q=${newSearch}&page=1`,
      });
    });

    it('handles empty form submission', () => {
      (useSearchParams as jest.Mock).mockReturnValue([
        new URLSearchParams({
          q: '',
          page: '1',
        }),
        jest.fn(),
      ]);
      render(<Search />);

      const form = screen.getByRole('form');
      const searchInput = screen.getByRole('searchbox');
      fireEvent.change(searchInput, { target: { value: '' } });
      fireEvent.submit(form);

      expect(mockNavigate).toHaveBeenCalledWith({
        pathname: '/search',
        search: '?q=&page=1',
      });
    });

    it('does not update localStorage if search term has not changed', () => {
      const existingTerm = 'existing search';
      (useSearchParams as jest.Mock).mockReturnValue([
        new URLSearchParams({
          q: existingTerm,
          page: '1',
        }),
        jest.fn(),
      ]);
      (useLocalStorage as jest.Mock).mockReturnValue([
        existingTerm,
        mockSetSearchTermLS,
      ]);

      render(<Search />);
      const form = screen.getByRole('form');
      fireEvent.submit(form);

      expect(mockSetSearchTermLS).not.toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith({
        pathname: '/search',
        search: `?q=${existingTerm}&page=1`,
      });
    });
  });
  afterAll(() => {
    const _dummyComponent = (): React.JSX.Element => {
      return <div>dummy</div>;
    };
    render(<_dummyComponent />);
  });
});
