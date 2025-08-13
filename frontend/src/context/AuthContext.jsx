

import React, { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../utils/axios";
import { jwtDecode } from "jwt-decode"; // npm install jwt-decode

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const isLoggedIn = !!user;

  useEffect(() => {
    const checkLogin = async () => {
      const storedToken = localStorage.getItem('jwtToken');

      if (storedToken) {
        try {
          // --- MODIFIED: Client-side decode first for immediate UX ---
          const decoded = jwtDecode(storedToken);
          // Check if token is expired client-side
          if (decoded.exp * 1000 < Date.now()) {
            console.log("AUTHCONTEXT: Stored token is expired client-side.");
            localStorage.removeItem('jwtToken');
            setUser(null);
            return;
          }
          // Set initial user based on decoded token (useful for quick UI updates)
          setUser({
            _id: decoded.id,
            role: decoded.role,
            // You might not have all user data in token, so a backend call is still good
            // but this provides immediate partial user state.
          });
          

          const res = await axiosInstance.get(`${process.env.REACT_APP_API_URL}/api/auth/me`);

          // If successful, user data is in res.data, update full user object
          setUser(res.data);
          console.log("AUTHCONTEXT: /api/auth/me successful response, user verified.");
        } catch (err) {
          // If token is invalid, expired (server-side), or /me fails, clear it
          console.error("AuthContext checkLogin error:", err.response?.data || err.message || err);
          console.error("AuthContext checkLogin full error object:", err);
          localStorage.removeItem('jwtToken'); // Clear invalid token
          setUser(null);
        }
      } else {
        console.log("AUTHCONTEXT: No JWT token found in localStorage.");
        setUser(null); // No token, ensure user is null
      }
    };

    checkLogin();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);