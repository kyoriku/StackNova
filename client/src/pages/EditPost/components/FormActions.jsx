import { useNavigate } from 'react-router-dom';

export const FormActions = ({ isSubmitting, actionText = 'Save' }) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-end gap-3">
      <button
        type="button"
        onClick={() => navigate('/dashboard')}
        className="px-4 py-2 rounded-lg
                 bg-gray-100 dark:bg-gray-700
                 text-gray-700 dark:text-gray-300
                 hover:bg-gray-200 dark:hover:bg-gray-600
                 disabled:opacity-50 disabled:cursor-not-allowed
                 cursor-pointer"
        disabled={isSubmitting}
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 rounded-lg min-w-[122px]
                 bg-blue-600 text-white
                 hover:bg-blue-700
                 disabled:opacity-50 disabled:cursor-not-allowed
                 cursor-pointer
                 flex items-center justify-center"
      >
        {isSubmitting ? (
          <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-r-transparent align-[-0.125em]" aria-hidden="true" />
        ) : (
          actionText
        )}
      </button>
    </div>
  );
};