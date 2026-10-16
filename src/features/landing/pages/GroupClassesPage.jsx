import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import GroupClassesSection from '../components/GroupClassesSection';
import Footer from '../components/Footer';
import LeadModal from '../components/LeadModal';
import LegalModal from '../components/LegalModal';
import FloatingWhatsApp from '../components/FloatingWhatsApp';

/**
 * GroupClassesPage
 * Dedicated standalone page for Live Online Group Fitness Classes with smooth page entrance transition.
 */
export default function GroupClassesPage() {
  const navigate = useNavigate();
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [leadModalData, setLeadModalData] = useState({});
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState('privacy');

  // Shared IntersectionObserver for smooth reveal animations without memory leak
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
    if (sectionId === 'group-classes' || sectionId === 'schedule') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (sectionId === 'personal-training' || sectionId === 'pricing') {
      navigate('/personal-training');
      return;
    }
    if (sectionId === 'home') {
      navigate('/');
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(`/#${sectionId}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2FAF8] text-slate-800 font-sans selection:bg-teal-500 selection:text-white relative w-full max-w-full overflow-x-hidden">
      {/* Dynamic SEO Tags */}
      <Helmet>
        <title>Live Online Group Fitness Classes | Wellwigen</title>
        <meta
          name="description"
          content="Train together and stay motivated with live, coach-led online group classes. HIIT, Tabata, Jungle Fit, Strength & Conditioning, and Yoga with certified coaches."
        />
        <meta
          name="keywords"
          content="online group fitness classes, live workout classes India, HIIT, Tabata, functional fitness, group yoga, online fitness membership"
        />
        <link rel="canonical" href="https://wellwigen.com/group-classes" />
      </Helmet>

      {/* Sticky Header with active pill on Group Classes */}
      <Navbar onOpenLeadModal={handleOpenLeadModal} />

      {/* Smooth GPU-accelerated Page Entrance Transition (Zero Glitch / Zero Blur Lag) */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="relative w-full max-w-full overflow-x-hidden"
      >
        <GroupClassesSection
          onOpenLeadModal={handleOpenLeadModal}
        />
      </motion.main>

      {/* Footer */}
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
