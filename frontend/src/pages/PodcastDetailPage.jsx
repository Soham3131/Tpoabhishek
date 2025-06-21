// frontend/src/pages/PodcastDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import { PlayCircleIcon, InformationCircleIcon, MicrophoneIcon, CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/solid';

const PodcastDetailPage = () => {
    const { id } = useParams();
    const [podcast, setPodcast] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPodcast = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await axiosInstance.get(`/api/podcasts/${id}`);
                setPodcast(res.data);
            } catch (err) {
                console.error("Error fetching podcast details:", err);
                setError(err.response?.data?.msg || "Failed to load podcast details.");
            } finally {
                setLoading(false);
            }
        };
        fetchPodcast();
    }, [id]);

    // Helper to extract YouTube video ID
    const getYouTubeVideoId = (url) => {
        if (!url) return null;
        // Regex for various YouTube URL formats
        const regExp = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(regExp);
        return (match && match[1]) ? match[1] : null;
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] text-[#2D3436] p-8">Loading podcast details...</div>;
    }

    if (error) {
        return <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] text-red-600 p-8">{error}</div>;
    }

    if (!podcast) {
        return <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] text-[#2D3436] p-8">Podcast not found.</div>;
    }

    const youtubeVideoId = getYouTubeVideoId(podcast.youtubeLink);

    return (
        <div className="min-h-screen bg-[#F5F7FA] text-[#2D3436] pb-12">
            {/* Hero Section */}
            <div className="relative w-full bg-gradient-to-br from-[#1E3A5F] to-[#4A789C] text-white py-16 px-4 sm:px-6 lg:px-8 shadow-lg overflow-hidden">
                <div className="absolute inset-0 bg-pattern opacity-10 animate-pulse-slow"></div>
                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 animate-fade-in-up">
                        {podcast.title}
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-200 mb-8 animate-fade-in-up animation-delay-200">
                        {podcast.speaker ? `An insightful discussion with ${podcast.speaker}.` : "An insightful discussion from the world of HR."}
                    </p>
                </div>
            </div>

            {/* Main Content Section */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
                <div className="bg-white rounded-xl shadow-xl p-8 lg:p-10 border border-gray-100 flex flex-col md:flex-row items-center md:items-start gap-8">
                    {podcast.imageUrl && (
                        <div className="flex-shrink-0 w-full md:w-1/2 lg:w-2/5 aspect-video overflow-hidden rounded-lg shadow-md border border-gray-200">
                            <img
                                src={podcast.imageUrl}
                                alt={podcast.title || "Podcast Cover"}
                                className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                    )}

                    <div className="flex-grow text-center md:text-left">
                        <h2 className="text-3xl font-bold text-[#1E3A5F] mb-4">{podcast.title}</h2>

                        {podcast.speaker && (
                            <p className="text-gray-700 text-lg mb-2 flex items-center justify-center md:justify-start">
                                <MicrophoneIcon className="w-5 h-5 mr-2 text-[#4A789C]" />
                                Speaker: <span className="font-semibold ml-1">{podcast.speaker}</span>
                            </p>
                        )}
                        {podcast.duration && (
                             <p className="text-gray-700 text-lg mb-2 flex items-center justify-center md:justify-start">
                                <ClockIcon className="w-5 h-5 mr-2 text-[#4A789C]" />
                                Duration: <span className="ml-1">{podcast.duration}</span>
                            </p>
                        )}
                        {podcast.releaseDate && (
                            <p className="text-gray-700 text-lg mb-4 flex items-center justify-center md:justify-start">
                                <CalendarDaysIcon className="w-5 h-5 mr-2 text-[#4A789C]" />
                                Released: <span className="ml-1">{new Date(podcast.releaseDate).toLocaleDateString()}</span>
                            </p>
                        )}

                        {podcast.description && (
                            <div className="mt-4">
                                <h3 className="text-xl font-bold text-[#1E3A5F] mb-2 flex items-center justify-center md:justify-start">
                                    <InformationCircleIcon className="w-6 h-6 mr-2 text-[#4A789C]" /> Description:
                                </h3>
                                <p className="text-[#2D3436] leading-relaxed whitespace-pre-line text-lg">{podcast.description}</p>
                            </div>
                        )}

                        {/* Embedded YouTube Player on Detail Page */}
                        {youtubeVideoId && (
                            <div className="mt-8 text-center md:text-left">
                                <h3 className="text-xl font-bold text-[#1E3A5F] mb-4 flex items-center justify-center md:justify-start">
                                    <PlayCircleIcon className="w-6 h-6 mr-2 text-[#FF6B35]" /> Watch Podcast:
                                </h3>
                                <div className="w-full max-w-2xl mx-auto md:mx-0 aspect-video rounded-lg overflow-hidden shadow-xl border-4 border-[#FF6B35] transition-all duration-300 hover:scale-[1.01]">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={`https://www.youtube.com/embed/${youtubeVideoId}`} // Corrected YouTube embed URL protocol and path
                                        title={`${podcast.title} - YouTube video player`}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        referrerPolicy="strict-origin-when-cross-origin"
                                        allowFullScreen
                                        className="w-full h-full"
                                    ></iframe>
                                </div>
                                <a
                                    href={podcast.youtubeLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-6 inline-flex bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg items-center justify-center transform hover:scale-105 transition-all duration-300"
                                >
                                    <PlayCircleIcon className="w-6 h-6 mr-3" /> Open in YouTube
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Custom Tailwind CSS animations (same as ContentDetailPage) */}
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

export default PodcastDetailPage;