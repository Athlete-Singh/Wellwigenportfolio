import { create } from 'zustand';
import {
  registerProviderApi,
  saveProgressApi,
  uploadProviderDocumentsApi,
  getProviderStatusApi,
  sendEmailOtpApi,
  verifyEmailOtpApi,
} from '../services/providerService.js';

export const useProviderStore = create((set, get) => ({
  provider: JSON.parse(localStorage.getItem('wellwigen_onboarding_provider')) || null,
  token: localStorage.getItem('wellwigen_onboarding_token') || null,
  isLoading: false,
  error: null,

  initialize: async () => {
    const saved = localStorage.getItem('wellwigen_onboarding_provider');
    if (saved) {
      const parsed = JSON.parse(saved);
      set({ provider: parsed });

      // Refresh from server to ensure database verification flags are up to date
      if (parsed?._id) {
        try {
          const res = await getProviderStatusApi(parsed._id);
          if (res?.data) {
            set({ provider: res.data });
            localStorage.setItem('wellwigen_onboarding_provider', JSON.stringify(res.data));
          }
        } catch (e) {
          // Network or offline: keep local draft
        }
      }
    }
  },

  saveProgress: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const data = await saveProgressApi(payload);
      const updatedProvider = data.data;
      set({
        provider: updatedProvider,
        token: data.token || get().token,
        isLoading: false,
      });
      localStorage.setItem('wellwigen_onboarding_provider', JSON.stringify(updatedProvider));
      if (data.token) {
        localStorage.setItem('wellwigen_onboarding_token', data.token);
      }
      return data;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  sendEmailOtp: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const res = await sendEmailOtpApi({ email });
      set({ isLoading: false });
      return res;
    } catch (error) {
      set({ isLoading: false, error: error.response?.data?.message || error.message });
      throw error;
    }
  },

  verifyEmailOtp: async (email, otp) => {
    set({ isLoading: true, error: null });
    try {
      const res = await verifyEmailOtpApi({ email, otp });
      // Update local provider state with verified flag
      const current = get().provider || {};
      const updated = { ...current, email, emailVerified: true };
      set({ provider: updated, isLoading: false });
      localStorage.setItem('wellwigen_onboarding_provider', JSON.stringify(updated));
      return res;
    } catch (error) {
      set({ isLoading: false, error: error.response?.data?.message || error.message });
      throw error;
    }
  },

  registerProvider: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const data = await registerProviderApi(payload);
      set({ provider: data.data, isLoading: false });
      localStorage.setItem('wellwigen_onboarding_provider', JSON.stringify(data.data));
      return data;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  uploadDocuments: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const data = await uploadProviderDocumentsApi(payload);
      set({ provider: data.data, isLoading: false });
      return data;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },
}));

export default useProviderStore;
