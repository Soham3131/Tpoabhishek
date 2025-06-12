// import React, { useState, useEffect, useRef } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { logoutUser } from "../services/authService";
// import UserProfileEditor from "../components/UserProfileEditor";
// import logo from "../assets/logo.png"; // Ensure this path is correct and logo1.png exists
// import { UserCircleIcon } from '@heroicons/react/24/solid';

// const Navbar = () => {
//   const [servicesOpen, setServicesOpen] = useState(false);
//   const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
//   const { user, setUser, isLoggedIn } = useAuth();
//   const navigate = useNavigate();
//   const profileDropdownRef = useRef(null); // Ref for profile dropdown

//   // Close dropdown on outside click
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
//         setProfileDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const handleLogout = async () => {
//     try {
//       await logoutUser();
//       setUser(null); // Clear user from context
//       navigate("/login");
//       setProfileDropdownOpen(false); // Close dropdown on logout
//     } catch (err) {
//       console.error("Logout failed:", err);
//       // Implement a custom modal/toast for messages instead of alert()
//       // For now, retaining alert as per previous pattern to avoid breaking functionality
//       alert(err.response?.data?.msg || "Logout failed"); 
//     }
//   };

//   // Determine the home link based on user role
//   const getHomeLink = () => {
//     if (isLoggedIn) {
//       if (user?.role === 'admin') {
//         return "/admin-dashboard";
//       } else if (user?.role === 'user' || user?.role === 'recruiter') {
//         return "/student-dashboard";
//       }
//     }
//     return "/"; // Default for non-logged-in users
//   };

//   // Define services items that are always present
//   let servicesItems = [
//     ["Seminars", "/seminars"],
//     ["Certified Trainings", "/trainings"],
//     ["Industrial Visits", "/visits"],
//     ["Workshops", "/workshops"],
//     ["Job Fairs", "/jobfairs"],
//   ];

//   // Add "My Applications" only if the user is logged in AND is not an admin
//   if (isLoggedIn && user?.role !== 'admin') {
//     servicesItems = [["My Applications", "/my-applications"], ...servicesItems];
//   }

//   return (
//     <nav className="h-24 bg-gradient-to-r from-[#1E3A5F] via-[#2e567e] to-[#1E3A5F] text-white shadow-3xl animate-fade-in-down relative z-50">
//       <div className="container mx-auto px-6 py-2 flex items-center justify-between h-full">
//         {/* Logo */}
//         <div className="flex-shrink-0 pl-4">
//           <Link to={getHomeLink()} className="flex items-center transform hover:scale-105 transition-transform duration-200">
//             <img src={logo} alt="Logo" className="h-20 w-auto object-contain drop-shadow-lg" />
//           </Link>
//         </div>

//         {/* Middle Nav Items */}
//         <div className="hidden md:flex flex-1 justify-center space-x-10 text-xl font-medium">
//           {[
//             { name: "Internships", link: "/internships" },
//             { name: "Jobs", link: "/jobs" },
//           ].map((item) => (
//             <Link
//               key={item.name}
//               to={item.link}
//               className="relative group text-gray-200 hover:text-[#FF6B35] transition duration-300 transform hover:scale-105 hover:font-semibold"
//             >
//               {item.name}
//               <span className="absolute left-0 -bottom-1 w-0 h-1 bg-[#FF6B35] group-hover:w-full transition-all duration-300 rounded-full"></span>
//             </Link>
//           ))}

//           <div
//             onMouseEnter={() => setServicesOpen(true)}
//             onMouseLeave={() => setServicesOpen(false)}
//             className="relative group cursor-pointer text-gray-200 hover:text-[#FF6B35] transition duration-300 transform hover:scale-105 hover:font-semibold"
//           >
//             Services ▾
//             <span className="absolute left-0 -bottom-1 w-0 h-1 bg-[#FF6B35] group-hover:w-full transition-all duration-300 rounded-full"></span>

//             {servicesOpen && (
//               <div className="absolute top-full left-0 mt-3 bg-[#4A789C] text-white shadow-xl rounded-lg w-60 z-50 animate-fade-in-up-dropdown overflow-hidden border border-[#FF6B35]">
//                 {servicesItems.map(([label, link]) => (
//                   <Link
//                     key={label}
//                     to={link}
//                     className="block px-5 py-3 hover:bg-[#FF6B35] transition text-base font-light hover:text-white"
//                     onClick={() => setServicesOpen(false)} // Close dropdown on click
//                   >
//                     {label}
//                   </Link>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Auth Buttons / Profile Icon */}
//         <div className="flex items-center space-x-6 pr-4">
//           {isLoggedIn ? (
//             <div className="relative" ref={profileDropdownRef}>
//               {/* Profile Icon */}
//               <button
//                 onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
//                 className="flex items-center justify-center w-14 h-14 rounded-full bg-[#FF6B35] text-white text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:ring-offset-2 focus:ring-offset-[#1E3A5F] overflow-hidden transform hover:scale-110 transition-transform duration-200 shadow-xl border-2 border-white"
//               >
//                 {user?.profilePicture ? (
//                   <img
//                     src={user.profilePicture}
//                     alt="Profile"
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <UserCircleIcon className="w-12 h-12 text-white" />
//                 )}
//               </button>

