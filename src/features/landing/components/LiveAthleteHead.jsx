import React from 'react';
import { motion } from 'framer-motion';
import { useLiveAthlete } from '../context/LiveAthleteContext';

/**
 * LiveAthleteHead - Synchronized head layer rendered inside the header.
 * Clipped precisely at the header boundary: clip-path: inset(0 0 calc(100% - var(--header-h)) 0)
 * Uses the exact same image, position, scale, perspective, and tilt transforms as LiveAthleteBody
 * so they form ONE seamless continuous figure across the header edge.
 */
export default function LiveAthleteHead() {
  const athlete = useLiveAthlete();
  if (!athlete) return null;

  const {
    isHeadHovered,
    setIsHeadHovered,
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
      className="hidden lg:block pointer-events-none select-none z-5"
      style={{
        perspective: '1000px',
      }}
      aria-hidden="true"
    >
      {/* Clipped Header Head Strip */}
      <motion.div
        initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'fixed',
          top: 0,
          left: 'calc(var(--athlete-gap-center, 72vw) - (var(--athlete-width) / 2))',
          width: 'var(--athlete-width)',
          height: 'var(--athlete-height)',
          opacity: isHeadHovered ? 1 : scrollOpacity,
          clipPath: 'inset(0 0 calc(100% - var(--header-h, 72px)) 0)',
          WebkitClipPath: 'inset(0 0 calc(100% - var(--header-h, 72px)) 0)',
        }}
      >
        {/* 3D Tilt Canvas (strictly synchronized with body layer) */}
        <motion.div
          style={{
            position: 'absolute',
            top: 'var(--athlete-top-offset, 6px)',
            left: 0,
            width: '100%',
            height: 'calc(100% - var(--athlete-top-offset, 6px))',
            transformOrigin: '50% 12%',
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
          className="relative w-full h-full flex items-start justify-center"
        >
          {/* Athlete Clean Transparent Full Body Cutout (identical to body layer) */}
          <picture className="w-full h-full block">
            <source srcSet="/images/athlete-live.webp" type="image/webp" />
            <img
              src="/images/athlete-live.png"
              alt=""
              className="w-full h-full object-contain pointer-events-none"
              style={{
                filter: isHeadHovered
                  ? 'brightness(1.04) contrast(1.05) drop-shadow(0 0 20px rgba(45, 212, 191, 0.40)) drop-shadow(0 0 28px rgba(255, 107, 53, 0.20))'
                  : 'brightness(1.01) contrast(1.03) drop-shadow(0 0 14px rgba(45, 212, 191, 0.18)) drop-shadow(0 0 22px rgba(255, 107, 53, 0.10))',
                transition: 'filter 0.35s ease-out',
              }}
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </picture>

          {/* Interactive Head Hover Hitbox (centered on athlete head, pointer-events: auto ONLY on head) */}
          <div
            onMouseEnter={() => setIsHeadHovered(true)}
            onMouseLeave={() => setIsHeadHovered(false)}
            style={{
              position: 'absolute',
              top: 0,
              left: 'calc(50% - 70px)',
              width: '140px',
              height: 'calc(var(--header-h, 72px) - var(--athlete-top-offset, 6px))',
              pointerEvents: 'auto',
              cursor: 'default',
            }}
            title="Wellwigen Pro Coach"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
