import React, { useEffect, useRef, useState } from 'react';
import './AnimatedBackground.css';

/**
 * ============================================================================
 * WELLWIGEN "LIVING ENERGY FIELD" - MASTER CONFIGURATION
 * ============================================================================
 * Easily toggle individual effects on/off or fine-tune performance values below.
 * If the site feels heavy on low-spec hardware, lower particleCount or turn off
 * enableMouseSpotlight and enableNoiseGrain.
 */
export const BACKGROUND_CONFIG = {
  particleCount: 50,             // 40-60 on desktop
  particleCountMobile: 18,       // 15-20 on mobile
  iconCount: 12,                 // Max 10-14 elements on desktop
  iconCountMobile: 6,            // Scaled down on mobile
  blobOpacityDark: 0.22,         // 15-25% opacity on dark sections
  blobOpacityLight: 0.09,        // 8-12% opacity on light sections
  enableMouseSpotlight: true,    // Soft teal radial glow following cursor (desktop only)
  enableHeartbeatLine: false,    // Turned off per user request: eliminates periodic ECG heart line
  enableLightSweep: false,        // Turned off: eliminates diagonal glass animation on face/images
  enableRadarRings: false,       // Turned off: eliminates expanding ring outlines near hero area
  enableGridShimmer: false,       // Turned off: eliminates harsh diagonal shimmer lines over images
  enableNoiseGrain: true,        // Subtle 3-4% film grain overlay
  enableParallax: true,          // Multi-layer scroll parallax
  zIndex: -1,                    // Stacking index (-1 sits behind content)
};

/**
 * High-performance SVG Outline Fitness Icons
 * Lightweight vector paths with zero external icon dependencies.
 */
const ICONS_DATA = [
  {
    id: 'dumbbell-1',
    type: 'dumbbell',
    top: '8%',
    left: '6%',
    depth: 'mid',
    size: 34,
    floatClass: 'ab-float-gentle',
  },
  {
    id: 'kettlebell-1',
    type: 'kettlebell',
    top: '20%',
    right: '8%',
    depth: 'near',
    size: 40,
    floatClass: 'ab-float-reverse',
  },
  {
    id: 'heartbeat-1',
    type: 'heartbeat',
    top: '32%',
    left: '12%',
    depth: 'far',
    size: 36,
    floatClass: 'ab-float-slow',
  },
  {
    id: 'stopwatch-1',
    type: 'stopwatch',
    top: '46%',
    right: '10%',
    depth: 'mid',
    size: 38,
    floatClass: 'ab-float-gentle',
  },
  {
    id: 'lightning-1',
    type: 'lightning',
    top: '58%',
    left: '7%',
    depth: 'near',
    size: 40,
    floatClass: 'ab-float-reverse',
  },
  {
    id: 'hexagon-1',
    type: 'hexagon',
    top: '70%',
    right: '12%',
    depth: 'far',
    size: 34,
    floatClass: 'ab-float-slow',
  },
  {
    id: 'dumbbell-2',
    type: 'dumbbell',
    top: '82%',
    left: '16%',
    depth: 'mid',
    size: 36,
    floatClass: 'ab-float-gentle',
  },
  {
    id: 'kettlebell-2',
    type: 'kettlebell',
    top: '14%',
    right: '28%',
    depth: 'far',
    size: 30,
    floatClass: 'ab-float-slow',
  },
  {
    id: 'hexagon-2',
    type: 'hexagon',
    top: '40%',
    right: '4%',
    depth: 'near',
    size: 42,
    floatClass: 'ab-float-reverse',
  },
  {
    id: 'lightning-2',
    type: 'lightning',
    top: '52%',
    left: '24%',
    depth: 'far',
    size: 28,
    floatClass: 'ab-float-slow',
  },
  {
    id: 'stopwatch-2',
    type: 'stopwatch',
    top: '66%',
    left: '5%',
    depth: 'mid',
    size: 34,
    floatClass: 'ab-float-gentle',
  },
  {
    id: 'heartbeat-2',
    type: 'heartbeat',
    top: '90%',
    right: '8%',
    depth: 'near',
    size: 42,
    floatClass: 'ab-float-reverse',
  },
];

