

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser, verifyUserOtp } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import logo1 from "../assets/logo1.png"; // Your logo file
import bg from "../assets/bg.png"; // Your background image file
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'; // Importing icons for password visibility

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user", // Default to 'user' to match backend enum
  });
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false); // To control visibility of OTP form
  const [message, setMessage] = useState(null); // For success messages
  const [error, setError] = useState(null); // To display errors
  const [loading, setLoading] = useState(false); // To show loading state
  const [passwordVisible, setPasswordVisible] = useState(false); // State for password visibility

  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      await registerUser(formData);

      setOtpSent(true); // Switch to OTP input view
      setMessage("OTP has been sent to your email. Please check your inbox.");

    } catch (error) {
      setError(error.response?.data?.msg || "Signup failed. Please try again.");
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      const res = await verifyUserOtp(formData.email, otp);
      
      if (res.status === 200) { // Assuming 200 OK means OTP verified
        setMessage("Account verified successfully! You can now log in.");
        navigate("/login"); 
      } else {
        setError(res.data?.msg || "OTP verification failed.");
      }
    } catch (error) {
      setError(error.response?.data?.msg || "OTP verification failed. Please check your OTP.");
      console.error("OTP verification error:", error);
    } finally {
      setLoading(false);
    }
  };

  const formCardBackgroundColor = "bg-[#1C1D2E]"; 
  const textColor = "text-white";
  const inputBgColor = "bg-[#25263B]"; // Input field background color
  const placeholderColor = "placeholder-[#A0A0A0]";
  const inputBorderColor = "border-[#3A3A4D]";
  const primaryButtonColor = "bg-[#6A5ACD]"; // Lighter purple
  const primaryButtonHoverColor = "hover:bg-[#5C4FA5]"; // Darker purple on hover
  const linkColor = "text-[#6A5ACD]"; // Link color matching button
  const eyeIconColor = "text-[#A0A0A0]"; // Gray for eye icon, visible against dark input bg
  const eyeIconHoverColor = "hover:text-white"; // White on hover


  return (
    // Main container with full-page background image
    <div
      className={`min-h-screen flex items-center justify-center p-4 bg-cover bg-center`}
      style={{ backgroundImage: `url(${bg})` }}
    >
    
      <form
        className={`${formCardBackgroundColor} p-8 rounded-lg shadow-2xl w-full max-w-md border ${inputBorderColor} mx-auto lg:ml-8 lg:mr-auto transition-all duration-500 ease-in-out`}
        onSubmit={otpSent ? handleOtpSubmit : handleRegisterSubmit}
      >
        <div className="flex justify-center mb-6">
          {/* Logo */}
          <img src={logo1} alt="Company Logo" className="h-20 w-auto object-contain animate-fade-in" onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/100x50/3A3A4D/FFFFFF?text=Logo"; }} />
        </div>

        <h2 className={`text-3xl font-bold mb-2 ${textColor} text-center animate-fade-in-up`}>
          {otpSent ? "Verify Your Email" : "Create an Account"}
        </h2>
        <p className={`text-md mb-6 ${textColor} opacity-75 text-center animate-fade-in-up delay-100`}>
          {otpSent ? "An OTP has been sent to your email. Please check your inbox." : "Let's get started!"}
        </p>

        {message && <p className="text-green-400 text-sm mb-4 text-center animate-fade-in-up">{message}</p>}
        {error && <p className="text-red-400 text-sm mb-4 text-center animate-fade-in-up">{error}</p>}
        {loading && <p className="text-blue-400 text-sm mb-4 text-center animate-fade-in-up">Loading...</p>}

        {!otpSent ? ( // Show registration form
          <>
            <div className="mb-4 animate-fade-in-up delay-200">
              <label htmlFor="name" className={`block text-sm font-medium mb-1 ${textColor}`}>Name</label>
              <input
                name="name"
                id="name"
                placeholder="Olivia Wilson"
                className={`w-full p-3 rounded-md ${inputBgColor} ${textColor} ${placeholderColor} ${inputBorderColor} border focus:outline-none focus:ring-2 focus:ring-[#6A5ACD] transition-all duration-200`}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4 animate-fade-in-up delay-300">
              <label htmlFor="email" className={`block text-sm font-medium mb-1 ${textColor}`}>Email</label>
              <input
                name="email"
                id="email"
                placeholder="hello@reallygreatsite.com"
                type="email"
                className={`w-full p-3 rounded-md ${inputBgColor} ${textColor} ${placeholderColor} ${inputBorderColor} border focus:outline-none focus:ring-2 focus:ring-[#6A5ACD] transition-all duration-200`}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-6 relative animate-fade-in-up delay-400">
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
                style={{ top: 'calc(50% + 5px)' }}
              >
                {passwordVisible ? (
                  <EyeSlashIcon className={`h-5 w-5 ${eyeIconColor} ${eyeIconHoverColor} cursor-pointer transition-colors duration-200`} />
                ) : (
                  <EyeIcon className={`h-5 w-5 ${eyeIconColor} ${eyeIconHoverColor} cursor-pointer transition-colors duration-200`} />
                )}
              </button>
            </div>

            <div className="mb-6 animate-fade-in-up delay-500">
              <label htmlFor="role" className={`block mb-2 text-sm font-medium ${textColor}`}>Register As:</label>
              <select
                name="role"
                id="role"
                value={formData.role}
                onChange={handleChange}
                className={`w-full p-3 rounded-md ${inputBgColor} ${textColor} ${inputBorderColor} border focus:outline-none focus:ring-2 focus:ring-[#6A5ACD] transition-all duration-200`}
              >
                <option value="user">Student</option>
                {/* <option value="recruiter">Recruiter</option>
                 <option value="admin">Admin</option>
                */}
               
              </select>
            </div>

            <button
              type="submit"
              className={`w-full ${primaryButtonColor} ${primaryButtonHoverColor} text-white py-3 rounded-md font-semibold text-lg transition-all duration-200 shadow-lg animate-fade-in-up delay-600`}
              disabled={loading}
            >
              Sign Up
            </button>
          </>
        ) : ( // Show OTP verification form
          <>
            <div className="mb-6 animate-fade-in-up delay-200">
              <label htmlFor="otp" className={`block text-sm font-medium mb-1 ${textColor}`}>Enter OTP</label>
              <input
                name="otp"
                id="otp"
                placeholder="••••••"
                type="text"
                className={`w-full p-3 rounded-md ${inputBgColor} ${textColor} ${placeholderColor} ${inputBorderColor} border focus:outline-none focus:ring-2 focus:ring-[#6A5ACD] transition-all duration-200`}
                value={otp}
                onChange={handleOtpChange}
                required
                minLength="6"
                maxLength="6"
              />
            </div>
            <button
              type="submit"
              className={`w-full ${primaryButtonColor} ${primaryButtonHoverColor} text-white py-3 rounded-md font-semibold text-lg transition-all duration-200 shadow-lg animate-fade-in-up delay-300`}
              disabled={loading}
            >
              Verify OTP
            </button>
          </>
        )}

        <p className={`mt-6 text-center text-sm ${textColor} opacity-80 animate-fade-in-up delay-700`}>
          Already have an account?{" "}
          <Link to="/login" className={`${linkColor} hover:underline font-medium`}>Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
