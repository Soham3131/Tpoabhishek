

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
        
        const res = await axiosInstance.get(`${process.env.REACT_APP_API_URL}/api/auth/me`, {
          withCredentials: true, // Crucial for sending cookies
        });

         // --- ADD THESE LOGS1 ---
            console.log("AUTHCONTEXT: /api/auth/me successful response:", res);
            console.log("AUTHCONTEXT: User from /api/auth/me:", res.data);
            // --- END ADDED LOGS ---


        
        // If successful, user data is in res.data
        setUser(res.data); // Set the user object
      } catch (err) {
        
       // --- ADD THESE LOGS1 ---
            console.error("AuthContext checkLogin error:", err.response?.data || err.message || err);
            console.error("AuthContext checkLogin full error object:", err);
            // --- END ADDED LOGS ---

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