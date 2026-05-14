import React from 'react';
import { Video } from 'lucide-react';
import { motion } from 'framer-motion';

const ConsultationLoader = () => {
  return (
    <div className="relative flex items-center justify-center w-full h-full">
      {/* Signal Waves */}
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute w-12 h-12 border-2 border-white/40 rounded-full"
          initial={{ scale: 0.8, opacity: 0.8 }}
          animate={{ scale: 2.2, opacity: 0 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.6,
            ease: "easeOut"
          }}
        />
      ))}
      
      {/* Camera Icon */}
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, -5, 5, 0]
        }}
        transition={{ duration: 3, repeat: Infinity }}
        className="relative z-10"
      >
        <Video className="w-10 h-10 text-white fill-white/20" />
      </motion.div>

      {/* Recording Dot */}
      <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
    </div>
  );
};

export default ConsultationLoader;