function FitnessIconSvg({ type }) {
  switch (type) {
    case 'dumbbell':
      return (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="6" y="16" width="6" height="16" rx="2" />
          <rect x="12" y="20" width="3" height="8" rx="1" />
          <line x1="15" y1="24" x2="33" y2="24" strokeWidth="2.5" />
          <rect x="33" y="20" width="3" height="8" rx="1" />
          <rect x="36" y="16" width="6" height="16" rx="2" />
        </svg>
      );
    case 'kettlebell':
      return (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 17V12a7 7 0 0 1 14 0v5" strokeWidth="2" />
          <circle cx="24" cy="30" r="14" />
          <ellipse cx="24" cy="19" rx="4" ry="2" fill="currentColor" opacity="0.3" />
        </svg>
      );
    case 'heartbeat':
      return (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 24h9l4-10 6 20 5-14 3 6h13" />
        </svg>
      );
    case 'stopwatch':
      return (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="24" cy="27" r="15" />
          <path d="M24 12V7M20 7h8M24 27l6-6M36 15l2-2" strokeWidth="2" />
        </svg>
      );
    case 'lightning':
      return (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="26 4 12 26 23 26 20 44 36 20 25 20 26 4" />
        </svg>
      );
    case 'hexagon':
      return (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="24 6 40 15 40 33 24 42 8 33 8 15" />
          <circle cx="24" cy="24" r="3" fill="currentColor" opacity="0.4" />
        </svg>
      );
    default:
      return null;
  }
}

