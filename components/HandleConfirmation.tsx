import React from 'react';
import { Platform } from '../types';

interface HandleConfirmationProps {
  platform: Platform;
  handle: string;
  onConfirm: () => void;
  onEdit: () => void;
}

const HandleConfirmation: React.FC<HandleConfirmationProps> = ({ platform, handle, onConfirm, onEdit }) => {
  return (
    <div className="animate-fade-in-up text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Is this correct?</h2>
      <div className="bg-gray-50/50 p-6 rounded-lg border border-gray-200 mb-8">
        <p className="text-gray-600">Platform: <span className="font-semibold text-gray-800">{platform}</span></p>
        <p className="text-gray-600">Handle: <span className="font-semibold text-brand-primary">{handle}</span></p>
      </div>
      <div className="flex justify-center items-center gap-4">
        <button
          onClick={onEdit}
          className="px-6 py-3 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-300"
        >
          No, go back
        </button>
        <button
          onClick={onConfirm}
          className="px-6 py-3 font-semibold text-white bg-brand-primary rounded-lg hover:bg-opacity-90 transition-colors duration-300"
        >
          Yes, continue
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-8">
        Note: Real-time handle verification requires API access to social media platforms which is not implemented in this demo. We are proceeding with the handle you provided.
      </p>
    </div>
  );
};

export default HandleConfirmation;