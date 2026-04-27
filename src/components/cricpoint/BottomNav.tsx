'use client';

import { Home, MapPin, Bot, BarChart3, MoreVertical } from 'lucide-react';
import { useCricPointStore, type BottomTab } from '@/store/cricpoint-store';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const tabs: { id: BottomTab; label: string; icon: React.ReactNode }[] = [
  { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
  { id: 'pin', label: 'Pin', icon: <MapPin className="w-5 h-5" /> },
  { id: 'ai-chat', label: 'AI', icon: <Bot className="w-5 h-5" /> },
  { id: 'point-table', label: 'Polls', icon: <BarChart3 className="w-5 h-5" /> },
];

export default function BottomNav() {
  const { activeTab, setActiveTab } = useCricPointStore();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 safe-area-bottom">
        <div className="flex items-center justify-around max-w-lg mx-auto h-16">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 ${
                activeTab === tab.id
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              <div className={`relative ${activeTab === tab.id ? 'scale-110' : ''} transition-transform`}>
                {tab.icon}
                {activeTab === tab.id && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                )}
              </div>
              <span className={`text-[10px] font-semibold ${activeTab === tab.id ? 'text-green-600 dark:text-green-400' : ''}`}>
                {tab.label}
              </span>
            </button>
          ))}

          {/* 3-dot menu */}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-all"
          >
            <MoreVertical className="w-5 h-5" />
            <span className="text-[10px] font-semibold">More</span>
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
              className="fixed bottom-20 right-4 z-50 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden min-w-[200px]"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <div className="py-2">
                <MenuOption icon="🏆" label="ICC Ranking" />
                <MenuOption icon="📊" label="Ranking" />
                <MenuOption icon="📝" label="Posts" />
                <MenuOption icon="⚙️" label="Settings" />
                <MenuOption icon="ℹ️" label="Info" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function MenuOption({ icon, label }: { icon: string; label: string }) {
  return (
    <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left">
      <span className="text-base">{icon}</span>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
    </button>
  );
}
