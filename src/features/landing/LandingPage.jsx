import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomeSection from './components/HomeSection';
// OLD CODE (commented by AI) - Shifted to dedicated PersonalTrainingPage
// import PersonalTrainingSection from './components/PersonalTrainingSection';
// OLD CODE (commented by AI) - Shifted to dedicated GroupClassesPage
// import GroupClassesSection from './components/GroupClassesSection';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import LeadModal from './components/LeadModal';
import LegalModal from './components/LegalModal';
import FloatingWhatsApp from './components/FloatingWhatsApp';
// NEW CODE - Live 3D Athlete Context & Full-Body Layer (Home Page Only)
import { LiveAthleteProvider } from './context/LiveAthleteContext';
import LiveAthleteBody from './components/LiveAthleteBody';
// NEW CODE - Distinct, attractive section border divider between Home and FinalCTA
import { DiagonalSlashDivider } from './components/SectionDividers';

export default function LandingPage() {
  const navigate = useNavigate();
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [leadModalData, setLeadModalData] = useState({});
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState('privacy');

  // Handle direct anchor links from URL on mount
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const id = hash.replace('#', '');
      const timer = setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  // OLD CODE (commented by AI)
  /* Single shared IntersectionObserver was missing; elements relied on varied animation libraries */
  // NEW CODE - smooth animation/performance: single shared IntersectionObserver for glitch-free pop animations without leaks
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const items = document.querySelectorAll('.reveal-item');

    if (prefersReducedMotion) {
      items.forEach((item) => item.classList.add('revealed'));
      return;
    }

    const activeTimers = [];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            el.classList.add('animating');
            el.classList.add('revealed');
            observer.unobserve(el);

            // Clean up will-change after animation duration to free GPU memory
            const timer = setTimeout(() => {
              el.classList.remove('animating');
            }, 650);
            activeTimers.push(timer);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -8% 0px',
      }
    );

    items.forEach((item) => {
      // If element is already in initial viewport, reveal immediately without scroll wait
      const rect = item.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.85) {
        item.classList.add('revealed');
      } else {
        observer.observe(item);
      }
    });

    return () => {
      activeTimers.forEach(clearTimeout);
      observer.disconnect();
    };
  }, []);

  const handleOpenLeadModal = (data = {}) => {
    setLeadModalData(data);
    setLeadModalOpen(true);
  };

  const handleCloseLeadModal = () => {
    setLeadModalOpen(false);
  };

  const handleOpenLegalModal = (type) => {
    setLegalModalType(type);
    setLegalModalOpen(true);
  };

  const handleCloseLegalModal = () => {
    setLegalModalOpen(false);
  };

  const handleNavigateSection = (sectionId) => {
    if (sectionId === 'personal-training' || sectionId === 'pricing') {
      navigate('/personal-training');
      return;
    }
    if (sectionId === 'group-classes' || sectionId === 'schedule') {
      navigate('/group-classes');
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', `#${sectionId}`);
    }
  };

  return (
    <LiveAthleteProvider>
      <div className="min-h-screen bg-transparent text-slate-800 font-sans selection:bg-teal-500 selection:text-white relative w-full max-w-full overflow-x-hidden">
        {/* Dynamic SEO Tags */}
      <Helmet>
        <title>Wellwigen | Online Personal Training &amp; Live Group Fitness Classes</title>
        <meta
          name="description"
          content="Get Fit. Get Strong. Stay Consistent. Join Wellwigen for personalized 1-on-1 personal training and live interactive online group fitness classes with certified expert coaches."
        />
        <meta
          name="keywords"
          content="online personal training, live group fitness classes, online fitness trainer India, HIIT, Tabata, Yoga, Jungle Fit, weight loss coaching, strength training online"
        />
        <link rel="canonical" href="https://wellwigen.com/" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://wellwigen.com/" />
        <meta property="og:title" content="Wellwigen | Online Personal Training &amp; Group Fitness" />
        <meta
          property="og:description"
          content="Get Fit. Get Strong. Stay Consistent. Personalized online fitness training &amp; live group workouts."
        />
        <meta property="og:image" content="https://wellwigen.com/images/hero_workout.jpg" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Wellwigen | Online Personal Training &amp; Group Fitness" />
        <meta
          name="twitter:description"
          content="Personalized 1-on-1 online personal training and live interactive group classes with expert coaches."
        />
        <meta name="twitter:image" content="https://wellwigen.com/images/hero_workout.jpg" />

        {/* Structured Data: SportsActivityLocation / HealthClub */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "SportsActivityLocation",
              "name": "Wellwigen Online Fitness",
              "alternateName": "Wellwigen",
              "url": "https://wellwigen.com",
              "logo": "https://wellwigen.com/favicon.svg",
              "image": "https://wellwigen.com/images/hero_workout.jpg",
              "description": "Online personal training and live interactive group fitness classes coached by certified master trainers.",
              "telephone": "+919598506627",
              "email": "wellwigen@gmail.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "123 Fitness Street, Wellness City",
                "addressCountry": "IN"
              },
              "priceRange": "₹₹",
              "openingHours": "Mo-Su 06:00-22:00"
            }
          `}
        </script>
      </Helmet>

      {/* OLD CODE (commented by AI) - fixed background athlete
      <LiveAthleteBody />
      */}

      {/* Sticky Header with Frosted Glass & Progress Bar (z-50) */}
      <Navbar onOpenLeadModal={handleOpenLeadModal} />

      {/* OLD CODE (commented by AI) - z-10 constrained hero children below z-50 navbar
      <main className="relative z-10">
      */}
      {/* NEW CODE - relative without z-index isolation: allows LiveAthleteHero (z-55) to sit on top of Navbar (z-50) */}
      <main className="relative w-full max-w-full overflow-x-hidden">
        {/* Section 1: Home (id="home") */}
        <HomeSection
          onOpenLeadModal={handleOpenLeadModal}
          onNavigateSection={handleNavigateSection}
        />

        {/* OLD CODE (commented by AI)
        <PersonalTrainingSection
          onOpenLeadModal={handleOpenLeadModal}
        />
        <GroupClassesSection
          onOpenLeadModal={handleOpenLeadModal}
        />
        <FinalCTA
          onOpenLeadModal={handleOpenLeadModal}
          onNavigateSection={handleNavigateSection}
        />
        */}
        {/* OLD CODE (commented by AI) - Shifted all Personal Training content to dedicated /personal-training page per user request
        <div className="cv-auto">
          <PersonalTrainingSection
            onOpenLeadModal={handleOpenLeadModal}
          />
        </div>
        */}

        {/* OLD CODE (commented by AI) - Shifted all Group Classes content to dedicated /group-classes page per user request
        <div className="cv-auto">
          <GroupClassesSection
            onOpenLeadModal={handleOpenLeadModal}
          />
        </div>
        */}

        {/* NEW CODE - Distinct Border Format 6: Asymmetric Diagonal Slash Divider */}
        <DiagonalSlashDivider />

        <div className="cv-auto">
          {/* Section 4: Final CTA */}
          <FinalCTA
            onOpenLeadModal={handleOpenLeadModal}
            onNavigateSection={handleNavigateSection}
          />
        </div>
      </main>

      {/* Section 5: Footer (Dark Teal) */}
      <Footer
        onNavigateSection={handleNavigateSection}
        onOpenLegalModal={handleOpenLegalModal}
      />

      {/* Lead Modal */}
      <LeadModal
        isOpen={leadModalOpen}
        onClose={handleCloseLeadModal}
        initialData={leadModalData}
      />

      {/* Legal Modal */}
      <LegalModal
        isOpen={legalModalOpen}
        type={legalModalType}
        onClose={handleCloseLegalModal}
      />

      {/* Floating Interactive Elements */}
      <FloatingWhatsApp />
    </div>
  </LiveAthleteProvider>
  );
}