export default function AnimatedBackground() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const spotlightRef = useRef(null);

  // Responsive state
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Scroll parallax reference tracking
  const scrollYRef = useRef(0);
  const scrollBoostRef = useRef(0);
  const lastScrollYRef = useRef(0);

  // Mouse tracking references for smooth lerp spotlight
  const mouseTargetRef = useRef({ x: -1000, y: -1000 });
  const mouseCurrentRef = useRef({ x: -1000, y: -1000 });

  // 1. Initial checks & Mobile/Reduced-Motion detection
  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const mediaMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaMotion.matches);

    const handleMotionChange = (e) => setReducedMotion(e.matches);
    if (mediaMotion.addEventListener) {
      mediaMotion.addEventListener('change', handleMotionChange);
    } else {
      mediaMotion.addListener(handleMotionChange);
    }

    checkViewport();
    window.addEventListener('resize', checkViewport, { passive: true });

    return () => {
      window.removeEventListener('resize', checkViewport);
      if (mediaMotion.removeEventListener) {
        mediaMotion.removeEventListener('change', handleMotionChange);
      } else {
        mediaMotion.removeListener(handleMotionChange);
      }
    };
  }, []);

  // OLD CODE (commented by AI)
  /*
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY || window.pageYOffset;
      const delta = Math.abs(currentScrollY - lastScrollYRef.current);
      lastScrollYRef.current = currentScrollY;
      scrollYRef.current = currentScrollY;

      // Add energy boost to particles while scrolling
      scrollBoostRef.current = Math.min(scrollBoostRef.current + delta * 0.08, 4.0);

      // Parallax update via CSS custom variable on container
      if (containerRef.current && BACKGROUND_CONFIG.enableParallax) {
        containerRef.current.style.setProperty('--scroll-y', `${currentScrollY}px`);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  */
  // NEW CODE - smooth animation/performance: rAF throttled scroll, zero parallax overhead on mobile
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      const currentScrollY = window.scrollY || window.pageYOffset;
      const delta = Math.abs(currentScrollY - lastScrollYRef.current);
      lastScrollYRef.current = currentScrollY;
      scrollYRef.current = currentScrollY;

      // Light particle energy boost
      scrollBoostRef.current = Math.min(scrollBoostRef.current + delta * 0.05, 3.0);

      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Disable parallax calculation entirely on mobile for max FPS
          if (!isMobile && containerRef.current && BACKGROUND_CONFIG.enableParallax && !reducedMotion) {
            containerRef.current.style.setProperty('--scroll-y', `${currentScrollY}px`);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobile, reducedMotion]);

  // 3. Mouse-follow Spotlight with smooth lag (Lerp)
  useEffect(() => {
    if (isMobile || !BACKGROUND_CONFIG.enableMouseSpotlight || reducedMotion) return;

    let animId;
    const handleMouseMove = (e) => {
      mouseTargetRef.current = { x: e.clientX, y: e.clientY };
    };

    const updateSpotlight = () => {
      // Lerp (smooth lag)
      const target = mouseTargetRef.current;
      const current = mouseCurrentRef.current;
      current.x += (target.x - current.x) * 0.08;
      current.y += (target.y - current.y) * 0.08;

      if (spotlightRef.current) {
        spotlightRef.current.style.background = `radial-gradient(circle 380px at ${current.x.toFixed(1)}px ${current.y.toFixed(1)}px, var(--ab-spotlight-color), transparent 70%)`;
      }

      animId = requestAnimationFrame(updateSpotlight);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    animId = requestAnimationFrame(updateSpotlight);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [isMobile, reducedMotion]);

  // 4. Glowing Embers / Sparks Canvas Particles
  useEffect(() => {
    if (reducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    // Initialize particles
    const count = isMobile
      ? BACKGROUND_CONFIG.particleCountMobile
      : BACKGROUND_CONFIG.particleCount;

    const particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.6 + 1.1,
        // ~65% Teal shades, ~35% Orange embers
        isOrange: Math.random() > 0.65,
        speedY: -(Math.random() * 0.5 + 0.35),
        wobbleSpeed: Math.random() * 0.03 + 0.015,
        wobbleOffset: Math.random() * Math.PI * 2,
        wobbleAmp: Math.random() * 0.5 + 0.2,
        alpha: Math.random() * 0.5 + 0.3,
        pulseSpeed: Math.random() * 0.03 + 0.01,
      });
    }

    let isTabVisible = document.visibilityState === 'visible';
    const handleVisibilityChange = () => {
      isTabVisible = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Particle render loop
    const render = () => {
      if (isTabVisible) {
        ctx.clearRect(0, 0, width, height);

        // Smoothly decay scroll boost
        const currentBoost = 1 + scrollBoostRef.current;
        scrollBoostRef.current *= 0.94;

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];

          // Upward drift + horizontal sine wobble
          p.wobbleOffset += p.wobbleSpeed;
          p.x += Math.sin(p.wobbleOffset) * p.wobbleAmp;
          p.y += p.speedY * currentBoost;

          // Wrap around top edge to bottom
          if (p.y < -15) {
            p.y = height + 15;
            p.x = Math.random() * width;
          }
          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;

          // Pulse opacity gently
          const currentAlpha = p.alpha * (0.8 + 0.2 * Math.sin(p.wobbleOffset));

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

          if (p.isOrange) {
            ctx.fillStyle = `rgba(242, 122, 61, ${currentAlpha.toFixed(3)})`;
            ctx.shadowColor = 'rgba(242, 122, 61, 0.4)';
          } else {
            ctx.fillStyle = `rgba(45, 212, 191, ${currentAlpha.toFixed(3)})`;
            ctx.shadowColor = 'rgba(45, 212, 191, 0.45)';
          }
          ctx.shadowBlur = 6;
          ctx.fill();
        }
      }

      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isMobile, reducedMotion]);

  // Filter icons for mobile
  const activeIcons = isMobile
    ? ICONS_DATA.slice(0, BACKGROUND_CONFIG.iconCountMobile)
    : ICONS_DATA.slice(0, BACKGROUND_CONFIG.iconCount);

  return (
    <div
      ref={containerRef}
      className="ab-root-container ab-theme-light"
      style={{ zIndex: BACKGROUND_CONFIG.zIndex }}
      aria-hidden="true"
    >
      {/* 1. Base Gradient Mesh (Drifting Blobs) */}
      <div className="ab-blobs-layer">
        <div className="ab-blob ab-blob-1" />
        <div className="ab-blob ab-blob-2" />
        <div className="ab-blob ab-blob-3" />
        <div className="ab-blob ab-blob-4" />
      </div>

      {/* 2. Animated Perspective Grid & Shimmer Wave */}
      {BACKGROUND_CONFIG.enableGridShimmer && (
        <div className="ab-grid-layer">
          <div className="ab-grid-shimmer" />
        </div>
      )}

      {/* 3. Floating Fitness Outline Icons with Depth Parallax */}
      <div className="ab-icons-layer">
        {activeIcons.map((icon) => (
          <div
            key={icon.id}
            className={`ab-icon-node ab-depth-${icon.depth} ${icon.floatClass}`}
            style={{
              top: icon.top,
              left: icon.left,
              right: icon.right,
              width: `${icon.size}px`,
              height: `${icon.size}px`,
            }}
          >
            <FitnessIconSvg type={icon.type} />
          </div>
        ))}
      </div>

      {/* 4. Canvas Particles (Rising Embers / Sparks) */}
      {!reducedMotion && <canvas ref={canvasRef} className="ab-canvas-particles" />}

      {/* 5. Special Effects */}

      {/* 5a. Mouse-Follow Spotlight (Desktop Only) */}
      {BACKGROUND_CONFIG.enableMouseSpotlight && !isMobile && !reducedMotion && (
        <div ref={spotlightRef} className="ab-mouse-spotlight" />
      )}

      {/* 5b. Animated ECG / Heartbeat Line removed per user request */}

      {/* 5c. Diagonal Light Sweep (Every ~15s) */}
      {BACKGROUND_CONFIG.enableLightSweep && !reducedMotion && (
        <div className="ab-light-sweep" />
      )}

      {/* 5d. Pulsing Concentric Radar Rings near Hero */}
      {BACKGROUND_CONFIG.enableRadarRings && !reducedMotion && (
        <div className="ab-radar-container">
          <div className="ab-radar-ring ab-radar-ring-1" />
          <div className="ab-radar-ring ab-radar-ring-2" />
          <div className="ab-radar-ring ab-radar-ring-3" />
        </div>
      )}

      {/* 5e. Subtle Film-grain / Noise Overlay */}
      {BACKGROUND_CONFIG.enableNoiseGrain && <div className="ab-noise-layer" />}
    </div>
  );
}
