import { useNavigate } from 'react-router-dom';

export const FormActions = ({ isSubmitting, isDisabled }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => navigate('/dashboard')}
        className="px-4 py-2 bg-gray-500 text-white rounded-lg
                 hover:bg-gray-600 transition-colors cursor-pointer"
        disabled={isSubmitting}
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isSubmitting || isDisabled}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg
                 hover:bg-blue-700 transition-colors cursor-pointer 
                 disabled:opacity-50 disabled:cursor-not-allowed min-w-[117px]"
      >
        {isSubmitting ? (
          <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-r-transparent align-[-0.125em]" />
        ) : (
          'Create Post'
        )}
      </button>
    </div>
  );
};