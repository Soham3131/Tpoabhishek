// src/services/authService.js
import axiosInstance from '../utils/axios';

const API = '/api/auth'; // Base URL for auth routes
const RESUME_API = '/api/resume'; // Base URL for resume routes

export const registerUser = async (formData) => {
  return await axiosInstance.post(`${API}/signup`, formData);
};

export const loginUser = async (formData) => {
  return await axiosInstance.post(`${API}/login`, formData);
};

export const logoutUser = async () => {
  return await axiosInstance.post(`${API}/logout`);
};

export const verifyUserOtp = async (email, otp) => {
  return await axiosInstance.post(`${API}/verify-otp`, { email, otp });
};

export const requestPasswordResetOtp = async (email) => {
  return await axiosInstance.post(`${API}/forgot-password`, { email });
};

export const resetUserPassword = async (email, otp, newPassword) => {
  return await axiosInstance.post(`${API}/reset-password`, { email, otp, newPassword });
};

export const getMyProfile = async () => {
  return await axiosInstance.get(`${API}/me`);
};

export const updateMyProfile = async (formData) => {
  return await axiosInstance.put(`${API}/profile`, formData);
};

// --- NEW: Functions for Resume data ---
export const getMyResumeDetails = async () => {
  return await axiosInstance.get(`${RESUME_API}`); // Calls GET /api/resume
};

export const createOrUpdateMyResume = async (resumeData) => {
  return await axiosInstance.post(`${RESUME_API}`, resumeData); // Calls POST /api/resume
};