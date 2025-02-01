import './App.css';

import { Component } from 'react';
import ErrorButton from './components/errorButton/errorButton';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import Search from './components/Search/Search';
import { LS_KEY_SEARCH_TERM } from './constants/constants';
import { ImageResult, searchImages } from './api/nasaApi';

type AppProps = object;
interface AppState {
  items: ImageResult;
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
}

class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      items: [],
      isLoading: false,
      error: null,
      searchTerm: localStorage.getItem(LS_KEY_SEARCH_TERM) || '',
    };
  }
  componentDidMount() {
    this.fetchImages(this.state.searchTerm);
  }

  fetchImages = async (searchTerm: string) => {
    try {
      this.setState({ isLoading: true, error: null });

      const response = await searchImages({ query: searchTerm });

      this.setState({
        items: response,
        isLoading: false,
      });
    } catch (error) {
      this.setState({
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false,
      });
    }
  };

  onSearch = (newSearchTerm: string) => {
    localStorage.setItem(LS_KEY_SEARCH_TERM, newSearchTerm);

    this.setState({ searchTerm: newSearchTerm }, () => {
      this.fetchImages(newSearchTerm);
      console.log('Search term:', newSearchTerm);
    });
  };

  render() {
    return (
      <ErrorBoundary>
        <h1>NASA Image search</h1>
        <Search
          onSearch={this.onSearch}
          initialSearchTerm={this.state.searchTerm}
        />
        {
          // TODO
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
