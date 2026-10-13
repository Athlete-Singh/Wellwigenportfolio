/**
 * Wellwigen Trainer Portal API Service
 * Centralizes all Trainer Portal state, mock authentication, onboarding data,
 * and dashboard operations. Designed for easy swap with real REST/GraphQL APIs later.
 */

import axios from 'axios';

// Base API URL
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const STORAGE_KEYS = {
  TRAINER_AUTH: 'wellwigen_trainer_auth',
  TRAINER_ONBOARDING: 'wellwigen_trainer_onboarding',
  TRAINER_CLASSES: 'wellwigen_trainer_classes',
  TRAINER_CLIENTS: 'wellwigen_trainer_clients',
  TRAINER_AVAILABILITY: 'wellwigen_trainer_availability',
  TRAINER_NOTIFICATIONS: 'wellwigen_trainer_notifications',
  TRAINER_SETTINGS: 'wellwigen_trainer_settings',
};

// Default pre-seeded demo trainer for instant testing
const DEMO_TRAINER = {
  id: 'trn_demo_101',
  name: 'Vikram Rajput',
  email: 'trainer@wellwigen.com',
  phone: '+91 98765 43210',
  city: 'Mumbai',
  languages: ['English', 'Hindi'],
  gender: 'Male',
  specialization: 'Strength & Conditioning',
  secondarySpecializations: ['HIIT', 'Functional Training'],
  experience: '6 Years',
  certifications: ['ACE Certified Personal Trainer', 'ISSA Strength Coach'],
  institution: 'American Council on Exercise (ACE)',
  photoUrl: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=600&q=80',
  certificateUrl: '',
  services: {
    personalTraining: true,
    groupClasses: true,
    oneOnOnePriceMonthly: 4999,
    groupClassSeatPrice: 499,
  },
  bio: 'Certified strength and conditioning coach helping professionals build lean muscle, fix posture, and develop sustainable workout habits with evidence-based training.',
  videoUrl: '',
  instagram: '@vikram_wellwigen',
  linkedin: 'linkedin.com/in/vikram-coach',
  status: 'approved', // 'onboarding' | 'pending' | 'approved'
  joinedDate: 'Jan 2026',
  rating: 4.9,
  reviewsCount: 38,
};

// Full roster of registered coaches with their weekly availability schedules
export const DEFAULT_COACHES_ROSTER = [
  {
    id: 'trn_aditya',
    name: 'Aditya',
    email: 'aditya@wellwigen.com',
    phone: '+91 98765 43210',
    specialization: 'Strength & Conditioning',
    experience: '6 Years',
    status: 'approved',
    rating: 4.95,
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    city: 'Mumbai',
    availability: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      timeSlots: [
        { time: '06:00 AM - 07:00 AM', active: true },
        { time: '07:00 AM - 08:00 AM', active: true },
        { time: '09:00 AM - 10:00 AM', active: true },
        { time: '10:30 AM - 11:30 AM', active: true },
        { time: '05:00 PM - 06:00 PM', active: true },
        { time: '06:30 PM - 07:30 PM', active: true },
      ],
      noticeHours: 12,
      bufferMinutes: 15,
    },
  },
  {
    id: 'trn_demo_101',
    name: 'Vikram Rajput',
    email: 'trainer@wellwigen.com',
    phone: '+91 98765 43211',
    specialization: 'HIIT & Conditioning',
    experience: '6 Years',
    status: 'approved',
    rating: 4.9,
    photoUrl: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=600&q=80',
    city: 'Delhi',
    availability: {
      days: ['Monday', 'Tuesday', 'Thursday', 'Friday', 'Saturday'], // Off on Wednesday & Sunday
      timeSlots: [
        { time: '06:00 AM - 07:00 AM', active: true },
        { time: '07:00 AM - 08:00 AM', active: true },
        { time: '08:00 AM - 09:00 AM', active: true },
        { time: '05:00 PM - 06:00 PM', active: true },
        { time: '06:30 PM - 07:30 PM', active: true },
      ],
      noticeHours: 24,
      bufferMinutes: 15,
    },
  },
  {
    id: 'trn_priya_102',
    name: 'Priya Sharma',
    email: 'priya@wellwigen.com',
    phone: '+91 98765 43212',
    specialization: 'Mobility & Core',
    experience: '5 Years',
    status: 'approved',
    rating: 4.92,
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    city: 'Bengaluru',
    availability: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Friday', 'Saturday'], // Off on Thursday & Sunday
      timeSlots: [
        { time: '07:00 AM - 08:00 AM', active: true },
        { time: '08:00 AM - 09:00 AM', active: true },
        { time: '10:00 AM - 11:00 AM', active: true },
        { time: '04:00 PM - 05:00 PM', active: true },
        { time: '06:00 PM - 07:00 PM', active: true },
      ],
      noticeHours: 12,
      bufferMinutes: 20,
    },
  },
  {
    id: 'trn_rahul_103',
    name: 'Rahul Verma',
    email: 'rahul.v@wellwigen.com',
    phone: '+91 98765 43213',
    specialization: 'Functional Training',
    experience: '4 Years',
    status: 'approved',
    rating: 4.85,
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    city: 'Hyderabad',
    availability: {
      days: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], // Off on Monday
      timeSlots: [
        { time: '06:00 AM - 07:00 AM', active: true },
        { time: '07:00 AM - 08:00 AM', active: true },
        { time: '09:00 AM - 10:00 AM', active: true },
        { time: '05:00 PM - 06:00 PM', active: true },
      ],
      noticeHours: 12,
      bufferMinutes: 15,
    },
  },
  {
    id: 'trn_ananya_104',
    name: 'Ananya Sen',
    email: 'ananya@wellwigen.com',
    phone: '+91 98765 43214',
    specialization: 'Yoga & Flexibility Flow',
    experience: '7 Years',
    status: 'approved',
    rating: 4.98,
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    city: 'Pune',
    availability: {
      days: ['Monday', 'Wednesday', 'Friday', 'Sunday'], // Off on Tue, Thu, Sat
      timeSlots: [
        { time: '06:00 AM - 07:00 AM', active: true },
        { time: '07:30 AM - 08:30 AM', active: true },
        { time: '05:30 PM - 06:30 PM', active: true },
      ],
      noticeHours: 18,
      bufferMinutes: 15,
    },
  },
];

