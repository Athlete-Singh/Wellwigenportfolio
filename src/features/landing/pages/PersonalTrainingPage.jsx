import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PersonalTrainingSection from '../components/PersonalTrainingSection';
import Footer from '../components/Footer';
import LeadModal from '../components/LeadModal';
import LegalModal from '../components/LegalModal';
import FloatingWhatsApp from '../components/FloatingWhatsApp';

/**
 * PersonalTrainingPage
 * Dedicated standalone page for 1-on-1 Personal Training with smooth page entrance transition.
 */
export default function PersonalTrainingPage() {
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
    if (sectionId === 'personal-training') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (sectionId === 'home') {
      navigate('/');
      return;
    }
    if (sectionId === 'group-classes' || sectionId === 'schedule') {
      navigate('/group-classes');
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
        <title>1-on-1 Online Personal Training | Wellwigen</title>
        <meta
          name="description"
          content="Transform your body with certified personal trainers. Customized workout splits, live form correction, nutrition guidance, and verified coaches at Wellwigen."
        />
        <meta
          name="keywords"
          content="online personal training, 1 on 1 fitness coach, custom workout plan, certified master trainer, fitness transformation India"
        />
        <link rel="canonical" href="https://wellwigen.com/personal-training" />
      </Helmet>

      {/* Sticky Header with active pill on Personal Training */}
      <Navbar onOpenLeadModal={handleOpenLeadModal} />

      {/* Smooth GPU-accelerated Page Entrance Transition (Zero Glitch / Zero Blur Lag) */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="relative w-full max-w-full overflow-x-hidden"
      >
        <PersonalTrainingSection
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
