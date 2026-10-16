import React from 'react';
import { Sparkles, Target, Award, Flame, Dumbbell, Star, ChevronDown, Activity, Zap } from 'lucide-react';

/**
 * =========================================================================
 * BORDER & SECTION DIVIDER FORMATS
 * Each section boundary has its own distinct, attractive, and professional format.
 * =========================================================================
 */

/**
 * FORMAT 1: WAVE HORIZON DIVIDER
 * Transition: Hero (Mint #EFFCF9) -> Virtual Studio (White #FFFFFF)
 * Features: Sculpted dual-layer wave curve, glowing cyan-teal gradient hairline,
 * and a centered floating athletic badge.
 */
export function WaveHorizonDivider() {
  return (
    <div className="relative w-full overflow-hidden leading-none z-20 -mb-px select-none pointer-events-none">
      <svg
        viewBox="0 0 1440 70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-10 sm:h-14 lg:h-16 block text-white"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="waveGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1FB5A3" stopOpacity="0" />
            <stop offset="25%" stopColor="#2DD4BF" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#1FB5A3" stopOpacity="0.9" />
            <stop offset="75%" stopColor="#38BDF8" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#1FB5A3" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="waveUnderlay" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1FB5A3" stopOpacity="0.08" />
            <stop offset="50%" stopColor="#1FB5A3" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.08" />
          </linearGradient>
        </defs>

        {/* Ambient Underlay Wave */}
        <path
          d="M0,28 C360,55 720,5 1080,45 C1260,60 1380,40 1440,32 L1440,70 L0,70 Z"
          fill="url(#waveUnderlay)"
        />

        {/* Main Solid White Horizon Wave */}
        <path
          d="M0,35 C320,62 640,15 1020,48 C1220,60 1360,42 1440,38 L1440,70 L0,70 Z"
          fill="#FFFFFF"
        />

        {/* Glowing Athletic Precision Crest Line */}
        <path
          d="M0,35 C320,62 640,15 1020,48 C1220,60 1360,42 1440,38"
          stroke="url(#waveGlow)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>

      {/* Centered Floating Athletic Studio Badge */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-teal-400/50 shadow-md shadow-teal-500/10 text-[10px] sm:text-xs font-display font-extrabold uppercase tracking-[0.2em] text-teal-800">
          <Sparkles size={12} className="text-teal-500 animate-pulse" />
          <span>VIRTUAL FITNESS ARENA</span>
          <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
        </div>
      </div>
    </div>
  );
}

/**
 * FORMAT 2: STADIUM CHEVRON NOTCH DIVIDER
 * Transition: Virtual Studio Teal Band (#1FB5A3) -> Program Tracks Mint (#F2FAF8)
 * Features: Sharp athletic chevron notch cut-out, glowing neon dual-gradient runner line
 * (teal to coral), and stadium track hash ticks.
 */
export function StadiumChevronDivider() {
  return (
    <div className="relative w-full overflow-hidden leading-none z-20 select-none pointer-events-none -mt-px">
      <svg
        viewBox="0 0 1440 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-8 sm:h-12 lg:h-14 block"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="chevronTealBand" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1FB5A3" />
            <stop offset="100%" stopColor="#189E8E" />
          </linearGradient>
          <linearGradient id="chevronAccentStroke" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1FB5A3" stopOpacity="0" />
            <stop offset="30%" stopColor="#5EEAD4" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#FF6B35" stopOpacity="1" />
            <stop offset="70%" stopColor="#5EEAD4" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#1FB5A3" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Teal Angular Stadium Notch Base */}
        <path
          d="M0,0 L0,22 L660,22 L720,54 L780,22 L1440,22 L1440,0 Z"
          fill="url(#chevronTealBand)"
        />

        {/* Glowing Dual Neon Track Line */}
        <path
          d="M0,22 L660,22 L720,54 L780,22 L1440,22"
          stroke="url(#chevronAccentStroke)"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </svg>

      {/* Floating Track Hash Mark Pill */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 sm:px-4 sm:py-1 rounded-full bg-[#111B2E] text-white border border-teal-400/40 shadow-lg text-[9px] sm:text-[11px] font-mono font-bold tracking-widest uppercase">
          <span className="text-teal-400">///</span>
          <span className="text-slate-200">TRAINING TRACKS</span>
          <span className="text-[#FF6B35]">///</span>
        </div>
      </div>
    </div>
  );
}

/**
 * FORMAT 3: SCULPTED ARENA DOME ARC DIVIDER
 * Transition: Program Tracks Mint (#F2FAF8) -> The Wellwigen Advantage White (#FFFFFF)
 * Features: Architectural convex stadium roofline dome arc, glowing specular rim,
 * and sports emblem badge.
 */
export function SculptedDomeArcDivider() {
  return (
    <div className="relative w-full overflow-hidden leading-none z-20 select-none pointer-events-none -mt-px">
      <svg
        viewBox="0 0 1440 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-8 sm:h-12 lg:h-14 block"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="domeRimGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1FB5A3" stopOpacity="0" />
            <stop offset="25%" stopColor="#1FB5A3" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#2DD4BF" stopOpacity="0.9" />
            <stop offset="75%" stopColor="#1FB5A3" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#1FB5A3" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Solid Pure White Convex Dome Arc */}
        <path
          d="M0,45 Q720,0 1440,45 L1440,60 L0,60 Z"
          fill="#FFFFFF"
        />

        {/* Glowing Specular Arena Top Rim */}
        <path
          d="M0,45 Q720,0 1440,45"
          stroke="url(#domeRimGlow)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>

      {/* Centered Floating Arena Podium Emblem */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full bg-white border-2 border-teal-500/60 shadow-md text-[10px] sm:text-xs font-heading font-extrabold text-slate-800 tracking-wider uppercase">
          <Award size={13} className="text-teal-600 shrink-0" />
          <span>THE WELLWIGEN ADVANTAGE</span>
          <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B35]" />
        </div>
      </div>
    </div>
  );
}

/**
 * FORMAT 4: MULTI-LANE VELOCITY TRACK DIVIDER
 * Transition: Between How It Works & "Your Goals. Your Focus." Showcase Banner
 * Features: Parallel Olympic stadium speed dash ribbons, millimeter stopwatch tick marks,
 * and high-energy gradient nodes.
 */
export function VelocityTrackDivider() {
  return (
    <div className="relative py-10 sm:py-14 max-w-5xl mx-auto px-4 select-none">
      <div className="relative flex items-center justify-center">
        {/* Left Track Dashes */}
        <div className="flex-1 flex items-center gap-1.5 sm:gap-2">
          <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-teal-400 to-teal-500" />
          <div className="w-8 sm:w-14 h-[3px] rounded-full bg-[#1FB5A3]" />
          <div className="w-3 sm:w-5 h-[3px] rounded-full bg-[#2DD4BF]" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B35]" />
        </div>

        {/* Center Speedometer / Precision Node */}
        <div className="mx-3 sm:mx-6 shrink-0">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-slate-900 to-[#0A2624] text-white border border-teal-400/50 shadow-lg shadow-teal-500/20 text-[10px] sm:text-xs font-mono font-bold tracking-[0.2em] uppercase">
            <Zap size={12} className="text-[#FF6B35]" />
            <span className="text-teal-300">VELOCITY &amp; PRECISION</span>
            <span className="text-slate-400 text-[9px]">// 03</span>
          </div>
        </div>

        {/* Right Track Dashes */}
        <div className="flex-1 flex items-center gap-1.5 sm:gap-2 justify-end">
          <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B35]" />
          <div className="w-3 sm:w-5 h-[3px] rounded-full bg-[#2DD4BF]" />
          <div className="w-8 sm:w-14 h-[3px] rounded-full bg-[#1FB5A3]" />
          <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent via-teal-400 to-teal-500" />
        </div>
      </div>
    </div>
  );
}

/**
 * FORMAT 5: INVERTED STADIUM NOTCH & STAR CREST DIVIDER
 * Transition: Between Showcase Banner & Real People Real Results (Testimonials)
 * Features: Architectural downward chevron notch, gold/teal ambient glow, and verified star pill.
 */
export function InvertedNotchDivider() {
  return (
    <div className="relative py-8 sm:py-12 max-w-4xl mx-auto px-4 select-none">
      <div className="relative flex items-center justify-center">
        {/* Left Tapered Line */}
        <div className="flex-1 h-[1.5px] bg-gradient-to-r from-transparent via-slate-300 to-teal-400/80" />

        {/* Center Verified Rating Crest */}
        <div className="mx-3 sm:mx-5 shrink-0">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-teal-300/80 shadow-md text-[11px] sm:text-xs font-heading font-extrabold text-slate-800">
            <div className="flex items-center gap-0.5 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={11} className="fill-amber-400" />
              ))}
            </div>
            <span className="text-slate-300 font-normal">|</span>
            <span className="tracking-wider uppercase text-teal-800 text-[10px] sm:text-[11px]">
              VERIFIED MEMBER EXPERIENCES
            </span>
          </div>
        </div>

        {/* Right Tapered Line */}
        <div className="flex-1 h-[1.5px] bg-gradient-to-l from-transparent via-slate-300 to-teal-400/80" />
      </div>
    </div>
  );
}

