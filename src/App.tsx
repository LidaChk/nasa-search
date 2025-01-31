import './App.css';

import { Component } from 'react';
import ErrorButton from './components/errorButton/errorButton';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

type AppProps = object;
interface AppState {
  // TODO add types for items
  items: unknown[];

  isLoading: boolean;
  error: string | null;
}

class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      items: [],
      isLoading: false,
      error: null,
    };
  }

  render() {
    return (
      <ErrorBoundary>
        <h1>NASA Image search</h1>
        {
          // TODO
          // <Search onSearch={() => {}} />
          // <CardList items={[]} />
        }
        <div className="app">
          <ErrorButton />
        </div>
      </ErrorBoundary>
    );
  }
}

export default App;
