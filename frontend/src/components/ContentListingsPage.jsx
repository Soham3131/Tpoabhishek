

import React, { useEffect, useState, useMemo } from 'react';
import axiosInstance from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { TrashIcon, MagnifyingGlassIcon, CalendarIcon, BriefcaseIcon, MapPinIcon, PlayCircleIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';

const ContentListingsPage = ({
    title,
    endpoint,
    deleteEndpoint,
    detailPageBasePath,
    getHeroText: customHeroText, // Renamed to avoid conflict with local function
    renderItem,
    disableLocationFilter = false // <-- CORRECTED: Added as a prop with a default value
}) => {
    const { user } = useAuth();
    const [content, setContent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [locationFilter, setLocationFilter] = useState('');

    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
    const [debouncedLocationFilter, setDebouncedLocationFilter] = useState(locationFilter);

    // No need for a separate contentType variable if title.toLowerCase() is sufficient
    // const contentType = title.toLowerCase(); // This was the problematic line

    const MAX_DESCRIPTION_LENGTH = 100;

    // Debounce effects
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedLocationFilter(locationFilter);
        }, 500);
        return () => clearTimeout(handler);
    }, [locationFilter]);

    // Function to determine dynamic hero text (now accepts customHeroText prop)
    const heroText = useMemo(() => {
        if (customHeroText) return customHeroText; // Use custom text if provided

        switch (title) {
            case "Job":
                return {
                    main: "Find Your Dream Job Here",
                    sub: "Explore opportunities from top companies and kickstart your career."
                };
            case "Internship":
                return {
                    main: "Unlock Your Potential with Internships",
                    sub: "Gain invaluable experience in your field of study."
                };
            case "Seminar":
                return {
                    main: "Expand Your Knowledge, Attend a Seminar",
                    sub: "Engage with experts and delve into new topics."
                };
            case "Training":
                return {
                    main: "Sharpen Your Skills, Enroll in a Training",
                    sub: "Master new techniques with our certified training programs."
                };
            case "Visit":
                return {
                    main: "Explore Industries, Join an Industrial Visit",
                    sub: "Get a firsthand look at leading organizations and their operations."
                };
            case "Job Fair":
                return {
                    main: "Connect with Employers, Find Your Next Opportunity",
                    sub: "Meet recruiters and discover exciting career paths."
                };
            case "Workshop":
                return {
                    main: "Learn by Doing, Master New Techniques",
                    sub: "Hands-on experience to enhance your practical skills."
                };
            case "Podcast": // Add Podcast case for default hero text if not custom
                return {
                    main: "Listen & Learn: HR Podcasts",
                    sub: "Tune into insightful discussions with HR experts and industry leaders."
                };
                 case "Corporate Event":
    return {
      main: "Join the Next Big Corporate Event",
      sub: "Connect with industry leaders, learn from experts, and expand your professional network."
    }
            default:
                return {
                    main: `Explore ${title} Opportunities`,
                    sub: "Discover the best opportunities tailored for you."
                };
                
        }
    }, [title, customHeroText]);

    const fetchContent = async () => {
        setLoading(true);
        setError(null);
        setMessage(null);
        try {
            const params = {};
            if (debouncedSearchTerm) {
                params.search = debouncedSearchTerm;
            }
            // Only apply location filter if not disabled
            if (debouncedLocationFilter && !disableLocationFilter) { // <-- CORRECTED: Directly use the prop
                params.location = debouncedLocationFilter;
            }

            const res = await axiosInstance.get(endpoint, { params });
            setContent(res.data);
        } catch (err) {
            console.error(`Error fetching ${title.toLowerCase()}:`, err);
            setError(err.response?.data?.msg || `Failed to load ${title.toLowerCase()}.`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContent();
    }, [endpoint, debouncedSearchTerm, debouncedLocationFilter, disableLocationFilter]); // Added disableLocationFilter to dependencies

    const handleDelete = async (itemId, itemName) => {
        if (!user || user.role !== 'admin') {
            alert("You are not authorized to delete this item.");
            return;
        }
        if (!window.confirm(`Are you sure you want to delete '${itemName}'? This action cannot be undone.`)) {
            return;
        }

        setLoading(true);
        setError(null);
        setMessage(null);
        try {
            await axiosInstance.delete(`${deleteEndpoint}/${itemId}`);
            setMessage(`'${itemName}' deleted successfully!`);
            fetchContent();
        } catch (err) {
            console.error(`Error deleting ${title.toLowerCase()}:`, err);
            setError(err.response?.data?.msg || `Failed to delete '${itemName}'.`);
        } finally {
            setLoading(false);
        }
    };

    const themeColors = {
        primary: '#1E3A5F',       // Navy Blue
        secondary: '#4A789C',     // Steel Blue
        accent: '#FF6B35',        // Orange
        background: '#F5F7FA',    // Light Gray
        text: '#2D3436',          // Dark Gray
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] text-[#2D3436] p-8">Loading {title.toLowerCase()}...</div>;
    }

    if (error) {
        return <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] text-red-600 p-8">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-[#F5F7FA]">
            {/* Hero Section */}
            <div className="relative w-full bg-gradient-to-br from-[#1E3A5F] to-[#4A789C] text-white py-16 px-4 sm:px-6 lg:px-8 shadow-lg overflow-hidden">
                <div className="absolute inset-0 bg-pattern opacity-10 animate-pulse-slow"></div>

                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 animate-fade-in-up">
                        {heroText.main}
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-200 mb-8 animate-fade-in-up animation-delay-200">
                        {heroText.sub}
                    </p>

                    {/* Search and Filter Bar within Hero */}
                    <div className="bg-white rounded-xl shadow-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-up animation-delay-400">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Keywords (e.g., HR, Recruitment)"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#4A789C] focus:border-transparent transition-all duration-200 text-[#2D3436]"
                            />
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>
                        {/* Conditional rendering for Location Filter */}
                        {!disableLocationFilter && (
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Location (e.g., New Delhi, New York)"
                                    value={locationFilter}
                                    onChange={(e) => setLocationFilter(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#4A789C] focus:border-transparent transition-all duration-200 text-[#2D3436]"
                                />
                                <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            </div>
                        )}
                        {/* Clear Filters Button (now spans 1 or 2 columns based on location filter presence) */}
                        <button
                            onClick={() => { setSearchTerm(''); setLocationFilter(''); }}
                            className={`mt-4 w-full bg-gray-200 hover:bg-gray-300 text-[#2D3436] font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out shadow-md hover:shadow-lg ${disableLocationFilter ? 'col-span-full' : 'md:col-span-2'}`}
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Listings Section */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {message && <p className="text-green-600 text-sm mb-6 text-center animate-fade-in">{message}</p>}

                {!content.length && !loading ? (
                    <div className="text-lg text-[#2D3436] text-center p-10 bg-white rounded-lg shadow-md">
                        No {title.toLowerCase()} found matching your criteria. Try adjusting your filters!
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {content.map((item, index) => (
                            // Use the renderItem prop if provided, otherwise fallback to default rendering
                            renderItem ? renderItem(item, index, handleDelete, user, detailPageBasePath) : (
                                <div
                                    key={item._id}
                                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col justify-between border border-gray-100 animate-fade-in"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <div>
                                        <h2 className="text-xl font-bold text-[#1E3A5F] mb-3">{item.title || item.companyName || item.organization}</h2>
                                        {item.company && <p className="text-[#2D3436] text-sm mb-1 flex items-center"><BriefcaseIcon className="w-4 h-4 mr-2 text-[#4A789C]" /> <strong>Company:</strong> {item.company}</p>}
                                        {item.organization && <p className="text-[#2D3436] text-sm mb-1 flex items-center"><BriefcaseIcon className="w-4 h-4 mr-2 text-[#4A789C]" /> <strong>Organization:</strong> {item.organization}</p>}
                                        {item.location && <p className="text-[#2D3436] text-sm mb-1 flex items-center"><MapPinIcon className="w-4 h-4 mr-2 text-[#4A789C]" /> <strong>Location:</strong> {item.location}</p>}

                                        {item.stipend && <p className="text-[#2D3436] text-sm mb-1"><strong>Stipend:</strong> {item.stipend}</p>}
                                        {item.salary && <p className="text-[#2D3436] text-sm mb-1"><strong>Salary:</strong> {item.salary}</p>}
                                        {item.duration && <p className="text-[#2D3436] text-sm mb-1"><strong>Duration:</strong> {item.duration}</p>}
                                        {item.organizer && <p className="text-[#2D3436] text-sm mb-1"><strong>Organizer:</strong> {item.organizer}</p>}
                                        {item.provider && <p className="text-[#2D3436] text-sm mb-1"><strong>Provider:</strong> {item.provider}</p>}
                                        {item.contactPerson && <p className="text-[#2D3436] text-sm mb-1"><strong>Contact:</strong> {item.contactPerson}</p>}

                                        {item.date && <p className="text-[#2D3436] text-sm mb-1 flex items-center"><CalendarIcon className="w-4 h-4 mr-2 text-[#4A789C]" /> <strong>Date:</strong> {new Date(item.date).toLocaleDateString()}</p>}
                                        {item.startDate && <p className="text-[#2D3436] text-sm mb-1 flex items-center"><CalendarIcon className="w-4 h-4 mr-2 text-[#4A789C]" /> <strong>Start Date:</strong> {new Date(item.startDate).toLocaleDateString()}</p>}
                                        {item.endDate && <p className="text-[#2D3436] text-sm mb-1 flex items-center"><CalendarIcon className="w-4 h-4 mr-2 text-[#4A789C]" /> <strong>End Date:</strong> {new Date(item.endDate).toLocaleDateString()}</p>}
                                        {item.time && <p className="text-[#2D3436] text-sm mb-1"><strong>Time:</strong> {item.time}</p>}
                                        {item.deadline && <p className="text-[#2D3436] text-sm mb-1 flex items-center"><CalendarIcon className="w-4 h-4 mr-2 text-[#4A789C]" /> <strong>Deadline:</strong> {new Date(item.deadline).toLocaleDateString()}</p>}

                                        {item.requirements && item.requirements.length > 0 && (
                                            <p className="text-[#2D3436] text-sm mb-1"><strong>Requirements:</strong> {item.requirements.join(', ')}</p>
                                        )}
                                        {item.participatingCompanies && item.participatingCompanies.length > 0 && (
                                            <p className="text-[#2D3436] text-sm mb-1"><strong>Companies:</strong> {item.participatingCompanies.join(', ')}</p>
                                        )}

                                        {item.description && (
                                            <div className="text-[#2D3436] text-sm mt-3">
                                                <p className="leading-relaxed">
                                                    {item.description.substring(0, MAX_DESCRIPTION_LENGTH)}
                                                    {item.description.length > MAX_DESCRIPTION_LENGTH && '...'}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-5 flex flex-wrap gap-3 justify-end">
                                        {detailPageBasePath && (
                                            <Link
                                                to={`${detailPageBasePath}/${item._id}`}
                                                className="bg-[#FF6B35] hover:bg-orange-600 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
                                            >
                                                More Details
                                            </Link>
                                        )}

                                        {user && user.role === 'admin' && (
                                            <button
                                                onClick={() => handleDelete(item._id, item.title || item.companyName || item.organization)}
                                                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
                                            >
                                                <TrashIcon className="w-4 h-4 mr-2" /> Delete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                )}
            </div>
            {/* Add custom Tailwind CSS animations */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fadeIn 0.6s ease-out forwards;
                }

                @keyframes fadeInTop {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fadeInTop 0.8s ease-out forwards;
                }
                .animation-delay-200 { animation-delay: 0.2s; }
                .animation-delay-400 { animation-delay: 0.4s; }

                @keyframes pulseSlow {
                    0% { transform: scale(1); opacity: 0.1; }
                    50% { transform: scale(1.05); opacity: 0.15; }
                    100% { transform: scale(1); opacity: 0.1; }
                }
                .animate-pulse-slow {
                    animation: pulseSlow 4s infinite ease-in-out;
                }

                /* Basic pattern for hero background */
                .bg-pattern {
                    background-image: radial-gradient(#4A789C 1px, transparent 1px), radial-gradient(#4A789C 1px, transparent 1px);
                    background-size: 20px 20px;
                    background-position: 0 0, 10px 10px;
                }
            `}</style>
        </div>
    );
};

export default ContentListingsPage;