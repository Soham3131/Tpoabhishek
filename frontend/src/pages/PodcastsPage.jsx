// frontend/src/pages/PodcastsPage.jsx
import React, { useMemo } from 'react';
import ContentListingsPage from '../components/ContentListingsPage';
import { PlayCircleIcon, TrashIcon, MicrophoneIcon, CalendarDaysIcon, ClockIcon, EyeIcon } from '@heroicons/react/24/solid'; // Added EyeIcon
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const PodcastsPage = () => {
    // Memoize the hero text specific to Podcasts
    const getPodcastHeroText = useMemo(() => {
        return {
            main: "Listen & Learn: HR Podcasts",
            sub: "Tune into insightful discussions with HR experts and industry leaders."
        };
    }, []);

    // Override the default rendering of items for podcasts
    const renderPodcastItem = (item, index, handleDelete, user, detailPageBasePath) => (
        <div
            key={item._id}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col justify-between border border-gray-100 animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }} // Staggered animation for list items
        >
            <div>
                {item.imageUrl && (
                    <div className="mb-4 aspect-video overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                        <img
                            src={item.imageUrl}
                            alt={item.title || "Podcast Image"}
                            className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500 ease-in-out" // Subtle zoom on image hover
                        />
                    </div>
                )}
                <h2 className="text-xl font-bold text-[#1E3A5F] mb-2">{item.title}</h2>

                {item.speaker && (
                    <p className="text-gray-600 text-sm mb-1 flex items-center">
                        <MicrophoneIcon className="w-4 h-4 mr-1 text-[#4A789C]" />
                        <span className="font-semibold">Speaker:</span> {item.speaker}
                    </p>
                )}
                {item.duration && (
                    <p className="text-gray-600 text-sm mb-1 flex items-center">
                        <ClockIcon className="w-4 h-4 mr-1 text-[#4A789C]" />
                        Duration: {item.duration}
                    </p>
                )}
                {item.releaseDate && (
                    <p className="text-gray-600 text-sm mb-3 flex items-center">
                        <CalendarDaysIcon className="w-4 h-4 mr-1 text-[#4A789C]" />
                        Released: {new Date(item.releaseDate).toLocaleDateString()}
                    </p>
                )}

                {item.description && (
                    <div className="text-[#2D3436] text-sm mt-3">
                        <p className="leading-relaxed">
                            {item.description.substring(0, 120)}
                            {item.description.length > 120 && '...'}
                        </p>
                    </div>
                )}
            </div>

            <div className="mt-5 flex flex-wrap gap-3 justify-end">
                {/* CHANGED: From <a> to <Link> and text to "View Details" */}
                <Link
                    to={`${detailPageBasePath}/${item._id}`} // This will link to /podcasts/details/:id
                    className="bg-[#FF6B35] hover:bg-orange-600 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center group"
                >
                    <EyeIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" /> View Details
                </Link>

                {user && user.role === 'admin' && (
                    <button
                        onClick={() => handleDelete(item._id, item.title)}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center group"
                    >
                        <TrashIcon className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" /> Delete
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <ContentListingsPage
            title="Podcast"
            endpoint="/api/podcasts"
            deleteEndpoint="/api/podcasts"
            detailPageBasePath="/podcasts/details" // This is correctly set, and now the Link will use it
            getHeroText={getPodcastHeroText}
            renderItem={renderPodcastItem}
            disableLocationFilter={true}
        />
    );
};

export default PodcastsPage;