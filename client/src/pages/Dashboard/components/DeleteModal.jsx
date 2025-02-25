import { X } from 'lucide-react';

export const DeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  itemName,
  itemType = "Item"
}) => {
  if (!isOpen) return null;

  const modalId = "delete-confirmation-modal";
  const modalTitleId = "delete-modal-title";
  const modalDescriptionId = "delete-modal-description";

  return (
    <div
      className="fixed inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-[1px] flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby={modalTitleId}
      aria-describedby={modalDescriptionId}
      id={modalId}
    >
      <section className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4 shadow-lg border border-gray-200 dark:border-gray-700">
        <header className="flex justify-between items-center mb-4">
          <h2
            id={modalTitleId}
            className="text-lg font-semibold text-gray-900 dark:text-white"
          >
            Delete {itemType}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 
              cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>
        <p
          id={modalDescriptionId}
          className="text-gray-600 dark:text-gray-300 mb-6"
        >
          Are you sure you want to delete "{itemName}"? This action cannot be undone.
        </p>
        <footer className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg 
                    dark:text-gray-300 dark:bg-gray-700 
                    [&:hover]:bg-gray-200 dark:[&:hover]:bg-gray-600 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 text-white bg-red-600 rounded-lg 
              hover:bg-red-700 
              disabled:opacity-50 disabled:cursor-not-allowed 
              cursor-pointer min-w-[79px]
              flex items-center justify-center"
            aria-busy={isDeleting}
          >
            {isDeleting ? (
              <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-r-transparent align-[-0.125em]" aria-hidden="true" />
            ) : (
              'Delete'
            )}
          </button>
        </footer>
      </section>
    </div>
  );
};