import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useNavigate, useParams } from 'react-router';
import Pagination from './pagination';

jest.mock('react-router', () => ({
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

describe('Pagination', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  it('renders pagination with correct page information', () => {
    (useParams as jest.Mock).mockReturnValue({
      searchTerm: 'test',
      currentPage: '2',
    });

    render(<Pagination totalPages={5} />);

    expect(screen.getByText('Page 2 of 5')).toBeInTheDocument();
    expect(screen.getByText('Previous')).toBeEnabled();
    expect(screen.getByText('Next')).toBeEnabled();
  });

  it('disables Previous button on first page', () => {
    (useParams as jest.Mock).mockReturnValue({
      searchTerm: 'test',
      currentPage: '1',
    });

    render(<Pagination totalPages={5} />);

    expect(screen.getByText('Previous')).toBeDisabled();
    expect(screen.getByText('Next')).toBeEnabled();
  });

  it('disables Next button on last page', () => {
    (useParams as jest.Mock).mockReturnValue({
      searchTerm: 'test',
      currentPage: '5',
    });

    render(<Pagination totalPages={5} />);

    expect(screen.getByText('Previous')).toBeEnabled();
    expect(screen.getByText('Next')).toBeDisabled();
  });

  it('navigates to previous page when Previous button is clicked', () => {
    (useParams as jest.Mock).mockReturnValue({
      searchTerm: 'test',
      currentPage: '3',
    });

    render(<Pagination totalPages={5} />);

    fireEvent.click(screen.getByText('Previous'));
    expect(mockNavigate).toHaveBeenCalledWith('/search/test/2');
  });

  it('navigates to next page when Next button is clicked', () => {
    (useParams as jest.Mock).mockReturnValue({
      searchTerm: 'test',
      currentPage: '3',
    });

    render(<Pagination totalPages={5} />);

    fireEvent.click(screen.getByText('Next'));
    expect(mockNavigate).toHaveBeenCalledWith('/search/test/4');
  });

  it('handles empty search term correctly', () => {
    (useParams as jest.Mock).mockReturnValue({
      searchTerm: '',
      currentPage: '2',
    });

    render(<Pagination totalPages={5} />);

    fireEvent.click(screen.getByText('Next'));
    expect(mockNavigate).toHaveBeenCalledWith('/search//3');
  });
});
