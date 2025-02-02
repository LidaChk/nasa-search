import { Component, ReactNode } from 'react';

interface Props {
  error: string | null;
  children: ReactNode;
}

class ErrorCatchWrapper extends Component<Props> {
  render() {
    if (this.props.error) {
      throw new Error(this.props.error);
    }
    return this.props.children;
  }
}

export default ErrorCatchWrapper;
