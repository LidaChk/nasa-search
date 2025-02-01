import { Component } from 'react';
import './search.css';

interface Props {
  onSearch: (searchTerm: string) => void;
  initialSearchTerm: string;
}

interface State {
  searchTerm: string;
}

class Search extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      searchTerm: props.initialSearchTerm,
    };
  }

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchTerm: e.target.value });
  };

  handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedSearchTerm = this.state.searchTerm.trim();
    this.props.onSearch(trimmedSearchTerm);
  };
  render() {
    const { searchTerm } = this.state;

    return (
      <form
        onSubmit={this.handleSearch}
        className="search-form"
        aria-label="search"
      >
        <input
          type="search"
          className="search-input"
          placeholder="Search..."
          value={searchTerm}
          onChange={this.handleInputChange}
        />
        <button className="search-button">Search</button>
      </form>
    );
  }
}

export default Search;
