import React, { useState } from 'react';
import { BrandContext } from '../types';
import UserIcon from './icons/UserIcon';

interface ProvideContextProps {
  onSave: (context: BrandContext) => void;
}

const voiceOptions = ["Witty & Humorous", "Professional & Authoritative", "Friendly & Casual", "Inspirational & Uplifting", "Minimal & Modern"];

const ProvideContext: React.FC<ProvideContextProps> = ({ onSave }) => {
  const [brandName, setBrandName] = useState('');
  const [bio, setBio] = useState('');
  const [postExamples, setPostExamples] = useState(['', '']);
  const [brandVoice, setBrandVoice] = useState('');

  const handleExampleChange = (index: number, value: string) => {
    const newExamples = [...postExamples];
    newExamples[index] = value;
    setPostExamples(newExamples);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName.trim()) return;
    const nonEmptyExamples = postExamples.map(p => p.trim()).filter(p => p !== '');
    onSave({ brandName: brandName.trim(), bio: bio.trim(), postExamples: nonEmptyExamples, brandVoice });
  };

  return (
    <div className="animate-fade-in-up">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center justify-center gap-2">
            <UserIcon /> Welcome! Let's Set Up Your Brand Profile
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400">
            This information helps the AI match your unique voice and is saved in your browser for future use.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="brandName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Brand Name / Your Handle <span className="text-red-500">*</span>
          </label>
          <input
            id="brandName"
            type="text"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            placeholder="e.g., @LemmaIoT or Lemma Innovations"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
            required
            autoFocus
          />
        </div>
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Your Bio / Brand Description
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="e.g., We create handcrafted leather goods with a focus on sustainable materials."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
            rows={2}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Examples of Your Recent Posts
          </label>
           <div className="space-y-2">
            {postExamples.map((ex, index) => (
                <input
                    key={index}
                    type="text"
                    value={ex}
                    onChange={(e) => handleExampleChange(index, e.target.value)}
                    placeholder={`Paste post example ${index + 1}`}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                />
            ))}
           </div>
        </div>

         <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            What's Your Brand Voice?
          </label>
           <div className="flex flex-wrap gap-2">
                {voiceOptions.map(voice => (
                    <button
                        key={voice}
                        type="button"
                        onClick={() => setBrandVoice(voice)}
                        className={`px-4 py-2 text-sm font-medium rounded-full border transition-colors ${brandVoice === voice ? 'bg-brand-primary text-white border-brand-primary' : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600'}`}
                    >
                        {voice}
                    </button>
                ))}
           </div>
        </div>

        <div className="flex justify-end items-center pt-2">
              <button
                type="submit"
                disabled={!brandName.trim()}
                className="px-6 py-3 font-semibold text-white bg-brand-primary rounded-lg hover:bg-opacity-90 transition-colors disabled:bg-gray-400"
              >
                Save & Start Generating
              </button>
        </div>
      </form>
    </div>
  );
};

export default ProvideContext;