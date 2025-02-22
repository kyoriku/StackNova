// src/components/LoadingSpinner.jsx
const LoadingSpinner = ({ text }) => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-[calc(100vh-16rem)]">
      <div 
        className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent align-[-0.125em]" 
        role="status"
        aria-label="Loading"
      />
      {text && <p className="mt-4 text-sm text-gray-500">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;