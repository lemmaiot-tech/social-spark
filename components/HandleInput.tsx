import React, { useState } from 'react';
import { Platform } from '../types';

interface HandleInputProps {
  platform: Platform;
  onSubmit: (handle: string) => void;
  onBack: () => void;
}

const validationRules: { [key in Platform]: { regex: RegExp; minLength: number; maxLength: number; errorMessage: string; } } = {
  [Platform.Twitter]: {
    regex: /^[a-zA-Z0-9_]+$/,
    minLength: 4,
    maxLength: 15,
    errorMessage: 'Twitter handles must be 4-15 characters and can only contain letters, numbers, and underscores.'
  },
  [Platform.Instagram]: {
    regex: /^[a-zA-Z0-9_.]+$/,
    minLength: 1,
    maxLength: 30,
    errorMessage: 'Instagram handles must be 1-30 characters and can only contain letters, numbers, underscores, and periods.'
  },
  [Platform.Facebook]: {
    regex: /^[a-zA-Z0-9.]+$/,
    minLength: 5,
    maxLength: 50,
    errorMessage: 'Facebook usernames must be at least 5 characters long and can only contain letters, numbers, and periods.'
  },
  [Platform.LinkedIn]: {
    regex: /^[a-zA-Z0-9-]+$/,
    minLength: 3,
    maxLength: 100,
    errorMessage: 'LinkedIn vanity URLs must be 3-100 characters long and can only contain letters, numbers, and hyphens.'
  },
  [Platform.TikTok]: {
    regex: /^[a-zA-Z0-9_.]+$/,
    minLength: 2,
    maxLength: 24,
    errorMessage: 'TikTok usernames must be 2-24 characters long and can only contain letters, numbers, underscores, and periods.'
  }
};


const HandleInput: React.FC<HandleInputProps> = ({ platform, onSubmit, onBack }) => {
  const [handle, setHandle] = useState('');
  const [error, setError] = useState<string | null>(null);

  const validateHandle = (value: string): boolean => {
    if (!value.trim()) {
      setError(null);
      return false; // No error if field is empty, but it's not valid for submission.
    }

    const rules = validationRules[platform];

    if (value.length < rules.minLength || value.length > rules.maxLength) {
      setError(rules.errorMessage);
      return false;
    }

    if (!rules.regex.test(value)) {
      setError(rules.errorMessage);
      return false;
    }

    if ((platform === Platform.Instagram || platform === Platform.TikTok) && value.endsWith('.')) {
        setError(`A ${platform} username cannot end with a period.`);
        return false;
    }

    setError(null);
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace('@', '');
    setHandle(value);
    validateHandle(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validateHandle(handle);
    if (handle.trim() && isValid) {
      onSubmit(handle.startsWith('@') ? handle : `@${handle}`);
    }
  };

  return (
    <div className="animate-fade-in-up">
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Step 2: Enter Your Handle</h2>
      <p className="text-center text-gray-600 mb-8">What's your username on {platform}?</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">@</span>
              <input
                type="text"
                value={handle}
                onChange={handleInputChange}
                placeholder="your_username"
                className={`w-full pl-8 pr-4 py-3 bg-gray-50 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-brand-primary focus:border-brand-primary'}`}
                autoFocus
                aria-invalid={!!error}
                aria-describedby="handle-error"
              />
          </div>
          {error && <p id="handle-error" className="text-red-600 text-sm mt-2 text-left">{error}</p>}
        </div>
        <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-transparent rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={!handle.trim() || !!error}
              className="px-6 py-3 font-semibold text-white bg-brand-primary rounded-lg hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300"
            >
              Continue
            </button>
        </div>
      </form>
    </div>
  );
};

export default HandleInput;