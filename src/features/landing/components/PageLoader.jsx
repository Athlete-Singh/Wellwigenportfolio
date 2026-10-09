import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PageLoader({ isLoading }) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/95 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center text-center px-4"
          >
            {/* Animated Logo Icon */}
            <div className="relative w-16 h-16 mb-4 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-2xl border-2 border-teal-500/20 border-t-teal-500"
              />
              <span className="text-2xl font-black text-teal-600 font-heading">W</span>
            </div>

            <div className="font-heading font-black text-2xl tracking-wider text-slate-900">
              WELLWIGEN
            </div>
            <div className="text-[10px] font-bold tracking-[0.25em] text-teal-600 uppercase mt-1">
              STRONGER BODY. BETTER YOU.
            </div>

            {/* Subtle Progress Indicator */}
            <div className="w-36 h-1 bg-slate-100 rounded-full mt-6 overflow-hidden">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-full h-full bg-gradient-to-r from-teal-500 to-sky-500"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
