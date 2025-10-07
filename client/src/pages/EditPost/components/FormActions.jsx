import { useNavigate } from 'react-router-dom';

export const FormActions = ({ isSubmitting, isDisabled, actionText = 'Save' }) => {
  const navigate = useNavigate();

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => navigate('/dashboard')}
        className="px-5 py-2.5 rounded-xl
                 bg-white dark:bg-gray-800 
                 text-gray-700 dark:text-gray-300
                 border-2 border-gray-200 dark:border-gray-700
                 hover:bg-gray-50 dark:hover:bg-gray-750
                 hover:border-gray-300 dark:hover:border-gray-600
                 font-semibold text-sm
                 transition-all duration-200 cursor-pointer
                 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isSubmitting}
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isSubmitting || isDisabled}
        className="px-5 py-2.5 rounded-xl
                 bg-gradient-to-r from-blue-500 to-purple-500
                 dark:from-blue-600 dark:to-purple-600
                 text-white font-semibold text-sm
                 hover:shadow-lg hover:shadow-blue-500/30 dark:hover:shadow-blue-500/40
                 hover:scale-105
                 transition-all duration-200 cursor-pointer 
                 disabled:opacity-50 disabled:cursor-not-allowed
                 disabled:hover:scale-100 disabled:hover:shadow-none
                 min-w-[130px] flex items-center justify-center"
      >
        {isSubmitting ? (
          <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-r-transparent align-[-0.125em]" />
        ) : (
          actionText
        )}
      </button>
    </div>
  );
};