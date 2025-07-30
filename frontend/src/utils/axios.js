// import axios from "axios";
// const baseURL = process.env.REACT_APP_API_URL;
// // console.log(process.env.REACT_APP_API_URL);



// if (!baseURL) {
//   throw new Error("REACT_APP_API_URL is not defined! Check your .env or Vercel env config.");
// }

// const axiosInstance = axios.create({
  
//    baseURL,
//   //withCredentials: true,
// });

// // console.log("AxiosInstance baseURL is set to:", axiosInstance.defaults.baseURL); // <--- ADD THIS LINE

// axiosInstance.interceptors.request.use(async (config) => {
//   const methodsRequiringCsrf = ['post', 'put', 'delete'];

//   // Identify if it's an auth route (excluded from CSRF on backend)
//   const isAuthRoute = config.url.includes('/api/auth/');

//   // Decide if we should add CSRF token to THIS request
//   const shouldAddCsrfHeader = methodsRequiringCsrf.includes(config.method) && !isAuthRoute;

//   // Debugging logs1 (keep temporarily)
//   console.log('Axios Interceptor Debug:');
//   console.log('  Request URL:', config.url);
//   console.log('  Request Method:', config.method);
//   console.log('  Is Auth Route:', isAuthRoute);
//   console.log('  Should Add CSRF Header:', shouldAddCsrfHeader);

//   if (shouldAddCsrfHeader) {
//     try {
     
// const csrfResponse = await fetch(`${process.env.REACT_APP_API_URL}/csrf-token`, {
//   method: 'GET',
//   withCredentials: true
// });

//  // --- ADD THESE LOGS1 ---
//             console.log("CSRF Token Fetch Response Status:", csrfResponse.status);
//             // --- END ADDED LOGS ---

//       if (!csrfResponse.ok) {
//           // If the csrf-token endpoint itself returns an error (e.g., 404/500)
//           const errorText = await csrfResponse.text(); // Read as text to see HTML error
//           console.error(`CSRF token fetch failed with status ${csrfResponse.status}: ${errorText}`);
//           throw new Error(`Failed to get CSRF token: ${csrfResponse.statusText}`);
//       }

//       const data = await csrfResponse.json();
      
//       if (!data.csrfToken) {
//         console.error("CSRF token not found in response from /csrf-token endpoint.");
//         throw new Error("CSRF token not found in response.");
//       }

//       config.headers["X-CSRF-Token"] = data.csrfToken;


//       // --- ADD THIS LOG1 ---
//             console.log('  Full config headers before sending request (with CSRF):', config.headers);
//             // --- END ADDED LOG ---


//       console.log('  CSRF token successfully added to header:', data.csrfToken);

//     } catch (error) {
//       console.error("  Error in CSRF token interception:", error);
    
//     }
//   } else {
//       // Ensure X-CSRF-Token header is absent for non-CSRF protected routes/methods
//       delete config.headers["X-CSRF-Token"];
//       console.log('  Skipping CSRF header for this request.');

//        // --- ADD THIS LOG1 ---
//         console.log('  Full config headers before sending request (no CSRF):', config.headers);
//         // --- END ADDED LOG ---
//   }

//   return config;
// });

// export default axiosInstance;

import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL;

if (!baseURL) {
  throw new Error("REACT_APP_API_URL is not defined! Check your .env or Vercel env config.");
}

const axiosInstance = axios.create({
    baseURL,
    // withCredentials: true, // You can keep this if you still want CSRF cookies for POST/PUT/DELETE
                               // and are okay with the browser handling them.
                               // If you want pure bearer token, you can remove it,
                               // but CSRF often uses HttpOnly cookies.
});

// Add a request interceptor to add the Authorization header
axiosInstance.interceptors.request.use(async (config) => {
    const token = localStorage.getItem('jwtToken'); // Get token from localStorage
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Add Bearer token
        console.log('Axios Interceptor: Authorization header added.');
    } else {
        // console.log('Axios Interceptor: No JWT token found in localStorage.');
    }

    // --- YOUR EXISTING CSRF LOGIC REMAINS (if you want CSRF protection) ---
    const methodsRequiringCsrf = ['post', 'put', 'delete'];
    const isAuthRoute = config.url.includes('/api/auth/');
    const shouldAddCsrfHeader = methodsRequiringCsrf.includes(config.method) && !isAuthRoute;

    // console.log('Axios Interceptor Debug:');
    // console.log('  Request URL:', config.url);
    // console.log('  Request Method:', config.method);
    // console.log('  Is Auth Route:', isAuthRoute);
    // console.log('  Should Add CSRF Header:', shouldAddCsrfHeader);

    if (shouldAddCsrfHeader) {
        try {
            const csrfResponse = await axios.get(`${baseURL}/csrf-token`); // Use axios directly, no withCredentials needed if CSRF cookie is HttpOnly and same-site
                                                                           // If _csrf cookie is also cross-site, you might need withCredentials:true here
            if (!csrfResponse.data || !csrfResponse.data.csrfToken) {
                console.error("CSRF token not found in response from /csrf-token endpoint.");
                throw new Error("CSRF token not found in response.");
            }
            config.headers["X-CSRF-Token"] = csrfResponse.data.csrfToken;
            console.log('  CSRF token successfully added to header:', csrfResponse.data.csrfToken);
            // console.log('  Full config headers before sending request (with CSRF):', config.headers);
        } catch (error) {
            console.error("  Error in CSRF token interception:", error);
        }
    } else {
        if (config.headers["X-CSRF-Token"]) {
            delete config.headers["X-CSRF-Token"];
        }
        // console.log('  Skipping CSRF header for this request.');
        // console.log('  Full config headers before sending request (no CSRF):', config.headers);
    }
    // --- END CSRF LOGIC ---

    return config;
});

export default axiosInstance;