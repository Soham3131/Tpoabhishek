import axios from "axios";

const axiosInstance = axios.create({
   baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  withCredentials: true,
});

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
      // Fetch CSRF token from the dedicated endpoint
      // const csrfResponse = await fetch("http://localhost:5000/csrf-token", {
      //   method: 'GET', // Ensure it's a GET request
      //   credentials: 'include'
      // });
const csrfResponse = await fetch(`${import.meta.env.VITE_API_URL}/csrf-token`, {
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
      // Decide how to handle this critical error:
      // Option 1: Re-throw to stop the request (recommended for security)
      // throw new axios.Cancel('CSRF token acquisition failed');
      // Option 2: Let it proceed, expecting backend to reject
    }
  } else {
      // Ensure X-CSRF-Token header is absent for non-CSRF protected routes/methods
      delete config.headers["X-CSRF-Token"];
      console.log('  Skipping CSRF header for this request.');
  }

  return config;
});

export default axiosInstance;