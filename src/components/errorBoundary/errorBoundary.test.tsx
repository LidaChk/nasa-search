import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from './errorBoundary';

const ErrorComponent = (): React.JSX.Element => {
  throw new Error('Test error');
};

const NormalComponent = (): React.JSX.Element => <div>Normal component</div>;

const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <NormalComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Normal component')).toBeInTheDocument();
  });

  it('renders error UI when there is an error', () => {
    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
    expect(screen.getByText('(^-^*)')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('Try Again');
  });

  it('resets error state when "Try Again" is clicked', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    const tryAgainButton = screen.getByRole('button', { name: /try again/i });
    rerender(
      <ErrorBoundary>
        <NormalComponent />
      </ErrorBoundary>
    );

    fireEvent.click(tryAgainButton);

    expect(screen.getByText('Normal component')).toBeInTheDocument();
  });

  it('has correct CSS classes', () => {
    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    const errorContainer = screen.getByText(
      'Something went wrong'
    ).parentElement;
    expect(errorContainer).toHaveClass('error-boundary', 'error-container');
  });

  it('calls componentDidCatch when error occurs', () => {
    const spy = jest.spyOn(ErrorBoundary.prototype, 'componentDidCatch');

    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('matches error state snapshot', () => {
    const { container } = render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(container).toMatchSnapshot();
  });
});
