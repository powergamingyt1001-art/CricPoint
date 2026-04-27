'use client';

import { motion } from 'framer-motion';

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-green-900 via-green-800 to-emerald-900"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Cricket ball animation background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-10"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: 'radial-gradient(circle, #fbbf24, transparent)',
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      {/* Logo Container */}
      <motion.div
        className="relative z-10 flex flex-col items-center"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Cricket Ball Logo */}
        <motion.div
          className="relative w-28 h-28 mb-6"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-full h-full rounded-full bg-gradient-to-br from-red-500 to-red-700 shadow-2xl flex items-center justify-center relative overflow-hidden">
            {/* Ball seam */}
            <div className="absolute w-full h-[2px] bg-white/40 top-1/2 -translate-y-1/2 rotate-[25deg]" />
            <div className="absolute w-[2px] h-full bg-white/30 left-1/2 -translate-x-1/2 rotate-[25deg]" />
            {/* Stitching */}
            <div className="absolute top-[30%] left-[15%] w-2 h-2 border border-white/50 rounded-full" />
            <div className="absolute top-[35%] left-[20%] w-2 h-2 border border-white/50 rounded-full" />
            <div className="absolute bottom-[30%] right-[15%] w-2 h-2 border border-white/50 rounded-full" />
            <div className="absolute bottom-[35%] right-[20%] w-2 h-2 border border-white/50 rounded-full" />
            {/* CP text */}
            <span className="text-white font-black text-2xl z-10">CP</span>
          </div>
        </motion.div>

        {/* App Name */}
        <motion.h1
          className="text-4xl font-black text-white tracking-wider"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          Cric<span className="text-yellow-400">Point</span>
        </motion.h1>

        <motion.p
          className="text-green-300 mt-2 text-sm font-medium tracking-widest uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          Live Cricket Scores
        </motion.p>
      </motion.div>

      {/* Loading Bar */}
      <motion.div
        className="absolute bottom-24 w-48 h-1 bg-green-900/50 rounded-full overflow-hidden z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-yellow-400 to-green-400 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ delay: 1.2, duration: 2, ease: "easeInOut" }}
          onAnimationComplete={onComplete}
        />
      </motion.div>

      {/* Loading text */}
      <motion.p
        className="absolute bottom-16 text-green-400/60 text-xs tracking-widest z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ delay: 1.5, duration: 1.5, repeat: Infinity }}
      >
        Loading...
      </motion.p>
    </motion.div>
  );
}
