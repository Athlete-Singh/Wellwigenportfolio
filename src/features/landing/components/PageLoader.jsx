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
            {/* 3D Brand Logo */}
            <motion.img
              src="/images/wellwigen-logo.webp"
              alt="Wellwigen - Your Wellness Partner."
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="h-16 sm:h-20 md:h-24 w-auto object-contain select-none mb-2 drop-shadow-md"
            />

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
