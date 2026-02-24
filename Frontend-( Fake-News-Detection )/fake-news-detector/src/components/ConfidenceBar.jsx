export default function ConfidenceBar({ confidence }) {
  // Determine color based on confidence level
  const getColor = (value) => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 60) return 'bg-yellow-500';
    if (value >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const barColor = getColor(confidence);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Confidence Score
        </span>
        <span className="text-sm font-bold text-gray-900 dark:text-white">
          {confidence}%
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
        <div 
          className={`h-full ${barColor} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${confidence}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        70% AI analysis + 30% community feedback
      </p>
    </div>
  );
}
