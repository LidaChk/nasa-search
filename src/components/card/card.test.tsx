import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import Card from './card';
import { mockItem } from '../__mocks__/mocks';

const BrowserRouterComponent = (): React.JSX.Element => {
  return (
    <BrowserRouter>
      <Card {...mockItem} />
    </BrowserRouter>
  );
};

const renderCard = () => {
  return render(<BrowserRouterComponent />);
};

describe('Card Component', () => {
  it('renders card with correct content', () => {
    renderCard();

    expect(screen.getByText(mockItem.title)).toBeInTheDocument();
    expect(screen.getByText(mockItem.description)).toBeInTheDocument();
    const image = screen.getByAltText(mockItem.title);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockItem.preview.href);
  });

  it('renders link with correct navigation path', () => {
    renderCard();

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute(
      'href',
      expect.stringContaining(`/details/${mockItem.nasaId}`)
    );
  });

  it('applies correct CSS classes', () => {
    renderCard();

    expect(screen.getByRole('link')).toHaveClass('card');
    expect(screen.getByRole('img').parentElement).toHaveClass(
      'card__image-container'
    );
    expect(screen.getByRole('img')).toHaveClass('card__image');
    expect(screen.getByText(mockItem.title).parentElement).toHaveClass(
      'card__content'
    );
  });
});
