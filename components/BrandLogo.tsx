import React from 'react';

const BrandLogo: React.FC = () => (
  <a 
    href="https://lemmaiot.com.ng" 
    target="_blank" 
    rel="noopener noreferrer"
    aria-label="LemmaIoT Homepage"
    className="flex justify-center mb-4 transition-transform transform hover:scale-105"
  >
    <img 
      src="https://loveemma.carrd.co/assets/images/gallery02/d3788757.png" 
      alt="Brand Logo" 
      className="h-24 w-auto"
    />
  </a>
);

export default BrandLogo;
