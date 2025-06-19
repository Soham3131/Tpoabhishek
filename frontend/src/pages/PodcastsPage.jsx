// frontend/src/pages/PodcastsPage.jsx
import React, { useMemo } from 'react';
import ContentListingsPage from '../components/ContentListingsPage';
import { PlayCircleIcon, TrashIcon } from '@heroicons/react/24/solid'; // Import TrashIcon here!

const PodcastsPage = () => {
  // Memoize the hero text specific to Podcasts
  const getPodcastHeroText = useMemo(() => {
    return {
      main: "Listen & Learn: HR Podcasts",
      sub: "Tune into insightful discussions with HR experts and industry leaders."
    };
  }, []);

  // Override the default rendering of items for podcasts
  // This function will be passed to ContentListingsPage and will render each podcast item
  const renderPodcastItem = (item, index, handleDelete, user, detailPageBasePath) => (
    <div
      key={item._id}
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col justify-between border border-gray-100 animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }} // Staggered animation
    >
      <div>
        {item.imageUrl && (
          <div className="mb-4 aspect-video overflow-hidden rounded-lg">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <h2 className="text-xl font-bold text-[#1E3A5F] mb-3">{item.title}</h2>
        {item.description && (
          <div className="text-[#2D3436] text-sm mt-3">
            <p className="leading-relaxed">
              {item.description.substring(0, 100)}
              {item.description.length > 100 && '...'}
            </p>
          </div>
        )}
      </div>

      <div className="mt-5 flex flex-wrap gap-3 justify-end">
        {/* Directly link to YouTube for podcasts, no "More Details" page in the traditional sense */}
        {item.youtubeLink && (
          <a
            href={item.youtubeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#FF6B35] hover:bg-orange-600 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
          >
            <PlayCircleIcon className="w-5 h-5 mr-2" /> Listen Now
          </a>
        )}

        {user && user.role === 'admin' && (
          <button
            onClick={() => handleDelete(item._id, item.title)}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
          >
            <TrashIcon className="w-4 h-4 mr-2" /> Delete
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
      detailPageBasePath="/podcasts/details" // This will not be used, but good to keep consistent
      getHeroText={getPodcastHeroText} // Pass the custom hero text
      renderItem={renderPodcastItem} // Pass the custom render function for each item
      disableLocationFilter={true} // Podcasts typically don't have a location filter
    />
  );
};

export default PodcastsPage;