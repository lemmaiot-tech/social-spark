import React from 'react';
import { Platform } from '../types';
import InstagramIcon from './icons/InstagramIcon';
import TwitterIcon from './icons/TwitterIcon';
import FacebookIcon from './icons/FacebookIcon';
import LinkedInIcon from './icons/LinkedInIcon';
import TikTokIcon from './icons/TikTokIcon';

interface PlatformSelectorProps {
  onSelect: (platform: Platform) => void;
}

const platforms = [
  { name: Platform.Instagram, icon: <InstagramIcon />, color: "group-hover:text-[#E1306C]" },
  { name: Platform.Twitter, icon: <TwitterIcon />, color: "group-hover:text-[#1DA1F2]" },
  { name: Platform.Facebook, icon: <FacebookIcon />, color: "group-hover:text-[#4267B2]" },
  { name: Platform.LinkedIn, icon: <LinkedInIcon />, color: "group-hover:text-[#0077B5]" },
  { name: Platform.TikTok, icon: <TikTokIcon />, color: "group-hover:text-[#FFFFFF] dark:group-hover:text-black" },
];

const PlatformSelector: React.FC<PlatformSelectorProps> = ({ onSelect }) => {
  return (
    <div className="animate-fade-in-up">
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100 mb-2">Step 1: Choose a Platform</h2>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-8">Where are you planning to post?</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {platforms.map((p) => (
          <button
            key={p.name}
            onClick={() => onSelect(p.name)}
            className="group flex flex-col items-center justify-center p-4 bg-white/50 rounded-lg border border-gray-200 hover:border-brand-primary hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-brand-primary dark:bg-gray-700/50 dark:border-gray-600 dark:hover:border-brand-primary"
            aria-label={`Select ${p.name}`}
          >
            <div className={`w-12 h-12 mb-3 text-gray-500 dark:text-gray-400 transition-colors duration-300 ${p.color}`}>{p.icon}</div>
            <span className="font-semibold text-gray-800 dark:text-gray-200">{p.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PlatformSelector;