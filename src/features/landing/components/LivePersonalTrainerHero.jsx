import React, { useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';

/**
 * LivePersonalTrainerHero
 * 3D "Break-Out-Of-The-Box" Personal Training Showcase:
 * - Highly colorful, vibrant architectural background formation inspired by the home page
 * - Electric cyan, deep luxury teal, and sunset coral geometric accents
 * - Trainer & athlete remain large, dramatically popping out of the background box in 3D
 * - Multi-layer photorealistic studio wall shadows cast directly onto the colorful shapes
 * - Continuous floating/breathing motion & interactive 3D mouse parallax
 */
export default function LivePersonalTrainerHero() {
  const containerRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  // Mouse coordinate values (-0.5 to 0.5 normalized across container)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for natural 60fps inertia
  const springConfig = { damping: 24, stiffness: 150, mass: 0.4 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // 3D Tilt Rotations
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-7, 7]);

  // Differential parallax depth offsets
  const wallTranslateX = useTransform(smoothX, [-0.5, 0.5], [6, -6]);
  const wallTranslateY = useTransform(smoothY, [-0.5, 0.5], [6, -6]);

  const athleteTranslateX = useTransform(smoothX, [-0.5, 0.5], [-14, 14]);
  const athleteTranslateY = useTransform(smoothY, [-0.5, 0.5], [-14, 14]);

  const handleMouseMove = (e) => {
    if (prefersReducedMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full select-none flex items-center justify-center pt-2 pb-0 lg:py-3"
      style={{ perspective: '1400px' }}
    >
      {/* 3D Canvas */}
      <motion.div
        style={{
          transformStyle: 'preserve-3d',
          rotateX: prefersReducedMotion ? 0 : rotateX,
          rotateY: prefersReducedMotion ? 0 : rotateY,
        }}
        className="relative w-full h-[360px] xs:h-[420px] sm:h-[500px] md:h-[580px] lg:h-[650px] xl:h-[700px] flex items-center justify-center overflow-visible"
      >
        {/* ================= COMPACT VIBRANT ARCHITECTURAL FORMATION ================= */}
        {/* Background shapes restored to original moderate size (~50-54%), so the large image breaks out dramatically in 3D */}
        <motion.div
          style={{
            x: prefersReducedMotion ? 0 : wallTranslateX,
            y: prefersReducedMotion ? 0 : wallTranslateY,
            transformStyle: 'preserve-3d',
          }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          {/* Radiant Multi-Color Ambient Bloom */}
          <div
            className="absolute top-[16%] sm:top-[18%] w-[68%] sm:w-[62%] lg:w-[58%] xl:w-[54%] h-[66%] sm:h-[62%] lg:h-[58%] xl:h-[56%] rounded-[48px] bg-gradient-to-tr from-teal-400/30 via-emerald-400/20 to-orange-400/15 blur-2xl -z-10"
            aria-hidden="true"
          />

          {/* Colorful Shape 1: Solid Circle in Electric Mint/Cyan (#5EEAD4) peeking behind top-left */}
          <div
            className="absolute rounded-full shadow-[0_14px_32px_rgba(45,212,191,0.28)] pointer-events-none"
            style={{
              width: 'var(--pt-circle-size, 230px)',
              height: 'var(--pt-circle-size, 230px)',
              backgroundColor: 'var(--solid-teal-light, #5EEAD4)',
              top: '14%',
              left: '10%',
              opacity: 0.95,
            }}
            aria-hidden="true"
          />

          {/* Colorful Shape 2: Deep Luxury Teal-Emerald Contrast Arch (#0F766E) tilted -7deg */}
          <div
            className="absolute top-[18%] sm:top-[20%] right-[10%] sm:right-[14%] lg:right-[16%] w-[64%] sm:w-[58%] lg:w-[54%] xl:w-[50%] h-[66%] sm:h-[62%] lg:h-[58%] xl:h-[55%] rounded-[36px] sm:rounded-[44px] shadow-[0_18px_40px_rgba(15,23,42,0.18)]"
            style={{
              backgroundColor: 'var(--solid-teal-dark, #0F766E)',
              transform: 'rotate(-7deg) translate(-10px, 8px)',
            }}
            aria-hidden="true"
          />

          {/* Colorful Shape 3: Main Vibrant Electric Teal & Aqua Arch Box (#2DE2C8 to #0F766E) */}
          <div
            className="absolute top-[20%] sm:top-[22%] w-[62%] sm:w-[56%] lg:w-[52%] xl:w-[48%] h-[66%] sm:h-[62%] lg:h-[58%] xl:h-[55%] rounded-[34px] sm:rounded-[42px] shadow-[0_24px_50px_rgba(15,23,42,0.22)] overflow-hidden border-2 border-teal-200/60"
            style={{
              background: 'linear-gradient(145deg, #2DE2C8 0%, #1FB5A3 38%, #14998A 72%, #0F766E 100%)',
              transform: 'translateZ(-25px)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -3px 8px rgba(0,0,0,0.2), 0 24px 50px -10px rgba(15,23,42,0.24)',
            }}
          >
            {/* Studio Overhead Spotlight Specular Reflection */}
            <div
              className="absolute -top-14 inset-x-0 h-44 pointer-events-none opacity-60"
              style={{
                background: 'radial-gradient(ellipse at 50% 0%, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.3) 45%, transparent 75%)',
              }}
            />

            {/* Precision Athletic Gridlines */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.4) 1px, transparent 1px),
                                  linear-gradient(to bottom, rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
                backgroundSize: '32px 32px',
              }}
            />

            {/* Modern Geometric Studio Rings */}
            <div
              className="absolute -bottom-14 -right-14 w-52 h-52 rounded-full pointer-events-none"
              style={{
                border: '3px solid rgba(255, 255, 255, 0.30)',
              }}
            />
            <div
              className="absolute -bottom-6 -right-6 w-36 h-36 rounded-full pointer-events-none"
              style={{
                border: '2px dashed rgba(255, 255, 255, 0.25)',
              }}
            />

            {/* Deep Floor Baseline Shadow */}
            <div
              className="absolute bottom-0 inset-x-0 h-20 pointer-events-none"
              style={{
                background: 'linear-gradient(to top, rgba(8, 40, 36, 0.6) 0%, transparent 100%)',
              }}
            />
          </div>

          {/* ================= COLORFUL FLOATING ACCENT SHAPES ================= */}
          {/* Accent 1: Vibrant Sunset Coral Ring */}
          <div
            className="bg-drift-1 absolute rounded-full shadow-lg pointer-events-none"
            style={{
              width: '40px',
              height: '40px',
              border: '3.5px solid #FF6B35',
              backgroundColor: 'transparent',
              top: '12%',
              right: '10%',
            }}
          />

          {/* Accent 2: Solid Electric Teal Disc */}
          <div
            className="bg-drift-2 absolute rounded-full shadow-md pointer-events-none"
            style={{
              width: '28px',
              height: '28px',
              backgroundColor: 'var(--solid-teal, #1FB5A3)',
              top: '18%',
              left: '5%',
            }}
          />

          {/* Accent 3: Dark Teal Geometric Ring */}
          <div
            className="bg-drift-1 absolute rounded-full shadow-sm pointer-events-none"
            style={{
              width: '32px',
              height: '32px',
              border: '2.5px solid var(--solid-teal-dark, #0F766E)',
              backgroundColor: 'transparent',
              bottom: '14%',
              left: '6%',
            }}
          />

          {/* Accent 4: Mint Green Light Disc */}
          <div
            className="bg-drift-2 absolute rounded-full shadow-md pointer-events-none"
            style={{
              width: '24px',
              height: '24px',
              backgroundColor: 'var(--solid-teal-light, #5EEAD4)',
              top: '74%',
              right: '8%',
            }}
          />

          {/* Accent 5: Vibrant Coral Pulse Micro-Dot */}
          <div
            className="bg-drift-1 absolute rounded-full shadow-sm pointer-events-none"
            style={{
              width: '12px',
              height: '12px',
              backgroundColor: '#FF6B35',
              top: '26%',
              right: '6%',
            }}
          />

          {/* Ground Contact Shadow Plane */}
          <div
            className="absolute bottom-2 sm:bottom-4 w-[75%] sm:w-[70%] h-8 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 65% 30% at 50% 90%, rgba(15, 23, 42, 0.45) 0%, rgba(15, 23, 42, 0.15) 50%, transparent 75%)',
              filter: 'blur(6px)',
            }}
          />
        </motion.div>

        {/* ================= ENLARGED 3D BREAK-OUT TRAINER & ATHLETE DUO ================= */}
        {/* Cutout image is significantly enlarged, breaking out dramatically beyond the background box in true 3D */}
        <motion.div
          style={{
            x: prefersReducedMotion ? 0 : athleteTranslateX,
            y: prefersReducedMotion ? 0 : athleteTranslateY,
            transformStyle: 'preserve-3d',
            transform: 'translateZ(55px)',
          }}
          animate={
            prefersReducedMotion
              ? {}
              : {
                  y: [0, -11, 0],
                }
          }
          transition={{
            duration: 4.4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="relative z-10 w-[136%] sm:w-[144%] lg:w-[152%] xl:w-[160%] h-[122%] sm:h-[130%] lg:h-[138%] xl:h-[145%] flex items-end justify-center pointer-events-none scale-130 sm:scale-140 lg:scale-150 xl:scale-158 origin-bottom -mb-2 sm:-mb-3 lg:-mb-4"
        >
          {/* Photorealistic Studio Wall Shadow 1: Diffuse Ambient Wall Shadow (Falls onto the colorful shapes) */}
          <div
            className="absolute inset-0 pointer-events-none select-none flex items-end justify-center"
            style={{
              transform: 'translate(12px, 30px) scale(0.985)',
              filter: 'blur(26px)',
              opacity: 0.50,
            }}
            aria-hidden="true"
          >
            <picture className="w-full h-full block">
              <source srcSet="/images/pt_trainer_athlete_duo.webp" type="image/webp" />
              <img
                src="/images/pt_trainer_athlete_duo.png"
                alt=""
                className="w-full h-full object-contain pointer-events-none"
                style={{ filter: 'brightness(0)' }}
              />
            </picture>
          </div>

          {/* Photorealistic Studio Wall Shadow 2: Directional Depth Shadow */}
          <div
            className="absolute inset-0 pointer-events-none select-none flex items-end justify-center"
            style={{
              transform: 'translate(5px, 14px) scale(0.995)',
              filter: 'blur(12px)',
              opacity: 0.35,
            }}
            aria-hidden="true"
          >
            <picture className="w-full h-full block">
              <source srcSet="/images/pt_trainer_athlete_duo.webp" type="image/webp" />
              <img
                src="/images/pt_trainer_athlete_duo.png"
                alt=""
                className="w-full h-full object-contain pointer-events-none"
                style={{ filter: 'brightness(0)' }}
              />
            </picture>
          </div>

          {/* Full-Size Cutout Duo (Trainer & Athlete) Breaking Out In 3D */}
          <picture className="w-full h-full block relative z-10">
            <source srcSet="/images/pt_trainer_athlete_duo.webp" type="image/webp" />
            <img
              src="/images/pt_trainer_athlete_duo.png"
              alt="Personal trainer coaching athlete with resistance band"
              className="w-full h-full object-contain pointer-events-none"
              style={{
                filter:
                  'brightness(1.03) contrast(1.06) drop-shadow(0 12px 24px rgba(15, 23, 42, 0.22)) drop-shadow(0 30px 48px rgba(15, 23, 42, 0.30))',
                transition: 'filter 0.35s ease-out',
              }}
              loading="eager"
              fetchpriority="high"
              decoding="async"
            />
          </picture>
        </motion.div>
      </motion.div>
    </div>
  );
}
