import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';

/**
 * LiveGroupClassesHero
 * 3D "Break-Out-Of-The-Box" Group Classes Showcase:
 * - Studio background image framed inside a compact architectural studio box
 * - 4 Yoga & fitness group athletes in front, dramatically breaking out of the box in 3D
 * - Vibrant colorful geometric accents (electric cyan disc, deep teal contrast arch, sunset coral rings)
 * - Multi-layer photorealistic studio floor & wall shadows
 * - Autonomous floating breathing motion & dynamic 3D mouse parallax
 */
export default function LiveGroupClassesHero() {
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
      className="relative w-full select-none flex items-center justify-center py-2 lg:py-4"
      style={{ perspective: '1400px' }}
    >
      {/* 3D Canvas */}
      <motion.div
        style={{
          transformStyle: 'preserve-3d',
          rotateX: prefersReducedMotion ? 0 : rotateX,
          rotateY: prefersReducedMotion ? 0 : rotateY,
        }}
        className="relative w-full h-[320px] xs:h-[360px] sm:h-[440px] md:h-[520px] lg:h-[620px] xl:h-[660px] flex items-center justify-center overflow-visible"
      >
        {/* ================= VIBRANT COLORFUL ARCHITECTURAL FORMATION & STUDIO BG BOX ================= */}
        <motion.div
          style={{
            x: prefersReducedMotion ? 0 : wallTranslateX,
            y: prefersReducedMotion ? 0 : wallTranslateY,
            transformStyle: 'preserve-3d',
          }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          {/* Radiant Multi-Color Ambient Bloom (Teal + Emerald + Warm Coral Glow) */}
          <div
            className="absolute top-[22%] sm:top-[24%] w-[76%] sm:w-[70%] lg:w-[66%] xl:w-[62%] h-[70%] sm:h-[66%] lg:h-[62%] xl:h-[60%] rounded-[52px] bg-gradient-to-tr from-teal-400/35 via-emerald-400/25 to-orange-400/20 blur-3xl -z-10"
            aria-hidden="true"
          />

          {/* Colorful Shape 1: Big Luminous Solid Circle in Electric Mint/Cyan (#5EEAD4) peeking behind top-left */}
          <div
            className="absolute rounded-full shadow-[0_16px_36px_rgba(45,212,191,0.30)] pointer-events-none"
            style={{
              width: 'var(--group-circle-size, 260px)',
              height: 'var(--group-circle-size, 260px)',
              backgroundColor: 'var(--solid-teal-light, #5EEAD4)',
              top: '18%',
              left: '8%',
              opacity: 0.95,
            }}
            aria-hidden="true"
          />

          {/* Colorful Shape 2: Deep Luxury Teal-Emerald Contrast Arch (#0F766E) tilted -7deg */}
          <div
            className="absolute top-[24%] sm:top-[26%] right-[10%] sm:right-[14%] lg:right-[16%] w-[70%] sm:w-[64%] lg:w-[60%] xl:w-[56%] h-[68%] sm:h-[64%] lg:h-[60%] xl:h-[58%] rounded-[38px] sm:rounded-[46px] shadow-[0_20px_45px_rgba(15,23,42,0.18)]"
            style={{
              backgroundColor: 'var(--solid-teal-dark, #0F766E)',
              transform: 'rotate(-7deg) translate(-12px, 8px)',
            }}
            aria-hidden="true"
          />

          {/* Colorful Shape 3: Main Studio Box with Sunlit Yoga Studio Background Image */}
          <div
            className="absolute top-[26%] sm:top-[28%] w-[68%] sm:w-[62%] lg:w-[58%] xl:w-[55%] h-[68%] sm:h-[64%] lg:h-[60%] xl:h-[58%] rounded-[36px] sm:rounded-[44px] shadow-[0_28px_60px_rgba(15,23,42,0.25)] overflow-hidden border-2 border-teal-200/60"
            style={{
              transform: 'translateZ(-25px)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6), 0 28px 60px -12px rgba(15,23,42,0.26)',
            }}
          >
            {/* The Sunlit Studio Room Background */}
            <picture className="w-full h-full block">
              <source srcSet="/images/group_yoga_studio_bg.webp" type="image/webp" />
              <img
                src="/images/group_yoga_studio_bg.jpg"
                alt="Sunlit yoga studio room with wooden floor and green plants"
                className="w-full h-full object-cover object-center filter brightness-[1.03] contrast-[1.04]"
                loading="eager"
              />
            </picture>

            {/* Studio Overhead Spotlight Specular Reflection */}
            <div
              className="absolute -top-16 inset-x-0 h-44 pointer-events-none opacity-40"
              style={{
                background: 'radial-gradient(ellipse at 50% 0%, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.3) 45%, transparent 75%)',
              }}
            />

            {/* Subtle Gradient Atmosphere Tint (Blends with Wellwigen Teal) */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, rgba(31, 181, 163, 0.15) 0%, transparent 60%, rgba(15, 118, 110, 0.25) 100%)',
              }}
            />

            {/* Modern Geometric Studio Rings inside the studio box */}
            <div
              className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full pointer-events-none"
              style={{
                border: '3px solid rgba(255, 255, 255, 0.30)',
              }}
            />
            <div
              className="absolute -bottom-8 -right-8 w-36 h-36 rounded-full pointer-events-none"
              style={{
                border: '2px dashed rgba(255, 255, 255, 0.25)',
              }}
            />

            {/* Soft Studio Floor Baseline Vignette */}
            <div
              className="absolute bottom-0 inset-x-0 h-16 pointer-events-none"
              style={{
                background: 'linear-gradient(to top, rgba(15, 23, 42, 0.35) 0%, transparent 100%)',
              }}
            />
          </div>

          {/* ================= COLORFUL FLOATING ACCENT SHAPES (LIKE HOME & PT PAGE) ================= */}
          {/* Accent 1: Vibrant Sunset Coral Ring */}
          <div
            className="bg-drift-1 absolute rounded-full shadow-lg pointer-events-none"
            style={{
              width: '38px',
              height: '38px',
              border: '3.5px solid #FF6B35',
              backgroundColor: 'transparent',
              top: '16%',
              right: '12%',
            }}
          />

          {/* Accent 2: Solid Electric Teal Disc */}
          <div
            className="bg-drift-2 absolute rounded-full shadow-md pointer-events-none"
            style={{
              width: '28px',
              height: '28px',
              backgroundColor: 'var(--solid-teal, #1FB5A3)',
              top: '22%',
              left: '4%',
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
              bottom: '18%',
              left: '6%',
            }}
          />

          {/* Accent 4: Mint Green Light Disc */}
          <div
            className="bg-drift-2 absolute rounded-full shadow-md pointer-events-none"
            style={{
              width: '22px',
              height: '22px',
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
              top: '32%',
              right: '6%',
            }}
          />

          {/* Ground Contact Shadow Plane */}
          <div
            className="absolute bottom-2 sm:bottom-4 w-[78%] sm:w-[74%] h-8 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 65% 30% at 50% 90%, rgba(15, 23, 42, 0.45) 0%, rgba(15, 23, 42, 0.15) 50%, transparent 75%)',
              filter: 'blur(5px)',
            }}
          />
        </motion.div>

        {/* ================= FULL-SIZE 3D BREAK-OUT YOGA ATHLETES CUTOUT ================= */}
        {/* Retains full grand size, projecting out above, to the left, and to the right of the studio box */}
        <motion.div
          style={{
            x: prefersReducedMotion ? 0 : athleteTranslateX,
            y: prefersReducedMotion ? 0 : athleteTranslateY,
            transformStyle: 'preserve-3d',
            transform: 'translateZ(40px)',
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
          className="relative z-10 w-[100%] sm:w-[102%] lg:w-[106%] xl:w-[108%] h-[100%] sm:h-[102%] lg:h-[104%] flex items-end justify-center pointer-events-none"
        >
          {/* Photorealistic Studio Floor Shadow 1: Diffuse Ambient Shadow */}
          <div
            className="absolute inset-0 pointer-events-none select-none flex items-end justify-center"
            style={{
              transform: 'translate(4px, 18px) scale(0.985)',
              filter: 'blur(22px)',
              opacity: 0.44,
            }}
            aria-hidden="true"
          >
            <picture className="w-full h-full block">
              <source srcSet="/images/group_yoga_athletes_cutout.webp" type="image/webp" />
              <img
                src="/images/group_yoga_athletes_cutout.png"
                alt=""
                className="w-full h-full object-contain pointer-events-none"
                style={{ filter: 'brightness(0)' }}
              />
            </picture>
          </div>

          {/* Photorealistic Studio Floor Shadow 2: Directional Contact Shadow */}
          <div
            className="absolute inset-0 pointer-events-none select-none flex items-end justify-center"
            style={{
              transform: 'translate(2px, 8px) scale(0.995)',
              filter: 'blur(9px)',
              opacity: 0.28,
            }}
            aria-hidden="true"
          >
            <picture className="w-full h-full block">
              <source srcSet="/images/group_yoga_athletes_cutout.webp" type="image/webp" />
              <img
                src="/images/group_yoga_athletes_cutout.png"
                alt=""
                className="w-full h-full object-contain pointer-events-none"
                style={{ filter: 'brightness(0)' }}
              />
            </picture>
          </div>

          {/* Full-Size Cutout (4 Yoga Practitioners on Mats) Breaking Out In 3D */}
          <picture className="w-full h-full block relative z-10">
            <source srcSet="/images/group_yoga_athletes_cutout.webp" type="image/webp" />
            <img
              src="/images/group_yoga_athletes_cutout.png"
              alt="Group fitness & yoga class practicing meditation on mats"
              className="w-full h-full object-contain pointer-events-none"
              style={{
                filter:
                  'brightness(1.02) contrast(1.05) drop-shadow(0 6px 14px rgba(15, 23, 42, 0.16)) drop-shadow(0 18px 28px rgba(15, 23, 42, 0.22))',
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
