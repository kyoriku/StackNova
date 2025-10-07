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
          className="block text-sm font-semibold text-gray-900 dark:text-gray-300"
        >
          Title
        </label>
        <span
          className={`text-sm font-semibold ${counterColorClass}`}
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
        className="w-full px-4 py-3 rounded-xl
                 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm
                 text-gray-900 dark:text-gray-100 
                 border-2 border-gray-200 dark:border-gray-700
                 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400
                 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30
                 placeholder:text-gray-400 dark:placeholder:text-gray-500
                 disabled:opacity-50 disabled:cursor-not-allowed
                 transition-all duration-200
                 shadow-sm shadow-gray-900/5 dark:shadow-black/20"
        placeholder="Enter an engaging title for your post"
        disabled={disabled}
        required
        aria-required="true"
      />
    </div>
  );
};