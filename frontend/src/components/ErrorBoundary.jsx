import { Component } from 'react';

// Without this, any uncaught error thrown during render anywhere in the tree
// unmounts the entire React app, leaving a blank white page until the user
// manually refreshes. This boundary catches that instead and shows a small
// recoverable panel with a reload button, and — importantly — a "Try again"
// option, since the error is often tied to whatever view is currently open
// (e.g. a modal left in a bad state) rather than the whole app.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Surface it in the console so it's still debuggable during development,
    // instead of silently swallowing it.
    console.error('Unhandled UI error:', error, info?.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
          <div className="text-center px-3">
            <i className="bi bi-exclamation-triangle text-danger" style={{ fontSize: '2.5rem' }} />
            <h5 className="mt-3 mb-1">Something went wrong</h5>
            <p className="text-muted small mb-3">
              This screen ran into an unexpected error. You can try again without losing your session.
            </p>
            <div className="d-flex gap-2 justify-content-center">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => this.setState({ error: null })}
              >
                Try again
              </button>
              <button
                type="button"
                className="btn btn-brand btn-sm"
                onClick={() => window.location.reload()}
              >
                Reload page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
