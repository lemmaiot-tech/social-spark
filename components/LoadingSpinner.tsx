import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 animate-fade-in">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-brand-primary mb-6"></div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Generating Ideas...</h2>
      <p className="text-gray-600 dark:text-gray-400">Our AI is crafting the perfect content for you. This might take a moment.</p>
    </div>
  );
};

export default LoadingSpinner;