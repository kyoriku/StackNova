export const CharacterCounter = ({ current, min, max }) => {
  // Calculate if we're below minimum, near maximum, or at maximum
  const isBelowMin = current < min;
  const isNearMax = current > max * 0.8; // 80% of max
  const isAtMax = current >= max;

  // Determine text color based on character count
  let textColorClass = 'text-gray-700 dark:text-gray-300';

  if (isBelowMin) {
    textColorClass = 'text-amber-500 dark:text-amber-400';
  } else if (isAtMax) {
    textColorClass = 'text-red-500 dark:text-red-400';
  } else if (isNearMax) {
    textColorClass = 'text-amber-500 dark:text-amber-400';
  }

  return (
    <div className={`text-xs ${textColorClass} flex items-center gap-2`}>
      <span>{current}/{max}</span>
      {isBelowMin && (
        <span className="font-medium">
          (Min {min} required)
        </span>
      )}
    </div>
  );
};