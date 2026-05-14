import React, { useState } from 'react';
import { Globe, User, Bell, LogOut, Activity, Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import ThemeToggle from './ThemeToggle';
import Logo from './Logo';

const Navbar = ({ role = 'Patient' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme, liteMode, toggleLiteMode } = useTheme();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { i18n } = useTranslation();
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  const toggleLanguage = () => {
    const langs = ['en', 'hi', 'pa'];
    const nextIndex = (langs.indexOf(i18n.language) + 1) % langs.length;
    i18n.changeLanguage(langs[nextIndex]);
  };

  const currentLangLabel = i18n.language.toUpperCase();

  return (
    <>
      <nav className="h-20 liquid-glass border-b border-slate-100 dark:border-slate-800 fixed top-0 left-0 right-0 z-50 px-4 md:px-10 flex items-center justify-between transition-all overflow-hidden">
        <div className="flex items-center gap-8 relative z-10">
          <div className="cursor-pointer" onClick={() => navigate(`/${role.toLowerCase()}`)}>
            <Logo size="md" />
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-4 relative z-10">
          <div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-2xl p-1 border border-slate-100 dark:border-slate-700">
             <button 
              onClick={toggleLanguage}
              className="px-4 py-2 bg-white dark:bg-slate-900 shadow-sm rounded-xl text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2"
             >
               <Globe className="w-3 h-3" /> {currentLangLabel}
             </button>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={toggleLiteMode}
              title={liteMode ? "Disable Lite Mode" : "Enable Lite Mode (Low Bandwidth)"}
              className={`p-3 rounded-2xl transition-all shadow-lg hover:scale-110 flex items-center gap-2 ${liteMode ? 'bg-amber-500 text-white' : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800'}`}
            >
              <Activity className={`w-5 h-5 ${liteMode ? 'animate-pulse' : ''}`} />
              {liteMode && <span className="text-[10px] font-black uppercase tracking-widest">Lite</span>}
            </button>
            
            <ThemeToggle />
          </div>

          <button className="relative p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-500 hover:text-primary transition-all shadow-lg hover:scale-110">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
          </button>
          
          <div className="flex items-center gap-4 pl-4 border-l border-slate-100 dark:border-slate-800">
            <div className="text-right hidden sm:block">
               <p className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-tight">{user?.name || 'Guest User'}</p>
               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{role}</p>
            </div>
            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-xl overflow-hidden group cursor-pointer">
              <User className="w-6 h-6 text-slate-400 group-hover:text-primary transition-all" />
            </div>

            <button 
              onClick={handleLogout}
              className="p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg hover:scale-110"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="flex lg:hidden items-center gap-3">
          <ThemeToggle />
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-600 dark:text-slate-400"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden pt-20">
          <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
          <div className="relative bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 p-6 flex flex-col gap-6 animate-in slide-in-from-top duration-300">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-800 dark:text-white uppercase">{user?.name || 'Guest User'}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">{role}</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="p-3 bg-red-500 text-white rounded-xl shadow-lg shadow-red-500/20"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button onClick={toggleLanguage} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl flex flex-col items-center gap-2 border border-slate-100 dark:border-slate-800">
                <Globe className="w-5 h-5 text-primary" />
                <span className="text-[10px] font-black uppercase">{currentLangLabel}</span>
              </button>
              <button onClick={toggleLiteMode} className={`p-4 rounded-2xl flex flex-col items-center gap-2 border ${liteMode ? 'bg-amber-500 text-white border-amber-600' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-800'}`}>
                <Activity className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase">Lite Mode</span>
              </button>
            </div>
            
            <button className="w-full py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20">
              Emergency Center
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;

