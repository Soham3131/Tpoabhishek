// import React, { useEffect, useState } from 'react';
// import { useAuth } from '../context/AuthContext'; // Assuming AuthContext provides 'user'
// import { useNavigate, Link } from 'react-router-dom';
// import Footer from '../components/Footer';
// import discover from "../assets/discover.png"; // Ensure this path is correct
// import SocialPrompt from '../components/SocialPrompt';

// const StudentDashboard = () => {
//   const { user } = useAuth(); // Get user from AuthContext
//   const navigate = useNavigate();
//   const [showSocialPrompt, setShowSocialPrompt] = useState(false);

//   // Define the new color scheme
//   const primaryNavyBlue = "bg-[#1E3A5F]";
//   const secondarySteelBlue = "bg-[#4A789C]";
//   const accentOrange = "bg-[#FF6B35]";
//   const lightGrayBackground = "bg-[#F5F7FA]";
//   const darkGrayText = "text-[#2D3436]";

//   // Text color variants
//   const primaryTextColor = "text-[#1E3A5F]";
//   const secondaryTextColor = "text-[#4A789C]";
//   const accentTextColor = "text-[#FF6B35]";

//   // Lighter shades for card backgrounds/icon circles
//   const lighterSteelBlue = "bg-[#E1EBF2]"; // Lighter variant of secondarySteelBlue
//   const lighterOrange = "bg-[#FFE0D3]"; // Lighter variant of accentOrange
//   const lighterNavyBlue = "bg-[#CCDDEE]"; // Lighter variant of primaryNavyBlue
//   const lighterGray = "bg-[#F5F7FA]"; // Same as background, for simple cards

//   const [searchQuery, setSearchQuery] = useState(''); // Keep search query state if search bar is present

//   const handleSearch = () => {
//     if (searchQuery.trim()) {
//       navigate(`/jobs?search=${encodeURIComponent(searchQuery.trim())}`);
//     }
//   };

//   const categories = [
//     { name: "Jobs", link: "/jobs", icon: "💼", description: "Discover full-time career opportunities.", iconBg: lighterOrange },
//     { name: "Internships", link: "/internships", icon: "🚀", description: "Find hands-on experience and valuable learning.", iconBg: lighterSteelBlue },
//     { name: "Trainings", link: "/trainings", icon: "🎓", description: "Enhance your skills with certified courses.", iconBg: lighterNavyBlue },
//     { name: "Seminars", link: "/seminars", icon: "🎤", description: "Attend expert talks and networking events.", iconBg: lighterOrange },
//     { name: "Workshops", link: "/workshops", icon: "🛠️", description: "Develop practical skills in interactive sessions.", iconBg: lighterSteelBlue },
//     { name: "Visits", link: "/visits", icon: "🏭", description: "Gain insights from industrial visits.", iconBg: lighterNavyBlue },
//     { name: "Job Fairs", link: "/jobfairs", icon: "🤝", description: "Connect with multiple recruiters in one place.", iconBg: lighterOrange },
//     { name: "Podcasts with HR", link: "/podcasts", icon: "🎧", description: "Listen to insightful discussions on HR topics.", iconBg: lighterSteelBlue }, // Added Podcasts category
//    { name: "Your applications", link: "/my-applications", icon: "📋", description: "Track the status of your service requests and view past interactions.", iconBg: "cyan-100" }, // Added Podcasts category
// ];

// useEffect(() => {
//   if (user) {
//     // Always reset the flag when user logs in
//     localStorage.removeItem(`hasSeenSocialPrompt_${user.id}`);
//     setShowSocialPrompt(true);
//   }
// }, [user]);



//    const handleClosePrompt = () => {
//     setShowSocialPrompt(false);
//     // Set a flag in local storage so the prompt doesn't show again for this user.
//     localStorage.setItem(`hasSeenSocialPrompt_${user?.id}`, 'true');
//   };

//   return (
//     <div className={`flex flex-col min-h-screen ${lightGrayBackground}`}>
//       <main className="flex-grow container mx-auto px-6 py-8">
//         {/* User Greeting (Conditional based on login status) */}
//         <div className={`text-center mb-8 ${darkGrayText}`}>
//           <h1 className="text-3xl font-bold mb-2">
//             {user ? `Welcome, ${user.name}!` : "Welcome!"}
//           </h1>
         
