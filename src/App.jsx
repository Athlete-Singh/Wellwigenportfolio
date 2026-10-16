import React from 'react';
import "./styles/App.css";
import "./styles/index.css";
import { Helmet } from 'react-helmet-async';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
// OLD CODE (commented by AI)
// import { onMessage } from 'firebase/messaging';
// import { messaging } from './config/firebase.js';

// OLD CODE (commented by AI)
// import Navbar from "./components/common/Navbar";
// import FloatingContact from "./components/common/FloatingContact";
// import AdminLayout from "./features/dashboard/layout/AdminLayout";
// NEW CODE - performance optimization: lazy load components not needed on landing page
const Navbar = React.lazy(() => import("./components/common/Navbar"));
const FloatingContact = React.lazy(() => import("./components/common/FloatingContact"));
const AdminLayout = React.lazy(() => import("./features/dashboard/layout/AdminLayout"));
import ErrorBoundary from "./components/ErrorBoundary";
import LandingPage from "./features/landing/LandingPage";
// NEW CODE - Dedicated Personal Training Page
import PersonalTrainingPage from "./features/landing/pages/PersonalTrainingPage";
// NEW CODE - Dedicated Group Classes Page
import GroupClassesPage from "./features/landing/pages/GroupClassesPage";
import AnimatedBackground from "./components/common/AnimatedBackground";

// OLD CODE (commented by AI)
/*
// Home / Website Pages
import Hero from './features/home/components/Hero';
import Framework from './features/home/components/Framework';
import FruitMarketplace from "./features/home/components/FruitMarketplace";
import HealthPrograms from "./features/home/components/HealthPrograms";
import FitnessClasses from "./features/home/components/FitnessClasses";
import VerifiedTrainers from "./features/home/components/VerifiedTrainers";
import Dashboard from "./features/dashboard/components/Dashboard";
import Diet from "./features/dashboard/components/Diet";
import Testimonials from './components/Testimonials';
import AboutUs from "./features/home/components/AboutUs";
import Metrics from './features/home/components/Metrics';
import ContactUs from './features/home/components/ContactUs';
import Footer from './components/common/Footer';
import TermsAndConditions from './components/TermsAndConditions';
import ConsultationForm from './features/auth/components/ConsultationForm';
import Login from './features/auth/components/Login';
import TrainerForm from './components/TrainerForm';

// Admin Pages
import UserDashboard from "./features/dashboard/pages/UserDashboard";
import AdminCategories from "./features/admin/pages/AdminCategories";
import MedicalRecords from "./features/dashboard/pages/MedicalRecords";
import Prescriptions from "./features/dashboard/pages/Prescriptions";
import Appointments from "./features/dashboard/pages/Appointments";
import Doctors from "./features/dashboard/pages/Doctors";
import Settings from "./features/dashboard/pages/Settings";
import AdminVendors from "./features/admin/pages/AdminVendors";
import ProviderVerification from "./features/admin/pages/ProviderVerification";
import AdminDashboard from "./features/admin/pages/AdminDashboard";

import Cart from "./features/shop/pages/Cart";

// Feature Imports
import Pricing from "./features/subscription/pages/PricingPage";
import Register from "./features/provider/pages/onboarding/OnboardingWizard";
import OnboardingWizard from "./features/provider/pages/onboarding/OnboardingWizard";
import ProviderStatus from "./features/provider/pages/onboarding/ProviderStatus";
import UnifiedDashboard from "./features/provider/pages/dashboard/UnifiedDashboard";
import PharmacyDashboard from "./features/provider/pages/dashboard/PharmacyDashboard";
import TrainerDashboard from "./features/provider/pages/dashboard/TrainerDashboard";

// Legacy Vendor Imports
import VendorLogin from "./features/provider/legacy/Login";
import AddProduct from "./features/provider/legacy/AddProduct";
*/
// NEW CODE - performance optimization: route-level code splitting via React.lazy
const Hero = React.lazy(() => import('./features/home/components/Hero'));
const Framework = React.lazy(() => import('./features/home/components/Framework'));
const FruitMarketplace = React.lazy(() => import("./features/home/components/FruitMarketplace"));
const HealthPrograms = React.lazy(() => import("./features/home/components/HealthPrograms"));
const FitnessClasses = React.lazy(() => import("./features/home/components/FitnessClasses"));
const VerifiedTrainers = React.lazy(() => import("./features/home/components/VerifiedTrainers"));
const Dashboard = React.lazy(() => import("./features/dashboard/components/Dashboard"));
const Diet = React.lazy(() => import("./features/dashboard/components/Diet"));
const Testimonials = React.lazy(() => import('./components/Testimonials'));
const AboutUs = React.lazy(() => import("./features/home/components/AboutUs"));
const Metrics = React.lazy(() => import('./features/home/components/Metrics'));
const ContactUs = React.lazy(() => import('./features/home/components/ContactUs'));
const Footer = React.lazy(() => import('./components/common/Footer'));
const TermsAndConditions = React.lazy(() => import('./components/TermsAndConditions'));
const ConsultationForm = React.lazy(() => import('./features/auth/components/ConsultationForm'));
const Login = React.lazy(() => import('./features/auth/components/Login'));
const TrainerForm = React.lazy(() => import('./components/TrainerForm'));

