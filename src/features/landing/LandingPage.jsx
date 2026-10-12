import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from './components/Navbar';
import HomeSection from './components/HomeSection';
import PersonalTrainingSection from './components/PersonalTrainingSection';
import GroupClassesSection from './components/GroupClassesSection';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import LeadModal from './components/LeadModal';
import LegalModal from './components/LegalModal';
import FloatingWhatsApp from './components/FloatingWhatsApp';

export default function LandingPage() {
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
  // NEW CODE - smooth animation/performance: single shared IntersectionObserver for glitch-free pop animations
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const items = document.querySelectorAll('.reveal-item');

    if (prefersReducedMotion) {
      items.forEach((item) => item.classList.add('revealed'));
      return;
    }

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
            el._animCleanup = timer;
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
      items.forEach((item) => {
        if (item._animCleanup) clearTimeout(item._animCleanup);
      });
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
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', `#${sectionId}`);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-800 font-sans selection:bg-teal-500 selection:text-white">
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

      {/* Sticky Header with Frosted Glass & Progress Bar */}
      <Navbar onOpenLeadModal={handleOpenLeadModal} />

      {/* Main Single-Scroll Body */}
      <main>
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
        {/* NEW CODE - smooth animation/performance: cv-auto content-visibility skips off-screen paint work */}
        <div className="cv-auto">
          {/* Section 2: Personal Training (id="personal-training") */}
          <PersonalTrainingSection
            onOpenLeadModal={handleOpenLeadModal}
          />
        </div>

        <div className="cv-auto">
          {/* Section 3: Group Classes (id="group-classes") */}
          <GroupClassesSection
            onOpenLeadModal={handleOpenLeadModal}
          />
        </div>

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
  );
}
