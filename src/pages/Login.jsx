// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext"; // Import useAuth
// import logo1 from "../assets/logo1.png"

// const Login = () => {
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const navigate = useNavigate();
//   const { setUser } = useAuth(); // <--- CHANGE: Get setUser from context, NOT setIsLoggedIn
//   const [error, setError] = useState(null); // To display errors
//   const [loading, setLoading] = useState(false); // To show loading state

//   const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     setLoading(true);
//     try {
//       const res = await axios.post("http://localhost:5000/api/auth/login", formData, {
//         withCredentials: true,
//       });

//       // --- CHANGE: Use setUser to update the user object in context ---
//       setUser(res.data.user); // Set the full user object from the backend response

//       const userRole = res.data.user.role;
//       if (userRole === "admin") {
//         navigate("/admin-dashboard");
//       } else {
//         // Assuming /student-dashboard is your user dashboard
//         navigate("/student-dashboard");
//       }
//     } catch (error) {
//       setError(error.response?.data?.msg || "Login failed. Please check your credentials.");
//       console.error("Login error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#ECEFF1] flex items-center justify-center">
//       <form className="bg-white p-8 rounded shadow-md w-full max-w-md" onSubmit={handleSubmit}>
//         <h2 className="text-2xl font-bold mb-4 text-center text-primary">Login</h2>

//         {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
//         {loading && <p className="text-blue-500 text-sm mb-4 text-center">Loading...</p>}

//         <input name="email" placeholder="Email" type="email" className="input" onChange={handleChange} required />
//         <input name="password" placeholder="Password" type="password" className="input" onChange={handleChange} required />

//         <button type="submit" className="mt-6 w-full bg-primary text-white py-2 rounded hover:bg-[#2a4568] transition" disabled={loading}>
//           Login
//         </button>

//         <p className="mt-4 text-center text-gray-600 text-sm">
//           <Link to="/forgot-password" className="text-primary hover:underline">Forgot Password?</Link>
//         </p>

//         <p className="mt-2 text-center text-gray-600 text-sm">
//           Don't have an account? <Link to="/signup" className="text-primary hover:underline">Sign Up</Link>
//         </p>
//       </form>
//     </div>
//   );
// };

// export default Login;
// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";
// import logo1 from "../assets/logo1.png"; // Your logo file
// import bg from "../assets/bg.png"; // Your background image file
// import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'; // Importing icons for password visibility

// const Login = () => {
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const navigate = useNavigate();
//   const { setUser } = useAuth();
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [passwordVisible, setPasswordVisible] = useState(false); // State for password visibility

//   const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     setLoading(true);
//     try {
//       const res = await axios.post("http://localhost:5000/api/auth/login", formData, {
//         withCredentials: true,
//       });

//       setUser(res.data.user);

//       const userRole = res.data.user.role;
//       if (userRole === "admin") {
//         navigate("/admin-dashboard");
//       } else {
//         navigate("/student-dashboard");
//       }
//     } catch (error) {
//       setError(error.response?.data?.msg || "Login failed. Please check your credentials.");
//       console.error("Login error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Define color variables for easier use with Tailwind
//   const backgroundColor = "bg-[#1A1A2E]"; // Dark blue/purple background
//   const cardBackgroundColor = "bg-[#161625]"; // Slightly darker for the form card
//   const textColor = "text-white";
//   const placeholderColor = "placeholder-[#A0A0A0]";
//   const inputBorderColor = "border-[#3A3A4D]";
//   const primaryButtonColor = "bg-[#6A5ACD]"; // Lighter purple
//   const primaryButtonHoverColor = "hover:bg-[#5C4FA5]"; // Darker purple on hover
//   const linkColor = "text-[#6A5ACD]"; // Link color matching button

//   return (
//     <div className={`min-h-screen flex ${backgroundColor}`}>
//       {/* Left Column: Login Form */}
//       <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 z-10">
//         <form
//           className={`${cardBackgroundColor} p-8 rounded-lg shadow-2xl w-full max-w-md border ${inputBorderColor}`}
//           onSubmit={handleSubmit}
//         >
//           <div className="flex justify-center mb-6">
//             <img src={logo1} alt="Company Logo" className="h-20 w-auto object-contain" onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/100x50/3A3A4D/FFFFFF?text=Logo"; }} />
//           </div>

//           <h2 className={`text-3xl font-bold mb-2 ${textColor} text-center`}>Welcome Back!</h2>
//           <p className={`text-md mb-6 ${textColor} opacity-75 text-center`}>Let's get you logged in.</p>

//           {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
//           {loading && <p className="text-blue-400 text-sm mb-4 text-center">Logging in...</p>}