//         </div>

//         {/* Hero Section */}
//         <section className={`text-center py-16 ${darkGrayText}`}>
//           <h2 className={`text-4xl md:text-5xl font-extrabold mb-4 leading-tight ${primaryTextColor}`}>
//             Find your <span className={accentTextColor}>Dream Career</span> here!
//           </h2>
//           <p className={`text-lg md:text-xl max-w-2xl mx-auto mb-8 ${darkGrayText} opacity-90`}>
//             Your journey to a fulfilling career begins here. Explore endless opportunities and connect with top companies.
//           </p>
          
//           {/* Search Bar */}
//           <div className="flex justify-center mb-12">
//             <div className="relative w-full max-w-xl shadow-lg rounded-full">
//               <input
//                 type="text"
//                 placeholder="Search for jobs, internships, or keywords..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 onKeyPress={(e) => {
//                   if (e.key === 'Enter') {
//                     handleSearch();
//                   }
//                 }}
//                 className={`w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[${secondaryTextColor}] focus:border-transparent ${darkGrayText} placeholder-gray-500`}
//               />
//               <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
//                 <path fillRule="evenodd" d="M8 4a4 4_0 100 8 4 4_0 000-8zM2 8a6 6_0 1110.89 3.476l4.817 4.817a1 1_0 01-1.414 1.414l-4.816-4.816A6 6_0 012 8z" clipRule="evenodd"></path>
//               </svg>
//               <button
//                 onClick={handleSearch}
//                 className={`absolute right-0 top-0 h-full px-8 rounded-full ${primaryNavyBlue} hover:bg-opacity-90 text-white font-semibold text-lg transition-colors duration-300`}
//               >
//                 Search
//               </button>
//             </div>
//           </div>
//         </section>

//         {/* egories Section */}
//         <section className="py-8">
//           <h2 className={`text-3xl font-bold text-center mb-10 ${primaryTextColor}`}>Popular Categories</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {categories.map((category, index) => (
//               <Link key={category.name} to={category.link}
//                 className={`block ${lighterGray} p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 text-center border border-gray-200 animate-fade-in`}
//                 style={{ animationDelay: `${index * 100}ms` }} // Staggered animation for categories
//               >
//                 <div className={`w-20 h-20 mx-auto mb-4 ${category.iconBg} rounded-full flex items-center justify-center shadow-inner`}>
//                   <span className="text-4xl">{category.icon}</span>
//                 </div>
//                 <h3 className={`text-xl font-semibold mb-2 ${primaryTextColor}`}>{category.name}</h3>
//                 <p className={`text-gray-700 text-sm ${darkGrayText} opacity-80`}>{category.description}</p>
//               </Link>
//             ))}
//           </div>
//         </section>

//         {/* NEW: Discover Job Section - Added after Categories */}
//         <section className="py-12 px-4">
//           <div className={`bg-white rounded-xl shadow-lg p-8 flex flex-col lg:flex-row items-center justify-between gap-8 border border-gray-200`}>
//             {/* Text Content */}
//             <div className="lg:w-1/2 text-center lg:text-left animate-fade-in-left">
//               <h2 className={`text-4xl md:text-5xl font-extrabold mb-4 leading-tight ${primaryTextColor}`}>
//                 Discover a job <br /> that suits you!
//               </h2>
//               <p className={`text-lg md:text-xl max-w-2xl mx-auto mb-6 ${darkGrayText} opacity-90`}>
//                 Thousands of opportunities from global to local companies are waiting for you! Explore for more and get the opportunity.
//               </p>
//               <Link to="/jobs" className={`inline-block ${accentOrange} text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl transform hover:scale-105 transition-all duration-300 animate-pulse-once`}>
//                 Take me to Jobs! &rarr;
//               </Link>
//             </div>
//             {/* Image */}
//             <div className="lg:w-1/2 flex justify-center items-center animate-fade-in-right">
//               <img src={discover} alt="Discover Job" className="max-w-full h-auto rounded-lg shadow-lg hover:scale-110 transition-all duration-200" />
//             </div>
//           </div>
//         </section>

