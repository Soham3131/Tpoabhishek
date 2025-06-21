import axios from "axios";
const baseURL = process.env.REACT_APP_API_URL;
console.log(process.env.REACT_APP_API_URL);



if (!baseURL) {
  throw new Error("REACT_APP_API_URL is not defined! Check your .env or Vercel env config.");
}

const axiosInstance = axios.create({
  
   baseURL,
  withCredentials: true,
});

console.log("AxiosInstance baseURL is set to:", axiosInstance.defaults.baseURL); // <--- ADD THIS LINE

axiosInstance.interceptors.request.use(async (config) => {
  const methodsRequiringCsrf = ['post', 'put', 'delete'];

  // Identify if it's an auth route (excluded from CSRF on backend)
  const isAuthRoute = config.url.includes('/api/auth/');

  // Decide if we should add CSRF token to THIS request
  const shouldAddCsrfHeader = methodsRequiringCsrf.includes(config.method) && !isAuthRoute;

  // Debugging logs (keep temporarily)
  console.log('Axios Interceptor Debug:');
  console.log('  Request URL:', config.url);
  console.log('  Request Method:', config.method);
  console.log('  Is Auth Route:', isAuthRoute);
  console.log('  Should Add CSRF Header:', shouldAddCsrfHeader);

  if (shouldAddCsrfHeader) {
    try {
     
const csrfResponse = await fetch(`${process.env.REACT_APP_API_URL}/csrf-token`, {
  method: 'GET',
  credentials: 'include'
});

      if (!csrfResponse.ok) {
          // If the csrf-token endpoint itself returns an error (e.g., 404/500)
          const errorText = await csrfResponse.text(); // Read as text to see HTML error
          console.error(`CSRF token fetch failed with status ${csrfResponse.status}: ${errorText}`);
          throw new Error(`Failed to get CSRF token: ${csrfResponse.statusText}`);
      }

      const data = await csrfResponse.json();
      
      if (!data.csrfToken) {
        console.error("CSRF token not found in response from /csrf-token endpoint.");
        throw new Error("CSRF token not found in response.");
      }

      config.headers["X-CSRF-Token"] = data.csrfToken;
      console.log('  CSRF token successfully added to header:', data.csrfToken);

    } catch (error) {
      console.error("  Error in CSRF token interception:", error);
    
    }
  } else {
      // Ensure X-CSRF-Token header is absent for non-CSRF protected routes/methods
      delete config.headers["X-CSRF-Token"];
      console.log('  Skipping CSRF header for this request.');
  }

  return config;
});

export default axiosInstance;