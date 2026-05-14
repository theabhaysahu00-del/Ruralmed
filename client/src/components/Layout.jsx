import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children, role, language, onLanguageToggle }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar 
        role={role} 
        language={language} 
        onLanguageToggle={onLanguageToggle} 
      />
      
      <div className="flex pt-20">
        <Sidebar role={role} />
        
        <main className="flex-1 ml-20 md:ml-72 p-6 md:p-10 transition-all">
          <div className="max-w-7xl mx-auto">
             {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;

