import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="text-center mt-12 py-6 border-t border-gray-200 dark:border-gray-700">
      <div className="flex flex-col items-center gap-4">
        <a 
            href="https://lemmaiot.com.ng" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="LemmaIoT Homepage"
            className="transition-transform transform hover:scale-105"
        >
            <img 
            src="https://loveemma.carrd.co/assets/images/gallery02/d3788757.png" 
            alt="LemmaIoT Logo" 
            className="h-16 w-auto"
            />
        </a>
        <p className="text-gray-600 dark:text-gray-400 text-sm max-w-md">
          Product of <a href="https://lemmaiot.com.ng" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-primary hover:underline">LemmaIoT</a> Cloud Solution to aid Nigerian Business.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
