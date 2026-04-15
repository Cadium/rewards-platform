import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="error-fullpage">
          <span className="error-fullpage-icon">⚠</span>
          <h2 className="error-fullpage-title">Something went wrong</h2>
          <p className="error-fullpage-msg">{this.state.error.message}</p>
          <button
            className="btn-ghost"
            onClick={() => this.setState({ error: null })}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
