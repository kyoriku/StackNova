export const TitleInput = ({ value, onChange, disabled, maxChars = 100 }) => {
  const charCount = value.length;
  const isNearLimit = charCount > maxChars * 0.8; // 80% of max
  const isAtLimit = charCount >= maxChars;

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
          className={`text-xs ${isAtLimit
            ? 'text-red-500 dark:text-red-400'
            : isNearLimit
              ? 'text-amber-500 dark:text-amber-400'
              : 'text-gray-700 dark:text-gray-300'
            }`}
        >
          {charCount}/{maxChars}
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
        maxLength={maxChars}
      />
    </div>
  );
};