//           <div className="mb-4">
//             <label htmlFor="email" className={`block text-sm font-medium mb-1 ${textColor}`}>Email</label>
//             <input
//               name="email"
//               id="email"
//               placeholder="your.email@example.com"
//               type="email"
//               className={`w-full p-3 rounded-md ${cardBackgroundColor} ${textColor} ${placeholderColor} ${inputBorderColor} border focus:outline-none focus:ring-2 focus:ring-[#6A5ACD] transition-all duration-200`}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="mb-6 relative"> {/* Added relative for positioning eye icon */}
//             <label htmlFor="password" className={`block text-sm font-medium mb-1 ${textColor}`}>Password</label>
//             <input
//               name="password"
//               id="password"
//               placeholder="••••••••"
//               type={passwordVisible ? "text" : "password"} {/* Toggle type */}
//               className={`w-full p-3 pr-10 rounded-md ${cardBackgroundColor} ${textColor} ${placeholderColor} ${inputBorderColor} border focus:outline-none focus:ring-2 focus:ring-[#6A5ACD] transition-all duration-200`}
//               onChange={handleChange}
//               required
//             />
//             {/* Eye Icon for password visibility toggle */}
//             <button
//               type="button" // Important to prevent form submission
//               onClick={() => setPasswordVisible(!passwordVisible)}
//               className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
//               style={{ top: '60%', transform: 'translateY(-50%)' }} // Adjust positioning
//             >
//               {passwordVisible ? (
//                 <EyeSlashIcon className={`h-5 w-5 ${textColor} opacity-60 hover:opacity-100 cursor-pointer`} />
//               ) : (
//                 <EyeIcon className={`h-5 w-5 ${textColor} opacity-60 hover:opacity-100 cursor-pointer`} />
//               )}
//             </button>
//           </div>

//           <button
//             type="submit"
//             className={`mt-4 w-full ${primaryButtonColor} ${primaryButtonHoverColor} text-white py-3 rounded-md font-semibold text-lg transition-all duration-200 shadow-lg`}
//             disabled={loading}
//           >
//             {loading ? 'Logging In...' : 'Login'}
//           </button>

//           <p className={`mt-6 text-center text-sm ${textColor} opacity-80`}>
//             <Link to="/forgot-password" className={`${linkColor} hover:underline font-medium`}>Forgot Password?</Link>
//           </p>

//           <p className={`mt-3 text-center text-sm ${textColor} opacity-80`}>
//             Don't have an account?{" "}
//             <Link to="/signup" className={`${linkColor} hover:underline font-medium`}>Sign Up</Link>
//           </p>
//         </form>
//       </div>

//       {/* Right Column: Background Image */}
//       <div
//         className="hidden lg:flex w-1/2 min-h-screen bg-cover bg-center"
//         style={{ backgroundImage: `url(${bg})` }}
//       ></div>
//     </div>
//   );
// };

// export default Login;
// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";
// import logo1 from "../assets/logo1.png";
// import bg from "../assets/bg.png";

// const Login = () => {
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const navigate = useNavigate();
//   const { setUser } = useAuth();
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     setLoading(true);
//     try {
//       const res = await axios.post("http://localhost:5000/api/auth/login", formData, {
//         withCredentials: true,
//       });

//       setUser(res.data.user);
//       const role = res.data.user.role;

//       if (role === "admin") {
//         navigate("/admin-dashboard");
//       } else {
//         navigate("/student-dashboard");
//       }
//     } catch (error) {
//       setError(
//         error.response?.data?.msg || "Login failed. Please check your credentials."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
//       style={{ backgroundImage: `url(${bg})` }}
//     >
//       <div className="bg-[#0E112B]/90 backdrop-blur-md p-8 md:p-10 rounded-2xl shadow-xl max-w-md w-full text-white">
//         <div className="flex items-center gap-3 mb-6 justify-center">
//           <img src={logo1} alt="Logo" className="w-8 h-8" />
//           <span className="text-xl font-bold tracking-wide">YourAppName</span>
//         </div>

//         <h2 className="text-2xl font-semibold mb-1 text-center">Welcome Back!</h2>
//         <p className="mb-6 text-sm text-center text-gray-300">Please log in to continue</p>

//         {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
//         {loading && <p className="text-blue-300 text-sm mb-4 text-center">Logging in...</p>}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             name="email"
//             type="email"
//             placeholder="Email"
//             className="w-full px-4 py-2 rounded bg-[#1B1E3C] text-white border border-gray-600 focus:outline-none"
//             onChange={handleChange}
//             required
//           />
//           <input
//             name="password"
//             type="password"
//             placeholder="Password"
//             className="w-full px-4 py-2 rounded bg-[#1B1E3C] text-white border border-gray-600 focus:outline-none"
//             onChange={handleChange}
//             required
//           />
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold py-2 rounded transition duration-200"
//           >
//             Login
//           </button>
//         </form>

//         <div className="mt-4 text-sm text-gray-300 flex justify-between">
//           <Link to="/forgot-password" className="hover:underline">Forgot Password?</Link>
//           <Link to="/signup" className="hover:underline">Sign Up</Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import logo1 from "../assets/logo1.png"; // Your logo file
import bg from "../assets/bg.png"; // Your background image file

