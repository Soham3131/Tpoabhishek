// // frontend/src/services/applicationService.js
// import axiosInstance from '../utils/axios'; // Ensure this uses withCredentials: true

// const API_URL = '/api/applications';

// const applyToContent = async (contentId, contentType) => {
//   const response = await axiosInstance.post(`${API_URL}/track`, { contentId, contentType }); // Adjusted to '/track'
//   return response.data;
// };

// const getApplicantCount = async (contentId, contentType) => {
//   const response = await axiosInstance.get(`${API_URL}/count/${contentType}/${contentId}`);
//   return response.data.count;
// };

// const checkUserApplied = async (contentId, contentType) => {
//   const response = await axiosInstance.get(`${API_URL}/hasApplied/${contentType}/${contentId}`);
//   return response.data.hasApplied;
// };

// const applicationService = {
//   applyToContent,
//   getApplicantCount,
//   checkUserApplied,
// };

// export default applicationService;
