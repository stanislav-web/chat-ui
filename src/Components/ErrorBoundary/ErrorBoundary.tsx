import React from 'react';
import { type IErrorState } from './interfaces/i.error-state';

class ErrorBoundary extends React.Component<any, IErrorState> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any): IErrorState {
    return {
      hasError: true,
      error: error.toString(),
      errorInfo: error
    };
  }

  render(): React.JSX.Element {
    if (this.state.hasError) {
      return <div>
        <h2>Something went wrong.</h2>
        <details style={{ whiteSpace: 'pre-wrap' }}>
          {this.state.error}
          <br />
          {this.state.errorInfo.componentStack}
        </details>
      </div>
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
