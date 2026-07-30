import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-screen">
          <h2>⚠️ Something went wrong.</h2>
          <p>The archive hit an unexpected error. You can try again, or reload the page.</p>
          <div className="form-actions" style={{ justifyContent: 'center' }}>
            <button className="btn-secondary" onClick={this.handleReset} type="button">
              Try Again
            </button>
            <button className="btn-primary" onClick={() => window.location.reload()} type="button">
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
