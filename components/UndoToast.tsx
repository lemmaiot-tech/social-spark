import React from 'react';

interface UndoToastProps {
  message: string;
  onUndo: () => void;
}

const UndoToast: React.FC<UndoToastProps> = ({ message, onUndo }) => {
  return (
    <div 
      className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-gray-800 text-white py-3 px-5 rounded-lg shadow-xl flex items-center justify-between gap-4 animate-slide-in-up z-50 dark:bg-gray-200 dark:text-gray-800"
      role="status"
      aria-live="polite"
    >
      <span>{message}</span>
      <button 
        onClick={onUndo} 
        className="font-semibold text-brand-secondary hover:text-opacity-80 transition-opacity dark:text-brand-primary dark:hover:opacity-80"
      >
        Undo
      </button>
    </div>
  );
};

export default UndoToast;