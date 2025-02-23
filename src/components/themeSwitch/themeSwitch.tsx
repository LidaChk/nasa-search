import React, { useContext, useCallback } from 'react';
import './themeSwitch.css';
import { ThemeContext } from '../../contexts/themeContext';

const ThemeSwitch = (): React.JSX.Element => {
  const { theme, setTheme } = useContext(ThemeContext);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }, [theme, setTheme]);

  return (
    <div
      data-testid="theme-switch"
      className="theme-switch"
      onClick={(e: React.SyntheticEvent) => e.stopPropagation()}
    >
      <input
        type="checkbox"
        id="theme-switch-toggle"
        className="theme-switch__toggle"
        checked={theme === 'light'}
        onChange={toggleTheme}
      />
      <label
        htmlFor="theme-switch-toggle"
        className="theme-switch__label"
      ></label>
    </div>
  );
};

export default ThemeSwitch;