const UserDashboard = React.lazy(() => import("./features/dashboard/pages/UserDashboard"));
/* [DISABLED FOR FUTURE USE] AdminCategories Page Import
const AdminCategories = React.lazy(() => import("./features/admin/pages/AdminCategories"));
*/
/* [DISABLED FOR FUTURE USE] MedicalRecords Page Import
const MedicalRecords = React.lazy(() => import("./features/dashboard/pages/MedicalRecords"));
*/
/* [DISABLED FOR FUTURE USE] Prescriptions Page Import
const Prescriptions = React.lazy(() => import("./features/dashboard/pages/Prescriptions"));
*/
/* [DISABLED FOR FUTURE USE] Appointments Page Import
const Appointments = React.lazy(() => import("./features/dashboard/pages/Appointments"));
*/
/* [DISABLED FOR FUTURE USE] Doctors Page Import
const Doctors = React.lazy(() => import("./features/dashboard/pages/Doctors"));
*/
const Settings = React.lazy(() => import("./features/dashboard/pages/Settings"));
/* [DISABLED FOR FUTURE USE] AdminVendors Page Import
const AdminVendors = React.lazy(() => import("./features/admin/pages/AdminVendors"));
*/
/* [DISABLED FOR FUTURE USE] ProviderVerification Page Import
const ProviderVerification = React.lazy(() => import("./features/admin/pages/ProviderVerification"));
*/
const AdminDashboard = React.lazy(() => import("./features/admin/pages/AdminDashboard"));
const AdminLogin = React.lazy(() => import("./features/admin/pages/AdminLogin"));
import AdminProtectedRoute from "./features/admin/components/AdminProtectedRoute";

const Cart = React.lazy(() => import("./features/shop/pages/Cart"));
const Pricing = React.lazy(() => import("./features/subscription/pages/PricingPage"));
const Register = React.lazy(() => import("./features/provider/pages/onboarding/OnboardingWizard"));
const OnboardingWizard = React.lazy(() => import("./features/provider/pages/onboarding/OnboardingWizard"));
const ProviderStatus = React.lazy(() => import("./features/provider/pages/onboarding/ProviderStatus"));
const UnifiedDashboard = React.lazy(() => import("./features/provider/pages/dashboard/UnifiedDashboard"));
const PharmacyDashboard = React.lazy(() => import("./features/provider/pages/dashboard/PharmacyDashboard"));
const TrainerDashboard = React.lazy(() => import("./features/provider/pages/dashboard/TrainerDashboard"));
const VendorLogin = React.lazy(() => import("./features/provider/legacy/Login"));
const AddProduct = React.lazy(() => import("./features/provider/legacy/AddProduct"));
// import MyStore from "./vendor/MyStore";

