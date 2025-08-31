
// import React, { useState, useEffect, useRef } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { logoutUser } from "../services/authService";
// import UserProfileEditor from "../components/UserProfileEditor";
// // import logo from "../assets/logo.png"; // Ensure this path is correct and logo1.png exists
// import logo from "../assets/logo.gif"; // Ensure this path is correct and logo1.png exists
// import { UserCircleIcon } from '@heroicons/react/24/solid';

// const Navbar = () => {
//     const [servicesOpen, setServicesOpen] = useState(false);
//     const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
//     const { user, setUser, isLoggedIn } = useAuth();
//     const navigate = useNavigate();
//     const profileDropdownRef = useRef(null); // Ref for profile dropdown

//     // Close dropdown on outside click
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
//                 setProfileDropdownOpen(false);
//             }
//         };
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => {
//             document.removeEventListener("mousedown", handleClickOutside);
//         };
//     }, []);

//     const handleLogout = async () => {
//         try {
//             await logoutUser();
//             setUser(null); // Clear user from context
//             navigate("/login");
//             setProfileDropdownOpen(false); // Close dropdown on logout
//         } catch (err) {
//             console.error("Logout failed:", err);
//             // Implement a custom modal/toast for messages instead of alert()
//             // For now, retaining alert as per previous pattern to avoid breaking functionality
//             alert(err.response?.data?.msg || "Logout failed");
//         }
//     };

//     // Determine the home link based on user role
//     const getHomeLink = () => {
//         if (isLoggedIn) {
//             if (user?.role === 'admin') {
//                 return "/admin-dashboard";
//             } else if (user?.role === 'user' || user?.role === 'recruiter') {
//                 return "/student-dashboard";
//             }
//         }
//         return "/"; // Default for non-logged-in users
//     };

//     // Define services items that are always present
//     let servicesItems = [
//         ["Seminars", "/seminars"],
//         ["Certified Trainings", "/trainings"],
//         ["Industrial Visits", "/visits"],
//         ["Workshops", "/workshops"],
//         ["Job Fairs", "/jobfairs"],
//         ["Podcast with HR", "/podcasts"], // <--- ADDED THIS LINE
//     ];

//     // Add "My Applications" only if the user is logged in AND is not an admin
//     if (isLoggedIn && user?.role !== 'admin') {
//         servicesItems = [["My Applications", "/my-applications"], ...servicesItems];
//     }

//     return (
//         <nav className="h-20 bg-gradient-to-r from-[#1E3A5F] via-[#2e567e] to-[#1E3A5F] text-white shadow-3xl animate-fade-in-down relative z-50">
//             <div className="container mx-auto px-6 flex items-center justify-between h-full">
//                 {/* Logo */}
//                 <div className="flex-shrink-0">
//                     <Link to={getHomeLink()} className="flex items-center transform hover:scale-105 transition-transform duration-200">
//                         <img src={logo} alt="Logo" className="h-[10rem] w-auto object-contain drop-shadow-lg" /> {/* Adjusted height */}
//                     </Link>
//                 </div>

//                 {/* Middle Nav Items */}
//                 <div className="hidden md:flex flex-1 justify-center space-x-10 text-lg font-medium"> {/* Adjusted font size */}
//                     {[
//                         { name: "Internships", link: "/internships" },
//                         { name: "Jobs", link: "/jobs" },
//                     ].map((item) => (
//                         <Link
//                             key={item.name}
//                             to={item.link}
//                             className="relative group text-gray-200 hover:text-[#FF6B35] transition duration-300 transform hover:scale-105 hover:font-semibold py-2" // Added py-2 for better clickable area
//                         >
//                             {item.name}
//                             <span className="absolute left-0 -bottom-1 w-0 h-1 bg-[#FF6B35] group-hover:w-full transition-all duration-300 rounded-full"></span>
//                         </Link>
//                     ))}

//                     <div
//                         onMouseEnter={() => setServicesOpen(true)}
//                         onMouseLeave={() => setServicesOpen(false)}
//                         className="relative group cursor-pointer text-gray-200 hover:text-[#FF6B35] transition duration-300 transform hover:scale-105 hover:font-semibold py-2" // Added py-2
//                     >
//                         Services ▾
//                         <span className="absolute left-0 -bottom-1 w-0 h-1 bg-[#FF6B35] group-hover:w-full transition-all duration-300 rounded-full"></span>

//                         {servicesOpen && (
//                             <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-[#4A789C] text-white shadow-xl rounded-lg w-60 z-50 animate-fade-in-up-dropdown overflow-hidden border border-[#FF6B35]">
//                                 {servicesItems.map(([label, link]) => (
//                                     <Link
//                                         key={label}
//                                         to={link}
//                                         className="block px-5 py-3 hover:bg-[#FF6B35] transition text-base font-light hover:text-white"
//                                         onClick={() => setServicesOpen(false)} // Close dropdown on click
//                                     >
//                                         {label}
//                                     </Link>
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 {/* Auth Buttons / Profile Icon */}
//                 <div className="flex items-center space-x-4"> {/* Adjusted spacing */}
//                     {isLoggedIn ? (
//                         <div className="relative" ref={profileDropdownRef}>
//                             {/* Profile Icon */}
//                             <button
//                                 onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
//                                 className="flex items-center justify-center w-12 h-12 rounded-full bg-[#FF6B35] text-white text-xl font-bold focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:ring-offset-2 focus:ring-offset-[#1E3A5F] overflow-hidden transform hover:scale-110 transition-transform duration-200 shadow-xl border-2 border-white" // Adjusted size
//                             >
//                                 {user?.profilePicture ? (
//                                     <img
//                                         src={user.profilePicture}
//                                         alt="Profile"
//                                         className="w-full h-full object-cover"
//                                     />
//                                 ) : (
//                                     <UserCircleIcon className="w-10 h-10 text-white" /> 
//                                 )}
//                             </button>

//                             {/* Profile Dropdown Content */}
//                             {profileDropdownOpen && (
//                                 <div className="absolute right-0 mt-3 w-80 bg-white rounded-lg shadow-xl py-4 z-50 text-[#2D3436] animate-fade-in-up-dropdown overflow-hidden border border-[#4A789C]">
//                                     <UserProfileEditor onCloseDropdown={() => { setProfileDropdownOpen(false); }} />
//                                 </div>
//                             )}
//                         </div>
//                     ) : (
//                         // Signup / Login buttons if not logged in
//                         <div className="flex items-center space-x-4">
//                             <Link
//                                 to="/signup"
//                                 className="bg-[#FF6B35] text-white px-5 py-2.5 rounded-full font-semibold hover:bg-orange-600 transition duration-300 shadow-lg transform hover:scale-105 ring-2 ring-transparent hover:ring-white focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:ring-offset-2" // Adjusted padding
//                             >
//                                 Sign Up
//                             </Link>
//                             <Link
//                                 to="/login"
//                                 className="bg-transparent border-2 border-white text-white px-5 py-2.5 rounded-full font-semibold hover:bg-white hover:text-[#1E3A5F] transition duration-300 shadow-lg transform hover:scale-105 ring-2 ring-transparent hover:ring-[#FF6B35] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2" // Adjusted padding
//                             >
//                                 Login
//                             </Link>
//                         </div>
//                     )}
//                 </div>
//             </div>
//             {/* Custom CSS for animations and shadow */}
//             <style>{`
//                 @keyframes fadeInDown {
//                     from { opacity: 0; transform: translateY(-30px); }
//                     to { opacity: 1; transform: translateY(0); }
//                 }
//                 .animate-fade-in-down {
//                     animation: fadeInDown 0.7s ease-out forwards;
//                 }

//                 @keyframes fadeInUpDropdown {
//                     from { opacity: 0; transform: translateY(-15px); }
//                     to { opacity: 1; transform: translateY(0); }
//                 }
//                 .animate-fade-in-up-dropdown {
//                     animation: fadeInUpDropdown 0.3s ease-out forwards;
//                 }

//                 /* Custom shadow for the navbar */
//                 .shadow-3xl {
//                     box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4), 0 5px 15px rgba(0, 0, 0, 0.2);
//                 }
//             `}</style>
//         </nav>
//     );
// };

// export default Navbar;

import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../services/authService";
import UserProfileEditor from "../components/UserProfileEditor";
import logo from "../assets/logo.gif";
import { UserCircleIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';

const Navbar = () => {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, setUser, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const profileDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      navigate("/login");
      setProfileDropdownOpen(false);
    } catch (err) {
      console.error("Logout failed:", err);
      alert(err.response?.data?.msg || "Logout failed");
    }
  };

  const getHomeLink = () => {
    if (isLoggedIn) {
      if (user?.role === "admin") return "/admin-dashboard";
      if (user?.role === "user" || user?.role === "recruiter") return "/student-dashboard";
    }
    return "/";
  };

  let servicesItems = [
    ["Seminars", "/seminars"],
    ["Certified Trainings", "/trainings"],
    ["Industrial Visits", "/visits"],
    ["Workshops", "/workshops"],
    ["Job Fairs", "/jobfairs"],
    ["Podcast with HR", "/podcasts"],
     ["Corporate Events", "/corporate-events"],
  ];

  if (isLoggedIn && user?.role !== "admin") {
    servicesItems = [["My Applications", "/my-applications"], ...servicesItems];
  }

  return (
    <nav className="h-20 bg-gradient-to-r from-[#1E3A5F] via-[#2e567e] to-[#1E3A5F] text-white shadow-3xl animate-fade-in-down relative z-50">
      <div className="container mx-auto px-6 flex items-center justify-between h-full">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link to={getHomeLink()} className="flex items-center transform hover:scale-105 transition-transform duration-200">
            <img src={logo} alt="Logo" className="h-[10rem] w-auto object-contain drop-shadow-lg" />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex flex-1 justify-center space-x-10 text-lg font-medium">
          {[
            { name: "Internships", link: "/internships" },
            { name: "Jobs", link: "/jobs" },
          ].map((item) => (
            <Link
              key={item.name}
              to={item.link}
              className="relative group text-gray-200 hover:text-[#FF6B35] transition duration-300 transform hover:scale-105 hover:font-semibold py-2"
            >
              {item.name}
              <span className="absolute left-0 -bottom-1 w-0 h-1 bg-[#FF6B35] group-hover:w-full transition-all duration-300 rounded-full"></span>
            </Link>
          ))}

          <div
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
            className="relative group cursor-pointer text-gray-200 hover:text-[#FF6B35] transition duration-300 transform hover:scale-105 hover:font-semibold py-2"
          >
            Services ▾
            <span className="absolute left-0 -bottom-1 w-0 h-1 bg-[#FF6B35] group-hover:w-full transition-all duration-300 rounded-full"></span>
            {servicesOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-[#4A789C] text-white shadow-xl rounded-lg w-60 z-50 animate-fade-in-up-dropdown overflow-hidden border border-[#FF6B35]">
                {servicesItems.map(([label, link]) => (
                  <Link
                    key={label}
                    to={link}
                    className="block px-5 py-3 hover:bg-[#FF6B35] transition text-base font-light hover:text-white"
                    onClick={() => setServicesOpen(false)}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Auth Buttons / Profile */}
        <div className="hidden md:flex items-center space-x-4">
          {isLoggedIn ? (
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-[#FF6B35] text-white overflow-hidden border-2 border-white shadow-xl hover:scale-110 transition"
              >
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <UserCircleIcon className="w-10 h-10 text-white" />
                )}
              </button>
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-lg shadow-xl py-4 z-50 text-[#2D3436] animate-fade-in-up-dropdown overflow-hidden border border-[#4A789C]">
                  <UserProfileEditor onCloseDropdown={() => setProfileDropdownOpen(false)} />
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/signup" className="bg-[#FF6B35] px-5 py-2.5 rounded-full font-semibold hover:bg-orange-600 transition shadow-lg">
                Sign Up
              </Link>
              <Link to="/login" className="border-2 border-white px-5 py-2.5 rounded-full font-semibold hover:bg-white hover:text-[#1E3A5F] transition shadow-lg">
                Login
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? (
              <XMarkIcon className="w-8 h-8 text-white" />
            ) : (
              <Bars3Icon className="w-8 h-8 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#2e567e] text-white px-6 py-4 space-y-4 animate-fade-in-down">
          {[
            { name: "Internships", link: "/internships" },
            { name: "Jobs", link: "/jobs" },
          ].map((item) => (
            <Link key={item.name} to={item.link} className="block py-2 hover:text-[#FF6B35]" onClick={() => setMobileMenuOpen(false)}>
              {item.name}
            </Link>
          ))}
          <div>
            <span className="block py-2 font-semibold">Services</span>
            <div className="ml-4 space-y-2">
              {servicesItems.map(([label, link]) => (
                <Link key={label} to={link} className="block hover:text-[#FF6B35]" onClick={() => setMobileMenuOpen(false)}>
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div className="pt-4">
            {isLoggedIn ? (
              <button onClick={handleLogout} className="w-full bg-[#FF6B35] py-2 rounded-lg">
                Logout
              </button>
            ) : (
              <>
                <Link to="/signup" className="block w-full bg-[#FF6B35] py-2 rounded-lg text-center mb-2" onClick={() => setMobileMenuOpen(false)}>
                  Sign Up
                </Link>
                <Link to="/login" className="block w-full border-2 border-white py-2 rounded-lg text-center" onClick={() => setMobileMenuOpen(false)}>
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
