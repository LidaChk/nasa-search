import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useNavigate, useSearchParams } from 'react-router';
import Pagination from './pagination';

jest.mock('react-router', () => ({
  useNavigate: jest.fn(),
  useSearchParams: jest.fn(),
}));

describe('Pagination', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  it('renders pagination with correct page information', () => {
    (useSearchParams as jest.Mock).mockReturnValue([
      new URLSearchParams({
        q: 'test',
        page: '2',
      }),
      jest.fn(),
    ]);

    render(<Pagination totalPages={5} />);

    expect(screen.getByText('Page 2 of 5')).toBeInTheDocument();
    expect(screen.getByText('Previous')).toBeEnabled();
    expect(screen.getByText('Next')).toBeEnabled();
    expect(screen.getByTestId('pagination')).toHaveClass('pagination');
  });

  describe('button states', () => {
    it('disables Previous button on first page', () => {
      (useSearchParams as jest.Mock).mockReturnValue([
        new URLSearchParams({
          q: 'test',
          page: '1',
        }),
        jest.fn(),
      ]);
      render(<Pagination totalPages={5} />);

      expect(screen.getByText('Previous')).toBeDisabled();
      expect(screen.getByText('Next')).toBeEnabled();
    });

    it('disables Next button on last page', () => {
      (useSearchParams as jest.Mock).mockReturnValue([
        new URLSearchParams({
          q: 'test',
          page: '5',
        }),
        jest.fn(),
      ]);

      render(<Pagination totalPages={5} />);

      expect(screen.getByText('Previous')).toBeEnabled();
      expect(screen.getByText('Next')).toBeDisabled();
    });

    it('enables both buttons on middle pages', () => {
      (useSearchParams as jest.Mock).mockReturnValue([
        new URLSearchParams({
          q: 'test',
          page: '3',
        }),
        jest.fn(),
      ]);

      render(<Pagination totalPages={5} />);

      expect(screen.getByText('Previous')).toBeEnabled();
      expect(screen.getByText('Next')).toBeEnabled();
    });
  });

  describe('navigation functionality', () => {
    it('navigates to previous page when Previous button is clicked', () => {
      (useSearchParams as jest.Mock).mockReturnValue([
        new URLSearchParams({
          q: 'test',
          page: '3',
        }),
        jest.fn(),
      ]);

      render(<Pagination totalPages={5} />);

      fireEvent.click(screen.getByText('Previous'));
      expect(mockNavigate).toHaveBeenCalledWith('/search?q=test&page=2');
    });

    it('navigates to next page when Next button is clicked', () => {
      (useSearchParams as jest.Mock).mockReturnValue([
        new URLSearchParams({
          q: 'test',
          page: '3',
        }),
        jest.fn(),
      ]);

      render(<Pagination totalPages={5} />);

      fireEvent.click(screen.getByText('Next'));
      expect(mockNavigate).toHaveBeenCalledWith('/search?q=test&page=4');
    });
  });

  describe('edge cases', () => {
    it('handles empty search term correctly', () => {
      (useSearchParams as jest.Mock).mockReturnValue([
        new URLSearchParams({
          q: '',
          page: '2',
        }),
        jest.fn(),
      ]);
      render(<Pagination totalPages={5} />);

      fireEvent.click(screen.getByText('Next'));
      expect(mockNavigate).toHaveBeenCalledWith('/search?q=&page=3');
    });

    it('handles undefined params correctly', () => {
      (useSearchParams as jest.Mock).mockReturnValue([
        new URLSearchParams({}),
        jest.fn(),
      ]);

      render(<Pagination totalPages={5} />);

      expect(screen.getByText('Page 1 of 5')).toBeInTheDocument();
      expect(screen.getByText('Previous')).toBeDisabled();
    });

    it('handles string totalPages correctly', () => {
      (useSearchParams as jest.Mock).mockReturnValue([
        new URLSearchParams({
          q: 'test',
          page: '2',
        }),
        jest.fn(),
      ]);

      render(<Pagination totalPages={5} />);

      expect(screen.getByText('Page 2 of 5')).toBeInTheDocument();
    });

    it('handles single page correctly', () => {
      (useSearchParams as jest.Mock).mockReturnValue([
        new URLSearchParams({
          q: 'test',
          page: '1',
        }),
        jest.fn(),
      ]);

      render(<Pagination totalPages={1} />);

      expect(screen.getByText('Previous')).toBeDisabled();
      expect(screen.getByText('Next')).toBeDisabled();
    });
  });

  describe('button click handling', () => {
    it('prevents navigation when Previous button is disabled', () => {
      (useSearchParams as jest.Mock).mockReturnValue([
        new URLSearchParams({
          q: 'test',
          page: '1',
        }),
        jest.fn(),
      ]);

      render(<Pagination totalPages={5} />);

      fireEvent.click(screen.getByText('Previous'));
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('prevents navigation when Next button is disabled', () => {
      (useSearchParams as jest.Mock).mockReturnValue([
        new URLSearchParams({
          q: 'test',
          page: '5',
        }),
        jest.fn(),
      ]);

      render(<Pagination totalPages={5} />);

      fireEvent.click(screen.getByText('Next'));
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
  afterAll(() => {
    const _dummyComponent = (): React.JSX.Element => {
      return <div>dummy</div>;
    };
    render(<_dummyComponent />);
  });
});
