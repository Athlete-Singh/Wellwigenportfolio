import React from 'react';
import { motion } from 'framer-motion';
import { useLiveAthlete } from '../context/LiveAthleteContext';

/**
 * LiveAthleteHero - 3D Athlete placed directly in the Hero Section.
 * - Scrolls naturally up with the home page (NOT pinned in the background of lower sections).
 * - Sits on top of the hero text and rotating words (z-55 > z-10).
 * - Sits on top of the navbar (z-55 > z-50) so his head seamlessly reaches into the header gap.
 * - 3D mouse tilt and natural idle breathing animation.
 * - Overflow-hidden and strictly clamped so it never wobbles or causes horizontal scroll on any screen.
 */
export default function LiveAthleteHero() {
  const athlete = useLiveAthlete();

  const {
    prefersReducedMotion,
    baseRotateX,
    baseRotateY,
  } = athlete || {};

  return (
    <div
      className="hidden lg:block absolute inset-0 pointer-events-none select-none overflow-hidden w-full max-w-full"
      style={{
        perspective: '1000px',
        zIndex: 25,
      }}
      aria-hidden="true"
    >
      {/* Positioned Hero Visual Container (Arch + Athlete in Lockstep) */}
      <motion.div
        initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'absolute',
          top: 'var(--athlete-top-offset, 52px)',
          right: 'clamp(-180px, calc((100vw - 1440px) / 2 - 130px), 140px)',
          width: 'var(--athlete-width)',
          height: 'var(--athlete-height)',
          maskImage: 'linear-gradient(to bottom, black 84%, transparent 99%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 84%, transparent 99%)',
        }}
      >
        {/* Layer 1: Flat Solid Background Shapes (Anchored directly to visual container) */}
        <div className="absolute inset-0 pointer-events-none select-none z-0">
          {/* Shape 2: Dark Teal Accent Panel peeking behind main arch */}
          <div
            className="absolute shadow-[0_16px_36px_rgba(15,23,42,0.10)]"
            style={{
              width: 'var(--hero-arch-width)',
              height: 'var(--hero-arch-height)',
              backgroundColor: 'var(--solid-teal-dark, #0F766E)',
              borderRadius: 'var(--hero-arch-radius) var(--hero-arch-radius) 44px 44px',
              transform: 'rotate(-9deg) translate(-28px, 16px)',
              right: 'calc(var(--athlete-width) * 0.165)',
              top: 'calc(var(--athlete-height) * 0.076)',
            }}
          />

          {/* Shape 3: Light Teal Circle peeking on left of arch */}
          <div
            className="absolute rounded-full shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
            style={{
              width: 'var(--hero-circle-size)',
              height: 'var(--hero-circle-size)',
              backgroundColor: 'var(--solid-teal-light, #5EEAD4)',
              right: 'calc(var(--athlete-width) * 0.355)',
              top: 'calc(var(--athlete-height) * 0.25)',
            }}
          />

          {/* Shape 1: Main Solid Teal Rounded-Arch Panel (tilted -5deg) */}
          <div
            className="absolute shadow-[0_24px_48px_rgba(15,23,42,0.14)]"
            style={{
              width: 'var(--hero-arch-width)',
              height: 'var(--hero-arch-height)',
              backgroundColor: 'var(--solid-teal, #1FB5A3)',
              borderRadius: 'var(--hero-arch-radius) var(--hero-arch-radius) 44px 44px',
              transform: 'rotate(var(--hero-arch-tilt, -5deg))',
              right: 'calc(var(--athlete-width) * 0.14)',
              top: 'calc(var(--athlete-height) * 0.091)',
            }}
          />

          {/* Floating Accent Shapes */}
          <div
            className="bg-drift-1 absolute rounded-full shadow-md"
            style={{
              width: '26px',
              height: '26px',
              backgroundColor: 'var(--solid-teal, #1FB5A3)',
              right: 'calc(var(--athlete-width) * 0.52)',
              top: 'calc(var(--athlete-height) * 0.18)',
            }}
          />
          <div
            className="bg-drift-2 absolute rounded-full shadow-sm"
            style={{
              width: '18px',
              height: '18px',
              backgroundColor: 'var(--solid-teal-dark, #0F766E)',
              right: 'calc(var(--athlete-width) * 0.22)',
              top: 'calc(var(--athlete-height) * 0.06)',
            }}
          />
          <div
            className="bg-drift-1 absolute rounded-full shadow-md"
            style={{
              width: '38px',
              height: '38px',
              backgroundColor: 'var(--solid-teal-light, #5EEAD4)',
              right: 'calc(var(--athlete-width) * 0.47)',
              top: 'calc(var(--athlete-height) * 0.74)',
            }}
          />
          <div
            className="bg-drift-2 absolute rounded-full shadow-sm"
            style={{
              width: '46px',
              height: '46px',
              border: '3.5px solid var(--solid-teal, #1FB5A3)',
              backgroundColor: 'transparent',
              right: 'calc(var(--athlete-width) * 0.56)',
              top: 'calc(var(--athlete-height) * 0.44)',
            }}
          />
          <div
            className="bg-drift-1 absolute rounded-full shadow-sm"
            style={{
              width: '28px',
              height: '28px',
              border: '2.5px solid var(--solid-teal-dark, #0F766E)',
              backgroundColor: 'transparent',
              right: 'calc(var(--athlete-width) * 0.14)',
              top: 'calc(var(--athlete-height) * 0.78)',
            }}
          />
        </div>

        {/* Layer 2: 3D Tilt Card Canvas with Athlete */}
        <motion.div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            transformOrigin: '50% 15%',
            transformStyle: 'preserve-3d',
            rotateX: prefersReducedMotion ? 0 : baseRotateX,
            rotateY: prefersReducedMotion ? 0 : baseRotateY,
          }}
          animate={
            prefersReducedMotion
              ? {}
              : {
                  scale: [1, 1.014, 1],
                  y: [0, -2.5, 0],
                }
          }
          transition={{
            duration: 3.6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="relative z-10 w-full h-full flex items-start justify-center"
        >
          {/* OLD CODE (commented by AI) - neon colored glow without studio wall shadows
          <picture className="w-full h-full block">
            <source srcSet="/images/athlete-live.webp" type="image/webp" />
            <img
              src="/images/athlete-live.png"
              alt="Wellwigen Pro Athlete"
              className="w-full h-full object-contain pointer-events-none"
              style={{
                filter: 'brightness(1.02) contrast(1.04) drop-shadow(0 0 16px rgba(45, 212, 191, 0.22)) drop-shadow(0 0 26px rgba(255, 107, 53, 0.12))',
                transition: 'filter 0.35s ease-out',
              }}
              loading="eager"
              fetchpriority="high"
              decoding="async"
            />
          </picture>
          */}

          {/* NEW CODE - Photorealistic Studio Wall Shadow matching user reference photo: diffuse ambient shadow behind dumbbells & torso */}
          <div
            className="absolute inset-0 pointer-events-none select-none"
            style={{
              transform: 'translate(2px, 24px) scale(0.985)',
              filter: 'blur(20px)',
              opacity: 0.40,
            }}
            aria-hidden="true"
          >
            <picture className="w-full h-full block">
              <source srcSet="/images/athlete-live.webp" type="image/webp" />
              <img
                src="/images/athlete-live.png"
                alt=""
                className="w-full h-full object-contain pointer-events-none"
                style={{
                  filter: 'brightness(0)',
                }}
              />
            </picture>
          </div>

          {/* NEW CODE - Secondary Tighter Directional Studio Shadow for crisp depth definition */}
          <div
            className="absolute inset-0 pointer-events-none select-none"
            style={{
              transform: 'translate(0px, 10px) scale(0.995)',
              filter: 'blur(9px)',
              opacity: 0.26,
            }}
            aria-hidden="true"
          >
            <picture className="w-full h-full block">
              <source srcSet="/images/athlete-live.webp" type="image/webp" />
              <img
                src="/images/athlete-live.png"
                alt=""
                className="w-full h-full object-contain pointer-events-none"
                style={{
                  filter: 'brightness(0)',
                }}
              />
            </picture>
          </div>

          {/* Athlete Clean Transparent Full Body Cutout with natural contact shadow */}
          <picture className="w-full h-full block relative z-10">
            <source srcSet="/images/athlete-live.webp" type="image/webp" />
            <img
              src="/images/athlete-live.png"
              alt="Wellwigen Pro Athlete"
              className="w-full h-full object-contain pointer-events-none"
              style={{
                filter:
                  'brightness(1.02) contrast(1.04) drop-shadow(0 4px 10px rgba(15, 23, 42, 0.16)) drop-shadow(0 16px 24px rgba(15, 23, 42, 0.22))',
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

/**
 * MobileAthleteHero - Dedicated 3D Athlete & Arched Backdrop for Mobile Screens (< lg).
 * - Gives mobile users the exact same 3D athlete, tilted teal arch, and studio shadows as desktop.
 * - Perfectly constrained to 100% width with overflow-hidden (ZERO horizontal sliding or wobble).
 * - Smooth breathing animation and layered depth.
 */
export function MobileAthleteHero() {
  const athlete = useLiveAthlete();
  const { prefersReducedMotion } = athlete || {};

  return (
    <div
      className="block lg:hidden relative w-full h-[325px] xs:h-[355px] sm:h-[395px] -mt-3 sm:-mt-5 mb-0 select-none pointer-events-none z-10"
      style={{ perspective: '800px' }}
      aria-hidden="true"
    >
      {/* Shifted Wrapper: Both background arch and athletes anchored to the right and bleeding past the screen edge */}
      <div
        className="absolute top-0 w-[380px] xs:w-[420px] sm:w-[460px] h-full"
        style={{
          right: 'clamp(-78px, -58px - 1.5vw, -48px)',
        }}
      >
        {/* Background Flat Solid Shapes (restored to original rightward position as requested) */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transform: 'translateX(30px)',
          }}
        >
          {/* Dark Teal Accent Panel */}
          <div
            className="absolute shadow-[0_12px_28px_rgba(15,23,42,0.12)]"
            style={{
              width: '210px',
              height: '280px',
              backgroundColor: 'var(--solid-teal-dark, #0F766E)',
              borderRadius: '105px 105px 26px 26px',
              transform: 'rotate(-9deg) translate(-14px, 10px)',
            }}
          />

          {/* Light Teal Circle */}
          <div
            className="absolute rounded-full shadow-[0_8px_20px_rgba(15,23,42,0.08)]"
            style={{
              width: '125px',
              height: '125px',
              backgroundColor: 'var(--solid-teal-light, #5EEAD4)',
              transform: 'translate(-80px, 25px)',
            }}
          />

          {/* Main Solid Teal Arch */}
          <div
            className="absolute shadow-[0_18px_36px_rgba(15,23,42,0.14)]"
            style={{
              width: '220px',
              height: '290px',
              backgroundColor: 'var(--solid-teal, #1FB5A3)',
              borderRadius: '110px 110px 26px 26px',
              transform: 'rotate(-5deg)',
            }}
          />

          {/* Drifting Floating Accent Circles & Rings */}
          <div
            className="bg-drift-1 absolute rounded-full shadow-md"
            style={{
              width: '16px',
              height: '16px',
              backgroundColor: 'var(--solid-teal, #1FB5A3)',
              transform: 'translate(-105px, -65px)',
            }}
          />
          <div
            className="bg-drift-2 absolute rounded-full shadow-sm"
            style={{
              width: '12px',
              height: '12px',
              backgroundColor: 'var(--solid-teal-dark, #0F766E)',
              transform: 'translate(95px, -55px)',
            }}
          />
          <div
            className="bg-drift-1 absolute rounded-full shadow-sm"
            style={{
              width: '24px',
              height: '24px',
              border: '2.5px solid var(--solid-teal, #1FB5A3)',
              backgroundColor: 'transparent',
              transform: 'translate(100px, 50px)',
            }}
          />
        </div>

        {/* 3D Athlete Foreground with Studio Shadows & Breathing Animation */}
        <motion.div
          animate={
            prefersReducedMotion
              ? {}
              : {
                  scale: [1, 1.018, 1],
                  y: [0, -3, 0],
                }
          }
          transition={{
            duration: 3.6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="relative w-full h-full flex items-center justify-center z-10"
          style={{
            maskImage: 'linear-gradient(to bottom, black 65%, transparent 95%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 65%, transparent 95%)',
          }}
        >
          {/* Diffuse Studio Wall Shadow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              transform: 'translate(2px, 14px) scale(0.98)',
              filter: 'blur(14px)',
              opacity: 0.38,
            }}
          >
            <picture className="w-full h-full flex items-center justify-center">
              <source srcSet="/images/athlete-live.webp" type="image/webp" />
              <img
                src="/images/athlete-live.png"
                alt=""
                className="w-full h-full object-contain pointer-events-none"
                style={{ filter: 'brightness(0)' }}
              />
            </picture>
          </div>

          {/* Athlete Clean Full Cutout */}
          <picture className="w-full h-full flex items-center justify-center relative z-10">
            <source srcSet="/images/athlete-live.webp" type="image/webp" />
            <img
              src="/images/athlete-live.png"
              alt="Wellwigen Pro Athlete"
              className="w-full h-full object-contain pointer-events-none"
              style={{
                filter:
                  'brightness(1.02) contrast(1.04) drop-shadow(0 4px 10px rgba(15, 23, 42, 0.16)) drop-shadow(0 14px 20px rgba(15, 23, 42, 0.20))',
              }}
              loading="eager"
              fetchpriority="high"
              decoding="async"
            />
          </picture>
        </motion.div>
      </div>
    </div>
  );
}