// Seed initial mock data into localStorage if empty
const initStorage = () => {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(STORAGE_KEYS.TRAINER_CLASSES)) {
    /* [DISABLED FOR FUTURE USE] Old initialClasses without Zoom configuration & cover images
    const initialClasses = [
      { id: 'cls_1', title: 'Morning High-Intensity MetCon', ... },
    ];
    */
    const initialClasses = [
      {
        id: 'cls_1',
        title: 'Core Power & Spinal Stability',
        subtitle: 'Live group training.',
        category: 'Strength & Conditioning',
        fitnessLevel: 'All Levels',
        date: '2026-10-14',
        time: '10:30 AM',
        formattedDateTime: '2026-10-14 • 10:30 AM',
        duration: '45 mins',
        durationMins: 45,
        capacity: 20,
        price: 499,
        recurring: 'One-time Session',
        isFreeDemo: true,
        allowedTiers: ['STARTER', 'GOLD', 'PLATINUM'],
        zoomUrl: 'https://us02web.zoom.us/j/8492019284?pwd=WLLWGN26',
        meetingId: '849 201 9284',
        passcode: 'WLLWGN26',
        coverImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
        status: 'Approved & Live',
        trainerId: 'trn_aditya',
        trainerName: 'Aditya',
        trainerPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        trainerSpecialization: 'Strength & Conditioning',
      },
      {
        id: 'cls_2',
        title: 'Morning High-Intensity MetCon',
        subtitle: 'Live group training.',
        category: 'HIIT & Conditioning',
        fitnessLevel: 'Intermediate',
        date: '2026-10-15',
        time: '07:00 AM',
        formattedDateTime: '2026-10-15 • 07:00 AM',
        duration: '45 mins',
        durationMins: 45,
        capacity: 25,
        price: 499,
        recurring: 'Daily (Mon-Fri)',
        isFreeDemo: true,
        allowedTiers: ['GOLD', 'PLATINUM'],
        zoomUrl: 'https://us02web.zoom.us/j/8492019284?pwd=WLLWGN26',
        meetingId: '849 201 9284',
        passcode: 'WLLWGN26',
        coverImage: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?q=80&w=800&auto=format&fit=crop',
        status: 'Approved & Live',
        trainerId: 'trn_demo_101',
        trainerName: 'Vikram Rajput',
        trainerPhoto: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=600&q=80',
        trainerSpecialization: 'HIIT & Conditioning',
      },
      {
        id: 'cls_3',
        title: 'Postural Reset & Mobility Flow',
        subtitle: 'Live group training.',
        category: 'Mobility & Core',
        fitnessLevel: 'All Levels',
        date: '2026-10-16',
        time: '08:00 AM',
        formattedDateTime: '2026-10-16 • 08:00 AM',
        duration: '40 mins',
        durationMins: 40,
        capacity: 20,
        price: 399,
        recurring: 'Weekly Recurring',
        isFreeDemo: false,
        allowedTiers: ['PLATINUM'],
        zoomUrl: 'https://us02web.zoom.us/j/8492019284?pwd=WLLWGN26',
        meetingId: '849 201 9284',
        passcode: 'WLLWGN26',
        coverImage: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop',
        status: 'Approved & Live',
        trainerId: 'trn_priya_102',
        trainerName: 'Priya Sharma',
        trainerPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
        trainerSpecialization: 'Mobility & Core',
      },
    ];
    localStorage.setItem(STORAGE_KEYS.TRAINER_CLASSES, JSON.stringify(initialClasses));
  }

  if (!localStorage.getItem(STORAGE_KEYS.TRAINER_CLIENTS)) {
    const initialClients = [
      {
        id: 'cli_1',
        name: 'Arjun Mehra',
        email: 'arjun.m@example.com',
        goal: 'Hypertrophy & Posture Fix',
        plan: '3-Month 1-on-1 Transformation',
        sessionsCompleted: 14,
        totalSessions: 36,
        nextSession: 'Today at 05:30 PM',
        status: 'Active',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      },
      {
        id: 'cli_2',
        name: 'Simran Kaur',
        email: 'simran.k@example.com',
        goal: 'Fat Loss & Stamina',
        plan: 'Monthly 1-on-1 Coaching',
        sessionsCompleted: 8,
        totalSessions: 12,
        nextSession: 'Tomorrow at 08:00 AM',
        status: 'Active',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      },
      {
        id: 'cli_3',
        name: 'Rohan Sharma',
        email: 'rohan.s@example.com',
        goal: 'Marathon Strength Prep',
        plan: 'Bi-Weekly Check-in Plan',
        sessionsCompleted: 18,
        totalSessions: 24,
        nextSession: 'Thursday at 06:00 PM',
        status: 'Active',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
      },
    ];
    localStorage.setItem(STORAGE_KEYS.TRAINER_CLIENTS, JSON.stringify(initialClients));
  }

  if (!localStorage.getItem(STORAGE_KEYS.TRAINER_AVAILABILITY)) {
    const initialAvailability = {
      slotsPerDay: 4,
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      timeSlots: [
        { time: '06:00 AM - 07:00 AM', active: true },
        { time: '07:00 AM - 08:00 AM', active: true },
        { time: '08:00 AM - 09:00 AM', active: false },
        { time: '05:00 PM - 06:00 PM', active: true },
        { time: '06:30 PM - 07:30 PM', active: true },
        { time: '08:00 PM - 09:00 PM', active: false },
      ],
      noticeHours: 12,
      bufferMinutes: 15,
    };
    localStorage.setItem(STORAGE_KEYS.TRAINER_AVAILABILITY, JSON.stringify(initialAvailability));
  }
};

