// ErrorBoundary.jsx
import { Component } from 'react';

export class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('Error caught by boundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center p-8">
          <h2 className="text-xl font-bold text-red-600 mb-2">Something went wrong</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please try refreshing the page
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}