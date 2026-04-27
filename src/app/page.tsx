'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCricPointStore } from '@/store/cricpoint-store';
import SplashScreen from '@/components/cricpoint/SplashScreen';
import Dashboard from '@/components/cricpoint/Dashboard';
import MatchDetail from '@/components/cricpoint/MatchDetail';

export default function Home() {
  const { currentView, setView } = useCricPointStore();
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
    setView('dashboard');
  };

  // Auto-redirect from splash after timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      if (showSplash) {
        setShowSplash(false);
        setView('dashboard');
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [showSplash, setView]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AnimatePresence mode="wait">
        {showSplash ? (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SplashScreen onComplete={handleSplashComplete} />
          </motion.div>
        ) : currentView === 'dashboard' ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Dashboard />
          </motion.div>
        ) : currentView === 'match-detail' ? (
          <motion.div
            key="match-detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <MatchDetail />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
