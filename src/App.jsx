import React from 'react';
import "./styles/App.css";
import "./styles/index.css";
import { Helmet } from 'react-helmet-async';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { onMessage } from 'firebase/messaging';
import { messaging } from './config/firebase.js';

import Navbar from "./components/common/Navbar";
import FloatingContact from "./components/common/FloatingContact";
import AdminLayout from "./features/dashboard/layout/AdminLayout";
import ErrorBoundary from "./components/ErrorBoundary";
import LandingPage from "./features/landing/LandingPage";
import AnimatedBackground from "./components/common/AnimatedBackground";

// Home / Website Pages
import Hero from './features/home/components/Hero';
import Framework from './features/home/components/Framework';
import FruitMarketplace from "./features/home/components/FruitMarketplace";
import HealthPrograms from "./features/home/components/HealthPrograms";
import FitnessClasses from "./features/home/components/FitnessClasses";
import VerifiedTrainers from "./features/home/components/VerifiedTrainers";
// Pricing is now imported from features
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
// ProductCatalog is now integrated into UserDashboard as 'Vendor Products'
import MedicalRecords from "./features/dashboard/pages/MedicalRecords";
import Prescriptions from "./features/dashboard/pages/Prescriptions";
import Appointments from "./features/dashboard/pages/Appointments";
import Doctors from "./features/dashboard/pages/Doctors";
import Settings from "./features/dashboard/pages/Settings";
import AdminVendors from "./features/admin/pages/AdminVendors";
import ProviderVerification from "./features/admin/pages/ProviderVerification";
import AdminDashboard from "./features/admin/pages/AdminDashboard";



import Cart from "./features/shop/pages/Cart";

// ✅ Feature Imports
import Pricing from "./features/subscription/pages/PricingPage";
import Register from "./features/provider/pages/onboarding/OnboardingWizard";
import OnboardingWizard from "./features/provider/pages/onboarding/OnboardingWizard";
import ProviderStatus from "./features/provider/pages/onboarding/ProviderStatus";
import UnifiedDashboard from "./features/provider/pages/dashboard/UnifiedDashboard";
import PharmacyDashboard from "./features/provider/pages/dashboard/PharmacyDashboard";
import TrainerDashboard from "./features/provider/pages/dashboard/TrainerDashboard";

// Legacy Vendor Imports (to be migrated)
import VendorLogin from "./features/provider/legacy/Login";
import AddProduct from "./features/provider/legacy/AddProduct";
// import MyStore from "./vendor/MyStore";

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

  React.useEffect(() => {
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
  }, []);

  return (
    <div className="min-h-screen bg-transparent text-black relative">
      {/* Global Living Energy Field Animated Background */}
      <AnimatedBackground />

      <Toaster position="top-right" reverseOrder={false} />

      {/* ✅ Hide Navbar for Landing Page, Admin, Vendor, and Provider Pages */}
      {location.pathname !== "/" &&
        !location.pathname.startsWith("/admin") &&
        !location.pathname.startsWith("/vendor") &&
        !location.pathname.startsWith("/provider") &&
        !location.pathname.startsWith("/lab") &&
        !location.pathname.startsWith("/pharmacy") &&
        !location.pathname.startsWith("/trainer") &&
        !location.pathname.startsWith("/dashboard") &&
        !location.pathname.startsWith("/login") && <Navbar />}

      <ErrorBoundary>
        <Routes location={location} key={location.pathname}>

          {/* ================= ADMIN ROUTES ================= */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          {/* OLD CODE (commented by AI) */}
          {/* (no /admin/inquiries route previously) */}
          {/* NEW CODE - Wellwigen restyle / Inquiries feature */}
          <Route path="/admin/inquiries" element={<AdminDashboard initialTab="Inquiries" />} />

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



          {/* ✅ Flat Admin Route Aliases to prevent 404s from Sidebar links */}
          <Route path="/admin/appointments" element={<AdminLayout><Appointments /></AdminLayout>} />
          <Route path="/admin/medical-records" element={<AdminLayout><MedicalRecords /></AdminLayout>} />
          <Route path="/admin/vendors" element={<AdminLayout><AdminVendors /></AdminLayout>} />
          <Route path="/admin/categories" element={<AdminLayout><AdminCategories /></AdminLayout>} />
          <Route path="/admin/settings" element={<AdminLayout><Settings /></AdminLayout>} />
          <Route path="/admin/verification" element={<AdminLayout><ProviderVerification /></AdminLayout>} />



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
          <Route path="/pharmacy/dashboard" element={<ProviderProtectedRoute allowedRole="PHARMACY"><PharmacyDashboard /></ProviderProtectedRoute>} />
          <Route path="/trainer/dashboard" element={<ProviderProtectedRoute allowedRole="TRAINER"><TrainerDashboard /></ProviderProtectedRoute>} />
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

          {/* ================= REDIRECTS FROM OLD MARKETING ROUTES TO ANCHORS ================= */}
          <Route path="/personal-training" element={<Navigate to="/#personal-training" replace />} />
          <Route path="/group-classes" element={<Navigate to="/#group-classes" replace />} />
          <Route path="/schedule" element={<Navigate to="/#group-classes" replace />} />
          <Route path="/about" element={<Navigate to="/#home" replace />} />
          <Route path="/contact" element={<Navigate to="/#home" replace />} />
          <Route path="/services" element={<Navigate to="/#home" replace />} />
          <Route path="/pricing" element={<Navigate to="/#personal-training" replace />} />
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
      </ErrorBoundary>
      {/* OLD CODE (commented by AI) */}
      {/* {location.pathname !== '/' && <FloatingContact />} */}
      {/* NEW CODE - Wellwigen restyle / Inquiries feature (hide floating contact in admin) */}
      {location.pathname !== '/' && !location.pathname.startsWith('/admin') && <FloatingContact />}
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