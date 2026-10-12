import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

const categories = [
  "Wellwigen",
  "Yoga Classes",
  "Tabata Classes",
  "Jungle Fit Classes",
  "Online Training"
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 }
  }
};

export default function Hero() {
  const navigate = useNavigate();
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const { scrollY } = useScroll();
  
  // Parallax background
  const bgY = useTransform(scrollY, [0, 500], [0, 150]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCategoryIndex((prev) => (prev + 1) % categories.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="w-full relative overflow-hidden min-h-[90vh] flex items-center"
      style={{
        backgroundColor: "#ffffff",
        backgroundImage: "radial-gradient(circle, rgba(13, 148, 136, 0.1) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none z-0">
        {/* === SVG HEALTH VECTORS === */}
        <svg className="absolute top-20 right-10 w-64 opacity-[0.06]" viewBox="0 0 320 60" fill="none">
          <path d="M0,30 L55,30 L70,6 L85,54 L100,14 L115,46 L130,30 L320,30" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <svg className="absolute bottom-32 left-10 opacity-[0.08] w-20" viewBox="0 0 80 96" fill="none">
          <path d="M40 6L10 18V44C10 62 23 79 40 88C57 79 70 62 70 44V18L40 6Z" stroke="#0d9488" strokeWidth="2" fill="none" />
        </svg>
      </motion.div>

      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10 w-full pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* === LEFT CONTENT === */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-start text-left"
          >
            {/* Platform badge */}

            {/* Headline */}
            <motion.h1 variants={itemVariants} className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[1.2] lg:leading-[1.1] mb-6 tracking-tight">
              Transform <br className="hidden sm:block" /> Your Health <br className="hidden sm:block" />
              <span className="flex flex-col sm:flex-row sm:items-center gap-x-3 mt-2">
                <span className="text-gray-900">with</span>
                <span className="text-teal-600 relative h-[50px] sm:h-[72px] lg:h-[84px] flex items-center overflow-hidden sm:overflow-visible w-full sm:min-w-[350px]">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={currentCategoryIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="absolute left-0 whitespace-nowrap"
                    >
                      {categories[currentCategoryIndex]}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p variants={itemVariants} className="text-gray-500 text-lg sm:text-xl max-w-lg mb-10 leading-relaxed font-light">
              Access immediate <strong className="text-gray-700">online doctor consultations</strong>, automated <strong className="text-gray-700">AI meal plans</strong>, and certified <strong className="text-gray-700">virtual fitness training</strong> in a single platform.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mb-12">
              <Link
                to="/register"
                className="px-8 py-4 bg-teal-600 text-white text-base font-bold rounded-xl hover:bg-teal-700 transition-all shadow-xl shadow-teal-600/20 flex items-center justify-center hover:-translate-y-1"
              >
                Get Started Free
              </Link>
              <Link
                to="/ecosystem"
                className="px-8 py-4 bg-white border-2 border-gray-100 text-gray-700 text-base font-bold rounded-xl hover:border-teal-100 hover:bg-teal-50 transition-all shadow-sm flex items-center justify-center hover:-translate-y-1"
              >
                See How It Works →
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div variants={itemVariants} className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <img
                    key={i}
                    className="w-12 h-12 rounded-full border-4 border-white shadow-sm object-cover"
                    src={`https://i.pravatar.cc/48?img=${i}`}
                    alt={`User ${i}`}
                  />
                ))}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center text-amber-400 text-sm">
                  ★★★★★
                </div>
                <span className="text-sm text-gray-500 font-light mt-0.5">
                  Trusted by <strong className="text-gray-900">6,000+</strong> users
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* === RIGHT CONTENT (Visual Composition) === */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block h-[600px] w-full"
          >
            {/* Main large image */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute right-0 top-10 w-[400px] h-[480px] rounded-[40px] overflow-hidden shadow-2xl border-8 border-white z-20"
            >
              {/* OLD CODE (commented by AI)
              <img src="/images/virtual_fitness_hero.jpg" alt="Yoga" className="w-full h-full object-cover" />
              */}
              {/* NEW CODE - performance optimization: WebP image */}
              <img src="/images/virtual_fitness_hero.webp" alt="Yoga" className="w-full h-full object-cover" loading="lazy" decoding="async" />
              <div className="absolute inset-0 bg-gradient-to-t from-teal-900/40 to-transparent"></div>
            </motion.div>

            {/* Floating small image 1 */}
            <motion.div 
              animate={{ y: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute left-0 bottom-20 w-[240px] h-[240px] rounded-[32px] overflow-hidden shadow-2xl border-4 border-white z-30"
            >
              <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=500&auto=format&fit=crop" alt="Fitness" className="w-full h-full object-cover" />
            </motion.div>

            {/* Floating small image 2 */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 2 }}
              className="absolute left-10 top-0 w-[200px] h-[200px] rounded-full overflow-hidden shadow-xl border-4 border-white z-10"
            >
              <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=500&auto=format&fit=crop" alt="Training" className="w-full h-full object-cover" />
            </motion.div>
            
            {/* Decorative background blob & vectors */}
            <div className="absolute right-10 top-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-teal-100/80 rounded-full blur-[80px] opacity-60 z-0"></div>
            
            {/* Vector 1: Dotted Square */}
            <svg className="absolute top-10 right-0 w-32 h-32 opacity-20 z-0" fill="none" viewBox="0 0 100 100">
              <pattern id="dotsPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle fill="#0d9488" cx="2" cy="2" r="2"></circle>
              </pattern>
              <rect x="0" y="0" width="100%" height="100%" fill="url(#dotsPattern)"></rect>
            </svg>

            {/* Vector 2: Floating Ring */}
            <motion.svg 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
              className="absolute bottom-10 right-20 w-24 h-24 opacity-30 z-0" 
              viewBox="0 0 100 100" 
              fill="none" 
              stroke="#0d9488" 
              strokeWidth="4" 
              strokeDasharray="10 10"
            >
              <circle cx="50" cy="50" r="40"></circle>
            </motion.svg>

            {/* Vector 3: Plus sign group */}
            <svg className="absolute top-1/3 right-1/4 w-12 h-12 opacity-30 z-0" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
