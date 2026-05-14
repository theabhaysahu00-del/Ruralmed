import React, { useState, useEffect } from 'react';
import {
  Settings, Globe, Bell, Shield, Lock, Palette,
  Save, Loader2, ToggleLeft, ToggleRight,
  Mail, Phone, Monitor, Moon, Sun, Languages, Server, Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import { adminAPI } from '../services/api';
import toast from 'react-hot-toast';

const Toggle = ({ checked, onChange, label, description }) => (
  <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group">
    <div>
      <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{label}</p>
      {description && <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{description}</p>}
    </div>
    <button onClick={onChange} className="transition-all hover:scale-110">
      {checked ? (
        <ToggleRight className="w-10 h-10 text-emerald-500" />
      ) : (
        <ToggleLeft className="w-10 h-10 text-slate-300 dark:text-slate-600" />
      )}
    </button>
  </div>
);

const AdminSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('platform');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await adminAPI.getSettings();
        setSettings(res.data);
      } catch (err) {
        // Fallback defaults
        setSettings({
          siteName: 'RuralMed',
          supportEmail: 'support@ruralmed.in',
          supportPhone: '+91 98765 43210',
          maintenanceMode: false,
          allowNewRegistrations: true,
          requireDoctorVerification: true,
          defaultLanguage: 'en',
          maxLoginAttempts: 5,
          sessionTimeout: 60,
          emailNotifications: true,
          smsNotifications: false,
          emergencyAlerts: true,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminAPI.updateSettings(settings);
      toast.success('Settings saved successfully');
    } catch (err) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const tabs = [
    { id: 'platform', label: 'Platform', icon: Server },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
            <Settings className="w-8 h-8 text-slate-500" />
            Platform Settings
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">
            Configure system preferences & security policies
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 disabled:opacity-60 transition-all"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : 'Save Changes'}
        </motion.button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg'
                : 'bg-white dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-800 hover:border-indigo-300'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Platform Settings */}
      {activeTab === 'platform' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-lg space-y-6"
        >
          <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2 px-2">
            <Server className="w-5 h-5 text-indigo-500" /> General Configuration
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Platform Name</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => updateField('siteName', e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Support Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => updateField('supportEmail', e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl pl-11 pr-5 py-3.5 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Support Phone</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={settings.supportPhone}
                  onChange={(e) => updateField('supportPhone', e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl pl-11 pr-5 py-3.5 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Default Language</label>
              <div className="relative">
                <Languages className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  value={settings.defaultLanguage}
                  onChange={(e) => updateField('defaultLanguage', e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl pl-11 pr-5 py-3.5 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none transition-all"
                >
                  <option value="en">English</option>
                  <option value="hi">हिंदी (Hindi)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4">
            <Toggle
              checked={settings.maintenanceMode}
              onChange={() => updateField('maintenanceMode', !settings.maintenanceMode)}
              label="Maintenance Mode"
              description="Temporarily disable platform access for non-admins"
            />
            <Toggle
              checked={settings.allowNewRegistrations}
              onChange={() => updateField('allowNewRegistrations', !settings.allowNewRegistrations)}
              label="Allow New Registrations"
              description="Enable or disable new user sign-ups"
            />
            <Toggle
              checked={settings.requireDoctorVerification}
              onChange={() => updateField('requireDoctorVerification', !settings.requireDoctorVerification)}
              label="Require Doctor Verification"
              description="Doctors must be verified before accessing the portal"
            />
          </div>
        </motion.div>
      )}

      {/* Notification Settings */}
      {activeTab === 'notifications' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-lg space-y-6"
        >
          <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2 px-2">
            <Bell className="w-5 h-5 text-amber-500" /> Notification Preferences
          </h3>
          <div className="space-y-3">
            <Toggle
              checked={settings.emailNotifications}
              onChange={() => updateField('emailNotifications', !settings.emailNotifications)}
              label="Email Notifications"
              description="Send appointment confirmations and alerts via email"
            />
            <Toggle
              checked={settings.smsNotifications}
              onChange={() => updateField('smsNotifications', !settings.smsNotifications)}
              label="SMS Notifications"
              description="Send SMS alerts for critical updates"
            />
            <Toggle
              checked={settings.emergencyAlerts}
              onChange={() => updateField('emergencyAlerts', !settings.emergencyAlerts)}
              label="Emergency Alerts"
              description="Instant notifications for emergency consultation requests"
            />
          </div>
        </motion.div>
      )}

      {/* Security Settings */}
      {activeTab === 'security' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-lg space-y-6"
        >
          <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2 px-2">
            <Lock className="w-5 h-5 text-red-500" /> Security Policies
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Max Login Attempts</label>
              <input
                type="number"
                min={1} max={20}
                value={settings.maxLoginAttempts}
                onChange={(e) => updateField('maxLoginAttempts', parseInt(e.target.value) || 5)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
              />
              <p className="text-[9px] font-bold text-slate-400 mt-1 px-1">Account locks after this many failed attempts</p>
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Session Timeout (minutes)</label>
              <input
                type="number"
                min={5} max={1440}
                value={settings.sessionTimeout}
                onChange={(e) => updateField('sessionTimeout', parseInt(e.target.value) || 60)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
              />
              <p className="text-[9px] font-bold text-slate-400 mt-1 px-1">Auto-logout inactive sessions</p>
            </div>
          </div>

          {/* Security Features Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            {[
              { icon: Shield, label: 'Helmet.js', desc: 'HTTP headers protection', active: true },
              { icon: Zap, label: 'Rate Limiting', desc: 'API abuse prevention', active: true },
              { icon: Lock, label: 'JWT Auth', desc: 'Token-based authentication', active: true },
            ].map(f => (
              <div key={f.label} className="p-5 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center gap-3 mb-2">
                  <f.icon className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{f.label}</span>
                </div>
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{f.desc}</p>
                <span className="inline-block mt-2 text-[8px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 rounded-lg">
                  ● Active
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Appearance Settings */}
      {activeTab === 'appearance' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-lg space-y-6"
        >
          <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2 px-2">
            <Palette className="w-5 h-5 text-purple-500" /> Appearance & Theme
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Sun, label: 'Light Mode', desc: 'Clean & professional', active: true },
              { icon: Moon, label: 'Dark Mode', desc: 'Reduced eye strain', active: false },
              { icon: Monitor, label: 'System', desc: 'Match OS preference', active: false },
            ].map(t => (
              <button
                key={t.label}
                className={`p-6 rounded-2xl border text-left transition-all hover:shadow-lg ${
                  t.active
                    ? 'border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/20 ring-2 ring-indigo-500/10'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                }`}
              >
                <t.icon className={`w-8 h-8 mb-3 ${t.active ? 'text-indigo-500' : 'text-slate-400'}`} />
                <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{t.label}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{t.desc}</p>
                {t.active && (
                  <span className="inline-block mt-3 text-[8px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-100 dark:bg-indigo-900/40 px-2 py-0.5 rounded-lg">
                    ● Selected
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Language Toggle */}
          <div className="pt-4">
            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4 px-2 flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-500" /> Language
            </h4>
            <div className="grid grid-cols-2 gap-4 max-w-md">
              {[
                { code: 'en', label: 'English', flag: '🇺🇸' },
                { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
              ].map(lang => (
                <button
                  key={lang.code}
                  onClick={() => updateField('defaultLanguage', lang.code)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    settings.defaultLanguage === lang.code
                      ? 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-blue-200'
                  }`}
                >
                  <span className="text-2xl mb-2 block">{lang.flag}</span>
                  <p className="text-sm font-black text-slate-900 dark:text-white">{lang.label}</p>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminSettings;
