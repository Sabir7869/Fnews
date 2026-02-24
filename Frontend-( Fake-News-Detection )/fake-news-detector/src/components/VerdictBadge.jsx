export default function VerdictBadge({ verdict }) {
  // Map backend values to display values
  const verdictMap = {
    REAL: 'TRUE',
    FAKE: 'FALSE',
    MISLEADING: 'PARTIALLY_TRUE'
  };
  
  const normalizedVerdict = verdictMap[verdict] || verdict;
  
  const config = {
    TRUE: {
      bg: 'bg-green-100 dark:bg-green-900',
      text: 'text-green-800 dark:text-green-200',
      border: 'border-green-300 dark:border-green-700',
      label: '✓ TRUE'
    },
    FALSE: {
      bg: 'bg-red-100 dark:bg-red-900',
      text: 'text-red-800 dark:text-red-200',
      border: 'border-red-300 dark:border-red-700',
      label: '✗ FALSE'
    },
    PARTIALLY_TRUE: {
      bg: 'bg-yellow-100 dark:bg-yellow-900',
      text: 'text-yellow-800 dark:text-yellow-200',
      border: 'border-yellow-300 dark:border-yellow-700',
      label: '◐ PARTIALLY TRUE'
    },
    UNVERIFIABLE: {
      bg: 'bg-gray-100 dark:bg-gray-800',
      text: 'text-gray-800 dark:text-gray-200',
      border: 'border-gray-300 dark:border-gray-600',
      label: '? UNVERIFIABLE'
    },
    PENDING: {
      bg: 'bg-blue-100 dark:bg-blue-900',
      text: 'text-blue-800 dark:text-blue-200',
      border: 'border-blue-300 dark:border-blue-700',
      label: '⏳ PENDING'
    }
  };

  const style = config[normalizedVerdict] || config.PENDING;

  return (
    <span 
      className={`
        inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold
        border ${style.bg} ${style.text} ${style.border}
      `}
    >
      {style.label}
    </span>
  );
}
