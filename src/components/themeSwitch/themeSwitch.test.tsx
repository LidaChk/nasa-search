import React from 'react';
import { render, screen, fireEvent, createEvent } from '@testing-library/react';
import { Theme, ThemeContext } from '../../contexts/themeContext';
import ThemeSwitch from './themeSwitch';

describe('ThemeSwitch', () => {
  const mockSetTheme = jest.fn();

  const renderWithThemeContext = (initialTheme: Theme = 'light') => {
    return render(
      <ThemeContext.Provider
        value={{ theme: initialTheme, setTheme: mockSetTheme }}
      >
        <ThemeSwitch />
      </ThemeContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly with light theme', () => {
    renderWithThemeContext('light');

    const toggleSwitch = screen.getByRole('checkbox');
    expect(toggleSwitch).toBeInTheDocument();
    expect(toggleSwitch).not.toBeChecked();
  });

  test('renders correctly with dark theme', () => {
    renderWithThemeContext('dark');

    const toggleSwitch = screen.getByRole('checkbox');
    expect(toggleSwitch).toBeInTheDocument();
    expect(toggleSwitch).toBeChecked();
  });

  test('toggles theme from light to dark when clicked', () => {
    renderWithThemeContext('light');

    const toggleSwitch = screen.getByRole('checkbox');
    fireEvent.click(toggleSwitch);

    expect(mockSetTheme).toHaveBeenCalledTimes(1);
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  test('toggles theme from dark to light when clicked', () => {
    renderWithThemeContext('dark');

    const toggleSwitch = screen.getByRole('checkbox');
    fireEvent.click(toggleSwitch);

    expect(mockSetTheme).toHaveBeenCalledTimes(1);
    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });

  test('stops event propagation when clicked', () => {
    renderWithThemeContext();

    const container = screen.getByTestId('theme-switch');
    const event = createEvent.click(container);
    jest.spyOn(event, 'stopPropagation');

    fireEvent(container, event);

    expect(event.stopPropagation).toHaveBeenCalled();
  });

  test('has correct CSS classes', () => {
    renderWithThemeContext();

    const container = screen.getByTestId('theme-switch');
    const toggle = screen.getByRole('checkbox');

    expect(container).toHaveClass('theme-switch');
    expect(toggle).toHaveClass('theme-switch__toggle');
  });

  test('updates when theme context changes', () => {
    const { rerender } = renderWithThemeContext('light');

    const toggleSwitch = screen.getByRole('checkbox');
    expect(toggleSwitch).not.toBeChecked();

    rerender(
      <ThemeContext.Provider value={{ theme: 'dark', setTheme: mockSetTheme }}>
        <ThemeSwitch />
      </ThemeContext.Provider>
    );

    expect(toggleSwitch).toBeChecked();
  });
  afterAll(() => {
    const _dummyComponent = (): React.JSX.Element => {
      return <div>dummy</div>;
    };
    render(<_dummyComponent />);
  });
});
