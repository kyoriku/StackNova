export const TitleInput = ({ value, onChange, disabled }) => (
  <div>
    <label
      htmlFor="title"
      className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
    >
      Title
    </label>
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