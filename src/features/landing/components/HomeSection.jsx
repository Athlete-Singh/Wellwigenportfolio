// OLD CODE (commented by AI)
/*
import React, { useState } from 'react';
import { motion } from 'framer-motion';
*/

// NEW CODE - Wellwigen alternating hero images
import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  Globe,
  Target,
  Users,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Clock,
  MapPin,
  Flame,
  Star,
  Sparkles,
  Zap,
  Activity,
  Dumbbell,
} from 'lucide-react';
import {
  HOME_TRUST_CHIPS,
  WHY_WELLWIGEN_TILES,
  HOW_IT_WORKS_STEPS,
  HOME_TESTIMONIALS,
} from '../data/fitnessData';
import GymMarqueeTicker from './GymMarqueeTicker';

export default function HomeSection({ onOpenLeadModal, onNavigateSection }) {
  // Alternating Hero Background Images (Calibrated face focal points for mobile & desktop)
  // OLD CODE (commented by AI)
  /*
  const HERO_IMAGES = [
    {
      src: '/images/hero_workout.jpg',
      alt: 'Wellwigen elite athletic power training in gym',
      position: 'object-[68%_16%] lg:object-[68%_20%]',
    },
    {
      src: '/images/hero_sled_push.jpg',
      alt: 'Athletic power sled push training at Wellwigen',
      position: 'object-[56%_38%] lg:object-[65%_25%]',
    },
    {
      src: '/images/hero_home_plank.jpg',
      alt: 'Live online virtual personal training session with coach',
      position: 'object-[74%_34%] lg:object-[68%_28%]',
    },
    {
      src: '/images/hero_bench_athlete.jpg',
      alt: 'Muscular athlete focus training at Wellwigen gym',
      position: 'object-[80%_18%] lg:object-[78%_20%]',
    },
    {
      src: '/images/hero_online_coach.jpg',
      alt: 'Expert online personal fitness coach conducting live consultation',
      position: 'object-[61%_20%] lg:object-[62%_20%]',
    },
  ];
  */
  // NEW CODE - performance optimization: WebP images with responsive srcset
  const HERO_IMAGES = [
    {
      src: '/images/hero_workout.webp',
      srcSet: '/images/hero_workout-480w.webp 480w, /images/hero_workout-768w.webp 768w, /images/hero_workout.webp 1024w',
      alt: 'Wellwigen elite athletic power training in gym',
      position: 'object-[68%_16%] lg:object-[68%_20%]',
    },
    {
      src: '/images/hero_sled_push.webp',
      srcSet: '/images/hero_sled_push-480w.webp 480w, /images/hero_sled_push-768w.webp 768w, /images/hero_sled_push.webp 1024w',
      alt: 'Athletic power sled push training at Wellwigen',
      position: 'object-[56%_38%] lg:object-[65%_25%]',
    },
    {
      src: '/images/hero_home_plank.webp',
      srcSet: '/images/hero_home_plank-480w.webp 480w, /images/hero_home_plank-768w.webp 768w, /images/hero_home_plank.webp 1024w',
      alt: 'Live online virtual personal training session with coach',
      position: 'object-[74%_34%] lg:object-[68%_28%]',
    },
    {
      src: '/images/hero_bench_athlete.webp',
      srcSet: '/images/hero_bench_athlete-480w.webp 480w, /images/hero_bench_athlete-768w.webp 768w, /images/hero_bench_athlete.webp 1024w',
      alt: 'Muscular athlete focus training at Wellwigen gym',
      position: 'object-[80%_18%] lg:object-[78%_20%]',
    },
    {
      src: '/images/hero_online_coach.webp',
      srcSet: '/images/hero_online_coach-480w.webp 480w, /images/hero_online_coach-768w.webp 768w, /images/hero_online_coach.webp 1024w',
      alt: 'Expert online personal fitness coach conducting live consultation',
      position: 'object-[61%_20%] lg:object-[62%_20%]',
    },
  ];

  // Dynamic rotating keywords per user specifications
  // OLD CODE (commented by AI)
  /*
  const ROTATING_HERO_WORDS = [
    'Wellwigen',
    'HIIT',
    'Personal Training',
    'Yoga Classes',
    'Jungle Fit Classes',
    'Tabata Classes',
  ];
  */
  // NEW CODE - removed HIIT per user request
  // OLD CODE (commented by AI)
  /*
  const ROTATING_HERO_WORDS = [
    'Wellwigen',
    'Personal Training',
    'Yoga Classes',
    'Jungle Fit Classes',
    'Tabata Classes',
  ];
  */
  // NEW CODE - updated Jungle Fit Classes to Jungle Fit Class per user request
  const ROTATING_HERO_WORDS = [
    'Wellwigen',
    'Personal Training',
    'Yoga Classes',
    'Jungle Fit Class',
    'Tabata Classes',
  ];

  // Premium Classes Showcase Section (Light Theme)
  // OLD CODE (commented by AI)
  /*
  const PREMIUM_CLASSES = [
    {
      id: 'yoga',
      title: 'Yoga classes',
      desc: 'Mindful flows, breathwork & deep flexibility with certified yogis.',
      img: '/images/class_yoga.jpg',
      position: 'object-center',
    },
    {
      id: 'tabata',
      title: 'Tabata classes',
      desc: 'High-intensity interval rounds engineered for maximum calorie burn & stamina.',
      img: '/images/class_tabata.jpg',
      position: 'object-center',
    },
    {
      id: 'junglefit',
      title: 'Jungle fit classes',
      desc: 'Fun, high-energy functional movements, primal flow & rhythmic conditioning.',
      img: '/images/class_jungle_fit.jpg',
      position: 'object-center',
    },
    {
      id: 'hiit',
      title: 'HIIT',
      desc: 'Full-throttle interval training to build lean muscle and athletic power.',
      img: '/images/class_hiit.jpg',
      position: 'object-center',
    },
  ];
  */
  // NEW CODE - performance optimization: WebP images with 480w responsive srcSet
  const PREMIUM_CLASSES = [
    {
      id: 'yoga',
      title: 'Yoga classes',
      desc: 'Mindful flows, breathwork & deep flexibility with certified yogis.',
      img: '/images/class_yoga.webp',
      srcSet: '/images/class_yoga-480w.webp 480w, /images/class_yoga.webp 1024w',
      position: 'object-center',
    },
    {
      id: 'tabata',
      title: 'Tabata classes',
      desc: 'High-intensity interval rounds engineered for maximum calorie burn & stamina.',
      img: '/images/class_tabata.webp',
      srcSet: '/images/class_tabata-480w.webp 480w, /images/class_tabata.webp 1024w',
      position: 'object-center',
    },
    {
      id: 'junglefit',
      title: 'Jungle fit classes',
      desc: 'Fun, high-energy functional movements, primal flow & rhythmic conditioning.',
      img: '/images/class_jungle_fit.webp',
      srcSet: '/images/class_jungle_fit-480w.webp 480w, /images/class_jungle_fit.webp 1024w',
      position: 'object-center',
    },
    {
      id: 'hiit',
      title: 'HIIT',
      desc: 'Full-throttle interval training to build lean muscle and athletic power.',
      img: '/images/class_hiit.webp',
      srcSet: '/images/class_hiit-480w.webp 480w, /images/class_hiit.webp 1024w',
      position: 'object-center',
    },
  ];

  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  // OLD CODE (commented by AI)
  /*
  const [typedWord, setTypedWord] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isWordComplete, setIsWordComplete] = useState(false);
  */
  // NEW CODE - restored original rotating word index
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  // OLD CODE (commented by AI)
  /*
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 3800);
    return () => clearInterval(timer);
  }, [HERO_IMAGES.length]);
  */
  // NEW CODE - smooth animation/performance: pre-caches next slide for instant, glitch-free crossfade
  useEffect(() => {
    // Preload next image immediately
    const nextIdx = (currentHeroImage + 1) % HERO_IMAGES.length;
    const preloadImg = new Image();
    preloadImg.src = HERO_IMAGES[nextIdx].src;

    const timer = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 3800);
    return () => clearInterval(timer);
  }, [currentHeroImage, HERO_IMAGES.length]);

  // OLD CODE (commented by AI)
  /*
  // Typewriter effect: types character-by-character, pops on completion, then deletes
  useEffect(() => {
    const targetWord = ROTATING_HERO_WORDS[wordIndex];
    let timeoutId;

    if (isWordComplete) {
      // Pause when word is fully typed so user can read and enjoy the pop
      timeoutId = setTimeout(() => {
        setIsWordComplete(false);
        setIsDeleting(true);
      }, 1700);
      return () => clearTimeout(timeoutId);
    }

    if (!isDeleting) {
      // Typing forward
      if (typedWord.length < targetWord.length) {
        timeoutId = setTimeout(() => {
          setTypedWord(targetWord.slice(0, typedWord.length + 1));
        }, 90);
      } else {
        // Word is fully typed -> trigger pop effect & pause
        setIsWordComplete(true);
      }
    } else {
      // Backspacing / Deleting
      if (typedWord.length > 0) {
        timeoutId = setTimeout(() => {
          setTypedWord(targetWord.slice(0, typedWord.length - 1));
        }, 45);
      } else {
        // Finished deleting -> move to next word
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % ROTATING_HERO_WORDS.length);
      }
    }

    return () => clearTimeout(timeoutId);
  }, [typedWord, isDeleting, isWordComplete, wordIndex]);
  */
  // NEW CODE - restored original vertical sliding rotation (enter from bottom, exit to top)
  useEffect(() => {
    const wordTimer = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % ROTATING_HERO_WORDS.length);
    }, 2600);
    return () => clearInterval(wordTimer);
  }, [ROTATING_HERO_WORDS.length]);
  const getTileIcon = (name) => {
    switch (name) {
      case 'Award': return <Award className="w-6 h-6 text-teal-600" />;
      case 'MapPin': return <MapPin className="w-6 h-6 text-sky-600" />;
      case 'Target': return <Target className="w-6 h-6 text-emerald-600" />;
      case 'TrendingUp': return <TrendingUp className="w-6 h-6 text-amber-600" />;
      case 'Users': return <Users className="w-6 h-6 text-purple-600" />;
      case 'Clock': return <Clock className="w-6 h-6 text-rose-600" />;
      default: return <Sparkles className="w-6 h-6 text-teal-600" />;
    }
  };

  // eslint-disable-next-line no-unused-vars
  const getChipIcon = (name) => {
    switch (name) {
      case 'Award': return <Award size={15} className="text-teal-600" />;
      case 'Globe': return <Globe size={15} className="text-sky-600" />;
      case 'Target': return <Target size={15} className="text-emerald-600" />;
      case 'Users': return <Users size={15} className="text-purple-600" />;
      default: return <Sparkles size={15} className="text-teal-600" />;
    }
  };

  return (
    <section id="home" className="relative overflow-hidden">

      {/* Side Vertical Text Rail on XL screens */}
      <div className="hidden xl:flex fixed left-4 top-1/2 -translate-y-1/2 flex-col items-center gap-4 z-20 pointer-events-none opacity-40">
        <span className="[writing-mode:vertical-rl] rotate-180 font-display text-[10px] tracking-[0.3em] font-bold uppercase text-slate-400">
          WELLWIGEN &bull; 01 HOME
        </span>
        <div className="w-px h-16 bg-teal-500/50" />
      </div>

      {/* OLD CODE (commented by AI)
      <div data-nav-theme="dark" className="relative min-h-[92vh] lg:min-h-screen flex flex-col lg:flex-row lg:items-center pt-20 pb-16 lg:pt-36 lg:pb-24 bg-[#0E1420]">
      */}
      {/* NEW CODE - shifted slightly down matching user screenshot */}
      <div data-nav-theme="dark" className="relative min-h-[92vh] lg:min-h-screen flex flex-col lg:flex-row lg:items-center pt-24 pb-16 lg:pt-40 lg:pb-24 bg-[#0E1420]">

        {/* ----------------- MOBILE ONLY: Dedicated Top Picture Showcase (< lg) ----------------- */}
        <div className="lg:hidden relative w-full h-[48vh] min-h-[340px] max-h-[460px] overflow-hidden select-none -mt-4">
          {/* Alternating Images with Calibrated Face Focal Points */}
          {/* OLD CODE (commented by AI)
          {HERO_IMAGES.map((img, idx) => (
            <motion.img
              key={img.src}
              src={img.src}
              alt={img.alt}
              initial={false}
              animate={{
                opacity: currentHeroImage === idx ? 1 : 0,
                scale: currentHeroImage === idx ? 1 : 1.05,
              }}
              transition={{
                opacity: { duration: 0.75, ease: 'easeInOut' },
                scale: { duration: 3.8, ease: 'easeOut' },
              }}
              className={`absolute inset-0 w-full h-full object-cover ${img.position} filter brightness-[0.95] contrast-[1.08]`}
              loading={idx === 0 ? 'eager' : 'lazy'}
              fetchPriority={idx === 0 ? 'high' : 'auto'}
            />
          ))}
          */}
          {/* NEW CODE - performance optimization: render only current and next slide, responsive srcset */}
          {HERO_IMAGES.map((img, idx) => {
            const isSlideActive = currentHeroImage === idx;
            const isNextSlide = (currentHeroImage + 1) % HERO_IMAGES.length === idx;
            if (!isSlideActive && !isNextSlide) return null;
            return (
              <motion.img
                key={img.src}
                src={img.src}
                srcSet={img.srcSet}
                sizes="100vw"
                alt={img.alt}
                initial={false}
                animate={{
                  opacity: isSlideActive ? 1 : 0,
                  scale: isSlideActive ? 1 : 1.05,
                }}
                transition={{
                  opacity: { duration: 0.75, ease: 'easeInOut' },
                  scale: { duration: 3.8, ease: 'easeOut' },
                }}
                className={`absolute inset-0 w-full h-full object-cover ${img.position} filter brightness-[0.95] contrast-[1.08]`}
                loading={idx === 0 ? 'eager' : 'lazy'}
                fetchPriority={idx === 0 ? 'high' : 'auto'}
                decoding={idx === 0 ? 'sync' : 'async'}
              />
            );
          })}

          {/* Deep seamless gradient fade at bottom to blend into #0E1420 */}
          <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-[#0E1420] from-20% via-[#0E1420]/80 via-60% to-transparent pointer-events-none" />

          {/* Subtle top fade for the navbar */}
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#0E1420]/80 to-transparent pointer-events-none" />
        </div>

        {/* ----------------- DESKTOP ONLY: Edge-to-Edge Background (lg+) ----------------- */}
        <div className="hidden lg:block absolute inset-0 z-0 overflow-hidden">
          {/* OLD CODE (commented by AI)
          {HERO_IMAGES.map((img, idx) => (
            <motion.img
              key={img.src}
              src={img.src}
              alt={img.alt}
              initial={false}
              animate={{
                opacity: currentHeroImage === idx ? 1 : 0,
                scale: currentHeroImage === idx ? 1 : 1.04,
              }}
              transition={{
                opacity: { duration: 0.75, ease: 'easeInOut' },
                scale: { duration: 3.8, ease: 'easeOut' },
              }}
              className={`absolute inset-0 w-full h-full object-cover ${img.position} filter brightness-[0.88] contrast-[1.12]`}
              loading={idx === 0 ? 'eager' : 'lazy'}
              fetchPriority={idx === 0 ? 'high' : 'auto'}
            />
          ))}
          */}
          {/* NEW CODE - performance optimization: render only current and next slide, responsive srcset */}
          {HERO_IMAGES.map((img, idx) => {
            const isSlideActive = currentHeroImage === idx;
            const isNextSlide = (currentHeroImage + 1) % HERO_IMAGES.length === idx;
            if (!isSlideActive && !isNextSlide) return null;
            return (
              <motion.img
                key={img.src}
                src={img.src}
                srcSet={img.srcSet}
                sizes="100vw"
                alt={img.alt}
                initial={false}
                animate={{
                  opacity: isSlideActive ? 1 : 0,
                  scale: isSlideActive ? 1 : 1.04,
                }}
                transition={{
                  opacity: { duration: 0.75, ease: 'easeInOut' },
                  scale: { duration: 3.8, ease: 'easeOut' },
                }}
                className={`absolute inset-0 w-full h-full object-cover ${img.position} filter brightness-[0.88] contrast-[1.12]`}
                loading={idx === 0 ? 'eager' : 'lazy'}
                fetchPriority={idx === 0 ? 'high' : 'auto'}
                decoding={idx === 0 ? 'sync' : 'async'}
              />
            );
          })}

          {/* Deep Cinematic Multi-layer Gradient Overlays for Razor-Sharp Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0E1420] via-[#0E1420]/90 to-transparent lg:w-[68%]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0E1420]/80 via-[#0E1420]/50 to-transparent" />
          <div className="absolute top-0 inset-x-0 h-44 bg-gradient-to-b from-[#0E1420]/95 via-[#0E1420]/50 to-transparent pointer-events-none" />
          <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#0E1420] via-[#0E1420]/80 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-blueprint opacity-[0.03] pointer-events-none" />
          <div className="absolute inset-0 bg-noise opacity-25 pointer-events-none" />
          <div className="absolute top-1/4 left-1/4 w-[480px] h-[480px] bg-teal-500/15 rounded-full blur-[130px] pointer-events-none" />
        </div>

        {/* Giant Faded Outline Display Watermark behind content (Desktop) */}
        <div className="absolute top-24 left-6 text-[15vw] font-display font-black text-transparent stroke-text select-none pointer-events-none opacity-20 z-0 leading-none hidden lg:block">
          BEAST MODE
        </div>

        {/* OLD CODE (commented by AI)
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full -mt-40 xs:-mt-44 sm:-mt-48 lg:mt-0">
        */}
        {/* OLD CODE (commented by AI)
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full -mt-36 xs:-mt-40 sm:-mt-44 lg:mt-0">
        */}
        {/* OLD CODE (commented by AI)
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full -mt-24 xs:-mt-28 sm:-mt-32 lg:mt-6">
        */}
        {/* OLD CODE (commented by AI)
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full -mt-32 xs:-mt-36 sm:-mt-40 lg:mt-8">
          <div className="max-w-2xl lg:max-w-3xl space-y-4 sm:space-y-6 lg:space-y-7">
        */}
        {/* NEW CODE - shifted slightly further down on desktop (lg:mt-16), wide container (lg:max-w-4xl xl:max-w-5xl) so words never clip */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full -mt-32 xs:-mt-36 sm:-mt-40 lg:mt-16">
          <div className="max-w-2xl lg:max-w-4xl xl:max-w-5xl space-y-4 sm:space-y-6 lg:space-y-7">

            {/* Display Headline with Animated Rotating Words */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {/* OLD CODE (commented by AI)
              <h1 className="font-heading font-black text-[1.75rem] xs:text-3xl sm:text-5xl md:text-6xl lg:text-[4.75rem] tracking-tight text-white leading-[1.1] sm:leading-[0.98]">
                <span className="block text-white drop-shadow-md">
                  Transform
                </span>
                <span className="block text-white drop-shadow-md mt-0.5 sm:mt-1">
                  Your Body
                </span>
                <span className="flex items-baseline flex-nowrap gap-x-2 sm:gap-x-3.5 mt-0.5 sm:mt-1 whitespace-nowrap overflow-visible">
                  <span className="text-white/95 drop-shadow-md shrink-0">
                    With
                  </span>
                  <span className="relative inline-block h-[1.35em] overflow-hidden align-baseline whitespace-nowrap">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={ROTATING_HERO_WORDS[currentWordIndex]}
                        initial={{ opacity: 0, y: 36, scale: 0.94 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -36, scale: 0.94 }}
                        transition={{
                          duration: 0.42,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="inline-block gradient-teal-sky-text drop-shadow-[0_0_35px_rgba(45,226,200,0.35)] leading-tight pb-3 whitespace-nowrap"
                      >
                        {ROTATING_HERO_WORDS[currentWordIndex]}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                </span>
              </h1>
              */}
              {/* NEW CODE - generous width, trailing padding to prevent clipping of long words like "Training", clean alignment */}
              <h1 className="font-heading font-black text-[1.75rem] xs:text-3xl sm:text-5xl md:text-6xl lg:text-[4.35rem] xl:text-[4.75rem] tracking-tight text-white leading-[1.1] sm:leading-[0.98]">
                <span className="block text-white drop-shadow-md">
                  Transform
                </span>
                <span className="block text-white drop-shadow-md mt-0.5 sm:mt-1">
                  Your Body
                </span>
                <span className="flex items-baseline flex-nowrap gap-x-2 sm:gap-x-3.5 mt-0.5 sm:mt-1 whitespace-nowrap overflow-visible">
                  <span className="text-white/95 drop-shadow-md shrink-0">
                    With
                  </span>
                  <span className="relative inline-block h-[1.35em] overflow-hidden align-baseline whitespace-nowrap pr-4 sm:pr-8">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={ROTATING_HERO_WORDS[currentWordIndex]}
                        initial={{ opacity: 0, y: 36, scale: 0.94 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -36, scale: 0.94 }}
                        transition={{
                          duration: 0.42,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="inline-block gradient-teal-sky-text drop-shadow-[0_0_35px_rgba(45,226,200,0.35)] leading-tight pb-3 pr-4 whitespace-nowrap"
                      >
                        {ROTATING_HERO_WORDS[currentWordIndex]}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                </span>
              </h1>
            </motion.div>

            {/* Concise, Premium Subtext (Positioned cleanly below the picture border) */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm xs:text-base sm:text-lg lg:text-xl text-slate-300/90 max-w-xl font-normal leading-relaxed drop-shadow pt-3 sm:pt-0"
            >
              1-on-1 personal training &amp; live group fitness with certified master coaches.
            </motion.p>

            {/* Action Buttons: Slim & fitted row on mobile, full-sized on desktop */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-row flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3.5 pt-1"
            >
              {/* Primary Power Coral CTA */}
              {/* OLD CODE (commented by AI)
              <button
                onClick={() => onOpenLeadModal({ program: 'Personal Training', plan: 'Transformation' })}
                className="btn-power-coral btn-shine px-3.5 py-2.5 sm:px-8 sm:py-4 rounded-xl text-xs sm:text-base font-bold flex items-center justify-center gap-1.5 sm:gap-2.5 cursor-pointer shadow-coral-glow hover:scale-[1.02] active:scale-[0.98] transition-all group shrink-0"
              >
              */}
              {/* NEW CODE - smooth animation/performance: specific transform transition with touch-action */}
              <button
                onClick={() => onOpenLeadModal({ program: 'Personal Training', plan: 'Transformation' })}
                className="btn-power-coral btn-shine px-3.5 py-2.5 sm:px-8 sm:py-3 rounded-xl text-xs sm:text-base font-bold flex items-center justify-center gap-1.5 sm:gap-2.5 cursor-pointer shadow-coral-glow hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200 group shrink-0"
              >
                <span>Join Now</span>
                <ArrowRight size={14} className="sm:w-[19px] sm:h-[19px] group-hover:translate-x-1.5 transition-transform" />
              </button>

              {/* Secondary CTA */}
              {/* OLD CODE (commented by AI)
              <button
                onClick={() => onNavigateSection('group-classes')}
                className="px-3 py-2.5 sm:px-7 sm:py-4 rounded-xl bg-slate-900/70 hover:bg-slate-800/80 border border-slate-700/80 text-white font-bold text-xs sm:text-base flex items-center justify-center gap-1.5 sm:gap-2.5 backdrop-blur-md hover:border-teal-400/50 transition-all cursor-pointer shadow-lg whitespace-nowrap"
              >
              */}
              {/* NEW CODE - smooth animation/performance: specific background and border transitions */}
              <button
                onClick={() => onNavigateSection('group-classes')}
                className="px-3 py-2.5 sm:px-7 sm:py-3 rounded-xl bg-slate-900/70 hover:bg-slate-800/80 border border-slate-700/80 text-white font-bold text-xs sm:text-base flex items-center justify-center gap-1.5 sm:gap-2.5 backdrop-blur-md hover:border-teal-400/50 transition-[background-color,border-color] duration-200 cursor-pointer shadow-lg whitespace-nowrap"
              >
                <span>Explore Group Classes</span>
                <ArrowRight size={14} className="sm:w-[18px] sm:h-[18px] text-teal-400 shrink-0" />
              </button>
            </motion.div>



            {/* Athletic Category Tag Pills (Matches reference mockup 2) */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="pt-1 flex flex-wrap gap-2 sm:gap-2.5"
            >
              {[
                'Personal Training',
                'Live Group Classes',
                'HIIT & Tabata',
                'Strength & Conditioning',
                'Functional Workouts',
                'Custom Nutrition',
              ].map((pill, idx) => (
                <button
                  key={idx}
                  onClick={() => onNavigateSection('personal-training')}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-teal-500/50 text-slate-300 hover:text-white text-xs font-medium backdrop-blur-sm transition-colors duration-200 cursor-pointer"
                >
                  {pill}
                </button>
              ))}
            </motion.div>

          </div>
        </div>

      </div>

      {/* ================= DARK MARQUEE TICKER BAND ================= */}
      <GymMarqueeTicker />

      {/* ================= TRANSFORM WITH OUR PREMIUM CLASSES (VIRTUAL STUDIO - LIGHT THEME) ================= */}
      <section data-nav-theme="light" className="relative py-20 sm:py-24 bg-gradient-to-b from-[#F3FBF9] via-white to-[#F8FAFC] text-slate-900 overflow-hidden border-y border-slate-200/80">
        {/* Soft Ambient Light Glows */}
        <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-teal-100/40 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-sky-100/35 rounded-full blur-[130px] pointer-events-none" />

        {/* Faded Watermark Accent (Light) */}
        <div className="absolute -top-6 right-6 text-[15vw] font-display font-black text-slate-200/35 select-none pointer-events-none z-0">
          STUDIO
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Section Header (Clean Light Theme) */}
          <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-700 text-xs font-display font-extrabold uppercase tracking-widest shadow-sm mb-4"
            >
              <Sparkles size={13} className="text-teal-600" />
              <span>VIRTUAL STUDIO</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-display font-black text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] text-slate-900 tracking-tight leading-[1.12]"
            >
              Transform With Our{' '}
              <span className="text-teal-600 drop-shadow-sm">
                Premium Classes
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-slate-600 text-sm sm:text-base mt-3 max-w-2xl mx-auto leading-relaxed"
            >
              Choose from a variety of expert-led online sessions tailored to your goals. Click on any class to reserve your spot!
            </motion.p>
          </div>

          {/* 4 Premium Class Cards Grid (Light Theme & Crisp Natural Photos) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {PREMIUM_CLASSES.map((item, idx) => (
              /* OLD CODE (commented by AI)
              <div
                key={item.id}
                onClick={() => onOpenLeadModal({ program: item.title, plan: 'Trial Class' })}
                className="group relative h-[430px] sm:h-[460px] lg:h-[490px] rounded-[30px] overflow-hidden border border-slate-200/80 hover:border-teal-400 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2.5 cursor-pointer flex flex-col justify-end p-6 sm:p-7 select-none bg-slate-100"
              >
              */
              /* NEW CODE - smooth animation/performance: unified reveal pop animation with stagger, composite-only transform hover */
              <div
                key={item.id}
                onClick={() => onOpenLeadModal({ program: item.title, plan: 'Trial Class' })}
                className={`reveal-item reveal-stagger-${(idx % 4) + 1} group relative h-[430px] sm:h-[460px] lg:h-[490px] rounded-[30px] overflow-hidden border border-slate-200/80 hover:border-teal-400 shadow-md hover:shadow-xl transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-2 cursor-pointer flex flex-col justify-end p-6 sm:p-7 select-none bg-slate-100 [touch-action:manipulation]`}
              >
                {/* Natural, Bright Background Image (Zoom on Hover) */}
                <img
                  src={item.img}
                  alt={item.title}
                  className={`absolute inset-0 w-full h-full object-cover ${item.position} group-hover:scale-105 transition-transform duration-500 ease-out`}
                  loading="lazy"
                  decoding="async"
                />

                {/* Smooth Bottom Gradient Fade for Crisp Text Contrast */}
                <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent pointer-events-none" />

                {/* Bottom Content Area */}
                <div className="relative z-10 space-y-2">
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <h3 className="font-display font-extrabold text-2xl sm:text-[1.65rem] text-white tracking-tight leading-tight group-hover:text-[#2DE2C8] transition-colors drop-shadow-sm">
                        {item.title}
                      </h3>
                      {/* OLD CODE (commented by AI)
                      <div className="w-10 h-1 bg-[#2DE2C8] rounded-full mt-2 group-hover:w-16 transition-all duration-300" />
                      */}
                      {/* NEW CODE - smooth animation/performance: GPU scaleX transform instead of width layout trigger */}
                      <div className="w-10 h-1 bg-[#2DE2C8] rounded-full mt-2 origin-left group-hover:scale-x-150 transition-transform duration-300" />
                    </div>

                    {/* Circular Action Arrow Button */}
                    {/* OLD CODE (commented by AI)
                    <div className="w-10 h-10 rounded-full bg-teal-500 text-white flex items-center justify-center group-hover:bg-[#2DE2C8] group-hover:text-slate-950 group-hover:scale-110 transition-all shadow-md shrink-0">
                    */}
                    {/* NEW CODE - smooth animation/performance: specific background and transform transitions */}
                    <div className="w-10 h-10 rounded-full bg-teal-500 text-white flex items-center justify-center group-hover:bg-[#2DE2C8] group-hover:text-slate-950 group-hover:scale-110 transition-[background-color,color,transform] duration-200 shadow-md shrink-0">
                      <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>

                  <p className="text-xs sm:text-[13px] text-slate-200/95 line-clamp-2 leading-relaxed pt-1 drop-shadow-sm">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ================= CHOOSE HOW YOU WANT TO TRAIN (DARK ACCENT SECTION) ================= */}
      <div data-nav-theme="dark" className="relative py-28 bg-[#0E1420] text-white overflow-hidden">
        {/* Background Blueprint Grid & Noise Texture */}
        <div className="absolute inset-0 bg-blueprint-grid opacity-30 pointer-events-none" />
        <div className="absolute inset-0 bg-noise opacity-40 pointer-events-none" />

        {/* Huge Watermark Word */}
        <div className="absolute top-8 right-4 text-[16vw] watermark-text opacity-30 z-0">
          POWER
        </div>

        {/* Glow orbs */}
        <div className="absolute top-1/2 left-10 w-96 h-96 bg-[#1FB5A3]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#3B9BD4]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-display font-extrabold uppercase tracking-widest text-[#2DE2C8] bg-[#111B2E] border border-[#2A3547] px-4 py-1.5 rounded-full shadow-sm">
              PROGRAM TRACKS
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-4 tracking-tight">
              Choose How You Want To Train
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-2">
              Whether you need dedicated individual accountability or vibrant group energy, we have the ideal plan.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-stretch">

            {/* Card 1: Personal Training (Background Image Card with Face-Clear Window) */}
            <div className="reveal-item reveal-stagger-1 rounded-3xl p-8 sm:p-10 relative flex flex-col justify-between overflow-hidden group shadow-2xl border border-slate-700/60 hover:-translate-y-1.5 transition-[transform,box-shadow] duration-250 min-h-[580px] bg-slate-900">
              {/* Background Image positioned for optimal face clarity (mobile: shifted right so face is visible, desktop: 70%) */}
              <img
                src="/images/home_personal_training.jpg"
                alt="Personal trainer coaching athlete with barbell in fitness studio"
                className="absolute inset-0 w-full h-full object-cover object-[42%_15%] sm:object-[70%_15%] group-hover:scale-105 transition-transform duration-700 ease-out pointer-events-none"
                loading="lazy"
                decoding="async"
              />

              {/* Multi-stop Gradient: sheer at top so faces stay 100% clear, deep dark at bottom for font priority */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/20 pointer-events-none" />

              {/* Card Content on Top */}
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div>
                  {/* Top Icon with window below so faces are clear */}
                  <div className="flex items-center justify-end mb-28 sm:mb-32">
                    <div className="w-11 h-11 rounded-2xl bg-teal-500/90 backdrop-blur-md text-slate-950 flex items-center justify-center shadow-lg border border-teal-300/40">
                      <Target size={22} className="stroke-[2.5]" />
                    </div>
                  </div>

                  <h3 className="font-heading text-2xl sm:text-3xl font-black text-white mb-2 drop-shadow-md">
                    Personal Training
                  </h3>
                  <p className="text-[#2DE2C8] font-bold text-sm sm:text-base mb-6 drop-shadow-sm">
                    1-on-1 Coaching Built Around You.
                  </p>

                  <ul className="space-y-3.5 mb-8">
                    {[
                      'Personalized workout plan',
                      'Goal-based training',
                      'Expert coach guidance',
                      'Progress tracking',
                      'Nutrition guidance',
                      'Flexible online sessions',
                    ].map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-slate-100 font-medium drop-shadow-sm">
                        <CheckCircle2 size={18} className="text-[#2DE2C8] shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => onNavigateSection('personal-training')}
                  className="w-full btn-primary-gradient px-6 py-2.5 sm:py-3 text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-teal-glow group/btn"
                >
                  <span>Explore Personal Training</span>
                  <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Card 2: Online Group Classes (Background Image Card with Face-Clear Window) */}
            <div className="reveal-item reveal-stagger-2 rounded-3xl p-8 sm:p-10 relative flex flex-col justify-between overflow-hidden group shadow-2xl border border-slate-700/60 hover:-translate-y-1.5 transition-[transform,box-shadow] duration-250 min-h-[580px] bg-slate-900">
              {/* Background Image positioned for optimal face clarity (mobile: shifted toward girl's face, desktop: untouched) */}
              <img
                src="/images/home_group_classes.jpg"
                alt="Online group fitness class performing synchronized dumbbell workout"
                className="absolute inset-0 w-full h-full object-cover object-[62%_20%] sm:object-[50%_25%] group-hover:scale-105 transition-transform duration-700 ease-out pointer-events-none"
                loading="lazy"
                decoding="async"
              />

              {/* Multi-stop Gradient: sheer at top so faces stay 100% clear, deep dark at bottom for font priority */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/20 pointer-events-none" />

              {/* Card Content on Top */}
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div>
                  {/* Top Icon with window below so faces are clear */}
                  <div className="flex items-center justify-end mb-28 sm:mb-32">
                    <div className="w-11 h-11 rounded-2xl bg-sky-500/90 backdrop-blur-md text-slate-950 flex items-center justify-center shadow-lg border border-sky-300/40">
                      <Users size={22} className="stroke-[2.5]" />
                    </div>
                  </div>

                  <h3 className="font-heading text-2xl sm:text-3xl font-black text-white mb-2 drop-shadow-md">
                    Online Group Classes
                  </h3>
                  <p className="text-sky-400 font-bold text-sm sm:text-base mb-6 drop-shadow-sm">
                    Live Workouts. Real Coaches. Real Community.
                  </p>

                  <ul className="space-y-3.5 mb-8">
                    {[
                      'Live instructor-led workouts',
                      'Multiple class types',
                      'Weekly schedule',
                      'Beginner friendly',
                      'Community motivation',
                      'Train from home',
                    ].map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-slate-100 font-medium drop-shadow-sm">
                        <CheckCircle2 size={18} className="text-sky-400 shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => onNavigateSection('group-classes')}
                  className="w-full btn-primary-gradient px-6 py-2.5 sm:py-3 text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-teal-glow group/btn"
                >
                  <span>Explore Group Classes</span>
                  <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Slanted Bottom Divider Transitioning back */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-transparent to-transparent pointer-events-none" />
      </div>

      {/* ================= LIGHT CONTENT SECTION: WHY WELLWIGEN & HOW IT WORKS ================= */}
      <div data-nav-theme="light" className="relative py-24 bg-transparent overflow-hidden">

        {/* Huge Watermark */}
        <div className="absolute top-1/4 -right-10 text-[18vw] watermark-text-light opacity-40 z-0">
          COMMUNITY
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* ================= WHY WELLWIGEN ================= */}
          <div className="mb-28">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-display font-extrabold uppercase tracking-widest text-teal-700 bg-teal-50 border border-teal-200 px-4 py-1.5 rounded-full">
                THE WELLWIGEN ADVANTAGE
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
                Why Wellwigen? More Than Just Workouts. It's a Fitness Community.
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
                We believe in real people, real support and real results. With expert coaches, flexible training and a motivating community, Wellwigen helps you stay consistent and achieve your goals.
              </p>
            </div>

            {/* 6 Feature Tiles */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {WHY_WELLWIGEN_TILES.map((tile, idx) => (
                /* OLD CODE (commented by AI)
                <div
                  key={idx}
                  className="card-soft p-6 border border-slate-200/90 flex flex-col justify-between group hover:border-teal-400"
                >
                */
                /* NEW CODE - smooth animation/performance: reveal-item with stagger for pop entrance */
                <div
                  key={idx}
                  className={`reveal-item reveal-stagger-${(idx % 6) + 1} card-soft p-6 border border-slate-200/90 flex flex-col justify-between group hover:border-teal-400`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-soft-sm border border-slate-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    {getTileIcon(tile.icon)}
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-slate-900 mb-1.5">
                      {tile.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {tile.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ================= HOW WELLWIGEN WORKS ================= */}
          <div className="mb-28">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-display font-extrabold uppercase tracking-widest text-teal-700 bg-teal-50 border border-teal-200 px-4 py-1.5 rounded-full">
                HOW IT WORKS
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
                How Wellwigen Works - Simple steps. Real results.
              </h2>
            </div>

            <div className="relative">
              {/* Connecting Line for desktop */}
              <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-1 bg-gradient-to-r from-teal-400 via-sky-400 to-teal-400 rounded-full -translate-y-1/2 z-0" />

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                {HOW_IT_WORKS_STEPS.map((step, idx) => (
                  /* OLD CODE (commented by AI)
                  <div
                    key={step.step}
                    className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft-sm text-center flex flex-col items-center hover:shadow-md transition-shadow"
                  >
                  */
                  /* NEW CODE - smooth animation/performance: reveal-item with stagger */
                  <div
                    key={step.step}
                    className={`reveal-item reveal-stagger-${(idx % 4) + 1} bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft-sm text-center flex flex-col items-center hover:shadow-md transition-shadow duration-200`}
                  >
                    <div className="w-12 h-12 rounded-full gradient-teal-sky text-white font-display font-black text-lg flex items-center justify-center shadow-teal-glow mb-4">
                      {step.step}
                    </div>
                    <h3 className="font-heading text-base font-bold text-slate-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ================= FULL-WIDTH SHOWCASE BANNER: YOUR GOALS. YOUR FOCUS. ================= */}
          <div className="mb-20 sm:mb-24 reveal-item">
            <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden bg-gradient-to-br from-[#0A121E] via-[#092229] to-[#0D1C2E] border border-teal-500/35 shadow-[0_20px_50px_-15px_rgba(8,34,41,0.6)] text-white group">
              
              {/* Special Effects & Ambient Atmosphere */}
              <div className="absolute inset-0 bg-blueprint-grid opacity-15 pointer-events-none" />
              <div className="absolute -top-24 -left-24 w-80 h-80 bg-teal-500/15 rounded-full blur-[90px] pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#2DE2C8]/10 rounded-full blur-[90px] pointer-events-none" />
              <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-teal-400/50 to-transparent" />

              <div className="relative z-10 grid lg:grid-cols-12 gap-6 lg:gap-8 items-stretch p-4 sm:p-6 lg:p-7">
                
                {/* Content Side: Slim, concise & perfectly balanced */}
                <div className="lg:col-span-7 flex flex-col justify-center order-2 lg:order-1 py-1">
                  
                  {/* Headline */}
                  <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight">
                    Your Goals.{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2DE2C8] via-teal-300 to-emerald-400">
                      Your Focus.
                    </span>
                  </h2>

                  {/* Short, crisp content */}
                  <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                    Customized 1-on-1 personal training, real-time posture correction, and authentic progress — crafted around your body and schedule at home.
                  </p>

                  {/* Slim Inner Feature Boxes */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-2.5 my-3.5">
                    <div className="flex items-center gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-white/[0.05] border border-white/10 hover:border-teal-400/40 transition-colors">
                      <Target size={14} className="text-[#2DE2C8] shrink-0" />
                      <span className="text-[11px] sm:text-xs font-bold text-slate-100 truncate">Custom Workouts</span>
                    </div>
                    <div className="flex items-center gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-white/[0.05] border border-white/10 hover:border-teal-400/40 transition-colors">
                      <Activity size={14} className="text-emerald-400 shrink-0" />
                      <span className="text-[11px] sm:text-xs font-bold text-slate-100 truncate">Live Form Correction</span>
                    </div>
                    <div className="flex items-center gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-white/[0.05] border border-white/10 hover:border-teal-400/40 transition-colors">
                      <Zap size={14} className="text-cyan-400 shrink-0" />
                      <span className="text-[11px] sm:text-xs font-bold text-slate-100 truncate">Nutrition & Habits</span>
                    </div>
                    <div className="flex items-center gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-white/[0.05] border border-white/10 hover:border-teal-400/40 transition-colors">
                      <TrendingUp size={14} className="text-[#2DE2C8] shrink-0" />
                      <span className="text-[11px] sm:text-xs font-bold text-slate-100 truncate">Weekly Progress</span>
                    </div>
                  </div>

                  {/* Button */}
                  <div className="flex items-center gap-3 pt-0.5">
                    {/* OLD CODE (commented by AI)
                    <button
                      onClick={() => onNavigateSection('personal-training')}
                      className="btn-primary-gradient btn-shine px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold inline-flex items-center gap-2 shadow-teal-glow cursor-pointer transition-all hover:scale-105"
                    >
                    */}
                    {/* NEW CODE - smooth animation/performance: specific transform transition */}
                    <button
                      onClick={() => onNavigateSection('personal-training')}
                      className="btn-primary-gradient btn-shine px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold inline-flex items-center gap-2 shadow-teal-glow cursor-pointer transition-transform duration-200 hover:scale-105"
                    >
                      <span>Explore Personal Training</span>
                      <ArrowRight size={15} />
                    </button>
                  </div>

                </div>

                {/* Media Showcase Side: Large, Clean, Big Image fitting the content height */}
                <div className="lg:col-span-5 order-1 lg:order-2 flex">
                  <div className="relative rounded-xl lg:rounded-2xl overflow-hidden border border-teal-500/30 shadow-lg w-full h-full min-h-[200px] sm:min-h-[220px]">
                    {/* OLD CODE (commented by AI)
                    <img
                      src="/images/card_goals_focus.jpg"
                      alt="Athletes performing kettlebell workouts during personal training"
                      className="w-full h-full object-cover object-[45%_25%] sm:object-center group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                      decoding="async"
                    />
                    */}
                    {/* NEW CODE - performance optimization: WebP image with responsive srcSet */}
                    <img
                      src="/images/card_goals_focus.webp"
                      srcSet="/images/card_goals_focus-480w.webp 480w, /images/card_goals_focus.webp 1024w"
                      sizes="(max-width: 640px) 100vw, 500px"
                      alt="Athletes performing kettlebell workouts during personal training"
                      className="w-full h-full object-cover object-[45%_25%] sm:object-center group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* ================= REAL PEOPLE. REAL RESULTS (TESTIMONIALS) ================= */}
          <div className="mb-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-display font-extrabold uppercase tracking-widest text-teal-700 bg-teal-50 border border-teal-200 px-4 py-1.5 rounded-full">
                COMMUNITY VOICES
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
                Real People. Real Results.
              </h2>
              <p className="text-slate-600 text-sm mt-2">
                Hear from our Wellwigen members achieving authentic health transformations.
              </p>
            </div>

            {/* Testimonial Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {HOME_TESTIMONIALS.map((t, idx) => (
                /* OLD CODE (commented by AI)
                <div
                  key={t.id}
                  className="card-soft p-6 border border-slate-200/80 flex flex-col justify-between hover:border-teal-300 transition-all"
                >
                */
                /* NEW CODE - smooth animation/performance: reveal-item with stagger and specific transition */
                <div
                  key={t.id}
                  className={`reveal-item reveal-stagger-${(idx % 3) + 1} card-soft p-6 border border-slate-200/80 flex flex-col justify-between hover:border-teal-300 transition-[transform,border-color,box-shadow] duration-200`}
                >
                  <div>
                    {/* Star Rating */}
                    <div className="flex items-center gap-1 mb-4 text-amber-400">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} size={15} className="fill-amber-400" />
                      ))}
                    </div>

                    <p className="text-sm text-slate-700 italic leading-relaxed mb-6">
                      "{t.quote}"
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                    <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-teal-500/30 shrink-0">
                      <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                    </div>
                    <div>
                      <div className="font-heading font-bold text-sm text-slate-900">{t.name}</div>
                      <div className="text-xs font-semibold text-teal-600">{t.result}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
