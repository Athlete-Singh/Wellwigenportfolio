export const API_BASE_URL = (() => {
  const base = import.meta.env.VITE_API_BASE_URL;
  if (base) return base.replace(/\/+$/, '');
  const apiUrl = import.meta.env.VITE_API_URL;
  if (apiUrl) return apiUrl.replace(/\/api\/?$/, '');
  if (typeof window !== 'undefined') {
    const isLocal =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';
    if (!isLocal) {
      return '';
    }
  }
  return 'http://localhost:8000';
})();

export const ENDPOINTS = {
  // Existing
  register: '/consultation',
  
  // Subscription Feature
  subscriptionCreate: '/api/subscription/create',
  subscriptionVerify: '/api/subscription/verify',
  subscriptionMe: (userId) => `/api/subscription/me/${userId}`,
  subscriptionCancel: (id) => `/api/subscription/cancel/${id}`,
  subscriptionPause: (id) => `/api/subscription/pause/${id}`,

  // Provider Feature
  providerRegister: '/api/provider/register',
  providerUploadDocs: '/api/provider/upload-documents',
  providerMe: (id) => `/api/provider/me/${id}`,
  providerAvailability: (id) => `/api/provider/availability/${id}`,
};
