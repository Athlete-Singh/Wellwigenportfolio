import React from 'react';
import { motion } from 'framer-motion';
import { useLiveAthlete } from '../context/LiveAthleteContext';

/**
 * LiveAthleteBody - Premium 3D Athlete stuck on the background for the Home page.
 * Stacking order: Site background < LiveAthleteBody (z-5) < Main sections (z-10) < Header (z-50)
 * Sits in fixed position stuck to the background, tilts in 3D with screen mouse movements,
 * breathes with natural idle animation, and fades to ~0.18 opacity on scroll past hero.
 */
export default function LiveAthleteBody() {
  const athlete = useLiveAthlete();
  if (!athlete) return null;

  const {
    isHeadHovered,
    prefersReducedMotion,
    baseRotateX,
    baseRotateY,
    hoverRotateX,
    hoverRotateY,
    scrollOpacity,
    parallaxY,
  } = athlete;

  return (
    <div
      className="hidden lg:block fixed inset-0 pointer-events-none select-none z-5 overflow-hidden"
      style={{
        perspective: '1000px',
      }}
      aria-hidden="true"
    >
      {/* Positioned Athlete Body Container */}
      <motion.div
        initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'fixed',
          top: 'var(--athlete-top-offset, 10px)',
          left: 'calc(var(--athlete-gap-center, 72vw) - (var(--athlete-width) * 0.5137))',
          width: 'var(--athlete-width)',
          height: 'var(--athlete-height)',
          opacity: isHeadHovered ? 1 : scrollOpacity,
          maskImage: 'linear-gradient(to bottom, black 68%, transparent 98%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 68%, transparent 98%)',
        }}
      >
        {/* 3D Tilt Card Canvas */}
        <motion.div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            transformOrigin: '50% 15%',
            transformStyle: 'preserve-3d',
            rotateX: prefersReducedMotion ? 0 : isHeadHovered ? hoverRotateX : baseRotateX,
            rotateY: prefersReducedMotion ? 0 : isHeadHovered ? hoverRotateY : baseRotateY,
            y: prefersReducedMotion ? 0 : parallaxY,
          }}
          animate={
            prefersReducedMotion
              ? {}
              : isHeadHovered
              ? { scale: 1.05 }
              : {
                  scale: [1, 1.014, 1],
                  y: [0, -2.5, 0],
                }
          }
          transition={
            isHeadHovered
              ? { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
              : {
                  scale: { duration: 3.6, repeat: Infinity, ease: 'easeInOut' },
                  y: { duration: 3.6, repeat: Infinity, ease: 'easeInOut' },
                }
          }
          className="w-full h-full flex items-start justify-center"
        >
          {/* Athlete Clean Transparent Full Body Cutout (New Studio Asset) */}
          <picture className="w-full h-full block">
            <source srcSet="/images/athlete-live.webp" type="image/webp" />
            <img
              src="/images/athlete-live.png"
              alt="Wellwigen Pro Athlete"
              className="w-full h-full object-contain pointer-events-none"
              style={{
                filter: isHeadHovered
                  ? 'brightness(1.04) contrast(1.05) drop-shadow(0 0 20px rgba(45, 212, 191, 0.38)) drop-shadow(0 0 28px rgba(255, 107, 53, 0.18))'
                  : 'brightness(1.01) contrast(1.03) drop-shadow(0 0 14px rgba(45, 212, 191, 0.16)) drop-shadow(0 0 22px rgba(255, 107, 53, 0.08))',
                transition: 'filter 0.35s ease-out',
              }}
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </picture>
        </motion.div>
      </motion.div>
    </div>
  );
}
