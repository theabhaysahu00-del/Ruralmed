import React from 'react';
import { Clipboard, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const AILoader = () => {
  return (
    <div className="relative flex items-center justify-center w-full h-full overflow-hidden rounded-2xl">
      {/* Neural Background Pulse */}
      <motion.div
        animate={{ 
          opacity: [0.1, 0.3, 0.1],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute inset-0 bg-white/20 rounded-full blur-xl"
      />

      {/* Main Icon */}
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10"
      >
        <Clipboard className="w-10 h-10 text-white fill-white/10" />
      </motion.div>

      {/* Scanning Laser Line */}
      <motion.div
        animate={{ top: ['0%', '100%', '0%'] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
        className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_10px_#fff] z-20"
      />

      {/* Scanning Glow */}
      <motion.div
        animate={{ top: ['0%', '100%', '0%'] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
        className="absolute left-0 right-0 h-8 bg-white/10 blur-md z-15"
      />
    </div>
  );
};

export default AILoader;
