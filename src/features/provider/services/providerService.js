import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

/**
 * Returns authorization headers if an onboarding or session token is stored.
 */
export const getAuthHeaders = () => {
  const token =
    localStorage.getItem('wellwigen_onboarding_token') ||
    localStorage.getItem('wellwigen_provider_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const loginProviderApi = async (data) => {
  const response = await axios.post(`${API_URL}/provider/login`, data);
  if (response.data?.token) {
    localStorage.setItem('wellwigen_provider_token', response.data.token);
  }
  return response.data;
};

export const saveProgressApi = async (data) => {
  const headers = getAuthHeaders();
  const response = await axios.post(`${API_URL}/provider/save-progress`, data, { headers });
  if (response.data?.token) {
    localStorage.setItem('wellwigen_onboarding_token', response.data.token);
  }
  return response.data;
};

export const registerProviderApi = async (formData) => {
  const headers = getAuthHeaders();
  const response = await axios.post(`${API_URL}/provider/register`, formData, { headers });
  return response.data;
};

export const uploadProviderDocumentsApi = async (formData) => {
  const headers = {
    ...getAuthHeaders(),
    'Content-Type': 'multipart/form-data',
  };
  const response = await axios.post(`${API_URL}/provider/upload-documents`, formData, { headers });
  return response.data;
};

export const getProviderStatusApi = async (providerId) => {
  const headers = getAuthHeaders();
  const response = await axios.get(`${API_URL}/provider/me/${providerId}`, { headers });
  return response.data;
};

export const addProviderItemApi = async (itemData) => {
  const headers = getAuthHeaders();
  const response = await axios.post(`${API_URL}/product`, itemData, { headers });
  return response.data;
};

/**
 * Sends a real Email OTP verification code to the provider's email.
 * Requires onboarding JWT token.
 * 
 * @param {Object} params
 * @param {string} params.email
 */
export const sendEmailOtpApi = async ({ email }) => {
  const headers = getAuthHeaders();
  const response = await axios.post(`${API_URL}/otp/email/send`, { email }, { headers });
  return response.data;
};

/**
 * Verifies the 6-digit Email OTP against the server HMAC hash.
 * Requires onboarding JWT token.
 * 
 * @param {Object} params
 * @param {string} params.email
 * @param {string} params.otp
 */
export const verifyEmailOtpApi = async ({ email, otp }) => {
  const headers = getAuthHeaders();
  const response = await axios.post(`${API_URL}/otp/email/verify`, { email, otp }, { headers });
  return response.data;
};

export const providerService = {
  login: loginProviderApi,
  saveProgress: saveProgressApi,
  register: registerProviderApi,
  uploadDocs: uploadProviderDocumentsApi,
  getStatus: getProviderStatusApi,
  addItem: addProviderItemApi,
  sendEmailOtp: sendEmailOtpApi,
  verifyEmailOtp: verifyEmailOtpApi,
};

export default providerService;
