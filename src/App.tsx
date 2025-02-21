import React from 'react';
import ErrorBoundary from './components/errorBoundary/errorBoundary';
import './App.css';
import { AppRoutes } from './routes/AppRoutes';
import { Provider } from 'react-redux';
import { store } from './store/store';

const App: () => React.JSX.Element = () => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <AppRoutes />
      </Provider>
    </ErrorBoundary>
  );
};

export default App;
