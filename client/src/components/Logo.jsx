import React from 'react';
import { motion } from 'framer-motion';

const Logo = ({ className = '', iconOnly = false, size = 'md' }) => {
  const sizes = {
    sm: { icon: 'w-8 h-8', text: 'text-xl', gap: 'gap-2' },
    md: { icon: 'w-12 h-12', text: 'text-3xl', gap: 'gap-3' },
    lg: { icon: 'w-16 h-16', text: 'text-5xl', gap: 'gap-4' }
  };

  const currentSize = sizes[size] || sizes.md;

  return (
    <div className={`flex items-center ${currentSize.gap} ${className}`}>
      {/* High-Impact Medical Logo */}
      <motion.div 
        whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
        className={`relative ${currentSize.icon} flex-shrink-0 flex items-center justify-center`}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
        
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full relative z-10">
          {/* Main Cross Body */}
          <rect x="38" y="15" width="24" height="70" rx="12" className="fill-primary" />
          <rect x="15" y="38" width="70" height="24" rx="12" className="fill-primary" />
          
          {/* Stylized "Rural" accent - A small heartbeat line in the center */}
          <path 
            d="M35 50H42L45 40L55 60L58 50H65" 
            stroke="white" 
            strokeWidth="4" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          
          {/* Bottom Shadow/Depth */}
          <path 
            d="M38 75C38 81.6274 43.3726 87 50 87C56.6274 87 62 81.6274 62 75" 
            stroke="#0d9488" 
            strokeWidth="2" 
            strokeLinecap="round"
            opacity="0.3"
          />
        </svg>
      </motion.div>
      
      {!iconOnly && (
        <div className="flex flex-col">
          <div className="flex items-baseline">
            <span className={`${currentSize.text} font-black tracking-tighter text-slate-900 dark:text-white uppercase leading-none`}>
              RURAL
            </span>
            <span className={`${currentSize.text} font-black tracking-tighter text-primary uppercase leading-none`}>
              MED
            </span>
          </div>
          {size !== 'sm' && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 whitespace-nowrap">
                Healthcare Connect
              </span>
              <div className="h-[2px] w-full bg-primary/10 dark:bg-primary/20 rounded-full" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;
