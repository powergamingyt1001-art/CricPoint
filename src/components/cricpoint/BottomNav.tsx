'use client';

import { Home, Swords, Bot, BarChart3, MoreVertical } from 'lucide-react';
import { useCricPointStore, type BottomTab, type MenuDialog } from '@/store/cricpoint-store';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const tabs: { id: BottomTab; label: string; icon: React.ReactNode }[] = [
  { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
  { id: 'match', label: 'Match', icon: <Swords className="w-5 h-5" /> },
  { id: 'ai', label: 'AI', icon: <Bot className="w-5 h-5" /> },
  { id: 'poll', label: 'Poll', icon: <BarChart3 className="w-5 h-5" /> },
];

const menuOptions: { id: MenuDialog; icon: string; label: string }[] = [
  { id: 'icc-ranking', icon: '🏆', label: 'ICC Ranking' },
  { id: 'ranking', icon: '📊', label: 'Player Ranking' },
  { id: 'settings', icon: '⚙️', label: 'Settings' },
  { id: 'about', icon: 'ℹ️', label: 'About' },
];

export default function BottomNav() {
  const { activeTab, setActiveTab, setMenuDialog } = useCricPointStore();
  const [showMenu, setShowMenu] = useState(false);

  const handleMenuClick = (dialogId: MenuDialog) => {
    setShowMenu(false);
    // Small delay so menu closes first, then dialog opens
    setTimeout(() => {
      setMenuDialog(dialogId);
    }, 150);
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 safe-area-bottom">
        <div className="flex items-center justify-around max-w-lg mx-auto h-14">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setShowMenu(false); }}
              className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 ${
                activeTab === tab.id
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              <div className={`relative ${activeTab === tab.id ? 'scale-110' : ''} transition-transform`}>
                {tab.icon}
                {activeTab === tab.id && (
                  <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-green-500 rounded-full" />
                )}
              </div>
              <span className={`text-[9px] font-semibold ${activeTab === tab.id ? 'text-green-600 dark:text-green-400' : ''}`}>
                {tab.label}
              </span>
            </button>
          ))}

          {/* 3-dot menu */}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
              showMenu ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
            <MoreVertical className="w-5 h-5" />
            <span className={`text-[9px] font-semibold ${showMenu ? 'text-green-600 dark:text-green-400' : ''}`}>More</span>
          </button>
        </div>
      </div>

      {/* More Menu Overlay */}
      <AnimatePresence>
        {showMenu && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMenu(false)}
            />
            <motion.div
              className="fixed bottom-16 right-3 z-50 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden min-w-[200px]"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <div className="py-1.5">
                {menuOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleMenuClick(option.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors text-left active:bg-green-100 dark:active:bg-green-900/30"
                  >
                    <span className="text-base">{option.icon}</span>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{option.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
