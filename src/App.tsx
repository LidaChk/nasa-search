import './App.css';

import { Component } from 'react';
import ErrorBoundary from './components/errorBoundary/errorBoundary';
import Search from './components/search/search';
import { LS_KEY_SEARCH_TERM } from './constants/constants';
import { searchResultItem } from './types/types';
import { searchImages } from './api/nasaApi';
import CardList from './components/cardList/cardList';
import ErrorCatchWrapper from './components/errorCatchWrapper/errorCatchWrapper';

type AppProps = object;
interface AppState {
  items: searchResultItem[];
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
    });
  };

  render() {
    return (
      <ErrorBoundary>
        <h1>NASA Image search</h1>
        <ErrorCatchWrapper error={this.state.error}>
          <Search
            onSearch={this.onSearch}
            initialSearchTerm={this.state.searchTerm}
          />
          <CardList items={this.state.items} isLoading={this.state.isLoading} />
          <div className="app"></div>
        </ErrorCatchWrapper>
      </ErrorBoundary>
    );
  }
}

export default App;
