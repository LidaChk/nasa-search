import { Component } from 'react';
import './errorButton.css';

class ErrorButton extends Component {
  state = { hasError: false };

  handleClick = () => {
    this.setState({ hasError: true });
  };

  render() {
    if (this.state.hasError) {
      throw new Error('Test Error');
    }

    return (
      <button onClick={this.handleClick} className="error-button">
        Throw Error
      </button>
    );
  }
}

export default ErrorButton;