//               {/* Profile Dropdown Content */}
//               {profileDropdownOpen && (
//                 <div className="absolute right-0 mt-3 w-80 bg-white rounded-lg shadow-xl py-4 z-50 text-[#2D3436] animate-fade-in-up-dropdown overflow-hidden border border-[#4A789C]">
//                   <UserProfileEditor onCloseDropdown={() => { setProfileDropdownOpen(false); }} />
//                 </div>
//               )}
//             </div>
//           ) : (
//             // Signup / Login buttons if not logged in
//             <div className="flex items-center space-x-4">
//               <Link
//                 to="/signup"
//                 className="bg-[#FF6B35] text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-600 transition duration-300 shadow-lg transform hover:scale-105 ring-2 ring-transparent hover:ring-white focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:ring-offset-2"
//               >
//                 Sign Up
//               </Link>
//               <Link
//                 to="/login"
//                 className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-[#1E3A5F] transition duration-300 shadow-lg transform hover:scale-105 ring-2 ring-transparent hover:ring-[#FF6B35] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
//               >
//                 Login
//               </Link>
//             </div>
//           )}
//         </div>
//       </div>
//       {/* Custom CSS for animations and shadow */}
//       <style>{`
//         @keyframes fadeInDown {
//           from { opacity: 0; transform: translateY(-30px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .animate-fade-in-down {
//           animation: fadeInDown 0.7s ease-out forwards;
//         }

//         @keyframes fadeInUpDropdown {
//           from { opacity: 0; transform: translateY(-15px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .animate-fade-in-up-dropdown {
//           animation: fadeInUpDropdown 0.3s ease-out forwards;
//         }

//         /* Custom shadow for the navbar */
//         .shadow-3xl {
//           box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4), 0 5px 15px rgba(0, 0, 0, 0.2);
//         }
//       `}</style>
//     </nav>
//   );
// };

// export default Navbar;

import React, { useState } from 'react';
import axiosInstance from '../utils/axios';
import { XMarkIcon } from '@heroicons/react/24/solid';

