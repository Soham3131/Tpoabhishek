
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import PostContentModal from '../components/PostContentModal';
import { PlusIcon, UsersIcon, DocumentTextIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { logoutUser } from '../services/authService';

const AdminDashboard = () => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [contentTypeToPost, setContentTypeToPost] = useState('');
    const [totalApplications, setTotalApplications] = useState(null);
    const [applicationsLoading, setApplicationsLoading] = useState(true);
    const [applicationsError, setApplicationsError] = useState(null);

    const primaryNavyBlue = "text-[#1E3A5F]";
    const secondarySteelBlue = "text-[#4A789C]";
    const accentOrange = "text-[#FF6B35]";
    const lightGrayBackground = "bg-[#F5F7FA]";
    const darkGrayText = "text-[#2D3436]";
    const cardBackground = "bg-white";

    const handleAuthError = (err) => {
        if (err.response && err.response.status === 401) {
            console.error("Authentication error detected. Logging out...");
            logoutUser();
            setUser(null);
            navigate('/login');
            return true;
        }
        return false;
    };

    useEffect(() => {
        const fetchAdminData = async () => {
            if (!user || user.role !== 'admin') {
                setError("You are not authorized to view this dashboard.");
                setLoading(false);
                return;
            }

            try {
                const res = await axiosInstance.get("/api/admin/dashboard-data");
                setDashboardData(res.data);
            } catch (err) {
                if (!handleAuthError(err)) {
                    console.error("Error fetching admin dashboard data:", err);
                    setError(err.response?.data?.msg || "Failed to load admin dashboard data.");
                }
            } finally {
                setLoading(false);
            }
        };

        const fetchApplicationStats = async () => {
            setApplicationsLoading(true);
            setApplicationsError(null);
            try {
                const res = await axiosInstance.get("/api/applications/all");
                setTotalApplications(res.data.length);
            } catch (err) {
                if (!handleAuthError(err)) {
                    console.error("Error fetching application stats:", err);
                    setApplicationsError(err.response?.data?.msg || "Failed to load application stats.");
                }
            } finally {
                setApplicationsLoading(false);
            }
        };

        fetchAdminData();
        fetchApplicationStats();
    }, [user, navigate, setUser]);

    const handlePostNew = (type) => {
        setContentTypeToPost(type);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setContentTypeToPost('');
    };

    const handleViewAllUsers = () => {
        navigate('/admin/users');
    };

    const handleViewApplications = () => {
        navigate('/admin/applications');
    };

    if (loading || applicationsLoading) {
        return (
            <div className={`min-h-screen p-8 flex items-center justify-center ${lightGrayBackground}`}>
                <div className="flex items-center text-lg font-medium text-gray-700">
                    <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.03 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading Admin Dashboard...
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
            <div className="max-w-6xl mx-auto">
                <h1 className={`text-5xl font-extrabold mb-4 ${primaryNavyBlue} text-center animate-fade-in-up`}>
                    Admin Dashboard
                </h1>
                {user && <p className={`text-xl mb-10 ${secondarySteelBlue} text-center animate-fade-in-up delay-100`}>Welcome, <span className="font-semibold">{user.name}</span>! Ready to manage?</p>}

                {dashboardData ? (
                    <>
                        {/* Stats Cards Section */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                            <div
                                className={`p-8 rounded-xl shadow-lg border border-gray-200 cursor-pointer 
                                    transform transition-all duration-300 hover:scale-103 hover:shadow-xl 
                                    flex flex-col items-center justify-center text-center ${cardBackground} animate-zoom-in`}
                                onClick={handleViewAllUsers}
                            >
                                <UsersIcon className={`w-16 h-16 ${accentOrange} mb-4 animate-bounce-icon`} />
                                <h2 className={`text-2xl font-bold ${darkGrayText} mb-2`}>Total Users</h2>
                                <p className={`text-5xl font-extrabold ${primaryNavyBlue}`}>{dashboardData.stats.totalUsers}</p>
                                <p className={`text-sm text-gray-500 mt-2 ${secondarySteelBlue}`}>Click to view all users</p>
                            </div>

                            <div className={`p-8 rounded-xl shadow-lg border border-gray-200 
                                    transform transition-all duration-300 hover:scale-103 hover:shadow-xl 
                                    flex flex-col items-center justify-center text-center ${cardBackground} animate-zoom-in delay-100`}>
                                <DocumentTextIcon className="w-16 h-16 text-green-500 mb-4 animate-bounce-icon" />
                                <h2 className={`text-2xl font-bold ${darkGrayText} mb-2`}>Verified Users</h2>
                                <p className="text-5xl font-extrabold text-green-600">{dashboardData.stats.verifiedUsers}</p>
                                <p className={`text-sm text-gray-500 mt-2 ${secondarySteelBlue}`}>Accounts verified by admin</p>
                            </div>

                            <div className={`p-8 rounded-xl shadow-lg border border-gray-200 
                                    transform transition-all duration-300 hover:scale-103 hover:shadow-xl 
                                    flex flex-col items-center justify-center text-center ${cardBackground} animate-zoom-in delay-200`}>
                                <DocumentTextIcon className="w-16 h-16 text-orange-500 mb-4 animate-bounce-icon" />
                                <h2 className={`text-2xl font-bold ${darkGrayText} mb-2`}>Pending Verification</h2>
                                <p className="text-5xl font-extrabold text-orange-500">{dashboardData.stats.pendingVerifications}</p>
                                <p className={`text-sm text-gray-500 mt-2 ${secondarySteelBlue}`}>Awaiting your approval</p>
                            </div>

                            <div
                                className={`p-8 rounded-xl shadow-lg border border-gray-200 cursor-pointer 
                                    transform transition-all duration-300 hover:scale-103 hover:shadow-xl 
                                    flex flex-col items-center justify-center text-center ${cardBackground} animate-zoom-in delay-300`}
                                onClick={handleViewApplications}
                            >
                                <ChartBarIcon className="w-16 h-16 text-purple-600 mb-4 animate-bounce-icon" />
                                <h2 className={`text-2xl font-bold ${darkGrayText} mb-2`}>Total Applications</h2>
                                {applicationsLoading ? (
                                    <p className={`text-xl ${secondarySteelBlue}`}>Loading...</p>
                                ) : applicationsError ? (
                                    <p className="text-sm text-red-500">{applicationsError}</p>
                                ) : (
                                    <p className="text-5xl font-extrabold text-purple-600">{totalApplications}</p>
                                )}
                                <p className={`text-sm text-gray-500 mt-2 ${secondarySteelBlue}`}>Click for detailed report</p>
                            </div>
                        </div>

                        {/* Content Posting Section (Admin Only) */}
                        {user && user.role === 'admin' && (
                            <div className="mb-8 p-8 bg-white rounded-xl shadow-lg border border-gray-200 animate-fade-in-up delay-400">
                                <h2 className={`text-3xl font-bold ${primaryNavyBlue} mb-6 border-b-2 border-accentOrange pb-3`}>Post New Content</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {[
                                        { label: "Job", type: "job", endpoint: "/api/placements/create" },
                                        { label: "Internship", type: "internship", endpoint: "/api/internships/create" },
                                        { label: "Seminar", type: "seminar", endpoint: "/api/seminars/create" },
                                        { label: "Training", type: "training", endpoint: "/api/trainings/create" },
                                        { label: "Visit", type: "visit", endpoint: "/api/visits/create" },
                                        { label: "Job Fair", type: "jobfair", endpoint: "/api/jobfairs/create" },
                                        { label: "Workshop", type: "workshop", endpoint: "/api/workshops/create" },
                                        { label: "Podcast", type: "podcast", endpoint: "/api/podcasts/create" },
                                        { label: "Corporate Event", type: "corporate-event", endpoint: "/api/corporate-events/create" }, // <-- ADDED THIS
                                    ].map((item, index) => (
                                        <button
                                            key={item.type}
                                            onClick={() => handlePostNew(item.type)}
                                            className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg shadow-md 
                                                flex items-center justify-center transition-all duration-300 transform 
                                                hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75
                                                animate-slide-in-bottom delay-${500 + index * 70}`}
                                        >
                                            <PlusIcon className="w-6 h-6 mr-2" /> Post {item.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Modal for Posting Content */}
                        {isModalOpen && (
                            <PostContentModal
                                contentType={contentTypeToPost}
                                onClose={handleModalClose}
                            />
                        )}

                    </>
                ) : (
                    <div className={`text-center p-10 rounded-xl shadow-lg ${cardBackground} border border-gray-200 animate-zoom-in`}>
                        <DocumentTextIcon className={`w-20 h-20 mx-auto mb-4 ${secondarySteelBlue}`} />
                        <p className={`text-xl font-semibold ${darkGrayText}`}>No dashboard data available.</p>
                        <p className="text-gray-500 mt-2">Please ensure you are logged in as an administrator and the backend is running.</p>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes zoomIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                @keyframes slideInBottom { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes bounceIcon { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
                .animate-fade-in-up { animation: fadeInUp 0.7s ease-out forwards; }
                .animate-zoom-in { animation: zoomIn 0.6s ease-out forwards; }
                .animate-slide-in-bottom { animation: slideInBottom 0.6s ease-out forwards; }
                .animate-bounce-icon { animation: bounceIcon 1.5s ease-in-out infinite; }
                .delay-100 { animation-delay: 0.1s; }
                .delay-200 { animation-delay: 0.2s; }
                .delay-300 { animation-delay: 0.3s; }
                .delay-400 { animation-delay: 0.4s; }
                .delay-500 { animation-delay: 0.5s; }
                .delay-570 { animation-delay: 0.57s; }
                .delay-640 { animation-delay: 0.64s; }
                .delay-710 { animation-delay: 0.71s; }
                .delay-780 { animation-delay: 0.78s; }
                .delay-850 { animation-delay: 0.85s; }
                .delay-920 { animation-delay: 0.92s; }
            `}</style>
        </div>
    );
};

export default AdminDashboard;