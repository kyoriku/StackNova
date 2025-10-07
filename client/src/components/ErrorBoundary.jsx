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
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-16rem)] p-8">
          <div className="max-w-md w-full p-6 bg-red-50 dark:bg-red-900/20 
                        border border-red-200 dark:border-red-800 rounded-xl
                        shadow-sm shadow-red-200/30 dark:shadow-md dark:shadow-black/10
                        text-center">
            <h2 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-3">
              Something went wrong
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Please try refreshing the page. If the problem persists, contact support.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 
                       dark:bg-blue-500 dark:hover:bg-blue-600
                       text-white font-medium rounded-lg 
                       transition-colors duration-200 cursor-pointer
                       shadow-sm dark:shadow-md dark:shadow-black/10"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}