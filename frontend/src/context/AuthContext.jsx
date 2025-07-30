

// import React, { createContext, useContext, useEffect, useState } from "react";
// import axios from "../utils/axios"
// import axiosInstance from "../utils/axios";
// import { jwtDecode } from "jwt-decode"; 
// const AuthContext = createContext();


// export const AuthProvider = ({ children }) => {
//   // Store the entire user object or null if not logged in
//   const [user, setUser] = useState(null);
//   const isLoggedIn = !!user; // Derived state: true if user is not null

//   // Check login status on app mount
//   useEffect(() => {
//     const checkLogin = async () => {
//       try {
        
//         const res = await axiosInstance.get(`${process.env.REACT_APP_API_URL}/api/auth/me`, {
//           withCredentials: true, // Crucial for sending cookies
//         });

//          // --- ADD THESE LOGS1 ---
//             console.log("AUTHCONTEXT: /api/auth/me successful response:", res);
//             console.log("AUTHCONTEXT: User from /api/auth/me:", res.data);
//             // --- END ADDED LOGS ---


        
//         // If successful, user data is in res.data
//         setUser(res.data); // Set the user object
//       } catch (err) {
        
//        // --- ADD THESE LOGS1 ---
//             console.error("AuthContext checkLogin error:", err.response?.data || err.message || err);
//             console.error("AuthContext checkLogin full error object:", err);
//             // --- END ADDED LOGS ---

//         setUser(null); // Clear user data
//       }
//     };

//     checkLogin();
//   }, []); // Run once on component mount

//   // Pass user object and setUser function down the context
//   return (
//     <AuthContext.Provider value={{ user, setUser, isLoggedIn }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

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
          console.log("AUTHCONTEXT: Decoded user from stored JWT:", decoded);
          // --- END MODIFIED ---

          // --- MODIFIED: Make a call to /api/auth/me to verify token with backend ---
          // axiosInstance will automatically add the Authorization header
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