const PostContentModal = ({ contentType, onClose }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const getEndpoint = () => {
    switch (contentType) {
      case 'job': return "/api/placements";
      case 'internship': return "/api/internships";
      case 'seminar': return "/api/seminars";
      case 'training': return "/api/trainings";
      case 'visit': return "/api/visits";
      case 'jobfair': return "/api/jobfairs";
      case 'workshop': return "/api/workshops";
      default: return "";
    }
  };

  const getFormFields = () => {
    switch (contentType) {
      case 'job': return [
        { name: "title", label: "Job Title", type: "text", required: true },
        { name: "company", label: "Company", type: "text", required: true },
        { name: "location", label: "Location", type: "text", required: true },
        { name: "description", label: "Description", type: "textarea", required: true },
        { name: "requirements", label: "Requirements (comma-separated)", type: "text" },
        { name: "salary", label: "Salary (optional)", type: "text" },
        { name: "deadline", label: "Application Deadline", type: "date" },
        { name: "link", label: "Apply Link (optional)", type: "url" },
      ];
      case 'internship': return [
        { name: "title", label: "Internship Title", type: "text", required: true },
        { name: "company", label: "Company", type: "text", required: true },
        { name: "location", label: "Location", type: "text", required: true },
        { name: "description", label: "Description", type: "textarea", required: true },
        { name: "stipend", label: "Stipend (optional)", type: "text" },
        { name: "duration", label: "Duration", type: "text" },
        { name: "deadline", label: "Application Deadline", type: "date" },
        { name: "link", label: "Apply Link (optional)", type: "url" },
      ];
      case 'seminar': return [
        { name: "title", label: "Seminar Title", type: "text", required: true },
        { name: "organizer", label: "Organizer", type: "text", required: true },
        { name: "date", label: "Date", type: "date", required: true },
        { name: "time", label: "Time", type: "time" },
        { name: "location", label: "Location", type: "text", required: true },
        { name: "description", label: "Description", type: "textarea" },
        { name: "link", label: "Event Link (optional)", type: "url" },
      ];
      case 'training': return [
        { name: "title", label: "Training Title", type: "text", required: true },
        { name: "provider", label: "Provider", type: "text", required: true },
        { name: "startDate", label: "Start Date", type: "date", required: true },
        { name: "endDate", label: "End Date", type: "date" },
        { name: "location", label: "Location", type: "text" },
        { name: "description", label: "Description", type: "textarea" },
        { name: "cost", label: "Cost (optional)", type: "text" },
        { name: "link", label: "Enrollment Link (optional)", type: "url" },
      ];
      case 'visit': return [
        { name: "companyName", label: "Company Name", type: "text", required: true },
        { name: "date", label: "Date of Visit", type: "date", required: true },
        { name: "purpose", label: "Purpose of Visit", type: "textarea", required: true },
        { name: "contactPerson", label: "Contact Person (optional)", type: "text" },
        { name: "location", label: "Location", type: "text" },
        { name: "link", label: "Information Link (optional)", type: "url" },
      ];
      case 'jobfair': return [
        { name: "title", label: "Job Fair Title", type: "text", required: true },
        { name: "organizer", label: "Organizer", type: "text", required: true },
        { name: "date", label: "Date", type: "date", required: true },
        { name: "location", label: "Location", type: "text", required: true },
        { name: "description", label: "Description", type: "textarea" },
        { name: "participatingCompanies", label: "Participating Companies (comma-separated)", type: "text" },
        { name: "link", label: "Event Link (optional)", type: "url" },
      ];
      case 'workshop': return [
        { name: "title", label: "Workshop Title", type: "text", required: true },
        { name: "organizer", label: "Organizer", type: "text", required: true },
        { name: "date", label: "Date", type: "date", required: true },
        { name: "time", label: "Time", type: "time" },
        { name: "location", label: "Location", type: "text", required: true },
        { name: "description", label: "Description", type: "textarea" },
        { name: "link", label: "Enrollment Link (optional)", type: "url" },
      ];
      default: return [];
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'date' && value) {
      setFormData(prev => ({ ...prev, [name]: new Date(value).toISOString() }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    const endpoint = getEndpoint();
    if (!endpoint) {
      setError("Invalid content type for posting.");
      setLoading(false);
      return;
    }

    const dataToSend = { ...formData };
    if (dataToSend.requirements)
      dataToSend.requirements = dataToSend.requirements.split(',').map(i => i.trim()).filter(Boolean);
    if (dataToSend.participatingCompanies)
      dataToSend.participatingCompanies = dataToSend.participatingCompanies.split(',').map(i => i.trim()).filter(Boolean);

    try {
      await axiosInstance.post(endpoint, dataToSend);
      setMessage(`${contentType} posted successfully!`);
      setFormData({});
      setTimeout(onClose, 1500);
    } catch (err) {
      console.error("Error posting content:", err);
      // Ensure error message is user-friendly, especially for CSRF
      if (err.response?.status === 403 && err.response?.data?.msg?.includes('CSRF token')) {
          setError('Invalid CSRF token. Please refresh the page, log in again, and try posting.');
      } else {
          setError(err.response?.data?.msg || `Failed to post ${contentType}. Please check inputs.`);
      }
    } finally {
      setLoading(false);
    }
  };

  const modalTitle = contentType.charAt(0).toUpperCase() + contentType.slice(1);
  const displayModalTitle = contentType === 'jobfair' ? 'Job Fair' : modalTitle;

  return (
    // Outer overlay: fixed, full screen, semi-transparent background, centered content
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      {/* Modal content container: white background, rounded corners, shadow */}
      {/* Added max-h-[95vh] and overflow-y-auto to ensure it scrolls if content is too long */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl p-4 md:p-6 relative my-8 max-h-[95vh] overflow-y-auto">
        {/* Close button */}
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition">
          <XMarkIcon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-primary mb-6 text-center">Post New {displayModalTitle}</h2>

        {/* Message and error displays */}
        {message && <p className="text-green-600 text-sm mb-4 text-center">{message}</p>}
        {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}

        {/* Form layout: responsive grid */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {getFormFields().map((field) => (
            <div key={field.name} className="w-full">
              <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  id={field.name}
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  required={field.required}
                  rows="3"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              ) : (
                <input
                  type={field.type}
                  id={field.name}
                  name={field.name}
                  value={field.type === 'date' && formData[field.name]
                    ? new Date(formData[field.name]).toISOString().split('T')[0]
                    : (formData[field.name] || '')
                  }
                  onChange={handleChange}
                  required={field.required}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>
          ))}

          {/* Action buttons: responsive layout */}
          <div className="md:col-span-2 flex flex-col sm:flex-row justify-end items-center gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-md transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto bg-primary hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition"
              disabled={loading}
            >
              {loading ? 'Posting...' : `Post ${displayModalTitle}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostContentModal;
