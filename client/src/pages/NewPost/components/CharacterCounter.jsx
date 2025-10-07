export const CharacterCounter = ({ current, min, max }) => {
  const remaining = max - current;
  const isOverLimit = remaining < 0;
  const isNearLimit = remaining < 500 && remaining >= 0;

  let textColorClass = 'text-gray-500 dark:text-gray-400';

  if (isOverLimit) {
    textColorClass = 'text-red-600 dark:text-red-400';
  } else if (isNearLimit) {
    textColorClass = 'text-yellow-600 dark:text-yellow-400';
  }

  return (
    <div
      className={`text-sm font-semibold ${textColorClass}`}
      aria-label="Character count"
    >
      {current} / {max}
      {isOverLimit && ' (exceeds limit)'}
    </div>
  );
};