//       </main>

//       <Footer />
//        {showSocialPrompt && <SocialPrompt onClose={handleClosePrompt} />}


//       {/* Custom CSS for animations (retained and added new ones) */}
//       <style>{`
//         @keyframes fadeInDown {
//           from { opacity: 0; transform: translateY(-20px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
//         @keyframes fadeInLeft {
//           from { opacity: 0; transform: translateX(-50px); }
//           to { opacity: 1; transform: translateX(0); }
//         }
//         @keyframes fadeInRight {
//           from { opacity: 0; transform: translateX(50px); }
//           to { opacity: 1; transform: translateX(0); }
//         }
//         @keyframes pulseOnce {
//           0% { transform: scale(1); }
//           50% { transform: scale(1.03); }
//           100% { transform: scale(1); }
//         }

//         .animate-fade-in-down { animation: fadeInDown 0.7s ease-out forwards; }
//         .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
//         .animate-fade-in-left { animation: fadeInLeft 0.8s ease-out forwards; }
//         .animate-fade-in-right { animation: fadeInRight 0.8s ease-out forwards; }
//         .animate-pulse-once { animation: pulseOnce 1s ease-in-out; }
//       `}</style>
//     </div>
//   );
// };

// export default StudentDashboard;

// import React, { useEffect, useState } from 'react';
// import { useAuth } from '../context/AuthContext'; 
// import { useNavigate, Link } from 'react-router-dom';
// import Footer from '../components/Footer';
// import discover from "../assets/discover.png"; 
// import SocialPrompt from '../components/SocialPrompt';

// const StudentDashboard = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [showSocialPrompt, setShowSocialPrompt] = useState(false);

//   // Colors
//   const primaryNavyBlue = "bg-[#1E3A5F]";
//   const secondarySteelBlue = "bg-[#4A789C]";
//   const accentOrange = "bg-[#FF6B35]";
//   const lightGrayBackground = "bg-[#F5F7FA]";
//   const darkGrayText = "text-[#2D3436]";
//   const primaryTextColor = "text-[#1E3A5F]";
//   const secondaryTextColor = "text-[#4A789C]";
//   const accentTextColor = "text-[#FF6B35]";
//   const lighterSteelBlue = "bg-[#E1EBF2]";
//   const lighterOrange = "bg-[#FFE0D3]";
//   const lighterNavyBlue = "bg-[#CCDDEE]";
//   const lighterGray = "bg-[#F5F7FA]";

//   const [searchQuery, setSearchQuery] = useState('');

//   const handleSearch = () => {
//     if (searchQuery.trim()) {
//       navigate(`/jobs?search=${encodeURIComponent(searchQuery.trim())}`);
//     }
//   };

// const categories = [ 
//   { name: "Jobs", link: "/jobs", icon: "💼", description: "Discover full-time career opportunities.", iconBg: lighterOrange },
//   { name: "Internships", link: "/internships", icon: "🚀", description: "Find hands-on experience and valuable learning.", iconBg: lighterSteelBlue },
//   { name: "Trainings", link: "/trainings", icon: "🎓", description: "Enhance your skills with certified courses.", iconBg: lighterNavyBlue },
//   { name: "Seminars", link: "/seminars", icon: "🎤", description: "Attend expert talks and networking events.", iconBg: lighterOrange },
//   { name: "Workshops", link: "/workshops", icon: "🛠️", description: "Develop practical skills in interactive sessions.", iconBg: lighterSteelBlue },
//   { name: "Visits", link: "/visits", icon: "🏭", description: "Gain insights from industrial visits.", iconBg: lighterNavyBlue },
//   { name: "Job Fairs", link: "/jobfairs", icon: "🤝", description: "Connect with multiple recruiters in one place.", iconBg: lighterOrange },
//   { name: "Podcasts with HR", link: "/podcasts", icon: "🎧", description: "Listen to insightful discussions on HR topics.", iconBg: lighterSteelBlue },
//   { name: "Corporate Events", link: "/corporate-events", icon: "🏢", description: "Engage with professionals through industry-focused corporate events.", iconBg: lighterNavyBlue }, // ✅ New category
//   { name: "Your applications", link: "/my-applications", icon: "📋", description: "Track the status of your service requests and view past interactions.", iconBg: "cyan-100" },
// ];


