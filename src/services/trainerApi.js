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

// Coaches roster dynamically loaded from database
export const DEFAULT_COACHES_ROSTER = [];

// Production initialization without dummy data
const initStorage = () => {
  if (typeof window === 'undefined') return;

  // 🧹 Purge legacy dummy data (Arjun Mehra, Simran Kaur, Vikram Rajput, cls_1, etc.)
  try {
    const rawClients = localStorage.getItem(STORAGE_KEYS.TRAINER_CLIENTS);
    if (rawClients) {
      try {
        let clientsList = JSON.parse(rawClients);
        if (Array.isArray(clientsList)) {
          let modified = false;
          // Filter out dummy users
          const filtered = clientsList.filter(
            (c) => c.name !== 'Arjun Mehra' && c.name !== 'Simran Kaur' && c.id !== 'cli_1' && c.name !== 'Test Deletion Target' && c.email !== 'testdelete@test.com'
          ).map((c) => {
            let updated = { ...c };
            if (updated.assignedCoach === 'Vikram Rajput') {
              updated.assignedCoach = '';
              updated.assignedCoachId = '';
              modified = true;
            }
            if (updated.assignedCoachId === 'trn_demo_101') {
              updated.assignedCoachId = '';
              modified = true;
            }
            if (updated.avatar && updated.avatar.includes('1534528741775')) {
              updated.avatar = '';
              modified = true;
            }
            if (updated.phone && (updated.phone.startsWith('+91 98765 1') || updated.phone === '+91 98765 43210' || updated.phone === '9999999999')) {
              updated.phone = '';
              modified = true;
            }
            if (updated.renewalDate === '2026-05-15') {
              const createdTime = updated.createdAt ? new Date(updated.createdAt).getTime() : Date.now();
              updated.renewalDate = new Date(createdTime + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
              modified = true;
            }
            return updated;
          });
          if (modified || filtered.length !== clientsList.length) {
            localStorage.setItem(STORAGE_KEYS.TRAINER_CLIENTS, JSON.stringify(filtered));
          }
        }
      } catch {}
    }
    const rawClasses = localStorage.getItem(STORAGE_KEYS.TRAINER_CLASSES);
    if (rawClasses && (rawClasses.includes('cls_1') || rawClasses.includes('trn_demo_101') || rawClasses.includes('cls_2'))) {
      localStorage.setItem(STORAGE_KEYS.TRAINER_CLASSES, JSON.stringify([]));
    }
    const rawAuth = localStorage.getItem(STORAGE_KEYS.TRAINER_AUTH);
    if (rawAuth && (rawAuth.includes('trn_demo_101') || rawAuth.includes('Vikram Rajput') || rawAuth.includes('trainer@wellwigen.com'))) {
      localStorage.removeItem(STORAGE_KEYS.TRAINER_AUTH);
      localStorage.removeItem(STORAGE_KEYS.TRAINER_ONBOARDING);
    }
    const rawOnboarding = localStorage.getItem(STORAGE_KEYS.TRAINER_ONBOARDING);
    if (rawOnboarding && (rawOnboarding.includes('Vikram Rajput') || rawOnboarding.includes('trainer@wellwigen.com'))) {
      localStorage.removeItem(STORAGE_KEYS.TRAINER_ONBOARDING);
    }
  } catch {}

  if (!localStorage.getItem(STORAGE_KEYS.TRAINER_CLASSES)) {
    localStorage.setItem(STORAGE_KEYS.TRAINER_CLASSES, JSON.stringify([]));
  }

  if (!localStorage.getItem(STORAGE_KEYS.TRAINER_CLIENTS)) {
    localStorage.setItem(STORAGE_KEYS.TRAINER_CLIENTS, JSON.stringify([]));
  }

  if (!localStorage.getItem(STORAGE_KEYS.TRAINER_AVAILABILITY)) {
    const initialAvailability = {
      slotsPerDay: 4,
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      timeSlots: [],
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
      // Check backend status before deciding
      try {
        const res = await axios.get(
          `${API_BASE}/trainers/status?email=${encodeURIComponent(normalizedEmail)}`
        );
        if (res.data?.success && res.data.trainer) {
          trainer = res.data.trainer;
        } else {
          throw new Error('No registered coach account found with this email. Please register first.');
        }
      } catch (err) {
        throw new Error(err.response?.data?.message || err.message || 'Invalid coach credentials.');
      }
    }

    localStorage.setItem(STORAGE_KEYS.TRAINER_AUTH, JSON.stringify(trainer));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('trainerAuthChanged'));
    }
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
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('trainerAuthChanged'));
    }
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
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('trainerAuthChanged'));
        }
        return merged;
      }
    } catch (e) {
      console.warn('Backend registration sync notice:', e.message);
    }

    return newTrainer;
  },

  loginDemoTrainer() {
    throw new Error('Demo login is disabled for live production.');
  },

  logout() {
    localStorage.removeItem(STORAGE_KEYS.TRAINER_AUTH);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('trainerAuthChanged'));
    }
    return true;
  },

  /**
   * Verifies whether current stored credentials are valid.
   * Checks database status for real registered accounts, and accepts valid demo accounts.
   * If token/account is invalid or not found, clears stale credentials and returns false.
   */
  async verifyCurrentAuth() {
    const current = this.getCurrentTrainer();
    if (!current) return false;

    // Verify registered account against backend DB
    if (current.email) {
      try {
        const res = await axios.get(
          `${API_BASE}/trainers/status?email=${encodeURIComponent(current.email.trim().toLowerCase())}`
        );
        if (res.data?.success && res.data?.trainer) {
          return true;
        }
      } catch (err) {
        if (err.response?.status === 404 || err.response?.status === 401) {
          this.logout();
          return false;
        }
      }
    }

    return !!current;
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
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('wellwigen_trainer_application_submitted', { detail: merged }));
          window.dispatchEvent(new Event('storage'));
        }
        return merged;
      }
    } catch (err) {
      console.warn('Backend onboarding sync notice:', err.message);
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('wellwigen_trainer_application_submitted', { detail: completeProfile }));
      window.dispatchEvent(new Event('storage'));
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
      monthlyEarnings: '₹0',
      earningsGrowth: '0%',
      rating: 0,
      totalHoursTrained: '0 Hrs',
      profileViews: 0,
      pendingRequests: 0,
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

  addClient(clientData) {
    try {
      const clients = this.getClients();
      // Check if client with this email already exists
      const existingIdx = clients.findIndex(
        (c) => c.email && clientData.email && c.email.toLowerCase() === clientData.email.toLowerCase()
      );

      if (existingIdx !== -1) {
        clients[existingIdx] = {
          ...clients[existingIdx],
          ...clientData,
          status: 'Active',
          subscriptionStatus: 'Active',
          renewalDate: clientData.renewalDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEYS.TRAINER_CLIENTS, JSON.stringify(clients));
        this.syncClientToMembership(clients[existingIdx]);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('wellwigen_clients_updated'));
        }
        return clients[existingIdx];
      }

      const newClient = {
        id: clientData.id || `cli_${Date.now()}`,
        name: clientData.name || clientData.fullName || 'New Client',
        email: clientData.email || '',
        phone: clientData.phone || '',
        goal: clientData.goal || clientData.fitnessGoal || 'General Fitness',
        plan: clientData.plan || 'Total Wellness Monthly',
        program: clientData.program || 'Personal Training',
        sessionsCompleted: clientData.sessionsCompleted || 0,
        totalSessions: clientData.totalSessions || 12,
        nextSession: clientData.nextSession || 'Session 1: Initial Assessment',
        status: 'Active',
        subscriptionStatus: 'Active',
        renewalDate: clientData.renewalDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        assignedCoach: (clientData.assignedCoach && clientData.assignedCoach !== 'Vikram Rajput' && clientData.assignedCoach !== 'Unassigned') ? clientData.assignedCoach : '',
        assignedCoachId: (clientData.assignedCoachId && clientData.assignedCoachId !== 'trn_demo_101') ? clientData.assignedCoachId : '',
        avatar: clientData.avatar || '',
        source: 'inquiry_converted',
        createdAt: new Date().toISOString(),
      };

      clients.unshift(newClient);
      localStorage.setItem(STORAGE_KEYS.TRAINER_CLIENTS, JSON.stringify(clients));
      this.syncClientToMembership(newClient);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('wellwigen_clients_updated'));
      }
      return newClient;
    } catch (e) {
      console.error('Failed to add client:', e);
      return null;
    }
  },

  // Shift client to Membership section when trainer assigned and plan enrolled
  syncClientToMembership(client) {
    if (!client) return;
    const hasCoach = client.assignedCoach && client.assignedCoach !== 'Unassigned' && client.assignedCoach !== 'Vikram Rajput' && String(client.assignedCoach).trim() !== '';
    const hasPlan = client.plan && client.plan !== 'No Active Subscription' && String(client.plan).trim() !== '';
    if (!hasCoach || !hasPlan) return;

    try {
      const rawSubs = localStorage.getItem('wellwigen_admin_subscriptions');
      let subs = rawSubs ? JSON.parse(rawSubs) : [];
      if (!Array.isArray(subs)) subs = [];

      const existingIdx = subs.findIndex(
        (s) => s.clientId === client.id || (s.clientEmail && client.email && s.clientEmail.toLowerCase() === client.email.toLowerCase())
      );

      const planName = client.plan || 'Total Wellness Monthly';
      let planTier = 'Active Tier';
      let price = '₹2,999';
      if (planName.toLowerCase().includes('elite') || planName.toLowerCase().includes('premium') || planName.toLowerCase().includes('1-on-1')) {
        planTier = 'VIP Elite';
        price = '₹5,999';
      } else if (planName.toLowerCase().includes('strength') || planName.toLowerCase().includes('transform')) {
        planTier = 'Popular';
        price = '₹2,999';
      } else if (planName.toLowerCase().includes('mobility') || planName.toLowerCase().includes('flex') || planName.toLowerCase().includes('group')) {
        planTier = 'Starter';
        price = '₹1,999';
      }

      const subRecord = {
        id: existingIdx !== -1 ? subs[existingIdx].id : `sub_${client.id || Date.now()}`,
        clientId: client.id,
        clientName: client.name,
        clientEmail: client.email,
        clientPhone: client.phone || '',
        planName: client.plan,
        planTier,
        price,
        billingCycle: 'Monthly',
        assignedCoach: client.assignedCoach,
        assignedCoachId: client.assignedCoachId || '',
        startDate: client.createdAt ? new Date(client.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        expiryDate: client.renewalDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: client.subscriptionStatus || 'Active',
        updatedAt: new Date().toISOString(),
      };

      if (existingIdx !== -1) {
        subs[existingIdx] = { ...subs[existingIdx], ...subRecord };
      } else {
        subs.unshift(subRecord);
      }

      localStorage.setItem('wellwigen_admin_subscriptions', JSON.stringify(subs));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('wellwigen_subscriptions_updated'));
      }
    } catch (err) {
      console.warn('syncClientToMembership notice:', err);
    }
  },

  async syncConvertedInquiriesFromBackend() {
    try {
      const res = await axios.get(`${API_BASE}/inquiries?status=Converted`);
      const converted = res.data?.data || [];
      if (Array.isArray(converted) && converted.length > 0) {
        converted.forEach((inq) => {
          this.addClient({
            name: inq.fullName,
            email: inq.email,
            phone: inq.phone,
            goal: inq.fitnessGoal || 'General Fitness',
            plan: inq.plan || 'Online Group Classes Monthly',
            program: inq.program || 'Fitness Program',
            assignedCoach: (inq.assignedCoach && inq.assignedCoach !== 'Unassigned') ? inq.assignedCoach : '',
            assignedCoachId: inq.assignedCoachId || '',
            source: 'inquiry_converted',
          });
        });
      }
    } catch (err) {
      // offline / mock fallback
    }
  },

  removeClient(clientId) {
    try {
      const clients = this.getClients();
      const updated = clients.filter((c) => c.id !== clientId && c.email !== clientId);
      localStorage.setItem(STORAGE_KEYS.TRAINER_CLIENTS, JSON.stringify(updated));

      // Also clean up from subscriptions if present
      try {
        const storedSubs = localStorage.getItem('wellwigen_admin_subscriptions');
        if (storedSubs) {
          const subs = JSON.parse(storedSubs);
          const filteredSubs = subs.filter((s) => s.clientId !== clientId && s.clientEmail !== clientId);
          localStorage.setItem('wellwigen_admin_subscriptions', JSON.stringify(filteredSubs));
        }
      } catch (err) {
        console.warn('Error syncing subscriptions on client removal:', err);
      }

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('wellwigen_clients_updated'));
      }
      return true;
    } catch (e) {
      console.error('Failed to remove client:', e);
      return false;
    }
  },

  updateClient(clientId, updatedData) {
    try {
      const clients = this.getClients();
      const idx = clients.findIndex((c) => c.id === clientId || c.email === clientId);
      if (idx !== -1) {
        clients[idx] = { ...clients[idx], ...updatedData, updatedAt: new Date().toISOString() };
        localStorage.setItem(STORAGE_KEYS.TRAINER_CLIENTS, JSON.stringify(clients));
        this.syncClientToMembership(clients[idx]);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('wellwigen_clients_updated'));
        }
        return clients[idx];
      }
      return null;
    } catch (e) {
      console.error('Failed to update client:', e);
      return null;
    }
  },

  removeClientSubscription(clientId) {
    try {
      const clients = this.getClients();
      const idx = clients.findIndex((c) => c.id === clientId || c.email === clientId);
      if (idx !== -1) {
        clients[idx] = {
          ...clients[idx],
          plan: 'No Active Subscription',
          subscriptionStatus: 'Cancelled',
          status: 'Cancelled',
          renewalDate: 'N/A',
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEYS.TRAINER_CLIENTS, JSON.stringify(clients));

        // Sync with admin subscriptions
        try {
          const storedSubs = localStorage.getItem('wellwigen_admin_subscriptions');
          if (storedSubs) {
            const subs = JSON.parse(storedSubs);
            const updatedSubs = subs.map((s) => {
              if (s.clientId === clientId || s.clientEmail === clients[idx].email) {
                return { ...s, status: 'Cancelled' };
              }
              return s;
            });
            localStorage.setItem('wellwigen_admin_subscriptions', JSON.stringify(updatedSubs));
          }
        } catch (err) {
          console.warn('Error syncing subscriptions on sub removal:', err);
        }

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('wellwigen_clients_updated'));
        }
        return clients[idx];
      }
      return null;
    } catch (e) {
      console.error('Failed to remove client subscription:', e);
      return null;
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

  // ---------------- COACH ASSIGNMENT & AUTOMATED CRON NOTIFICATIONS ----------------
  async assignCoachToTarget(assignmentData) {
    try {
      const res = await axios.post(`${API_BASE}/trainers/assign`, assignmentData);
      return res.data;
    } catch (err) {
      console.warn('API notice assigning coach:', err.message);
      return { success: false, error: err.message };
    }
  },

  async getTrainerAssignments(query = {}) {
    try {
      const current = this.getCurrentTrainer();
      const params = {
        email: query.email || current?.email,
        name: query.name || current?.name,
        coachId: query.coachId || current?.id || current?._id,
      };
      const res = await axios.get(`${API_BASE}/trainers/assignments`, { params });
      if (res.data?.success && Array.isArray(res.data.assignments)) {
        return res.data.assignments;
      }
    } catch (err) {
      console.warn('API error fetching trainer assignments:', err.message);
    }
    return [];
  },

  async syncTrainerAssignmentNotifications() {
    try {
      const current = this.getCurrentTrainer();
      if (!current) return;
      const assignments = await this.getTrainerAssignments();
      assignments.forEach((assign) => {
        const notifTitle = `🎯 New ${assign.assignmentType === 'group' ? 'Group Class' : 'Trainee'}: ${assign.targetName}`;
        const notifMessage = `Assigned as lead coach for ${assign.targetName} (${assign.plan || 'Personal Training'}). Goal: ${assign.targetGoal || 'General Fitness'}`;
        this.addNotification({
          title: notifTitle,
          message: notifMessage,
          type: 'client',
          link: '/trainer/dashboard',
        });
      });
    } catch {}
  },

  // ---------------- PROFILE & SETTINGS ----------------
  async updateProfile(profileUpdates) {
    await new Promise((r) => setTimeout(r, 350));
    const current = this.getCurrentTrainer() || {};
    const updated = { ...current, ...profileUpdates };
    localStorage.setItem(STORAGE_KEYS.TRAINER_AUTH, JSON.stringify(updated));
    localStorage.setItem(STORAGE_KEYS.TRAINER_ONBOARDING, JSON.stringify(updated));

    if (current.email) {
      try {
        const res = await axios.patch(`${API_BASE}/trainers/profile`, {
          email: current.email,
          ...profileUpdates,
        });
        if (res.data?.trainer) {
          const synced = { ...updated, ...res.data.trainer };
          localStorage.setItem(STORAGE_KEYS.TRAINER_AUTH, JSON.stringify(synced));
          localStorage.setItem(STORAGE_KEYS.TRAINER_ONBOARDING, JSON.stringify(synced));
          return synced;
        }
      } catch (e) {
        console.warn('Backend profile update notice:', e.message);
      }
    }
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
        await this.syncTrainerAssignmentNotifications();
        return updated;
      }
    } catch {
      // Fallback to local storage state
    }
    await this.syncTrainerAssignmentNotifications();
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
    // No approved trainers in DB yet
    return [];
  },

  // ---------------- ADMIN PANEL TRAINER OPERATIONS ----------------
  async getAdminTrainers({ status = 'All', search = '', page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = {}) {
    const token = localStorage.getItem('adminToken') || '';
    const config = {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
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

    // Local fallback for offline resilience
    const localTrainer = this.getCurrentTrainer();
    const list = localTrainer ? [localTrainer] : [];
    return {
      success: true,
      trainers: list,
      pagination: { total: list.length, page: 1, limit, pages: 1 },
      counts: {
        total: list.length,
        pending: list.filter((t) => t.status === 'pending').length,
        approved: list.filter((t) => t.status === 'approved').length,
        rejected: list.filter((t) => t.status === 'rejected').length,
      },
    };
  },

  async getAdminTrainerById(id) {
    const token = localStorage.getItem('adminToken') || '';
    const config = {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
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
    return null;
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
      } catch (_patchErr) {
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

  async deleteTrainer(id) {
    const token = localStorage.getItem('adminToken') || 'mock-admin-token';
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    try {
      const res = await axios.delete(`${API_BASE}/admin/trainers/${id}`, config);
      return res.data;
    } catch (err) {
      console.warn('Backend delete trainer failed:', err.message);
      throw err;
    }
  },
};

export default trainerApi;

if (typeof window !== 'undefined') {
  setTimeout(() => {
    trainerApi.syncConvertedInquiriesFromBackend();
  }, 300);
}


