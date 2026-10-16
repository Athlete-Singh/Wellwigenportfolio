import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';

/**
 * LiveAthlete - Premium 3D interactive athlete bust component for the Home header.
 * Features:
 * - Subtle idle breathing & floating animation (3.5s natural loop).
 * - 3D physics-based tilt responding to mouse coordinates with spring smoothing.
 * - Multi-layer parallax (depth glow, athlete body, realistic drop shadow).
 * - Interactive hover pop with brand teal & coral energy glow.
 * - Entrance fade-and-rise with blur-to-sharp transition.
 * - Full prefers-reduced-motion accessibility support.
 */
export default function LiveAthlete() {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  // Mouse coordinate motion values (-0.5 to 0.5)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for buttery 60fps response
  const springConfig = { damping: 22, stiffness: 180, mass: 0.4 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // 3D Rotations (up to ~10 degrees)
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [8.5, -8.5]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-10.5, 10.5]);

  // Parallax offsets for depth layers
  const athleteX = useTransform(smoothX, [-0.5, 0.5], [-3.5, 3.5]);
  const athleteY = useTransform(smoothY, [-0.5, 0.5], [-2.5, 2.5]);

  const glowX = useTransform(smoothX, [-0.5, 0.5], [-7, 7]);
  const glowY = useTransform(smoothY, [-0.5, 0.5], [-5, 5]);

  const shadowX = useTransform(smoothX, [-0.5, 0.5], [5, -5]);
  const shadowY = useTransform(smoothY, [-0.5, 0.5], [7, 2]);

  const handleMouseMove = (e) => {
    if (prefersReducedMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 10, filter: 'blur(6px)', scale: 0.95 }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
      className="hidden lg:flex items-center justify-center relative select-none w-28 xl:w-32 h-12 cursor-default group"
      style={{
        perspective: '800px',
      }}
      title="Live 3D Master Coach"
    >
      {/* 3D Tilt Card Canvas */}
      <motion.div
        style={{
          rotateX: prefersReducedMotion ? 0 : rotateX,
          rotateY: prefersReducedMotion ? 0 : rotateY,
          transformStyle: 'preserve-3d',
        }}
        animate={
          prefersReducedMotion
            ? {}
            : isHovered
            ? { scale: 1.08, y: -2 }
            : {
                scale: [1, 1.018, 1],
                y: [0, -2.5, 0],
              }
        }
        transition={
          isHovered
            ? { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
            : {
                duration: 3.6,
                repeat: Infinity,
                ease: 'easeInOut',
              }
        }
        className="relative w-full h-full flex items-center justify-center pointer-events-none"
      >
        {/* ================= LAYER 1: AMBIENT BRAND DEPTH GLOW ================= */}
        <motion.div
          style={{
            x: prefersReducedMotion ? 0 : glowX,
            y: prefersReducedMotion ? 0 : glowY,
            transform: 'translateZ(-25px)',
          }}
          animate={{
            opacity: isHovered ? 0.85 : 0.45,
            scale: isHovered ? 1.18 : 1,
          }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="absolute inset-x-1 -inset-y-1.5 rounded-full pointer-events-none blur-md"
        >
          {/* Dual-tone gradient glow (Wellwigen Teal & Power Coral) */}
          <div className="w-full h-full rounded-full bg-gradient-to-r from-teal-400/40 via-emerald-400/30 to-[#FF6B35]/40 opacity-80" />
        </motion.div>

        {/* ================= LAYER 2: DEPTH DROP SHADOW ================= */}
        <motion.div
          style={{
            x: prefersReducedMotion ? 0 : shadowX,
            y: prefersReducedMotion ? 0 : shadowY,
            transform: 'translateZ(-15px)',
          }}
          animate={{
            opacity: isHovered ? 0.65 : 0.35,
            scale: isHovered ? 1.06 : 0.95,
          }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="absolute bottom-0 w-20 h-4 bg-slate-900/40 rounded-full blur-sm pointer-events-none"
        />

        {/* ================= LAYER 3: 3D ATHLETE BUST ================= */}
        <motion.div
          style={{
            x: prefersReducedMotion ? 0 : athleteX,
            y: prefersReducedMotion ? 0 : athleteY,
            transform: 'translateZ(25px)',
          }}
          className="relative w-full h-full flex items-center justify-center overflow-visible"
        >
          {/* Athlete Image (Sharp high-res bust with head, shoulders, chest & both dumbbells) */}
          <picture className="contents">
            <source srcSet="/images/athlete-live-bust.webp" type="image/webp" />
            <img
              src="/images/athlete-live-bust.png"
              alt="Wellwigen Pro Athlete Coach"
              className="h-[52px] xl:h-[56px] w-auto max-w-none object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.18)] pointer-events-none"
              style={{
                filter: isHovered
                  ? 'brightness(1.05) contrast(1.08) drop-shadow(0 8px 16px rgba(13,148,136,0.3))'
                  : 'brightness(1) contrast(1.04) drop-shadow(0 4px 8px rgba(0,0,0,0.18))',
                transition: 'filter 0.35s ease-out',
              }}
              loading="eager"
              decoding="async"
            />
          </picture>

          {/* ================= LAYER 4: SPECULAR MUSCLE GLEAM ON HOVER ================= */}
          <motion.div
            style={{
              x: prefersReducedMotion ? 0 : glowX,
              y: prefersReducedMotion ? 0 : glowY,
              transform: 'translateZ(38px)',
            }}
            animate={{
              opacity: isHovered ? 0.35 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-radial from-white/40 via-transparent to-transparent pointer-events-none rounded-full"
          />
        </motion.div>
      </motion.div>

      {/* Tiny subtle live pulse dot indicator (matches brand) */}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
        <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
        <span className="text-[9px] font-extrabold uppercase tracking-widest text-teal-700 bg-white/90 px-1.5 py-0.2 rounded-full border border-teal-200 shadow-2xs">
          3D Live
        </span>
      </div>
    </motion.div>
  );
}
