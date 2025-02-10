import React from 'react';
import { render, screen } from '@testing-library/react';
import Loader from './loader';

describe('Loader', () => {
  it('renders loader component', () => {
    render(<Loader />);
    const loaderElement = screen.getByLabelText('loading');
    expect(loaderElement).toBeInTheDocument();
  });

  it('has correct structure', () => {
    const { container } = render(<Loader />);
    const loaderDivs = container.firstChild?.childNodes;
    expect(loaderDivs).toHaveLength(4);
  });

  it('has correct CSS classes', () => {
    const { container } = render(<Loader />);
    expect(container.firstChild).toHaveClass('loader');
  });

  it('matches snapshot', () => {
    const { container } = render(<Loader />);
    expect(container.firstChild).toMatchSnapshot();
  });
  afterAll(() => {
    const _dummyComponent: React.FC = () => {
      return <div>dummy</div>;
    };
    render(<_dummyComponent />);
  });
});