//   // Always show SocialPrompt on page load/refresh
//   useEffect(() => {
//     setShowSocialPrompt(true);
//   }, [user]);

//   const handleClosePrompt = () => {
//     setShowSocialPrompt(false); // only hides until next refresh
//   };

//   return (
//     <div className={`flex flex-col min-h-screen ${lightGrayBackground}`}>
//       <main className="flex-grow container mx-auto px-6 py-8">
//         {/* Greeting */}
//         <div className={`text-center mb-8 ${darkGrayText}`}>
//           <h1 className="text-3xl font-bold mb-2">
//             {user ? `Welcome, ${user.name}!` : "Welcome!"}
//           </h1>
//         </div>

//         {/* Hero Section */}
//         <section className={`text-center py-16 ${darkGrayText}`}>
//           <h2 className={`text-4xl md:text-5xl font-extrabold mb-4 leading-tight ${primaryTextColor}`}>
//             Find your <span className={accentTextColor}>Dream Career</span> here!
//           </h2>
//           <p className={`text-lg md:text-xl max-w-2xl mx-auto mb-8 ${darkGrayText} opacity-90`}>
//             Your journey to a fulfilling career begins here. Explore endless opportunities and connect with top companies.
//           </p>

//           {/* Search Bar */}
//           <div className="flex justify-center mb-12">
//             <div className="relative w-full max-w-xl shadow-lg rounded-full">
//               <input
//                 type="text"
//                 placeholder="Search for jobs, internships, or keywords..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 onKeyPress={(e) => {
//                   if (e.key === 'Enter') handleSearch();
//                 }}
//                 className={`w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[${secondaryTextColor}] focus:border-transparent ${darkGrayText} placeholder-gray-500`}
//               />
//               <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
//               </svg>
//               <button
//                 onClick={handleSearch}
//                 className={`absolute right-0 top-0 h-full px-8 rounded-full ${primaryNavyBlue} hover:bg-opacity-90 text-white font-semibold text-lg transition-colors duration-300`}
//               >
//                 Search
//               </button>
//             </div>
//           </div>
//         </section>

//         {/* Categories */}
//         <section className="py-8">
//           <h2 className={`text-3xl font-bold text-center mb-10 ${primaryTextColor}`}>Popular Categories</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {categories.map((category, index) => (
//               <Link key={category.name} to={category.link}
//                 className={`block ${lighterGray} p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 text-center border border-gray-200 animate-fade-in`}
//                 style={{ animationDelay: `${index * 100}ms` }}
//               >
//                 <div className={`w-20 h-20 mx-auto mb-4 ${category.iconBg} rounded-full flex items-center justify-center shadow-inner`}>
//                   <span className="text-4xl">{category.icon}</span>
//                 </div>
//                 <h3 className={`text-xl font-semibold mb-2 ${primaryTextColor}`}>{category.name}</h3>
//                 <p className={`text-gray-700 text-sm ${darkGrayText} opacity-80`}>{category.description}</p>
//               </Link>
//             ))}
//           </div>
//         </section>

//         {/* Discover Section */}
//         <section className="py-12 px-4">
//           <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col lg:flex-row items-center justify-between gap-8 border border-gray-200">
//             <div className="lg:w-1/2 text-center lg:text-left animate-fade-in-left">
//               <h2 className={`text-4xl md:text-5xl font-extrabold mb-4 leading-tight ${primaryTextColor}`}>
//                 Discover a job <br /> that suits you!
//               </h2>
//               <p className={`text-lg md:text-xl max-w-2xl mx-auto mb-6 ${darkGrayText} opacity-90`}>
//                 Thousands of opportunities from global to local companies are waiting for you! Explore for more and get the opportunity.
//               </p>
//               <Link to="/jobs" className={`inline-block ${accentOrange} text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl transform hover:scale-105 transition-all duration-300 animate-pulse-once`}>
//                 Take me to Jobs! &rarr;
//               </Link>
//             </div>
//             <div className="lg:w-1/2 flex justify-center items-center animate-fade-in-right">
//               <img src={discover} alt="Discover Job" className="max-w-full h-auto rounded-lg shadow-lg hover:scale-110 transition-all duration-200" />
//             </div>
//           </div>
//         </section>
//       </main>

