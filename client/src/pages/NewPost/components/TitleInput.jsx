export const TitleInput = ({ value, onChange, disabled, maxChars = 100 }) => {
  const charCount = value.length;
  const remaining = maxChars - charCount;
  const isOverLimit = remaining < 0;
  const isNearLimit = remaining < 20 && remaining >= 0;

  let counterColorClass = 'text-gray-500 dark:text-gray-400';
  
  if (isOverLimit) {
    counterColorClass = 'text-red-600 dark:text-red-400';
  } else if (isNearLimit) {
    counterColorClass = 'text-yellow-600 dark:text-yellow-400';
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-900 dark:text-white"
        >
          Title
        </label>
        <span 
          className={`text-sm ${counterColorClass}`}
          aria-label="Character count"
        >
          {charCount} / {maxChars}
          {isOverLimit && ' (exceeds limit)'}
        </span>
      </div>
      <input
        type="text"
        id="title"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 rounded-lg
                 bg-white dark:bg-gray-700 
                 text-gray-900 dark:text-white 
                 border border-gray-200 dark:border-gray-600
                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                 disabled:opacity-50 disabled:cursor-not-allowed"
        placeholder="Enter post title"
        disabled={disabled}
        required
        aria-required="true"
      />
    </div>
  );
};