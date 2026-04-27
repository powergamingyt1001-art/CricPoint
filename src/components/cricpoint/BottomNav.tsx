'use client';

import { Home, Trophy, Mic, MapPin } from 'lucide-react';
import { useCricPointStore, type BottomTab } from '@/store/cricpoint-store';
import { motion } from 'framer-motion';

const tabs: { id: BottomTab; label: string; icon: React.ReactNode }[] = [
  { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
  { id: 'points', label: 'Points', icon: <Trophy className="w-5 h-5" /> },
  { id: 'commentary', label: 'Commentary', icon: <Mic className="w-5 h-5" /> },
];

export default function BottomNav() {
  const { activeTab, setActiveTab, matchPinned, togglePin } = useCricPointStore();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 safe-area-bottom">
      <div className="flex items-center justify-around max-w-lg mx-auto h-16">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 ${
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

        {/* Pin Toggle Button */}
        <button
          onClick={togglePin}
          className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 ${
            matchPinned
              ? 'text-green-600 dark:text-green-400'
              : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
          }`}
        >
          <div className={`relative ${matchPinned ? 'scale-110' : ''} transition-transform`}>
            <MapPin className={`w-5 h-5 ${matchPinned ? 'fill-green-500' : ''}`} />
            {matchPinned && (
              <motion.div
                className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            )}
          </div>
          <span className={`text-[10px] font-semibold ${matchPinned ? 'text-green-600 dark:text-green-400' : ''}`}>
            Pin {matchPinned ? 'ON' : ''}
          </span>
        </button>
      </div>
    </div>
  );
}
