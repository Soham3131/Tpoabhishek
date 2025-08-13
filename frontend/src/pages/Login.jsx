
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios"; // Keep plain axios for the initial login post
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
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, formData, {
        // --- MODIFIED: Removed withCredentials for the login POST itself ---
        // We are no longer relying on the browser setting an HttpOnly cookie for the main token.
        // The token will be in the response body.
        // If you decide to keep CSRF cookies for login (which are HttpOnly), you might re-add this,
        // but for the JWT bearer token, it's not needed here.
        // withCredentials: true,
      });

      // --- MODIFIED: Store token in localStorage and set user ---
      const { user, token } = res.data; // Destructure both user and token from the response data

      if (token) {
        localStorage.setItem('jwtToken', token); 
      } else {
        console.warn("LOGIN: No JWT Token received in login response.");
      }
      
      setUser(user); // Set the user data in your AuthContext

      

      const userRole = user.role; // Use 'user' from the destructured response
      if (userRole === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/student-dashboard");
      }
    } catch (error) {
      setError(error.response?.data?.msg || "Login failed. Please check your credentials.");
      console.error("LOGIN ERROR (Login.jsx):", error.response || error.message || error);
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
              <EyeSlashIcon className={`h-5  w-5 ${eyeIconColor} ${eyeIconHoverColor} cursor-pointer transition-colors duration-200`} />
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