import bg2 from "../assets/bg2.jpg"; // Your background image file
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'; // Importing icons for password visibility

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false); // State for password visibility

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", formData, {
        withCredentials: true,
      });

      setUser(res.data.user);

      const userRole = res.data.user.role;
      if (userRole === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/student-dashboard");
      }
    } catch (error) {
      setError(error.response?.data?.msg || "Login failed. Please check your credentials.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Define color variables based on the new design reference
  // Using colors directly from the provided image
  const mainBackgroundColor = "bg-[#1A1A2E]"; // Dark blue/purple for the overall page background
  const formCardBackgroundColor = "bg-[#1C1D2E]"; // Slightly lighter than main bg for the form card
  const textColor = "text-white";
  const inputBgColor = "bg-[#25263B]"; // Input field background color
  const placeholderColor = "placeholder-[#A0A0A0]";
  const inputBorderColor = "border-[#3A3A4D]";
  const primaryButtonColor = "bg-[#6A5ACD]"; // Lighter purple
  const primaryButtonHoverColor = "hover:bg-[#5C4FA5]"; // Darker purple on hover
  const linkColor = "text-[#6A5ACD]"; // Link color matching button
  const eyeIconColor = "text-[#A0A0A0]"; // Gray for eye icon, should be visible against dark input bg
  const eyeIconHoverColor = "hover:text-white"; // White on hover

  return (
    // Main container with full-page background image
    <div
      className={`min-h-screen flex items-center justify-center p-4 bg-cover bg-center`}
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Login Form Card - placed on the left side, adjusted for mobile responsiveness and center alignment for small screens */}
      <form
        className={`${formCardBackgroundColor} p-8 rounded-lg shadow-2xl w-full max-w-md border ${inputBorderColor} mx-auto lg:ml-8 lg:mr-auto transition-all duration-500 ease-in-out`}
        onSubmit={handleSubmit}
      >
        <div className="flex justify-center mb-6">
          {/* Logo */}
          <img src={logo1} alt="Company Logo" className="h-20 w-auto object-contain animate-fade-in" onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/100x50/3A3A4D/FFFFFF?text=Logo"; }} />
        </div>

        <h2 className={`text-3xl font-bold mb-2 ${textColor} text-center animate-fade-in-up`}>Welcome Back!</h2>
        <p className={`text-md mb-6 ${textColor} opacity-75 text-center animate-fade-in-up delay-100`}>Let's get you logged in.</p>

        {error && <p className="text-red-400 text-sm mb-4 text-center animate-fade-in-up">{error}</p>}
        {loading && <p className="text-blue-400 text-sm mb-4 text-center animate-fade-in-up">Logging in...</p>}

        {/* Email Input */}
        <div className="mb-4 animate-fade-in-up delay-200">
          <label htmlFor="email" className={`block text-sm font-medium mb-1 ${textColor}`}>Email</label>
          <input
            name="email"
            id="email"
            placeholder="your.email@example.com"
            type="email"
            className={`w-full p-3 rounded-md ${inputBgColor} ${textColor} ${placeholderColor} ${inputBorderColor} border focus:outline-none focus:ring-2 focus:ring-[#6A5ACD] transition-all duration-200`}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password Input with Toggle */}
        <div className="mb-6 relative animate-fade-in-up delay-300">
          <label htmlFor="password" className={`block text-sm font-medium mb-1 ${textColor}`}>Password</label>
          <input
            name="password"
            id="password"
            placeholder="••••••••"
            type={passwordVisible ? "text" : "password"}
            className={`w-full p-3 pr-10 rounded-md ${inputBgColor} ${textColor} ${placeholderColor} ${inputBorderColor} border focus:outline-none focus:ring-2 focus:ring-[#6A5ACD] transition-all duration-200`}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            onClick={() => setPasswordVisible(!passwordVisible)}
            className="absolute right-3 transform -translate-y-1/2 flex items-center"
            style={{ top: 'calc(50% + 5px)' }} // Adjust top based on label height and input padding
          >
            {passwordVisible ? (
              <EyeSlashIcon className={`h-5  w-5 ${eyeIconColor} ${eyeIconHoverColor} cursor-pointer transition-colors duration-200`} />
            ) : (
              <EyeIcon className={`h-5 w-5 ${eyeIconColor} ${eyeIconHoverColor} cursor-pointer transition-colors duration-200`} />
            )}
          </button>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className={`mt-4 w-full ${primaryButtonColor} ${primaryButtonHoverColor} text-white py-3 rounded-md font-semibold text-lg transition-all duration-200 shadow-lg animate-fade-in-up delay-400`}
          disabled={loading}
        >
          {loading ? 'Logging In...' : 'Login'}
        </button>

        {/* Forgot Password Link */}
        <p className={`mt-6 text-center text-sm ${textColor} opacity-80 animate-fade-in-up delay-500`}>
          <Link to="/forgot-password" className={`${linkColor} hover:underline font-medium`}>Forgot Password?</Link>
        </p>

        {/* Sign Up Link */}
        <p className={`mt-3 text-center text-sm ${textColor} opacity-80 animate-fade-in-up delay-600`}>
          Don't have an account?{" "}
          <Link to="/signup" className={`${linkColor} hover:underline font-medium`}>Sign Up</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
