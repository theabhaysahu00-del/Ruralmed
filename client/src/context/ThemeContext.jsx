import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove both classes first to be safe
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    
    // Also set as a data attribute (some plugins use this)
    root.setAttribute('data-theme', theme);
    
    // Direct style injection for background as a fail-safe
    if (theme === 'dark') {
      document.body.style.backgroundColor = '#020617'; // slate-950
    } else {
      document.body.style.backgroundColor = '#ffffff';
    }
    
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
