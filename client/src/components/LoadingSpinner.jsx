const LoadingSpinner = ({ text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 dark:border-blue-400 border-r-gray-50 dark:border-r-gray-900 align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" 
           role="status"
           aria-label="Loading">
        <span className="sr-only">Loading...</span>
      </div>
      <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">
        {text}
      </p>
    </div>
  );
};

export default LoadingSpinner;