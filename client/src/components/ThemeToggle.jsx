import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="relative p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-500 hover:text-primary transition-all shadow-premium overflow-hidden group"
      aria-label="Toggle Theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === 'light' ? (
          <motion.div
            key="moon"
            initial={{ y: 20, opacity: 0, rotate: 45 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -20, opacity: 0, rotate: -45 }}
            transition={{ duration: 0.3, ease: 'backOut' }}
          >
            <Moon className="w-5 h-5" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ y: 20, opacity: 0, rotate: -45 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -20, opacity: 0, rotate: 45 }}
            transition={{ duration: 0.3, ease: 'backOut' }}
          >
            <Sun className="w-5 h-5 text-amber-400" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle Glow Effect */}
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute -inset-1 bg-gradient-to-tr from-primary/10 to-transparent blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.button>
  );
};

export default ThemeToggle;
