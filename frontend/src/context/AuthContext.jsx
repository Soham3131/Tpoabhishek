

import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "../utils/axios"
import axiosInstance from "../utils/axios"; 
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Store the entire user object or null if not logged in
  const [user, setUser] = useState(null);
  const isLoggedIn = !!user; // Derived state: true if user is not null

  // Check login status on app mount
  useEffect(() => {
    const checkLogin = async () => {
      try {
        // Use axiosInstance to benefit from withCredentials and interceptors
        const res = await axiosInstance.get(`${process.env.REACT_APP_API_URL}/api/auth/me`, {
          withCredentials: true, // Crucial for sending cookies
        });
        
        // If successful, user data is in res.data
        setUser(res.data); // Set the user object
      } catch (err) {
        // If 401 or any error, user is not logged in or token is invalid
        console.error("AuthContext checkLogin error:", err);
        setUser(null); // Clear user data
      }
    };

    checkLogin();
  }, []); // Run once on component mount

  // Pass user object and setUser function down the context
  return (
    <AuthContext.Provider value={{ user, setUser, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);