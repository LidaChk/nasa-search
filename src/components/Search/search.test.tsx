import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useNavigate, useParams } from 'react-router';
import Search from './search';
import useLocalStorage from '../../hooks/useLocalStorage';

jest.mock('react-router', () => ({
  useNavigate: jest.fn(),
  useParams: jest.fn(),
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
      (useParams as jest.Mock).mockReturnValue({ searchTerm: '' });
      render(<Search />);

      expect(screen.getByRole('searchbox')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /search/i })
      ).toBeInTheDocument();
      expect(screen.getByRole('form')).toHaveAttribute('aria-label', 'search');
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('initializes with empty input when no searchTerm param', () => {
      (useParams as jest.Mock).mockReturnValue({});
      render(<Search />);

      expect(screen.getByRole('searchbox')).toHaveValue('');
    });
  });

  describe('Input Handling', () => {
    it('initializes input value from URL parameter', () => {
      (useParams as jest.Mock).mockReturnValue({ searchTerm: 'test query' });
      render(<Search />);

      expect(screen.getByRole('searchbox')).toHaveValue('test query');
    });

    it('updates input value when typing', () => {
      (useParams as jest.Mock).mockReturnValue({ searchTerm: '' });
      render(<Search />);

      const searchInput = screen.getByRole('searchbox');
      fireEvent.change(searchInput, { target: { value: 'new search' } });

      expect(searchInput).toHaveValue('new search');
    });

    it('handles special characters in input', () => {
      (useParams as jest.Mock).mockReturnValue({ searchTerm: '' });
      render(<Search />);

      const searchInput = screen.getByRole('searchbox');
      fireEvent.change(searchInput, { target: { value: '@#$%^&*' } });

      expect(searchInput).toHaveValue('@#$%^&*');
    });
  });

  describe('Form Submission', () => {
    it('navigates to search results and updates localStorage on form submission', () => {
      (useParams as jest.Mock).mockReturnValue({ searchTerm: '' });
      (useLocalStorage as jest.Mock).mockReturnValue([
        'old term',
        mockSetSearchTermLS,
      ]);

      render(<Search />);
      const searchInput = screen.getByRole('searchbox');
      const form = screen.getByRole('form');

      fireEvent.change(searchInput, { target: { value: '  new search  ' } });
      fireEvent.submit(form);

      expect(mockSetSearchTermLS).toHaveBeenCalledWith('new search');
      expect(mockNavigate).toHaveBeenCalledWith('/search/new search/1');
    });

    it('handles empty form submission', () => {
      (useParams as jest.Mock).mockReturnValue({ searchTerm: '' });
      render(<Search />);

      const form = screen.getByRole('form');
      const searchInput = screen.getByRole('searchbox');
      fireEvent.change(searchInput, { target: { value: '' } });
      fireEvent.submit(form);

      expect(mockNavigate).toHaveBeenCalledWith('/search/_empty/1');
    });

    it('does not update localStorage if search term has not changed', () => {
      const existingTerm = 'existing search';
      (useParams as jest.Mock).mockReturnValue({ searchTerm: existingTerm });
      (useLocalStorage as jest.Mock).mockReturnValue([
        existingTerm,
        mockSetSearchTermLS,
      ]);

      render(<Search />);
      const form = screen.getByRole('form');
      fireEvent.submit(form);

      expect(mockSetSearchTermLS).not.toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/search/existing search/1');
    });
  });
  afterAll(() => {
    const _dummyComponent: React.FC = () => {
      return <div>dummy</div>;
    };
    render(<_dummyComponent />);
  });
});
