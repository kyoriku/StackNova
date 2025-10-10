import { format } from 'date-fns';

export const ResponsiveDate = ({ date, className = "" }) => {
  return (
    <>
      {/* Short date - mobile only */}
      <time
        dateTime={date}
        className={`sm:hidden ${className}`}
      >
        {format(new Date(date), 'MMM d, yyyy')}
      </time>
      {/* Full date - desktop only */}
      <time
        dateTime={date}
        className={`hidden sm:block ${className}`}
      >
        {format(new Date(date), 'MMMM d, yyyy')}
      </time>
    </>
  );
};