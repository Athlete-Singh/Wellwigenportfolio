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
// NEW CODE - Live 3D Athlete placed in Hero section (Desktop & Mobile)
import LiveAthleteHero, { MobileAthleteHero } from './LiveAthleteHero';
// NEW CODE - Distinct, attractive and professional section borders and dividers
import {
  WaveHorizonDivider,
  StadiumChevronDivider,
  SculptedDomeArcDivider,
  VelocityTrackDivider,
  InvertedNotchDivider,
} from './SectionDividers';

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
  // Rotating word index for headline
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

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
    <section id="home" className="relative overflow-hidden w-full max-w-full">

      {/* Side Vertical Text Rail on XL screens */}
      <div className="hidden xl:flex fixed left-4 top-1/2 -translate-y-1/2 flex-col items-center gap-4 z-20 pointer-events-none opacity-40">
        <span className="[writing-mode:vertical-rl] rotate-180 font-display text-[10px] tracking-[0.3em] font-bold uppercase text-slate-400">
          WELLWIGEN &bull; 01 HOME
        </span>
        <div className="w-px h-16 bg-teal-500/50" />
      </div>

      {/* ================= HERO SECTION (LIGHT THEME) ================= */}
      {/* NEW CODE - Flat solid calm base (--solid-mint #F2FAF8) locked to 100% width */}
      <div data-nav-theme="light" data-home-bg="mint" className="relative min-h-[92vh] lg:min-h-screen flex flex-col lg:flex-row lg:items-center pt-14 sm:pt-18 lg:pt-40 pb-16 lg:pb-24 bg-[#F2FAF8] overflow-hidden w-full max-w-full">

        {/* ----------------- DESKTOP ONLY: Edge-to-Edge Background (lg+) ----------------- */}
        {/* OLD CODE (commented by AI) - dark gym photo background
        <div className="hidden lg:block absolute inset-0 z-0 overflow-hidden">
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
                className={`absolute inset-0 w-full h-full object-cover ${img.position} filter brightness-[0.98] contrast-[1.06]`}
                loading={idx === 0 ? 'eager' : 'lazy'}
                fetchPriority={idx === 0 ? 'high' : 'auto'}
                decoding={idx === 0 ? 'sync' : 'async'}
              />
            );
          })}

          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-transparent lg:w-[65%]" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/40 to-transparent" />
          <div className="absolute top-0 inset-x-0 h-44 bg-gradient-to-b from-white/95 via-white/50 to-transparent pointer-events-none" />
          <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#F8FAFC] via-white/80 to-transparent pointer-events-none" />
          <div className="absolute top-1/4 left-1/4 w-[480px] h-[480px] bg-teal-200/20 rounded-full blur-[130px] pointer-events-none" />
        </div>
        */}
        {/* OLD CODE (commented by AI) - pastel gradient overlays and blurred glow blobs
        <div className="hidden lg:block absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-y-0 left-0 w-full lg:w-[60%] bg-gradient-to-r from-white/95 via-white/80 to-transparent pointer-events-none" />
          <div className="absolute top-1/4 left-1/4 w-[480px] h-[480px] bg-teal-200/20 rounded-full blur-[130px] pointer-events-none" />
        </div>
        */}

        {/* ================= NEW CODE: FLAT SOLID HERO BACKGROUND SHAPES ================= */}
        {/* Layered at z-0: strictly LOWER than athletes (z-55) and LOWER than all text (z-10). Desktop only. */}
        <div
          className="hidden lg:block absolute inset-0 z-0 pointer-events-none select-none overflow-hidden"
          aria-hidden="true"
        >
          {/* Shapes positioned on right side behind athletes; left text column remains completely clean */}
          <div
            className="absolute top-16 right-0 w-[50vw] max-w-[850px] h-full"
            style={{
              right: 'max(-20px, calc((100vw - 1440px) / 2 - 40px))',
            }}
          >
            {/* Shape 2: Second Offset Outline/Panel in --solid-teal-dark peeking behind the main arch */}
            <div
              className="absolute shadow-[0_16px_36px_rgba(15,23,42,0.10)]"
              style={{
                width: 'var(--hero-arch-width, 500px)',
                height: 'var(--hero-arch-height, 680px)',
                backgroundColor: 'var(--solid-teal-dark, #0F766E)',
                borderRadius: 'var(--hero-arch-radius, 250px) var(--hero-arch-radius, 250px) 44px 44px',
                transform: 'rotate(-9deg) translate(-28px, 16px)',
                right: '110px',
                top: '40px',
              }}
            />

            {/* Shape 3: Big Solid Circle in lighter teal tint peeking behind */}
            <div
              className="absolute rounded-full shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
              style={{
                width: 'var(--hero-circle-size, 320px)',
                height: 'var(--hero-circle-size, 320px)',
                backgroundColor: 'var(--solid-teal-light, #5EEAD4)',
                right: '340px',
                top: '160px',
              }}
            />

            {/* Shape 1: Big Solid --solid-teal Rounded-Arch Panel (tilted -5deg) */}
            <div
              className="absolute shadow-[0_24px_48px_rgba(15,23,42,0.14)]"
              style={{
                width: 'var(--hero-arch-width, 500px)',
                height: 'var(--hero-arch-height, 680px)',
                backgroundColor: 'var(--solid-teal, #1FB5A3)',
                borderRadius: 'var(--hero-arch-radius, 250px) var(--hero-arch-radius, 250px) 44px 44px',
                transform: 'rotate(var(--hero-arch-tilt, -5deg))',
                right: '80px',
                top: '50px',
              }}
            />

            {/* Accent Shapes: 3 to 5 small flat solid circles/rings with soft drop shadows */}
            {/* Accent 1: Small solid teal circle (drifts very slowly) */}
            <div
              className="bg-drift-1 absolute rounded-full shadow-md"
              style={{
                width: '26px',
                height: '26px',
                backgroundColor: 'var(--solid-teal, #1FB5A3)',
                right: '540px',
                top: '110px',
              }}
            />

            {/* Accent 2: Small solid dark teal circle */}
            <div
              className="bg-drift-2 absolute rounded-full shadow-sm"
              style={{
                width: '18px',
                height: '18px',
                backgroundColor: 'var(--solid-teal-dark, #0F766E)',
                right: '180px',
                top: '30px',
              }}
            />

            {/* Accent 3: Flat solid mint circle */}
            <div
              className="bg-drift-1 absolute rounded-full shadow-md"
              style={{
                width: '38px',
                height: '38px',
                backgroundColor: 'var(--solid-teal-light, #5EEAD4)',
                right: '480px',
                top: '490px',
              }}
            />

            {/* Accent 4: Solid teal ring */}
            <div
              className="bg-drift-2 absolute rounded-full shadow-sm"
              style={{
                width: '46px',
                height: '46px',
                border: '3.5px solid var(--solid-teal, #1FB5A3)',
                backgroundColor: 'transparent',
                right: '590px',
                top: '290px',
              }}
            />

            {/* Accent 5: Solid dark teal ring */}
            <div
              className="bg-drift-1 absolute rounded-full shadow-sm"
              style={{
                width: '28px',
                height: '28px',
                border: '2.5px solid var(--solid-teal-dark, #0F766E)',
                backgroundColor: 'transparent',
                right: '80px',
                top: '520px',
              }}
            />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-1 sm:pt-4 lg:pt-16 pb-12 sm:pb-16 lg:pb-20">
          <div className="max-w-2xl lg:max-w-4xl xl:max-w-5xl">

            {/* Dedicated Mobile 3D Athlete Hero Showcase (< lg only: FIRST on mobile before content) */}
            <MobileAthleteHero />

            {/* Content Container: shifted higher UP on mobile to overlay onto the 3D athlete visual */}
            <div className="-mt-20 xs:-mt-24 sm:-mt-28 lg:mt-0 relative z-20 space-y-4 sm:space-y-6 lg:space-y-7">

              {/* Display Headline with Animated Rotating Words */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h1 className="font-heading font-black text-[1.9rem] xs:text-3.5xl sm:text-5xl md:text-6xl lg:text-[4.35rem] xl:text-[4.75rem] tracking-tight text-slate-900 leading-[1.1] sm:leading-[0.98]">
                  <span className="block text-slate-900">
                    Transform
                  </span>
                  <span className="block text-slate-900 mt-0.5 sm:mt-1">
                    Your Body
                  </span>
                  <span className="flex items-baseline flex-nowrap gap-x-2 sm:gap-x-3.5 mt-0.5 sm:mt-1 whitespace-nowrap overflow-hidden max-w-full">
                    <span className="text-slate-800 shrink-0">
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
                          className="inline-block bg-gradient-to-r from-teal-600 via-emerald-600 to-sky-600 bg-clip-text text-transparent drop-shadow-xs leading-tight pb-3 pr-4 whitespace-nowrap"
                        >
                          {ROTATING_HERO_WORDS[currentWordIndex]}
                        </motion.span>
                      </AnimatePresence>
                    </span>
                  </span>
                </h1>
              </motion.div>

              {/* Concise, Premium Subtext */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-sm xs:text-base sm:text-lg lg:text-xl text-slate-600 max-w-xl font-normal leading-relaxed pt-3 sm:pt-0"
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
                <button
                  onClick={() => onOpenLeadModal({ program: 'Personal Training', plan: 'Transformation' })}
                  className="btn-power-coral btn-shine px-4 py-2.5 sm:px-8 sm:py-3 rounded-full text-xs sm:text-base font-bold flex items-center justify-center gap-1.5 sm:gap-2.5 cursor-pointer shadow-coral-glow hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200 group shrink-0"
                >
                  <span>Join Now</span>
                  <ArrowRight size={14} className="sm:w-[19px] sm:h-[19px] group-hover:translate-x-1.5 transition-transform" />
                </button>

                {/* Secondary CTA (Rounded with colored line) */}
                <button
                  onClick={() => onNavigateSection('group-classes')}
                  className="px-4 py-2.5 sm:px-7 sm:py-3 rounded-full bg-white hover:bg-teal-50 border-2 border-teal-600 text-teal-800 font-bold text-xs sm:text-base flex items-center justify-center gap-1.5 sm:gap-2.5 shadow-sm hover:border-teal-700 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer whitespace-nowrap"
                >
                  <span>Explore Group Classes</span>
                  <ArrowRight size={14} className="sm:w-[18px] sm:h-[18px] text-teal-600 shrink-0" />
                </button>
              </motion.div>

              {/* Athletic Category Tag Pills (Rounded with colored line for maximum visibility & professional appeal) */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="pt-2 flex flex-wrap gap-2 sm:gap-3"
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
                    className="px-4 py-2 rounded-full bg-white hover:bg-teal-50/80 border-2 border-teal-500/80 hover:border-teal-600 text-slate-800 hover:text-teal-900 text-xs font-bold shadow-xs hover:shadow-md hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 cursor-pointer"
                  >
                    {pill}
                  </button>
                ))}
              </motion.div>

            </div>

          </div>
        </div>

        {/* NEW CODE - Live 3D Athlete placed AFTER text in DOM tree: sits on top of all text, rotating words, subheadline ("certified") & navbar */}
        <LiveAthleteHero />
      </div>

      {/* [DISABLED PER REQUEST] Sliding plate removed
      <GymMarqueeTicker />
      */}

      {/* ================= TRANSFORM WITH OUR PREMIUM CLASSES (VIRTUAL STUDIO - LIGHT THEME) ================= */}
      {/* NEW CODE - Distinct Border Format 1: Wave Horizon Divider (Hero to Virtual Studio) */}
      <WaveHorizonDivider />

      {/* NEW CODE - Solid pure white base with full-width solid --solid-teal band behind lower half of cards */}
      <section data-nav-theme="light" data-home-bg="white" className="relative pt-10 sm:pt-14 pb-0 bg-white text-slate-900 overflow-hidden">
        {/* Full-width solid --solid-teal band behind lower half of class cards */}
        <div
          className="absolute bottom-0 inset-x-0 z-0 pointer-events-none"
          style={{
            height: 'var(--class-band-height, 270px)',
            backgroundColor: 'var(--solid-teal, #1FB5A3)',
          }}
          aria-hidden="true"
        />

        {/* Flat decorative circular outline at edge for visual rhythm (never behind text) */}
        <div
          className="hidden xl:block absolute -top-16 -right-16 w-56 h-56 rounded-full z-0 pointer-events-none"
          style={{
            backgroundColor: 'var(--solid-mint, #F2FAF8)',
            border: '3px solid var(--solid-teal, #1FB5A3)',
          }}
          aria-hidden="true"
        />

        {/* OLD CODE (commented by AI) - Faded Watermark Accent removed per user request
        <div className="absolute -top-6 right-6 text-[15vw] font-display font-black text-slate-200/35 select-none pointer-events-none z-0">
          STUDIO
        </div>
        */}

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

        {/* NEW CODE - Distinct Border Format 2: Stadium Chevron Notch Divider (Teal band into Mint Program Tracks) */}
        <div className="relative z-10 mt-12 sm:mt-16">
          <StadiumChevronDivider />
        </div>
      </section>

      {/* ================= CHOOSE HOW YOU WANT TO TRAIN (PROGRAM TRACKS - LIGHT THEME) ================= */}
      {/* NEW CODE - Solid --solid-mint background with edge decorative elements */}
      <div
        data-nav-theme="light"
        data-home-bg="mint"
        className="relative pt-20 pb-0 text-slate-900 overflow-hidden"
        style={{ backgroundColor: 'var(--solid-mint, #F2FAF8)' }}
      >
        {/* At most one flat decorative circle at the edge of the section for rhythm (never behind text) */}
        <div
          className="hidden xl:block absolute -top-12 -left-12 w-48 h-48 rounded-full z-0 pointer-events-none"
          style={{
            border: '2px solid var(--solid-teal, #1FB5A3)',
            opacity: 0.35,
          }}
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-display font-extrabold uppercase tracking-widest text-teal-700 bg-teal-50 border-2 border-teal-500/40 px-4 py-1.5 rounded-full shadow-xs">
              PROGRAM TRACKS
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mt-4 tracking-tight">
              Choose How You Want To Train
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Whether you need dedicated individual accountability or vibrant group energy, we have the ideal plan.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-stretch">

            {/* Card 1: Personal Training (Premium Light Showcase Card - Compact) */}
            <div className="reveal-item reveal-stagger-1 rounded-[28px] p-5 sm:p-6 relative flex flex-col justify-between overflow-hidden group bg-white border-2 border-teal-500/35 hover:border-teal-500 shadow-[0_16px_36px_-10px_rgba(20,184,166,0.12)] hover:shadow-[0_24px_50px_-10px_rgba(20,184,166,0.22)] hover:-translate-y-1.5 transition-all duration-300">
              <div>
                {/* Image Showcase Frame (100% visible, clean) */}
                <div className="relative h-52 sm:h-56 rounded-2xl overflow-hidden mb-4 bg-slate-100 border border-slate-200/60 shadow-sm">
                  <img
                    src="/images/home_personal_training.jpg"
                    alt="Personal trainer coaching athlete with barbell in fitness studio"
                    className="w-full h-full object-cover object-[60%_15%] sm:object-[70%_15%] group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                    decoding="async"
                  />

                  {/* Top-Right Glassmorphic Badge */}
                  <div className="absolute top-3.5 right-3.5 w-10 h-10 rounded-xl bg-white/95 backdrop-blur-md text-teal-600 flex items-center justify-center shadow-md border border-white/80 group-hover:scale-105 transition-transform">
                    <Target size={20} className="stroke-[2.5]" />
                  </div>
                </div>

                {/* Card Header (compact spacing) */}
                <h3 className="font-heading text-2xl sm:text-[1.65rem] font-black text-slate-900 mb-1 tracking-tight group-hover:text-teal-700 transition-colors">
                  Personal Training
                </h3>
                <p className="text-teal-700 font-bold text-sm sm:text-[15px] mb-4">
                  1-on-1 Coaching Built Around You.
                </p>

                {/* Benefit Bullets (compact & close together) */}
                <ul className="space-y-1.5 mb-5 sm:mb-6">
                  {[
                    'Personalized workout plan',
                    'Goal-based training',
                    'Expert coach guidance',
                    'Progress tracking',
                    'Nutrition guidance',
                    'Flexible online sessions',
                  ].map((bullet, idx) => (
                    <li key={idx} className="flex items-center gap-2.5 text-sm text-slate-700 font-medium py-1 px-1.5 -mx-1.5 rounded-lg hover:bg-teal-50/70 transition-colors">
                      <div className="w-5 h-5 rounded-md bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 shadow-2xs">
                        <CheckCircle2 size={14} className="stroke-[2.5]" />
                      </div>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => onNavigateSection('personal-training')}
                className="w-full btn-primary-gradient px-6 py-2.5 sm:py-3 text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-teal-glow group/btn rounded-xl hover:scale-[1.01] transition-transform"
              >
                <span>Explore Personal Training</span>
                <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Card 2: Online Group Classes (Premium Light Showcase Card - Compact) */}
            <div className="reveal-item reveal-stagger-2 rounded-[28px] p-5 sm:p-6 relative flex flex-col justify-between overflow-hidden group bg-white border-2 border-sky-500/35 hover:border-sky-500 shadow-[0_16px_36px_-10px_rgba(14,165,233,0.12)] hover:shadow-[0_24px_50px_-10px_rgba(14,165,233,0.22)] hover:-translate-y-1.5 transition-all duration-300">
              <div>
                {/* Image Showcase Frame (100% visible, clean) */}
                <div className="relative h-52 sm:h-56 rounded-2xl overflow-hidden mb-4 bg-slate-100 border border-slate-200/60 shadow-sm">
                  <img
                    src="/images/home_group_classes.jpg"
                    alt="Online group fitness class performing synchronized dumbbell workout"
                    className="w-full h-full object-cover object-[78%_top] sm:object-[80%_top] group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                    decoding="async"
                  />

                  {/* Top-Right Glassmorphic Badge */}
                  <div className="absolute top-3.5 right-3.5 w-10 h-10 rounded-xl bg-white/95 backdrop-blur-md text-sky-600 flex items-center justify-center shadow-md border border-white/80 group-hover:scale-105 transition-transform">
                    <Users size={20} className="stroke-[2.5]" />
                  </div>
                </div>

                {/* Card Header (compact spacing) */}
                <h3 className="font-heading text-2xl sm:text-[1.65rem] font-black text-slate-900 mb-1 tracking-tight group-hover:text-sky-700 transition-colors">
                  Online Group Classes
                </h3>
                <p className="text-sky-600 font-bold text-sm sm:text-[15px] mb-4">
                  Live Workouts. Real Coaches. Real Community.
                </p>

                {/* Benefit Bullets (compact & close together) */}
                <ul className="space-y-1.5 mb-5 sm:mb-6">
                  {[
                    'Live instructor-led workouts',
                    'Multiple class types',
                    'Weekly schedule',
                    'Beginner friendly',
                    'Community motivation',
                    'Train from home',
                  ].map((bullet, idx) => (
                    <li key={idx} className="flex items-center gap-2.5 text-sm text-slate-700 font-medium py-1 px-1.5 -mx-1.5 rounded-lg hover:bg-sky-50/70 transition-colors">
                      <div className="w-5 h-5 rounded-md bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 shadow-2xs">
                        <CheckCircle2 size={14} className="stroke-[2.5]" />
                      </div>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => onNavigateSection('group-classes')}
                className="w-full btn-primary-gradient px-6 py-2.5 sm:py-3 text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-teal-glow group/btn rounded-xl hover:scale-[1.01] transition-transform"
              >
                <span>Explore Group Classes</span>
                <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>

        </div>

        {/* NEW CODE - Distinct Border Format 3: Sculpted Arena Dome Arc (Program Tracks into White Advantage) */}
        <div className="mt-16 sm:mt-20">
          <SculptedDomeArcDivider />
        </div>
      </div>

      {/* ================= LIGHT CONTENT SECTION: WHY WELLWIGEN & HOW IT WORKS ================= */}
      <div data-nav-theme="light" data-home-bg="white" className="relative py-20 bg-white text-slate-900 overflow-hidden">
        {/* At most one flat decorative circle outline at the edge of the section (never behind text) */}
        <div
          className="hidden xl:block absolute -bottom-16 -right-16 w-56 h-56 rounded-full z-0 pointer-events-none"
          style={{
            border: '2px solid var(--solid-teal, #1FB5A3)',
            opacity: 0.3,
          }}
          aria-hidden="true"
        />

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

          {/* NEW CODE - Distinct Border Format 4: Multi-Lane Velocity Track Divider */}
          <VelocityTrackDivider />

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

          {/* NEW CODE - Distinct Border Format 5: Inverted Stadium Notch & Star Crest Divider */}
          <InvertedNotchDivider />

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
