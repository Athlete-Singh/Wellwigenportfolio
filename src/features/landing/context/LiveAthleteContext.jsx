import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMotionValue, useSpring, useTransform, useScroll, useReducedMotion } from 'framer-motion';

const LiveAthleteContext = createContext(null);

export function LiveAthleteProvider({ children }) {
  const [isHeadHovered, setIsHeadHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Mouse coordinate motion values (-0.5 to +0.5 normalized across viewport)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for 60fps natural inertia
  const springConfig = { damping: 25, stiffness: 140, mass: 0.45 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // 3D Rotations (up to ~6deg idle tilt, up to ~12deg when head hovered)
  const baseRotateX = useTransform(smoothY, [-0.5, 0.5], [5, -5]);
  const baseRotateY = useTransform(smoothX, [-0.5, 0.5], [-6, 6]);

  const hoverRotateX = useTransform(smoothY, [-0.5, 0.5], [11, -11]);
  const hoverRotateY = useTransform(smoothX, [-0.5, 0.5], [-12, 12]);

  // Scroll tracking: full opacity in hero (1.0), fading to ~0.18 past hero
  const { scrollY } = useScroll();
  const scrollOpacity = useTransform(scrollY, [50, 500], [1, 0.18]);
  // Subtle parallax: moves up slightly slower than the page scroll
  const parallaxY = useTransform(scrollY, [0, 1000], [0, -45]);

  // Viewport mouse tracking
  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleMouseMove = (e) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [prefersReducedMotion, mouseX, mouseY]);

  // Measure header empty gap between nav pill and Trainer button
  useEffect(() => {
    const measureGap = () => {
      const navEl = document.querySelector('[data-athlete-nav-pill]');
      const trainerEl = document.querySelector('[data-athlete-trainer-btn]');
      const headerEl = document.querySelector('header');

      if (navEl && trainerEl && headerEl) {
        const navRect = navEl.getBoundingClientRect();
        const trainerRect = trainerEl.getBoundingClientRect();
        const headerRect = headerEl.getBoundingClientRect();

        const gapCenter = (navRect.right + trainerRect.left) / 2;
        const gapWidth = Math.max(0, trainerRect.left - navRect.right);

        document.documentElement.style.setProperty('--athlete-gap-center', `${Math.round(gapCenter)}px`);
        document.documentElement.style.setProperty('--athlete-gap-width', `${Math.round(gapWidth)}px`);
        document.documentElement.style.setProperty('--header-h', `${Math.round(headerRect.height)}px`);
      }
    };

    measureGap();
    // Re-measure after initial paint & layout settle
    const t1 = setTimeout(measureGap, 100);
    const t2 = setTimeout(measureGap, 600);

    window.addEventListener('resize', measureGap, { passive: true });
    window.addEventListener('scroll', measureGap, { passive: true });

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('resize', measureGap);
      window.removeEventListener('scroll', measureGap);
    };
  }, []);

  const value = {
    isHeadHovered,
    setIsHeadHovered,
    prefersReducedMotion,
    mouseX,
    mouseY,
    smoothX,
    smoothY,
    baseRotateX,
    baseRotateY,
    hoverRotateX,
    hoverRotateY,
    scrollOpacity,
    parallaxY,
  };

  return (
    <LiveAthleteContext.Provider value={value}>
      {children}
    </LiveAthleteContext.Provider>
  );
}

export function useLiveAthlete() {
  const ctx = useContext(LiveAthleteContext);
  return ctx;
}
