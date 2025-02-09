import React from 'react';
import { render, screen } from '@testing-library/react';
import NothingFound from './nothingFound';

describe('NothingFound Component', () => {
  it('renders with default message when no message prop is provided', () => {
    render(<NothingFound />);

    expect(screen.getByText('Nothing was found')).toBeInTheDocument();
    expect(screen.getByRole('img', { hidden: true })).toHaveTextContent(
      '(^-^*)'
    );
  });

  it('renders with custom message when message prop is provided', () => {
    const customMessage = 'Custom error message';
    render(<NothingFound message={customMessage} />);
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });
  afterAll(() => {
    const _dummyComponent: React.FC = () => {
      return <div>dummy</div>;
    };
    render(<_dummyComponent />);
  });
});