// Trainer Portal Imports (Light Theme, Modern Wellwigen Coaching)
import TrainerLayout from "./features/trainer/layout/TrainerLayout";
import TrainerProtectedRoute from "./features/trainer/components/TrainerProtectedRoute";
const TrainerIntro = React.lazy(() => import("./features/trainer/pages/TrainerIntro"));
const TrainerLogin = React.lazy(() => import("./features/trainer/pages/TrainerLogin"));
const TrainerRegister = React.lazy(() => import("./features/trainer/pages/TrainerRegister"));
const TrainerOnboarding = React.lazy(() => import("./features/trainer/pages/TrainerOnboarding"));
const TrainerPortalDashboard = React.lazy(() => import("./features/trainer/pages/TrainerDashboard"));
const TrainerClasses = React.lazy(() => import("./features/trainer/pages/TrainerClasses"));
const TrainerClients = React.lazy(() => import("./features/trainer/pages/TrainerClients"));
const TrainerAvailability = React.lazy(() => import("./features/trainer/pages/TrainerAvailability"));
const TrainerProfile = React.lazy(() => import("./features/trainer/pages/TrainerProfile"));
const TrainerSettings = React.lazy(() => import("./features/trainer/pages/TrainerSettings"));
const TrainerNotFound = React.lazy(() => import("./features/trainer/pages/TrainerNotFound"));
const TrainerSafetyGuidelines = React.lazy(() => import("./features/trainer/pages/TrainerSafetyGuidelines"));

// Route guard to prevent wrong dashboard access and enforce approved status
function ProviderProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem("providerToken") || localStorage.getItem("vendorToken");
  const infoRaw = localStorage.getItem("providerInfo") || localStorage.getItem("vendorInfo");
  const status = localStorage.getItem("providerStatus") || localStorage.getItem("vendorStatus");

  if (!token || !infoRaw) {
    return <Navigate to="/vendor/login" replace />;
  }

  let info = {};
  try {
    info = JSON.parse(infoRaw);
  } catch (e) {
    console.error("Failed to parse providerInfo:", e);
    return <Navigate to="/vendor/login" replace />;
  }

  const type = (info.type || "").toUpperCase(); // e.g. "DOCTOR", "LAB", "PHARMACY", "TRAINER", "NUTRITION", "VENDOR"

  // Enforce Approved Status
  if (status !== "approved") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] p-8 border border-slate-100">
          <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 font-bold">⚠️</div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Access Restricted</h2>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            Your application is currently in status: <span className="font-bold uppercase text-amber-600 bg-amber-50 px-2 py-0.5 rounded">{status || "pending"}</span>.
          </p>
          <p className="mt-2 text-xs text-slate-400 leading-relaxed">
            Once administrators approve your application, you will receive an email with your credentials to access your secure portal.
          </p>
          <button
            onClick={() => { localStorage.clear(); window.location.href = "/vendor/login"; }}
            className="mt-8 w-full py-3.5 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  // Enforce Role Alignment & Prevent Wrong Dashboard Access
  if (allowedRole && type !== allowedRole.toUpperCase()) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] p-8 border border-slate-100">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 font-bold">🚫</div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Access Prohibited</h2>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            You are registered as a <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">{type}</span>.
          </p>
          <p className="mt-2 text-xs text-slate-400 leading-relaxed">
            You do not have authorization to view the <span className="font-bold text-rose-600 uppercase">{allowedRole}</span> dashboard.
          </p>
          <button
            onClick={() => { window.location.href = `/${type.toLowerCase()}/dashboard`; }}
            className="mt-8 w-full py-3.5 bg-[#009688] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#00796B] transition-all shadow-xl shadow-emerald-200"
          >
            Go to My Dashboard
          </button>
        </div>
      </div>
    );
  }

  return children;
}



