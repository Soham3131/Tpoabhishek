// import React, { useEffect, useState } from 'react';
// import axiosInstance from '../utils/axios';
// import { useAuth } from '../context/AuthContext';
// import { LinkIcon } from '@heroicons/react/24/solid';
// import { useNavigate } from 'react-router-dom';

// const MyApplicationsPage = () => {
//     const { user, isLoggedIn } = useAuth();
//     const navigate = useNavigate();
//     const [applications, setApplications] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchApplications = async () => {
//             if (!isLoggedIn) {
//                 navigate('/login');
//                 return;
//             }
//             setLoading(true);
//             setError(null);
//             try {
//                 const res = await axiosInstance.get('/api/applications/my');
//                 setApplications(res.data);
//             } catch (err) {
//                 console.error("Error fetching user applications:", err);
//                 setError(err.response?.data?.msg || "Failed to load your applications.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchApplications();
//     }, [isLoggedIn, navigate]);

//     if (!isLoggedIn && !loading) {
//         return <div className="container mx-auto px-6 py-8 text-center text-lg">Redirecting to login...</div>;
//     }

//     if (loading) {
//         return <div className="container mx-auto px-6 py-8 text-center text-lg">Loading your applications...</div>;
//     }

//     if (error) {
//         return <div className="container mx-auto px-6 py-8 text-center text-red-600 text-lg">{error}</div>;
//     }

//     if (applications.length === 0) {
//         return <div className="container mx-auto px-6 py-8 text-center text-gray-600">You haven't applied for any opportunities yet.</div>;
//     }

//     return (
//         <div className="container mx-auto px-6 py-8">
//             <h1 className="text-3xl font-bold text-primary mb-6">My Applications</h1>

//             <div className="space-y-6">
//                 {applications.map(app => (
//                     <div key={app._id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
//                         <h2 className="text-xl font-semibold capitalize text-secondary mb-2">
//                             {/* Display the title from contentDetails if available, fallback to content type */}
//                             {app.contentDetails?.title || app.contentDetails?.companyName || app.contentDetails?.organization || `${app.contentType} Application`}
//                         </h2>
//                         {app.contentDetails?.company && (
//                             <p className="text-gray-700 mb-1">Company: {app.contentDetails.company}</p>
//                         )}
//                         {app.contentDetails?.organization && (
//                             <p className="text-gray-700 mb-1">Organization: {app.contentDetails.organization}</p>
//                         )}
//                         {app.contentDetails?.location && (
//                             <p className="text-gray-700 mb-1">Location: {app.contentDetails.location}</p>
//                         )}
//                         {app.contentDetails?.organizer && (
//                             <p className="text-gray-700 mb-1">Organizer: {app.contentDetails.organizer}</p>
//                         )}
//                         {app.contentDetails?.provider && (
//                             <p className="text-gray-700 mb-1">Provider: {app.contentDetails.provider}</p>
//                         )}
//                         <p className="text-gray-700 mb-1">Applied on: {new Date(app.appliedAt).toLocaleDateString()}</p>
//                         {app.appliedLink && (
//                             <a
//                                 href={app.appliedLink}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="inline-flex items-center text-blue-600 hover:underline text-sm mt-2"
//                             >
//                                 <LinkIcon className="w-4 h-4 mr-1" /> View Original Link
//                             </a>
//                         )}
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default MyApplicationsPage;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import axiosInstance from '../utils/axios'; 
import { useAuth } from '../context/AuthContext';
import { DocumentTextIcon, LinkIcon } from '@heroicons/react/24/outline'; // Outline icons for a lighter look