//       <Footer />

//       {/* Social Prompt always shows on refresh */}
//       {showSocialPrompt && <SocialPrompt onClose={handleClosePrompt} />}

//       <style>{`
//         @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
//         @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
//         @keyframes fadeInLeft { from { opacity: 0; transform: translateX(-50px); } to { opacity: 1; transform: translateX(0); } }
//         @keyframes fadeInRight { from { opacity: 0; transform: translateX(50px); } to { opacity: 1; transform: translateX(0); } }
//         @keyframes pulseOnce { 0% { transform: scale(1); } 50% { transform: scale(1.03); } 100% { transform: scale(1); } }

//         .animate-fade-in-down { animation: fadeInDown 0.7s ease-out forwards; }
//         .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
//         .animate-fade-in-left { animation: fadeInLeft 0.8s ease-out forwards; }
//         .animate-fade-in-right { animation: fadeInRight 0.8s ease-out forwards; }
//         .animate-pulse-once { animation: pulseOnce 1s ease-in-out; }
//       `}</style>
//     </div>
//   );
// };

// export default StudentDashboard;

import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext'; 
import { useNavigate, Link } from 'react-router-dom';
import Footer from '../components/Footer';
import discover from "../assets/discover.png"; 
import bg1 from "../assets/bg1.jpg"; 
import resume from "../assets/resume.png";   // ✅ Resume banner
import SocialPrompt from '../components/SocialPrompt';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showSocialPrompt, setShowSocialPrompt] = useState(false);

  // Colors
  const primaryNavyBlue = "bg-[#1E3A5F]";
  const secondarySteelBlue = "bg-[#4A789C]";
  const accentOrange = "bg-[#FF6B35]";
  const lightGrayBackground = "bg-[#F5F7FA]";
  const darkGrayText = "text-[#2D3436]";
  const primaryTextColor = "text-[#1E3A5F]";
  const secondaryTextColor = "text-[#4A789C]";
  const accentTextColor = "text-[#FF6B35]";
  const lighterSteelBlue = "bg-[#E1EBF2]";
  const lighterOrange = "bg-[#FFE0D3]";
  const lighterNavyBlue = "bg-[#CCDDEE]";
  const lighterGray = "bg-[#F5F7FA]";

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const categories = [ 
    { name: "Jobs", link: "/jobs", icon: "💼", description: "Discover full-time career opportunities.", iconBg: lighterOrange },
    { name: "Internships", link: "/internships", icon: "🚀", description: "Find hands-on experience and valuable learning.", iconBg: lighterSteelBlue },
    { name: "Trainings", link: "/trainings", icon: "🎓", description: "Enhance your skills with certified courses.", iconBg: lighterNavyBlue },
    { name: "Seminars", link: "/seminars", icon: "🎤", description: "Attend expert talks and networking events.", iconBg: lighterOrange },
    { name: "Workshops", link: "/workshops", icon: "🛠️", description: "Develop practical skills in interactive sessions.", iconBg: lighterSteelBlue },
    { name: "Visits", link: "/visits", icon: "🏭", description: "Gain insights from industrial visits.", iconBg: lighterNavyBlue },
    { name: "Job Fairs", link: "/jobfairs", icon: "🤝", description: "Connect with multiple recruiters in one place.", iconBg: lighterOrange },
    { name: "Podcasts with HR", link: "/podcasts", icon: "🎧", description: "Listen to insightful discussions on HR topics.", iconBg: lighterSteelBlue },
    { name: "Corporate Events", link: "/corporate-events", icon: "🏢", description: "Engage with professionals through industry-focused corporate events.", iconBg: lighterNavyBlue },
    { name: "Your applications", link: "/my-applications", icon: "📋", description: "Track the status of your service requests and view past interactions.", iconBg: "cyan-100" },
  ];

  // Always show SocialPrompt on page load/refresh
  useEffect(() => {
    setShowSocialPrompt(true);
  }, [user]);

  const handleClosePrompt = () => {
    setShowSocialPrompt(false); // only hides until next refresh
  };

  // ✅ Resume Banner click
  const handleResumeClick = () => {
    if (user) {
      alert("Please go to profile menu on navbar to make your resume.");
    } else {
      alert("Please login first to use Resume Builder.");
      navigate("/login");
    }
  };

  return (
    <div className={`flex flex-col min-h-screen ${lightGrayBackground}`}>
      <main className="flex-grow container mx-auto px-6 py-8">
        {/* Greeting */}
        <div className={`text-center mb-8 ${darkGrayText}`}>
          <h1 className="text-3xl font-bold mb-2">
            {user ? `Welcome, ${user.name}!` : "Welcome!"}
          </h1>
        </div>

        {/* Hero Section */}
        <section className={`text-center py-16 ${darkGrayText}`}>
          <h2 className={`text-4xl md:text-5xl font-extrabold mb-4 leading-tight ${primaryTextColor}`}>
            Find your <span className={accentTextColor}>Dream Career</span> here!
          </h2>
          <p className={`text-lg md:text-xl max-w-2xl mx-auto mb-8 ${darkGrayText} opacity-90`}>
            Your journey to a fulfilling career begins here. Explore endless opportunities and connect with top companies.
          </p>

          {/* ✅ Search Bar */}
          <div className="flex justify-center mb-12">
            <div className="relative w-full max-w-xl shadow-lg rounded-full">
              <input
                type="text"
                placeholder="Search for jobs, internships, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleSearch();
                }}
                className={`w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4A789C] focus:border-transparent ${darkGrayText} placeholder-gray-500`}
              />
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
              </svg>
              <button
                onClick={handleSearch}
                className={`absolute right-0 top-0 h-full px-8 rounded-full ${primaryNavyBlue} hover:bg-opacity-90 text-white font-semibold text-lg transition-colors duration-300`}
              >
                Search
              </button>
            </div>
          </div>
        </section>

        {/* ✅ Resume Builder Section */}
        <section className="py-8 flex justify-center">
          <img 
            src={resume} 
            alt="Resume Builder" 
            onClick={handleResumeClick}
            className="cursor-pointer max-w-3xl w-full rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
          />
        </section>

        {/* Categories */}
        <section className="py-8">
          <h2 className={`text-3xl font-bold text-center mb-10 ${primaryTextColor}`}>Popular Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link key={category.name} to={category.link}
                className={`block ${lighterGray} p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 text-center border border-gray-200 animate-fade-in`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-20 h-20 mx-auto mb-4 ${category.iconBg} rounded-full flex items-center justify-center shadow-inner`}>
                  <span className="text-4xl">{category.icon}</span>
                </div>
                <h3 className={`text-xl font-semibold mb-2 ${primaryTextColor}`}>{category.name}</h3>
                <p className={`text-gray-700 text-sm ${darkGrayText} opacity-80`}>{category.description}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Discover Section */}
        <section className="py-12 px-4">
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col lg:flex-row items-center justify-between gap-8 border border-gray-200">
            <div className="lg:w-1/2 text-center lg:text-left animate-fade-in-left">
              <h2 className={`text-4xl md:text-5xl font-extrabold mb-4 leading-tight ${primaryTextColor}`}>
                Discover a job <br /> that suits you!
              </h2>
              <p className={`text-lg md:text-xl max-w-2xl mx-auto mb-6 ${darkGrayText} opacity-90`}>
                Thousands of opportunities from global to local companies are waiting for you! Explore for more and get the opportunity.
              </p>
              <Link to="/jobs" className={`inline-block ${accentOrange} text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl transform hover:scale-105 transition-all duration-300 animate-pulse-once`}>
                Take me to Jobs! &rarr;
              </Link>
            </div>
            <div className="lg:w-1/2 flex justify-center items-center animate-fade-in-right">
              <img src={bg1} alt="Discover Job" className="max-w-full h-auto rounded-lg shadow-lg hover:scale-110 transition-all duration-200" />
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Social Prompt always shows on refresh */}
      {showSocialPrompt && <SocialPrompt onClose={handleClosePrompt} />}
    </div>
  );
};

export default StudentDashboard;