function App() {
  const location = useLocation();
  const BASE_URL = import.meta.env.VITE_API_URL;

  // Seamless scroll restoration on route changes (prevents jumpy transitions and visual leaks)
  React.useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  React.useEffect(() => {
    // OLD CODE (commented by AI)
    /*
    if (messaging) {
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log('Message received in foreground:', payload);
        toast(
          (t) => (
            <div>
              <p className="font-bold">{payload.notification?.title}</p>
              <p className="text-sm">{payload.notification?.body}</p>
            </div>
          ),
          { duration: 5000 }
        );
      });
      return () => unsubscribe();
    }
    */
    // NEW CODE - performance optimization: non-blocking deferred load of Firebase messaging
    let unsubscribe;
    const initMessaging = async () => {
      try {
        const { messaging: fbMessaging } = await import('./config/firebase.js');
        if (fbMessaging) {
          const { onMessage: fbOnMessage } = await import('firebase/messaging');
          unsubscribe = fbOnMessage(fbMessaging, (payload) => {
            console.log('Message received in foreground:', payload);
            toast(
              (t) => (
                <div>
                  <p className="font-bold">{payload.notification?.title}</p>
                  <p className="text-sm">{payload.notification?.body}</p>
                </div>
              ),
              { duration: 5000 }
            );
          });
        }
      } catch (err) {
        // Notification unsupported in environment
      }
    };
    initMessaging();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen bg-transparent text-black relative">
      {/* Global Living Energy Field Animated Background */}
      <AnimatedBackground />

      <Toaster position="top-right" reverseOrder={false} />

      {/* ✅ Hide Navbar for Landing Pages (Home, Personal Training, Group Classes), Admin, Vendor, and Provider Pages */}
      {location.pathname !== "/" &&
        location.pathname !== "/personal-training" &&
        location.pathname !== "/pricing" &&
        location.pathname !== "/group-classes" &&
        location.pathname !== "/schedule" &&
        !location.pathname.startsWith("/admin") &&
        !location.pathname.startsWith("/vendor") &&
        !location.pathname.startsWith("/provider") &&
        !location.pathname.startsWith("/lab") &&
        !location.pathname.startsWith("/pharmacy") &&
        !location.pathname.startsWith("/trainer") &&
        !location.pathname.startsWith("/dashboard") &&
        !location.pathname.startsWith("/login") && (
          <React.Suspense fallback={null}>
            <Navbar />
          </React.Suspense>
        )}

      <ErrorBoundary>
        {/* React.Suspense boundary for code-split routes */}
        <React.Suspense fallback={<div className="min-h-screen bg-[#F2FAF8]" />}>
          <Routes>

          {/* ================= ADMIN ROUTES ================= */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
          <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
          <Route path="/admin/panel" element={<Navigate to="/admin" replace />} />
          {/* NEW CODE - Wellwigen restyle / Inquiries feature */}
          <Route path="/admin/inquiries" element={<AdminProtectedRoute><AdminDashboard initialTab="Inquiries" /></AdminProtectedRoute>} />
          <Route path="/admin/trainers" element={<AdminProtectedRoute><AdminDashboard initialTab="Trainers" /></AdminProtectedRoute>} />
          {/* [DISABLED FOR FUTURE USE] Admin Classes & Schedule Route
          <Route path="/admin/classes" element={<AdminDashboard initialTab="Classes" />} />
          */}
          <Route path="/admin/clients" element={<AdminProtectedRoute><AdminDashboard initialTab="Clients" /></AdminProtectedRoute>} />
          <Route path="/admin/subscriptions" element={<AdminProtectedRoute><AdminDashboard initialTab="Subscriptions" /></AdminProtectedRoute>} />
          <Route path="/admin/settings" element={<AdminProtectedRoute><AdminDashboard initialTab="Settings" /></AdminProtectedRoute>} />
          <Route path="/admin/*" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />

          {/* [DISABLED FOR FUTURE USE] Admin Management Sub-Routes (Appointments, Medical Records, Vendors, Categories, Verification)
          <Route path="/admin/manage" element={<AdminLayout />}>
            <Route path="medical-records" element={<MedicalRecords />} />
            <Route path="prescriptions" element={<Prescriptions />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="doctors" element={<Doctors />} />
            <Route path="settings" element={<Settings />} />
            <Route path="vendors" element={<AdminVendors />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="verification" element={<ProviderVerification />} />
          </Route>
          */}

          {/* [DISABLED FOR FUTURE USE] Flat Admin Route Aliases to prevent 404s from Sidebar links
          <Route path="/admin/appointments" element={<AdminLayout><Appointments /></AdminLayout>} />
          <Route path="/admin/medical-records" element={<AdminLayout><MedicalRecords /></AdminLayout>} />
          <Route path="/admin/vendors" element={<AdminLayout><AdminVendors /></AdminLayout>} />
          <Route path="/admin/categories" element={<AdminLayout><AdminCategories /></AdminLayout>} />
          <Route path="/admin/verification" element={<AdminLayout><ProviderVerification /></AdminLayout>} />
          */}



          {/* ================= VENDOR ROUTES ================= */}

          <Route path="/provider/onboarding" element={<OnboardingWizard />} />
          <Route path="/provider/status" element={<ProviderStatus />} />
          <Route path="/vendor/register" element={<OnboardingWizard />} />

          <Route path="/vendor/login" element={
            <PageWrapper>
              <Helmet>
                <title>Partner & Provider Portal Login | Wellwigen Partner Hub</title>
                <meta name="description" content="Access the partner login portal for doctors, pharmacists, laboratory technicians, certified fitness trainers, and wellness vendors on the Wellwigen network." />
                <meta name="keywords" content="doctor portal login, partner store dashboard, lab testing portal access, fitness coach login, provider portal login" />
                <link rel="canonical" href={window.location.origin + "/vendor/login"} />
              </Helmet>
              <VendorLogin />
            </PageWrapper>
          } />

          {/* ✅ Role-Specific Provider Dashboards */}
          <Route path="/provider/dashboard" element={<ProviderProtectedRoute><UnifiedDashboard /></ProviderProtectedRoute>} />
          <Route path="/doctor/dashboard" element={<ProviderProtectedRoute allowedRole="DOCTOR"><UnifiedDashboard /></ProviderProtectedRoute>} />
          <Route path="/vendor/dashboard" element={<ProviderProtectedRoute allowedRole="VENDOR"><UnifiedDashboard /></ProviderProtectedRoute>} />
          <Route path="/lab/dashboard" element={<ProviderProtectedRoute allowedRole="LAB"><UnifiedDashboard /></ProviderProtectedRoute>} />
          <Route path="/nutrition/dashboard" element={<ProviderProtectedRoute allowedRole="NUTRITION"><UnifiedDashboard /></ProviderProtectedRoute>} />
          {/* OLD CODE (commented by AI)
          <Route path="/trainer/dashboard" element={<ProviderProtectedRoute allowedRole="TRAINER"><TrainerDashboard /></ProviderProtectedRoute>} />
          */}
          {/* NEW CODE - Wellwigen Trainer Portal (Public intro, auth, 6-step onboarding, and full dashboard suite) */}
          <Route path="/trainer" element={<TrainerIntro />} />
          <Route path="/trainer/login" element={<TrainerLogin />} />
          <Route path="/trainer/register" element={<TrainerRegister />} />
          <Route path="/trainer/onboarding" element={<TrainerProtectedRoute><TrainerOnboarding /></TrainerProtectedRoute>} />
          <Route path="/trainer/safety-guidelines" element={<TrainerSafetyGuidelines />} />
          <Route path="/safety-guidelines" element={<TrainerSafetyGuidelines />} />

          {/* OLD CODE (commented by AI)
          <Route path="/trainer/dashboard" element={<TrainerProtectedRoute><TrainerLayout><TrainerPortalDashboard /></TrainerLayout></TrainerProtectedRoute>} />
          <Route path="/trainer/classes" element={<TrainerProtectedRoute><TrainerLayout><TrainerClasses /></TrainerLayout></TrainerProtectedRoute>} />
          <Route path="/trainer/clients" element={<TrainerProtectedRoute><TrainerLayout><TrainerClients /></TrainerLayout></TrainerProtectedRoute>} />
          <Route path="/trainer/profile" element={<TrainerProtectedRoute><TrainerLayout><TrainerProfile /></TrainerLayout></TrainerProtectedRoute>} />
          <Route path="/trainer/settings" element={<TrainerProtectedRoute><TrainerLayout><TrainerSettings /></TrainerLayout></TrainerProtectedRoute>} />
          */}

          {/* NEW CODE - Protected Trainer Portal with Persistent Layout & Smooth Sliding Transitions */}
          <Route
            element={
              <TrainerProtectedRoute>
                <TrainerLayout />
              </TrainerProtectedRoute>
            }
          >
            <Route path="/trainer/dashboard" element={<TrainerPortalDashboard />} />
            <Route path="/trainer/classes" element={<TrainerClasses />} />
            <Route path="/trainer/clients" element={<TrainerClients />} />
            {/* [DISABLED FOR FUTURE USE] Trainer Availability Route
            <Route path="/trainer/availability" element={<TrainerAvailability />} />
            */}
            <Route path="/trainer/profile" element={<TrainerProfile />} />
            <Route path="/trainer/settings" element={<TrainerSettings />} />
          </Route>
          <Route path="/trainer/*" element={<TrainerNotFound />} />
          <Route path="/dashboard" element={<UserDashboard />} />

          {/* ================= TERMS ================= */}
          <Route
            path="/terms-and-conditions"
            element={
              <PageWrapper>
                <Helmet>
                  <title>Terms & Conditions & Privacy Policy | Wellwigen</title>
                  <meta name="description" content="Review the Terms & Conditions and Privacy Policy for utilizing the Wellwigen smart wellness platform and telemedicine consultation network." />
                  <link rel="canonical" href={window.location.origin + "/terms-and-conditions"} />
                </Helmet>
                <TermsAndConditions />
                <Footer />
              </PageWrapper>
            }
          />

          {/* ================= NEW SINGLE-PAGE LANDING ================= */}
          <Route path="/" element={<LandingPage />} />

          {/* ================= DEDICATED PERSONAL TRAINING PAGE ================= */}
          <Route path="/personal-training" element={<PersonalTrainingPage />} />
          <Route path="/pricing" element={<PersonalTrainingPage />} />

          {/* ================= DEDICATED GROUP CLASSES PAGE ================= */}
          <Route path="/group-classes" element={<GroupClassesPage />} />
          <Route path="/schedule" element={<GroupClassesPage />} />

          {/* ================= REDIRECTS FROM OLD MARKETING ROUTES TO ANCHORS ================= */}
          <Route path="/about" element={<Navigate to="/#home" replace />} />
          <Route path="/contact" element={<Navigate to="/#home" replace />} />
          <Route path="/services" element={<Navigate to="/#home" replace />} />
          <Route path="/testimonial" element={<Navigate to="/#home" replace />} />
          <Route path="/contactus" element={<Navigate to="/#home" replace />} />

          {/* ================= LEGACY START: Original Multi-page Homepage =================
          <Route
            path="/legacy-home"
            element={
              <PageWrapper>
                <Helmet>
                  <title>Wellwigen | 24/7 Online Doctor Consultation, AI Diet Planner & Fitness Coach</title>
                  <meta name="description" content="Wellwigen is an AI-powered health and wellness ecosystem. Get 24/7 online doctor consultations, personalized AI meal plans, and certified virtual personal fitness trainers. Sync biometric devices, book home lab tests, and get doorstep medicine delivery." />
                  <meta name="keywords" content="online doctor consultation, 24/7 online doctor, AI meal planner, AI nutrition app, virtual fitness trainer, online personal training, immediate virtual care, telehealth app, home lab tests, prescription medicine delivery online, AI diet coach, medical health ecosystem, digital clinic" />
                  <link rel="canonical" href={window.location.origin + "/"} />
                  <meta property="og:type" content="website" />
                  <meta property="og:title" content="Wellwigen | 24/7 Online Doctor Consultation, AI Diet Planner & Fitness Coach" />
                  <meta property="og:description" content="Access 24/7 online doctor consultations, personalized AI diet plans, certified fitness training, and fast online medicine delivery." />
                  <meta property="og:url" content="https://wellwigen.com" />
                  <meta property="og:image" content="https://wellwigen.com/og-image.jpg" />
                  <meta name="twitter:card" content="summary_large_image" />
                  <meta name="twitter:title" content="Wellwigen | 24/7 Online Doctor Consultation, AI Diet Planner & Fitness Coach" />
                  <meta name="twitter:description" content="Access 24/7 online doctor consultations, personalized AI diet plans, certified fitness training, and fast online medicine delivery." />
                  <script type="application/ld+json">
                    {`
                        {
                          "@context": "https://schema.org",
                          "@type": "MedicalBusiness",
                          "name": "Wellwigen",
                          "alternateName": "Wellwigen Health & Fitness",
                          "url": "https://wellwigen.com",
                          "logo": "https://wellwigen.com/favicon.svg",
                          "image": "https://wellwigen.com/og-image.jpg",
                          "description": "Wellwigen is an AI-powered health and wellness platform offering 24/7 online doctor consultations, personalized AI meal plans, and virtual fitness coaching.",
                          "telephone": "+919598506627",
                          "email": "wellwigen@gmail.com",
                          "address": {
                            "@type": "PostalAddress",
                            "streetAddress": "123 Fitness Street, Wellness City",
                            "addressCountry": "IN"
                          },
                          "priceRange": "$$"
                        }
                      `}
                  </script>
                </Helmet>

                <main>
                  <Hero />
                  <ResponsiveSection>
                    <FitnessClasses />
                    <ResponsiveSection>
                      <VerifiedTrainers />
                    </ResponsiveSection>
                  </ResponsiveSection>
                  <Framework />
                  <FruitMarketplace />
                  <ResponsiveSection>
                    <HealthPrograms />
                  </ResponsiveSection>
                  <Pricing isSubSection={true} />
                  <ResponsiveSection>
                    <Dashboard />
                  </ResponsiveSection>
                  <ResponsiveSection>
                    <Diet />
                  </ResponsiveSection>
                  <ResponsiveSection>
                    <AboutUs />
                  </ResponsiveSection>
                  <ResponsiveSection>
                    <Testimonials />
                  </ResponsiveSection>
                  <Metrics />
                  <ContactUs />
                </main>

                <Footer />
              </PageWrapper>
            }
          />
          ================= LEGACY END: Original Multi-page Homepage ================= */}

          {/* ================= LEGACY START: Original Marketing Sub-routes (redirected to single-scroll anchors above) =================
          <Route path="/services" element={
            <PageWrapper>
              <Helmet>
                <title>Comprehensive Telehealth Services: 24/7 Online Doctor & Fitness | Wellwigen Services</title>
                <meta name="description" content="Explore Wellwigen's complete digital healthcare ecosystem. Connect with 24/7 online doctor consultations, get a personalized AI meal planner, book home blood sample collections, hire online personal fitness trainers, and order online medicine delivery." />
                <link rel="canonical" href={window.location.origin + "/services"} />
              </Helmet>
              <ResponsiveSection><Dashboard /></ResponsiveSection>
              <ResponsiveSection><FitnessClasses /><ResponsiveSection><VerifiedTrainers /></ResponsiveSection></ResponsiveSection>
              <Footer />
            </PageWrapper>
          } />
          <Route path="/ecosystem" element={
            <PageWrapper>
              <Helmet>
                <title>AI Health Engine & Personalized Bio-Tracking | Wellwigen Ecosystem</title>
                <link rel="canonical" href={window.location.origin + "/ecosystem"} />
              </Helmet>
              <Footer />
            </PageWrapper>
          } />
          <Route path="/pricing" element={
            <PageWrapper>
              <Helmet>
                <title>Affordable Health Subscriptions & Telemedicine Pricing | Wellwigen Plans</title>
                <link rel="canonical" href={window.location.origin + "/pricing"} />
              </Helmet>
              <Pricing isSubSection={false} />
              <Footer />
            </PageWrapper>
          } />
          <Route path="/testimonial" element={
            <PageWrapper>
              <Helmet>
                <title>Wellwigen Reviews | Patient Success Stories & Client Testimonials</title>
                <link rel="canonical" href={window.location.origin + "/testimonial"} />
              </Helmet>
              <Testimonials />
              <Footer />
            </PageWrapper>
          } />
          <Route path="/contactus" element={
            <PageWrapper>
              <Helmet>
                <title>Contact Wellwigen | 24/7 Telehealth Support & Partner Care</title>
                <link rel="canonical" href={window.location.origin + "/contactus"} />
              </Helmet>
              <ContactUs />
              <Footer />
            </PageWrapper>
          } />
          ================= LEGACY END: Original Marketing Sub-routes ================= */}
          <Route path="/join-as-trainer" element={
            <PageWrapper>
              <Helmet>
                <title>Become a Certified Online Personal Trainer | Wellwigen Careers</title>
                <meta name="description" content="Sign up as a certified fitness coach or trainer on the Wellwigen network. Work remotely, create custom workout plans, track client biometrics, and build your digital training business." />
                <meta name="keywords" content="online personal trainer jobs, virtual fitness coach sign up, remote personal training career, certified fitness trainer platform, work as fitness trainer online" />
                <link rel="canonical" href={window.location.origin + "/join-as-trainer"} />
                <script type="application/ld+json">
                  {`
                      {
                        "@context": "https://schema.org",
                        "@type": "WebPage",
                        "name": "Join Wellwigen as a Certified Fitness Coach",
                        "description": "Onboarding page for professional personal trainers to offer remote fitness coaching."
                      }
                    `}
                </script>
              </Helmet>
              <TrainerForm />
              <Footer />
            </PageWrapper>
          } />

          {/* ================= REGISTER ================= */}
          <Route path="/register" element={
            <PageWrapper>
              <Helmet>
                <title>Sign Up for Wellwigen | Start Your Personalized AI Wellness Journey</title>
                <meta name="description" content="Sign up for Wellwigen today to access 24/7 online doctor consultations, personalized AI diet plans, sync your biometric devices, and connect with certified fitness coaches." />
                <meta name="keywords" content="register telemedicine app, sign up AI wellness platform, create personalized fitness profile, join online doctor system" />
                <link rel="canonical" href={window.location.origin + "/register"} />
                <script type="application/ld+json">
                  {`
                      {
                        "@context": "https://schema.org",
                        "@type": "RegisterAction",
                        "name": "Sign Up for Wellwigen",
                        "description": "Start your personalized health, telemedicine, and fitness program."
                      }
                    `}
                </script>
              </Helmet>
              <ResponsiveSection>
                <ConsultationForm />
              </ResponsiveSection>
              <Footer />
            </PageWrapper>
          } />

          {/* ================= LOGIN ================= */}
          <Route path="/login" element={
            <PageWrapper>
              <Helmet>
                <title>Patient Portal Login | Access Your Secure Wellwigen Dashboard</title>
                <meta name="description" content="Log in to your secure Wellwigen health portal. Access your telemedicine prescriptions, track health metrics, chat with your trainer, and view lab test results." />
                <meta name="keywords" content="telehealth portal sign in, patient login, access medical records online, patient health dashboard, login to doctor app" />
                <link rel="canonical" href={window.location.origin + "/login"} />
                <script type="application/ld+json">
                  {`
                      {
                        "@context": "https://schema.org",
                        "@type": "WebPage",
                        "name": "Patient Login - Wellwigen Portal",
                        "description": "Secure sign-in for patient health tracking and consultations."
                      }
                    `}
                </script>
              </Helmet>
              <Login />
            </PageWrapper>
          } />

        </Routes>
        </React.Suspense>
      </ErrorBoundary>
      {/* OLD CODE (commented by AI) */}
      {/* {location.pathname !== '/' && <FloatingContact />} */}
      {/* OLD CODE (commented by AI)
      {location.pathname !== '/' && !location.pathname.startsWith('/admin') && (
      */}
      {/* NEW CODE - Hide floating contact in admin and trainer portal */}
      {location.pathname !== '/' && !location.pathname.startsWith('/admin') && !location.pathname.startsWith('/trainer') && (
        <React.Suspense fallback={null}>
          <FloatingContact />
        </React.Suspense>
      )}
    </div>
  );
}

export default App;

/* ================= PAGE WRAPPER ================= */
function PageWrapper({ children }) {
  return (
    <div>{children}</div>
  );
}

/* ================= RESPONSIVE SECTION ================= */
function ResponsiveSection({ children }) {
  return (
    <div className="py-12 px-4 sm:px-6 md:px-12 lg:px-16 max-w-full md:max-w-7xl mx-auto">
      {children}
    </div>
  );
}