/**
 * FORMAT 6: ASYMMETRIC DIAGONAL SLASH DIVIDER
 * Transition: HomeSection (White/Mint) -> FinalCTA
 * Features: Dynamic -2.5° sports slash incline, dual energetic ribbon underlay (teal + coral),
 * and action catalyst chip.
 */
export function DiagonalSlashDivider() {
  return (
    <div className="relative w-full overflow-hidden leading-none z-20 select-none pointer-events-none -mt-px">
      <svg
        viewBox="0 0 1440 75"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-10 sm:h-14 lg:h-16 block"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="slashRibbon" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1FB5A3" />
            <stop offset="45%" stopColor="#2DD4BF" />
            <stop offset="75%" stopColor="#FF6B35" />
            <stop offset="100%" stopColor="#FFA07A" />
          </linearGradient>
          <linearGradient id="slashBg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F8FAFC" />
            <stop offset="100%" stopColor="#FFFFFF" />
          </linearGradient>
        </defs>

        {/* Upper Accent Ribbon Underlay */}
        <path
          d="M0,0 L1440,32 L1440,42 L0,10 Z"
          fill="url(#slashRibbon)"
          opacity="0.95"
        />

        {/* Main Angled Stadium Slope */}
        <path
          d="M0,10 L1440,42 L1440,75 L0,75 Z"
          fill="url(#slashBg)"
        />

        {/* Hairline Edge Glow */}
        <line
          x1="0"
          y1="10"
          x2="1440"
          y2="42"
          stroke="#5EEAD4"
          strokeWidth="1.5"
          opacity="0.7"
        />
      </svg>

      {/* Floating Action Badge */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-white border border-teal-400/50 shadow-xl text-[10px] sm:text-xs font-display font-extrabold uppercase tracking-[0.2em]">
          <Flame size={13} className="text-[#FF6B35] animate-bounce" />
          <span>JOIN THE MOVEMENT</span>
          <span className="text-teal-400">→</span>
        </div>
      </div>
    </div>
  );
}

/**
 * FORMAT 7: STEPPED STADIUM ARCH & NEON FIBER-OPTIC DIVIDER
 * Transition: FinalCTA (Light #E6F7F5) -> Footer (Dark Deep Emerald #092B28)
 * Features: Architectural stepped bevel curve, electric fiber-optic laser neon beam,
 * and high-tech corner brackets.
 */
export function SteppedStadiumArchDivider() {
  return (
    <div className="relative w-full overflow-hidden leading-none z-20 select-none pointer-events-none -mt-px bg-transparent">
      <svg
        viewBox="0 0 1440 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-8 sm:h-12 lg:h-14 block"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="footerNeonBeam" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0" />
            <stop offset="20%" stopColor="#2DD4BF" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#5EEAD4" stopOpacity="1" />
            <stop offset="80%" stopColor="#2DD4BF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#2DD4BF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Deep Emerald Footer Arch Base */}
        <path
          d="M0,25 Q720,55 1440,25 L1440,60 L0,60 Z"
          fill="#092B28"
        />

        {/* Fiber-Optic Laser Glow Line */}
        <path
          d="M0,25 Q720,55 1440,25"
          stroke="url(#footerNeonBeam)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>

      {/* Floating Center Tech Node */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#051C1A] text-teal-300 border border-teal-500/50 shadow-[0_0_15px_rgba(45,226,200,0.3)] text-[9px] sm:text-[10px] font-mono font-bold tracking-[0.25em] uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping" />
          <span>WELLWIGEN OFFICIAL HEADQUARTERS</span>
        </div>
      </div>
    </div>
  );
}

/**
 * FORMAT 8: GEOMETRIC SLANTED CREST DIVIDER (For Dedicated Sub-Pages)
 * Transition: Hero -> Content Blocks
 */
export function GeometricSlantedCrestDivider({ title = "TRAINING BLUEPRINT" }) {
  return (
    <div className="relative w-full overflow-hidden leading-none z-20 select-none pointer-events-none -mt-px">
      <svg
        viewBox="0 0 1440 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-8 sm:h-11 block"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="crestGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1FB5A3" stopOpacity="0" />
            <stop offset="30%" stopColor="#2DD4BF" stopOpacity="0.7" />
            <stop offset="70%" stopColor="#38BDF8" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#1FB5A3" stopOpacity="0" />
          </linearGradient>
        </defs>

        <path
          d="M0,0 L700,28 L740,28 L1440,0 L1440,50 L0,50 Z"
          fill="#FFFFFF"
        />

        <path
          d="M0,0 L700,28 L740,28 L1440,0"
          stroke="url(#crestGlow)"
          strokeWidth="2.5"
        />
      </svg>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
        <div className="inline-flex items-center gap-2 px-3 py-0.5 sm:px-4 sm:py-1 rounded-full bg-white border border-teal-400/50 shadow-sm text-[9px] sm:text-[10px] font-mono font-bold text-teal-800 tracking-widest uppercase">
          <Activity size={11} className="text-teal-600" />
          <span>{title}</span>
        </div>
      </div>
    </div>
  );
}

/**
 * FORMAT 9: HEX PULSE DIVIDER
 * Transition: Between feature blocks in sub-pages
 */
export function HexPulseDivider({ title = "COMPREHENSIVE COACHING SUITE" }) {
  return (
    <div className="relative py-10 sm:py-14 max-w-4xl mx-auto px-4 select-none">
      <div className="relative flex items-center justify-center">
        <div className="flex-1 h-[2px] bg-gradient-to-r from-transparent via-teal-400 to-[#1FB5A3]" />
        <div className="mx-3 sm:mx-5 shrink-0">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-slate-900 text-teal-300 border border-teal-500/40 shadow-md text-[10px] font-mono tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
            <span>{title}</span>
          </div>
        </div>
        <div className="flex-1 h-[2px] bg-gradient-to-l from-transparent via-teal-400 to-[#1FB5A3]" />
      </div>
    </div>
  );
}

/**
 * =========================================================================
 * PERSONAL TRAINING DEDICATED SECTION DIVIDERS
 * =========================================================================
 */

/**
 * PT FORMAT 1: PRECISION SLANT HORIZON
 * Hero -> Targeted Goals
 */
export function PTSlantHorizonDivider() {
  return (
    <div className="relative py-10 sm:py-14 max-w-6xl mx-auto px-4 select-none">
      <div className="relative flex items-center justify-center">
        {/* Left Bold Straight Line */}
        <div className="flex-1 flex items-center gap-1.5 sm:gap-2.5">
          <div className="h-[3.5px] flex-1 rounded-full bg-gradient-to-r from-transparent via-teal-400 to-[#1FB5A3] shadow-[0_0_12px_rgba(31,181,163,0.35)]" />
          <div className="w-8 sm:w-14 h-[3.5px] rounded-full bg-[#1FB5A3]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#2DD4BF] shadow-xs" />
        </div>

        {/* Center High-End Emblem Pill */}
        <div className="mx-3 sm:mx-6 shrink-0">
          <div className="inline-flex items-center gap-2.5 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-white border-2 border-teal-500 shadow-md shadow-teal-500/10 text-xs sm:text-sm font-heading font-black text-slate-800 tracking-wider uppercase">
            <Target size={15} className="text-teal-600 shrink-0" />
            <span>01 // TARGETED FITNESS GOALS</span>
            <span className="w-2 h-2 rounded-full bg-[#FF6B35] animate-pulse" />
          </div>
        </div>

        {/* Right Bold Straight Line */}
        <div className="flex-1 flex items-center gap-1.5 sm:gap-2.5 justify-end">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF6B35] shadow-xs" />
          <div className="w-8 sm:w-14 h-[3.5px] rounded-full bg-[#FF6B35]" />
          <div className="h-[3.5px] flex-1 rounded-full bg-gradient-to-l from-transparent via-[#FF6B35]/80 to-[#1FB5A3] shadow-[0_0_12px_rgba(255,107,53,0.3)]" />
        </div>
      </div>
    </div>
  );
}

/**
 * PT FORMAT 2: HEX PERFORMANCE PULSE
 * Targeted Goals -> Everything Included
 */
export function PTHexPulseDivider() {
  return (
    <div className="relative py-8 sm:py-12 max-w-4xl mx-auto px-4 select-none">
      <div className="relative flex items-center justify-center">
        <div className="flex-1 h-[2px] bg-gradient-to-r from-transparent via-teal-400 to-[#1FB5A3]" />
        
        <div className="mx-3 sm:mx-5 shrink-0">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-slate-900 to-[#0B2523] text-white border border-teal-400/40 shadow-lg text-[10px] sm:text-xs font-mono font-bold tracking-[0.2em] uppercase">
            <Sparkles size={12} className="text-teal-400" />
            <span>02 // 1-ON-1 COACHING SUITE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>

        <div className="flex-1 h-[2px] bg-gradient-to-l from-transparent via-teal-400 to-[#1FB5A3]" />
      </div>
    </div>
  );
}

/**
 * PT FORMAT 3: SPEED TIMELINE RIBBON
 * Everything Included -> Step-by-Step Path
 */
export function PTSpeedTimelineDivider() {
  return (
    <div className="relative py-8 sm:py-10 max-w-5xl mx-auto px-4 select-none">
      <div className="relative flex items-center justify-center">
        <div className="flex-1 flex items-center gap-2">
          <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-teal-400" />
          <div className="w-6 h-[2px] bg-teal-500 rounded-full" />
          <div className="w-2 h-[2px] bg-[#FF6B35] rounded-full" />
        </div>

        <div className="mx-4 shrink-0">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-teal-300 shadow-sm text-[10px] sm:text-xs font-heading font-extrabold text-teal-900 tracking-wider uppercase">
            <Dumbbell size={12} className="text-teal-600" />
            <span>03 // PROGRESSION BLUEPRINT</span>
          </div>
        </div>

        <div className="flex-1 flex items-center gap-2 justify-end">
          <div className="w-2 h-[2px] bg-[#FF6B35] rounded-full" />
          <div className="w-6 h-[2px] bg-teal-500 rounded-full" />
          <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-teal-400" />
        </div>
      </div>
    </div>
  );
}

/**
 * PT FORMAT 4: DARK ARENA INCLINE DIVIDER
 * Light Step Path -> Dark #0E1420 Transparent Pricing
 */
export function PTDarkArenaInclineDivider() {
  return (
    <div className="relative w-full overflow-hidden leading-none z-20 select-none pointer-events-none -mt-px">
      <svg
        viewBox="0 0 1440 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-8 sm:h-12 block"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="ptDarkRim" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1FB5A3" stopOpacity="0" />
            <stop offset="30%" stopColor="#2DD4BF" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#38BDF8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#1FB5A3" stopOpacity="0" />
          </linearGradient>
        </defs>

        <path
          d="M0,40 Q720,10 1440,40 L1440,60 L0,60 Z"
          fill="#0E1420"
        />

        <path
          d="M0,40 Q720,10 1440,40"
          stroke="url(#ptDarkRim)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#111B2E] text-[#2DE2C8] border border-teal-400/40 shadow-xl text-[10px] sm:text-xs font-mono font-bold tracking-[0.2em] uppercase">
          <Award size={12} className="text-teal-400" />
          <span>04 // TRANSFORMATION INVESTMENT</span>
        </div>
      </div>
    </div>
  );
}

/**
 * PT FORMAT 5: LIGHT AMPHITHEATER DIVIDER
 * Dark Pricing -> Light Success Stories & Coaches
 */
export function PTLightAmphitheaterDivider() {
  return (
    <div className="relative w-full overflow-hidden leading-none z-20 select-none pointer-events-none -mt-px">
      <svg
        viewBox="0 0 1440 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-8 sm:h-12 block"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="ptLightRim" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1FB5A3" stopOpacity="0" />
            <stop offset="50%" stopColor="#2DD4BF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#1FB5A3" stopOpacity="0" />
          </linearGradient>
        </defs>

        <path
          d="M0,42 Q720,5 1440,42 L1440,60 L0,60 Z"
          fill="#FFFFFF"
        />

        <path
          d="M0,42 Q720,5 1440,42"
          stroke="url(#ptLightRim)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-teal-400/50 shadow-md text-[10px] sm:text-xs font-heading font-extrabold text-slate-800 tracking-wider uppercase">
          <Star size={12} className="fill-amber-400 text-amber-400" />
          <span>05 // AUTHENTIC PROOF &amp; COACHES</span>
          <Star size={12} className="fill-amber-400 text-amber-400" />
        </div>
      </div>
    </div>
  );
}

/**
 * =========================================================================
 * GROUP CLASSES DEDICATED SECTION DIVIDERS
 * =========================================================================
 */

/**
 * GC FORMAT 1: ARENA ANGLE DROP DIVIDER
 * Light Hero -> Dark Weekly Workout Schedule
 */
export function GCArenaAngleDropDivider() {
  return (
    <div className="relative w-full overflow-hidden leading-none z-20 select-none pointer-events-none -mt-px">
      <svg
        viewBox="0 0 1440 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-8 sm:h-12 block"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="gcAngleLaser" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1FB5A3" stopOpacity="0" />
            <stop offset="25%" stopColor="#2DD4BF" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#C6F432" stopOpacity="1" />
            <stop offset="75%" stopColor="#2DD4BF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#1FB5A3" stopOpacity="0" />
          </linearGradient>
        </defs>

        <path
          d="M0,18 L680,18 L720,50 L760,18 L1440,18 L1440,64 L0,64 Z"
          fill="#0E1420"
        />

        <path
          d="M0,18 L680,18 L720,50 L760,18 L1440,18"
          stroke="url(#gcAngleLaser)"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </svg>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#111B2E] text-white border border-[#C6F432]/60 shadow-lg shadow-[#C6F432]/10 text-[10px] sm:text-xs font-mono font-bold tracking-[0.2em] uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C6F432] animate-ping" />
          <span className="text-[#C6F432]">WEEKLY ARENA SCHEDULE</span>
          <span className="text-teal-300">// 01</span>
        </div>
      </div>
    </div>
  );
}

/**
 * GC FORMAT 2: LIGHT WAVE HORIZON DIVIDER
 * Dark Weekly Schedule -> Light Membership Tiers
 */
export function GCLightWaveDivider() {
  return (
    <div className="relative w-full overflow-hidden leading-none z-20 select-none pointer-events-none -mt-px">
      <svg
        viewBox="0 0 1440 65"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-9 sm:h-13 block"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="gcLightWaveGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1FB5A3" stopOpacity="0" />
            <stop offset="30%" stopColor="#2DD4BF" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#FF6B35" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#1FB5A3" stopOpacity="0" />
          </linearGradient>
        </defs>

        <path
          d="M0,32 C360,58 720,8 1080,48 C1260,60 1380,40 1440,35 L1440,65 L0,65 Z"
          fill="#FFFFFF"
        />

        <path
          d="M0,32 C360,58 720,8 1080,48 C1260,60 1380,40 1440,35"
          stroke="url(#gcLightWaveGlow)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-teal-400/50 shadow-md text-[10px] sm:text-xs font-display font-extrabold uppercase tracking-[0.2em] text-teal-800">
          <Sparkles size={12} className="text-teal-600" />
          <span>ALL-ACCESS PASSES</span>
          <span className="text-[#FF6B35]">★</span>
        </div>
      </div>
    </div>
  );
}

/**
 * GC FORMAT 3: VELOCITY PULSE RIBBON
 * Light Membership Tiers -> Special Offer Trial Banner
 */
export function GCVelocityPulseDivider() {
  return (
    <div className="relative py-8 sm:py-12 max-w-4xl mx-auto px-4 select-none">
      <div className="relative flex items-center justify-center">
        <div className="flex-1 h-[2px] bg-gradient-to-r from-transparent via-[#C6F432] to-[#1FB5A3]" />

        <div className="mx-3 sm:mx-5 shrink-0">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-white border border-teal-400/40 shadow-lg text-[10px] sm:text-xs font-heading font-extrabold tracking-wider uppercase">
            <Flame size={13} className="text-[#FF6B35] animate-pulse" />
            <span>TRIAL EXPERIENCE</span>
            <span className="text-[#C6F432]">₹99 ONLY</span>
          </div>
        </div>

        <div className="flex-1 h-[2px] bg-gradient-to-l from-transparent via-[#C6F432] to-[#1FB5A3]" />
      </div>
    </div>
  );
}

/**
 * GC FORMAT 4: COMMUNITY CREST DIVIDER
 * Special Offer Trial Banner -> Why Choose Wellwigen Group Classes
 */
export function GCCommunityCrestDivider() {
  return (
    <div className="relative py-8 sm:py-10 max-w-4xl mx-auto px-4 select-none">
      <div className="relative flex items-center justify-center">
        <div className="flex-1 h-[1.5px] bg-gradient-to-r from-transparent via-slate-300 to-teal-400" />

        <div className="mx-3 sm:mx-5 shrink-0">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white border border-teal-300 shadow-sm text-[10px] sm:text-xs font-heading font-extrabold text-teal-900 tracking-wider uppercase">
            <Award size={13} className="text-teal-600" />
            <span>THE GROUP FITNESS ADVANTAGE</span>
          </div>
        </div>

        <div className="flex-1 h-[1.5px] bg-gradient-to-l from-transparent via-slate-300 to-teal-400" />
      </div>
    </div>
  );
}
