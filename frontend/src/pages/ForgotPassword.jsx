import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { requestPasswordResetOtp, resetUserPassword } from "../services/authService"; // Import new functions

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1); // 1: Enter Email, 2: Enter OTP & New Password
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      const res = await requestPasswordResetOtp(email);
      setMessage(res.data.msg);
      setStep(2); // Move to OTP verification step
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const res = await resetUserPassword(email, otp, newPassword);
      setMessage(res.data.msg);
      alert("Password reset successfully! You can now log in with your new password.");
      navigate("/login"); // Redirect to login page
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to reset password. Please check your OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#ECEFF1] flex items-center justify-center">
      <form
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
        onSubmit={step === 1 ? handleEmailSubmit : handleResetPasswordSubmit}
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-primary">
          {step === 1 ? "Forgot Password" : "Reset Password"}
        </h2>

        {message && <p className="text-green-500 text-sm mb-4 text-center">{message}</p>}
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        {loading && <p className="text-blue-500 text-sm mb-4 text-center">Loading...</p>}

        {step === 1 ? (
          <>
            <p className="text-gray-600 mb-4 text-center">
              Enter your email address to receive an OTP for password reset.
            </p>
            <input
              name="email"
              placeholder="Enter your email"
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="mt-6 w-full bg-primary text-white py-2 rounded hover:bg-[#2a4568] transition"
              disabled={loading}
            >
              Send OTP
            </button>
          </>
        ) : (
          <>
            <p className="text-gray-600 mb-4 text-center">
              An OTP has been sent to <span className="font-semibold">{email}</span>.
              Enter the OTP and your new password below.
            </p>
            <input
              name="otp"
              placeholder="Enter OTP"
              type="text"
              className="input"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              minLength="6"
              maxLength="6"
            />
            <input
              name="newPassword"
              placeholder="New Password"
              type="password"
              className="input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <input
              name="confirmPassword"
              placeholder="Confirm New Password"
              type="password"
              className="input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="mt-6 w-full bg-primary text-white py-2 rounded hover:bg-[#2a4568] transition"
              disabled={loading}
            >
              Reset Password
            </button>
          </>
        )}

        <p className="mt-4 text-center text-gray-600 text-sm">
          <Link to="/login" className="text-primary hover:underline">Back to Login</Link>
        </p>
      </form>
    </div>
  );
};

export default ForgotPassword;