initStorage();

export const trainerApi = {
  // ---------------- AUTHENTICATION ----------------
  getCurrentTrainer() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TRAINER_AUTH);
      if (stored) {
        return JSON.parse(stored);
      }
      return null;
    } catch {
      return null;
    }
  },

  isAuthenticated() {
    return !!this.getCurrentTrainer();
  },

  async login({ email, password }) {
    // Simulated network delay
    await new Promise((r) => setTimeout(r, 450));

    if (!email || !password) {
      throw new Error('Please enter both email and password.');
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if there is an existing registered trainer matching email
    const registeredOnboarding = this.getOnboardingData();
    let trainer = null;

    if (registeredOnboarding?.email?.toLowerCase() === normalizedEmail) {
      trainer = {
        ...registeredOnboarding,
        status: registeredOnboarding.status || 'pending',
      };
    } else {
      // Default to demo trainer
      trainer = {
        ...DEMO_TRAINER,
        email: normalizedEmail,
      };
    }

    localStorage.setItem(STORAGE_KEYS.TRAINER_AUTH, JSON.stringify(trainer));
    return trainer;
  },

  // OLD CODE (commented by AI)
  /*
  async register({ name, email, password, phone }) {
    await new Promise((r) => setTimeout(r, 450));
    ...
  */
  // NEW CODE - Dual local + backend registration
  async register({ name, email, password, phone }) {
    await new Promise((r) => setTimeout(r, 400));

    if (!name || !email || !password || !phone) {
      throw new Error('All registration fields are required.');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    const newTrainer = {
      id: 'trn_' + Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      status: 'onboarding',
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      rating: 5.0,
      reviewsCount: 0,
    };

    // Save auth and seed onboarding step 1
    localStorage.setItem(STORAGE_KEYS.TRAINER_AUTH, JSON.stringify(newTrainer));
    this.saveOnboardingData({
      ...newTrainer,
      step: 1,
    });

    // Sync with backend API
    try {
      const res = await axios.post(`${API_BASE}/trainers/register`, {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        phone: phone.trim(),
      });
      if (res.data?.trainer) {
        const merged = { ...newTrainer, ...res.data.trainer };
        localStorage.setItem(STORAGE_KEYS.TRAINER_AUTH, JSON.stringify(merged));
        return merged;
      }
    } catch (e) {
      console.warn('Backend registration sync notice:', e.message);
    }

    return newTrainer;
  },

  loginDemoTrainer() {
    localStorage.setItem(STORAGE_KEYS.TRAINER_AUTH, JSON.stringify(DEMO_TRAINER));
    return DEMO_TRAINER;
  },

  logout() {
    localStorage.removeItem(STORAGE_KEYS.TRAINER_AUTH);
    return true;
  },

  // ---------------- ONBOARDING ----------------
  getOnboardingData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TRAINER_ONBOARDING);
      if (stored) return JSON.parse(stored);
      const auth = this.getCurrentTrainer();
      return auth ? { name: auth.name, email: auth.email, phone: auth.phone } : {};
    } catch {
      return {};
    }
  },

  saveOnboardingData(data) {
    try {
      const existing = this.getOnboardingData();
      const updated = { ...existing, ...data };
      localStorage.setItem(STORAGE_KEYS.TRAINER_ONBOARDING, JSON.stringify(updated));

      // Also update auth user if name/email changed
      const auth = this.getCurrentTrainer();
      if (auth) {
        localStorage.setItem(
          STORAGE_KEYS.TRAINER_AUTH,
          JSON.stringify({ ...auth, ...data })
        );
      }
      return updated;
    } catch (e) {
      console.error('Failed to save onboarding data:', e);
      return data;
    }
  },

  // OLD CODE (commented by AI)
  /*
  async submitOnboardingApplication(finalData) {
    await new Promise((r) => setTimeout(r, 600));
    ...
  */
  // NEW CODE - Dual local + backend application submission
  async submitOnboardingApplication(finalData) {
    await new Promise((r) => setTimeout(r, 500));

    const completeProfile = {
      ...this.getOnboardingData(),
      ...finalData,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      applicationId: 'WW-TRN-' + Math.floor(100000 + Math.random() * 900000),
    };

    localStorage.setItem(STORAGE_KEYS.TRAINER_ONBOARDING, JSON.stringify(completeProfile));
    localStorage.setItem(STORAGE_KEYS.TRAINER_AUTH, JSON.stringify(completeProfile));

    // Persist to backend database for Admin approval queue
    try {
      const res = await axios.post(`${API_BASE}/trainers/submit-onboarding`, completeProfile);
      if (res.data?.trainer) {
        const merged = { ...completeProfile, ...res.data.trainer };
        localStorage.setItem(STORAGE_KEYS.TRAINER_ONBOARDING, JSON.stringify(merged));
        localStorage.setItem(STORAGE_KEYS.TRAINER_AUTH, JSON.stringify(merged));
        return merged;
      }
    } catch (err) {
      console.warn('Backend onboarding sync notice:', err.message);
    }

    return completeProfile;
  },

  // ---------------- DASHBOARD & STATS ----------------
  async getDashboardStats() {
    await new Promise((r) => setTimeout(r, 200));
    const classes = this.getClasses();
    const clients = this.getClients();

    return {
      activeClients: clients.length,
      upcomingClasses: classes.filter((c) => c.status === 'Upcoming').length,
      monthlyEarnings: '₹48,500',
      earningsGrowth: '+18.4%',
      rating: 4.9,
      totalHoursTrained: '142 Hrs',
      profileViews: 384,
      pendingRequests: 4,
    };
  },

  // ---------------- CLASSES ----------------
  /* [DISABLED FOR FUTURE USE] Old getClasses without title sanitization
  getClasses() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TRAINER_CLASSES);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },
  */
  // NEW CODE - getClasses with automatic cleanup of multiple '(Copy) (Copy)' artifacts
  getClasses() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TRAINER_CLASSES);
      if (!stored) return [];
      const list = JSON.parse(stored);
      return list.map((cls) => {
        if (!cls.title) return cls;
        // Clean multiple repeating (Copy) chains into clean titles
        const cleanedTitle = cls.title.replace(/\s*(\(\s*copy(\s*\d+)?\s*\)){2,}/gi, ' (Copy)').trim();
        return {
          ...cls,
          title: cleanedTitle,
        };
      });
    } catch {
      return [];
    }
  },

  async createClass(newClassData) {
    await new Promise((r) => setTimeout(r, 350));
    const current = this.getClasses();
    const created = {
      id: 'cls_' + Date.now(),
      enrolled: 0,
      status: 'Upcoming',
      ...newClassData,
    };
    const updated = [created, ...current];
    localStorage.setItem(STORAGE_KEYS.TRAINER_CLASSES, JSON.stringify(updated));
    return created;
  },

  async updateClass(id, updates) {
    await new Promise((r) => setTimeout(r, 200));
    const current = this.getClasses();
    const updated = current.map((c) => (c.id === id ? { ...c, ...updates } : c));
    localStorage.setItem(STORAGE_KEYS.TRAINER_CLASSES, JSON.stringify(updated));
    return updated.find((c) => c.id === id);
  },

  async deleteClass(id) {
    await new Promise((r) => setTimeout(r, 200));
    const current = this.getClasses();
    const updated = current.filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.TRAINER_CLASSES, JSON.stringify(updated));
    return true;
  },

  /* [DISABLED FOR FUTURE USE] Old duplicateClass that appended (Copy) repeatedly
  async duplicateClass(id) {
    await new Promise((r) => setTimeout(r, 200));
    const current = this.getClasses();
    const original = current.find((c) => c.id === id);
    if (!original) return null;
    const duplicated = {
      ...original,
      id: 'cls_' + Date.now(),
      title: `${original.title} (Copy)`,
      status: 'Under Review',
    };
    const updated = [duplicated, ...current];
    localStorage.setItem(STORAGE_KEYS.TRAINER_CLASSES, JSON.stringify(updated));
    return duplicated;
  },
  */
  // NEW CODE - Clean duplication logic without duplicate '(Copy)' chaining
  async duplicateClass(id) {
    await new Promise((r) => setTimeout(r, 200));
    const current = this.getClasses();
    const original = current.find((c) => c.id === id);
    if (!original) return null;
    // Strip any existing '(Copy)', '(Copy) (Copy)', '(Copy 2)', etc.
    const baseTitle = (original.title || 'Workout Class')
      .replace(/\s*(\(\s*copy(\s*\d+)?\s*\))+/gi, '')
      .trim();
    const duplicated = {
      ...original,
      id: 'cls_' + Date.now(),
      title: `${baseTitle} (Copy)`,
      status: 'Under Review',
    };
    const updated = [duplicated, ...current];
    localStorage.setItem(STORAGE_KEYS.TRAINER_CLASSES, JSON.stringify(updated));
    return duplicated;
  },

  // ---------------- CLIENTS ----------------
  getClients() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TRAINER_CLIENTS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  // ---------------- AVAILABILITY ----------------
  getAvailability() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TRAINER_AVAILABILITY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  async updateAvailability(updatedData) {
    await new Promise((r) => setTimeout(r, 300));
    localStorage.setItem(STORAGE_KEYS.TRAINER_AVAILABILITY, JSON.stringify(updatedData));
    return updatedData;
  },

  // NEW CODE - Get full roster of coaches with their weekly availability schedules
  getCoachesWithAvailability() {
    try {
      const localAvailability = this.getAvailability();
      const currentAuth = this.getCurrentTrainer();

      return DEFAULT_COACHES_ROSTER.map((coach) => {
        if (
          currentAuth &&
          (coach.id === currentAuth.id ||
            coach.name?.toLowerCase() === (currentAuth.name || '').toLowerCase())
        ) {
          return {
            ...coach,
            ...currentAuth,
            availability: localAvailability || coach.availability,
          };
        }
        return coach;
      });
    } catch {
      return DEFAULT_COACHES_ROSTER;
    }
  },

  // NEW CODE - Real-time calculation of coach availability for target date & time
  getCoachAvailabilityStatus(coach, dateStr, timeStr) {
    if (!coach) return { isAvailable: false, reason: 'Invalid Coach', badgeColor: 'rose', dayOfWeek: 'Unknown' };

    let dayOfWeek = 'Wednesday';
    try {
      if (dateStr) {
        // Robust date parsing (support YYYY-MM-DD or standard Date)
        const parts = String(dateStr).split('-');
        if (parts.length === 3) {
          const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
          dayOfWeek = d.toLocaleDateString('en-US', { weekday: 'long' });
        } else {
          const d = new Date(dateStr);
          if (!isNaN(d.getTime())) {
            dayOfWeek = d.toLocaleDateString('en-US', { weekday: 'long' });
          }
        }
      }
    } catch {
      dayOfWeek = 'Wednesday';
    }

    const avail = coach.availability || {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      timeSlots: [],
    };

    const isDayActive = Array.isArray(avail.days) && avail.days.includes(dayOfWeek);

    if (!isDayActive) {
      return {
        isAvailable: false,
        reason: `Off-Duty on ${dayOfWeek}s`,
        badgeColor: 'rose',
        dayOfWeek,
        activeSlots: [],
      };
    }

    const activeSlots = (avail.timeSlots || []).filter((s) => s.active).map((s) => s.time);

    return {
      isAvailable: true,
      reason: `Available on ${dayOfWeek}s`,
      badgeColor: 'emerald',
      dayOfWeek,
      activeSlots,
    };
  },

  // NEW CODE - Assign or reassign coach for a specific class
  async assignCoachToClass(classId, coachData) {
    await new Promise((r) => setTimeout(r, 200));
    const classes = this.getClasses();
    const updated = classes.map((c) => {
      if (c.id === classId) {
        return {
          ...c,
          trainerId: coachData.id || coachData.trainerId || '',
          trainerName: coachData.name || coachData.trainerName || 'Coach Aditya',
          trainerPhoto: coachData.photoUrl || coachData.trainerPhoto || '',
          trainerSpecialization: coachData.specialization || coachData.trainerSpecialization || '',
          updatedAt: new Date().toISOString(),
        };
      }
      return c;
    });
    localStorage.setItem(STORAGE_KEYS.TRAINER_CLASSES, JSON.stringify(updated));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('classesUpdated'));
    }
    return updated.find((c) => c.id === classId);
  },

  // ---------------- NOTIFICATIONS ----------------
  getNotifications() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TRAINER_NOTIFICATIONS);
      if (stored) return JSON.parse(stored);

      // Default initial trainer notifications
      const defaults = [
        {
          id: 'notif_1',
          title: 'Class Assigned: Core Power',
          message: 'Admin has assigned you to lead "Core Power & Spinal Stability" on Wednesday, 10:30 AM.',
          time: '15 mins ago',
          unread: true,
          type: 'class',
          link: '/trainer/classes',
        },
        {
          id: 'notif_2',
          title: 'Coach Profile Verified & Live',
          message: 'Your Wellwigen credentials have been reviewed and approved. Your profile is active.',
          time: '2 hours ago',
          unread: true,
          type: 'approval',
          link: '/trainer/profile',
        },
        {
          id: 'notif_3',
          title: 'Zoom Credentials Configured',
          message: 'Live Zoom link & Passcode are set up and ready to share with clients via WhatsApp.',
          time: 'Yesterday',
          unread: false,
          type: 'zoom',
          link: '/trainer/classes',
        },
      ];
      localStorage.setItem(STORAGE_KEYS.TRAINER_NOTIFICATIONS, JSON.stringify(defaults));
      return defaults;
    } catch {
      return [];
    }
  },

  markNotificationAsRead(id) {
    const list = this.getNotifications();
    const updated = list.map((n) => (n.id === id ? { ...n, unread: false } : n));
    localStorage.setItem(STORAGE_KEYS.TRAINER_NOTIFICATIONS, JSON.stringify(updated));
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('trainerNotificationsUpdated'));
    return updated;
  },

  markAllNotificationsAsRead() {
    const list = this.getNotifications();
    const updated = list.map((n) => ({ ...n, unread: false }));
    localStorage.setItem(STORAGE_KEYS.TRAINER_NOTIFICATIONS, JSON.stringify(updated));
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('trainerNotificationsUpdated'));
    return updated;
  },

  clearAllNotifications() {
    localStorage.setItem(STORAGE_KEYS.TRAINER_NOTIFICATIONS, JSON.stringify([]));
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('trainerNotificationsUpdated'));
    return [];
  },

  addNotification({ title, message, type = 'system', link = '/trainer/dashboard' }) {
    const list = this.getNotifications();
    const duplicate = list.find((n) => n.title === title && n.message === message && n.unread);
    if (duplicate) return list;

    const newNotif = {
      id: 'notif_' + Date.now(),
      title,
      message,
      time: 'Just now',
      unread: true,
      type,
      link,
      createdAt: new Date().toISOString(),
    };
    const updated = [newNotif, ...list];
    localStorage.setItem(STORAGE_KEYS.TRAINER_NOTIFICATIONS, JSON.stringify(updated));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('trainerNotificationsUpdated'));
    }
    return updated;
  },

  getNotificationSettings() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TRAINER_SETTINGS);
      if (stored) return JSON.parse(stored);
      const defaults = {
        whatsappAlerts: true,
        emailReminders: true,
        dailySummary: true,
      };
      localStorage.setItem(STORAGE_KEYS.TRAINER_SETTINGS, JSON.stringify(defaults));
      return defaults;
    } catch {
      return { whatsappAlerts: true, emailReminders: true, dailySummary: true };
    }
  },

  saveNotificationSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.TRAINER_SETTINGS, JSON.stringify(settings));
    return settings;
  },

  // ---------------- PROFILE & SETTINGS ----------------
  async updateProfile(profileUpdates) {
    await new Promise((r) => setTimeout(r, 350));
    const current = this.getCurrentTrainer() || {};
    const updated = { ...current, ...profileUpdates };
    localStorage.setItem(STORAGE_KEYS.TRAINER_AUTH, JSON.stringify(updated));
    localStorage.setItem(STORAGE_KEYS.TRAINER_ONBOARDING, JSON.stringify(updated));
    return updated;
  },

  // ---------------- STATUS SYNC ----------------
  // Polls/fetches live status from MongoDB backend to update trainer dashboard
  async syncTrainerStatus() {
    const current = this.getCurrentTrainer();
    if (!current?.email) return current;

    try {
      const res = await axios.get(`${API_BASE}/trainers/status`, {
        params: { email: current.email },
      });
      if (res.data?.success && res.data.trainer) {
        const newStatus = res.data.trainer.status || current.status;
        const newRejectionReason = res.data.trainer.rejectionReason || current.rejectionReason || '';

        // If newly rejected, push in-app notification
        if (newStatus === 'rejected' && current.status !== 'rejected') {
          this.addNotification({
            title: '⚠️ Application Status: Needs Revision',
            message: `Your coach application was rejected. Reason: "${newRejectionReason}". Please update your credentials.`,
            type: 'rejection',
            link: '/trainer/onboarding',
          });
        } else if (newStatus === 'approved' && current.status !== 'approved') {
          this.addNotification({
            title: '🎉 Coach Application Approved!',
            message: 'Your Wellwigen Coach profile has been verified and is active.',
            type: 'approval',
            link: '/trainer/dashboard',
          });
        }

        const updated = {
          ...current,
          ...res.data.trainer,
          status: newStatus,
          rejectionReason: newRejectionReason,
        };
        localStorage.setItem(STORAGE_KEYS.TRAINER_AUTH, JSON.stringify(updated));
        localStorage.setItem(STORAGE_KEYS.TRAINER_ONBOARDING, JSON.stringify(updated));
        return updated;
      }
    } catch {
      // Fallback to local storage state
    }
    return current;
  },

  // ---------------- PUBLIC / APPROVED TRAINERS ----------------
  async getApprovedTrainers() {
    try {
      const res = await axios.get(`${API_BASE}/trainers/approved`);
      if (res.data?.success && Array.isArray(res.data.trainers)) {
        return res.data.trainers;
      }
    } catch (err) {
      console.warn('Failed to load approved trainers from API, fallback to default:', err.message);
    }
    // Fallback default approved trainer
    return [DEMO_TRAINER];
  },

  // ---------------- ADMIN PANEL TRAINER OPERATIONS ----------------
  async getAdminTrainers({ status = 'All', search = '', page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = {}) {
    const token = localStorage.getItem('adminToken') || 'mock-admin-token';
    const config = {
      headers: { Authorization: `Bearer ${token}` },
      params: { status, search, page, limit, sortBy, sortOrder },
    };

    try {
      const res = await axios.get(`${API_BASE}/admin/trainers`, config);
      if (res.data?.success && Array.isArray(res.data.trainers)) {
        const trs = res.data.trainers;
        const counts = res.data.counts || {
          total: trs.length,
          pending: trs.filter((t) => t.status === 'pending' || t.status === 'pending_approval').length,
          approved: trs.filter((t) => t.status === 'approved' || t.status === 'active').length,
          rejected: trs.filter((t) => t.status === 'rejected').length,
        };
        return {
          success: true,
          trainers: trs,
          counts,
          pagination: res.data.pagination || { total: trs.length, page, limit, pages: Math.ceil(trs.length / limit) || 1 },
        };
      }
    } catch (err) {
      console.warn('API error fetching admin trainers, falling back:', err.message);
    }

    // Local fallback for offline/demo resilience
    const localTrainer = this.getCurrentTrainer();
    const mockList = localTrainer ? [localTrainer, DEMO_TRAINER] : [DEMO_TRAINER];
    return {
      success: true,
      trainers: mockList,
      pagination: { total: mockList.length, page: 1, limit, pages: 1 },
      counts: {
        total: mockList.length,
        pending: mockList.filter((t) => t.status === 'pending').length,
        approved: mockList.filter((t) => t.status === 'approved').length,
        rejected: mockList.filter((t) => t.status === 'rejected').length,
      },
    };
  },

  async getAdminTrainerById(id) {
    const token = localStorage.getItem('adminToken') || 'mock-admin-token';
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    try {
      const res = await axios.get(`${API_BASE}/admin/trainers/${id}`, config);
      if (res.data?.success && res.data.trainer) {
        return res.data.trainer;
      }
    } catch (err) {
      console.warn('API error fetching trainer by id:', err.message);
    }

    const current = this.getCurrentTrainer();
    if (current && (current.id === id || current._id === id)) {
      return current;
    }
    return DEMO_TRAINER;
  },

  async updateTrainerStatus(id, { status, rejectionReason = '' }) {
    if (status === 'rejected' && (!rejectionReason || !rejectionReason.trim())) {
      throw new Error('Rejection reason is required when rejecting an application.');
    }

    const token = localStorage.getItem('adminToken') || 'mock-admin-token';
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const trimmedReason = rejectionReason.trim();

    // Update in backend API (try PATCH first, fallback to PUT)
    let res = null;
    try {
      try {
        res = await axios.patch(
          `${API_BASE}/admin/trainers/${id}/status`,
          { status, rejectionReason: trimmedReason, reason: trimmedReason },
          config
        );
      } catch (patchErr) {
        res = await axios.put(
          `${API_BASE}/admin/trainers/${id}/status`,
          { status, rejectionReason: trimmedReason, reason: trimmedReason },
          config
        );
      }
    } catch (err) {
      console.warn('Backend update failed, applying local update:', err.message);
    }

    // Sync in-app notification in trainer panel
    if (status === 'rejected') {
      this.addNotification({
        title: '⚠️ Application Status: Action Required',
        message: `Your coach onboarding application was rejected. Reason: "${trimmedReason}". Please update your credentials.`,
        type: 'rejection',
        link: '/trainer/onboarding',
      });
    } else if (status === 'approved') {
      this.addNotification({
        title: '🎉 Coach Application Approved!',
        message: 'Congratulations! Your Wellwigen Coach profile has been verified and is active.',
        type: 'approval',
        link: '/trainer/dashboard',
      });
    }

    // If this matches the current local logged-in trainer, sync locally immediately
    const current = this.getCurrentTrainer();
    if (current && (current.id === id || current._id === id || current.email === res?.data?.trainer?.email)) {
      const updatedLocal = {
        ...current,
        status,
        rejectionReason: status === 'rejected' ? trimmedReason : '',
      };
      localStorage.setItem(STORAGE_KEYS.TRAINER_AUTH, JSON.stringify(updatedLocal));
      localStorage.setItem(STORAGE_KEYS.TRAINER_ONBOARDING, JSON.stringify(updatedLocal));
    }

    return res?.data || { success: true, message: `Trainer status updated to ${status}.` };
  },
};

export default trainerApi;
