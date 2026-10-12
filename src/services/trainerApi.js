/**
 * Wellwigen Trainer Portal API Service
 * Centralizes all Trainer Portal state, mock authentication, onboarding data,
 * and dashboard operations. Designed for easy swap with real REST/GraphQL APIs later.
 */

const STORAGE_KEYS = {
  TRAINER_AUTH: 'wellwigen_trainer_auth',
  TRAINER_ONBOARDING: 'wellwigen_trainer_onboarding',
  TRAINER_CLASSES: 'wellwigen_trainer_classes',
  TRAINER_CLIENTS: 'wellwigen_trainer_clients',
  TRAINER_AVAILABILITY: 'wellwigen_trainer_availability',
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

// Seed initial mock data into localStorage if empty
const initStorage = () => {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(STORAGE_KEYS.TRAINER_CLASSES)) {
    const initialClasses = [
      {
        id: 'cls_1',
        title: 'Morning High-Intensity MetCon',
        type: 'Live Group Class',
        category: 'HIIT & Conditioning',
        date: 'Tomorrow, 07:00 AM IST',
        duration: '45 mins',
        enrolled: 18,
        capacity: 25,
        price: 499,
        status: 'Upcoming',
      },
      {
        id: 'cls_2',
        title: 'Core & Kettlebell Conditioning',
        type: 'Live Group Class',
        category: 'Strength',
        date: 'Wednesday, 06:30 PM IST',
        duration: '50 mins',
        enrolled: 22,
        capacity: 25,
        price: 499,
        status: 'Upcoming',
      },
      {
        id: 'cls_3',
        title: 'Postural Reset & Mobility Flow',
        type: 'Live Group Class',
        category: 'Mobility & Rehab',
        date: 'Friday, 08:00 AM IST',
        duration: '40 mins',
        enrolled: 14,
        capacity: 20,
        price: 399,
        status: 'Scheduled',
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

  async register({ name, email, password, phone }) {
    await new Promise((r) => setTimeout(r, 450));

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

  async submitOnboardingApplication(finalData) {
    await new Promise((r) => setTimeout(r, 600));

    const completeProfile = {
      ...this.getOnboardingData(),
      ...finalData,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      applicationId: 'WW-TRN-' + Math.floor(100000 + Math.random() * 900000),
    };

    localStorage.setItem(STORAGE_KEYS.TRAINER_ONBOARDING, JSON.stringify(completeProfile));
    localStorage.setItem(STORAGE_KEYS.TRAINER_AUTH, JSON.stringify(completeProfile));

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
  getClasses() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TRAINER_CLASSES);
      return stored ? JSON.parse(stored) : [];
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

  // ---------------- PROFILE & SETTINGS ----------------
  async updateProfile(profileUpdates) {
    await new Promise((r) => setTimeout(r, 350));
    const current = this.getCurrentTrainer() || {};
    const updated = { ...current, ...profileUpdates };
    localStorage.setItem(STORAGE_KEYS.TRAINER_AUTH, JSON.stringify(updated));
    localStorage.setItem(STORAGE_KEYS.TRAINER_ONBOARDING, JSON.stringify(updated));
    return updated;
  },
};

export default trainerApi;
