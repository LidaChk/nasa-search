import React from 'react';
import ErrorBoundary from './components/errorBoundary/errorBoundary';
import './App.css';
import { AppRoutes } from './routes/AppRoutes';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { ThemeProvider } from './providers/themeProvider';

const App: () => React.JSX.Element = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Provider store={store}>
          <AppRoutes />
        </Provider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