const MyApplicationsPage = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define the color scheme
  const primaryNavyBlue = "text-[#1E3A5F]";
  const secondarySteelBlue = "text-[#4A789C]";
  const accentOrange = "text-[#FF6B35]";
  const lightGrayBackground = "bg-[#F5F7FA]";
  const darkGrayText = "text-[#2D3436]";
  const cardBackground = "bg-white";

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user) {
        setLoading(false);
        setError("Please log in to view your applications.");
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get('/api/applications/my', {
          withCredentials: true, // Important for sending cookies/auth token
        });
        setApplications(response.data);
      } catch (err) {
        console.error("Error fetching my applications:", err);
        setError(err.response?.data?.msg || "Failed to load your applications.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user]);

  if (loading) {
    return (
      <div className={`min-h-screen p-8 flex items-center justify-center ${lightGrayBackground}`}>
        <div className="flex items-center text-lg font-medium text-gray-700">
          <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.03 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading your applications...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen p-8 flex items-center justify-center ${lightGrayBackground}`}>
        <div className="text-red-600 font-semibold text-center p-6 rounded-lg shadow-md bg-white">
          <p>{error}</p>
          <p className="mt-2 text-sm text-gray-500">Please try again later or contact support.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-8 ${lightGrayBackground}`}>
      <div className="max-w-4xl mx-auto">
        <h1 className={`text-4xl font-extrabold mb-8 ${primaryNavyBlue} text-center animate-fade-in-up`}>
          My Applications
        </h1>

        {applications.length === 0 ? (
          <div className={`text-center p-10 rounded-xl shadow-lg ${cardBackground} border border-gray-200 animate-zoom-in`}>
            <DocumentTextIcon className={`w-20 h-20 mx-auto mb-4 text-gray-400`} />
            <p className={`text-xl font-semibold ${darkGrayText}`}>No applications found yet.</p>
            <p className="text-gray-500 mt-2">Start exploring opportunities and apply to track them here!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {applications.map((app) => (
              <div
                key={app._id}
                className={`p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ${cardBackground} border border-gray-200 animate-slide-in-bottom`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full capitalize ${app.contentType === 'job' ? 'bg-indigo-100 text-indigo-800' :
                      app.contentType === 'internship' ? 'bg-teal-100 text-teal-800' :
                      app.contentType === 'seminar' ? 'bg-purple-100 text-purple-800' :
                      app.contentType === 'workshop' ? 'bg-pink-100 text-pink-800' :
                      app.contentType === 'visit' ? 'bg-orange-100 text-orange-800' :
                      app.contentType === 'jobfair' ? 'bg-green-100 text-green-800' :
                      app.contentType === 'training' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {app.contentType}
                    </span>
                    <h2 className={`text-xl font-bold mt-2 ${primaryNavyBlue}`}>
                      {app.contentDetails?.title || app.contentDetails?.companyName || app.contentDetails?.organization || 'N/A'}
                    </h2>
                    <p className={`text-sm ${secondarySteelBlue}`}>
                      {app.contentDetails?.company || app.contentDetails?.organizer || app.contentDetails?.provider || 'N/A'}
                      {app.contentDetails?.location && ` - ${app.contentDetails.location}`}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm text-gray-500">Applied On:</p>
                    <p className={`text-base font-medium ${darkGrayText}`}>
                      {new Date(app.appliedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                
                <p className={`text-sm ${darkGrayText} mb-4`}>
                  {app.contentDetails?.description?.substring(0, 150) || "No description available."}
                  {app.contentDetails?.description?.length > 150 && '...'}
                </p>

                <div className="flex items-center space-x-4 border-t pt-4 border-gray-100">
                  <a
                    href={app.appliedLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center ${accentOrange} hover:underline font-medium transition-colors duration-200`}
                  >
                    <LinkIcon className="w-5 h-5 mr-1" />
                    View Application Link
                  </a>
                  {/* Optional: Add a link to the content detail page if available */}
                  {app.contentId && app.contentType && (
                     <a
                       href={`/${app.contentType}s/details/${app.contentId}`}
                       target="_blank"
                       rel="noopener noreferrer"
                       className={`flex items-center ${secondarySteelBlue} hover:underline font-medium transition-colors duration-200`}
                     >
                       <DocumentTextIcon className="w-5 h-5 mr-1" />
                       View Details
                     </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes zoomIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes slideInBottom {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
        .animate-zoom-in { animation: zoomIn 0.5s ease-out forwards; }
        .animate-slide-in-bottom { animation: slideInBottom 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default MyApplicationsPage;
