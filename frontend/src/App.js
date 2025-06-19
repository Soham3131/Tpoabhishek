

// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Login from "./pages/Login";
// import Signup from "./pages/SignupForm";
// import ForgotPassword from "./pages/ForgotPassword";
// import "./index.css";
// import StudentDashboard from "./pages/StudentDashboard";
// import AdminDashboard from "./pages/AdminDashboard";
// import Navbar from "./components/Navbar";
// import AdminPrivateRoute from "./components/AdminPrivateRoute";
// import AdminUserManagement from "./pages/AdminUserManagement";

// // Import Content Listing Pages
// import InternshipsPage from "./pages/InternshipsPage";
// import JobsPage from "./pages/JobsPage";
// import JobFairsPage from "./pages/JobFairsPage";
// import SeminarsPage from "./pages/SeminarsPage";
// import TrainingsPage from "./pages/TrainingsPage";
// import VisitsPage from "./pages/VisitsPage";
// import WorkshopsPage from "./pages/WorkshopsPage";
// import ContentDetailPage from "./components/ContentDetailPage";

// // NEW IMPORTS for Application Pages
// import MyApplicationsPage from "./pages/MyApplicationsPage";
// import AdminApplicationsPage from "./pages/AdminApplicationsPage";


// function App() {
//   return (
//     <Router>
//       <Navbar />
//       <Routes>
//         {/* Default route for the root path, shows StudentDashboard */}
//         <Route path="/" element={<StudentDashboard />} /> 
        
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/forgot-password" element={<ForgotPassword />} />
//         {/* Student dashboard can be accessed directly or via / */}
//         <Route path="/student-dashboard" element={<StudentDashboard />} />
        
//         {/* Content Listing Routes */}
//         <Route path="/internships" element={<InternshipsPage />} />
//         <Route path="/jobs" element={<JobsPage />} />
//         <Route path="/placements" element={<JobsPage />} /> {/* Alias if placements also show as jobs */}
//         <Route path="/jobfairs" element={<JobFairsPage />} />
//         <Route path="/seminars" element={<SeminarsPage />} />
//         <Route path="/trainings" element={<TrainingsPage />} />
//         <Route path="/visits" element={<VisitsPage />} />
//         <Route path="/workshops" element={<WorkshopsPage />} />

//         {/* Content Detail Pages - CRITICAL: These now include '/details/' to match generated links */}
//         <Route path="/internships/details/:id" element={<ContentDetailPage title="Internship" endpoint="/api/internships" contentTypeForTracking="internship" />} />
//         <Route path="/jobs/details/:id" element={<ContentDetailPage title="Job" endpoint="/api/placements" contentTypeForTracking="job" />} />
//         <Route path="/seminars/details/:id" element={<ContentDetailPage title="Seminar" endpoint="/api/seminars" contentTypeForTracking="seminar" />} />
//         <Route path="/trainings/details/:id" element={<ContentDetailPage title="Training" endpoint="/api/trainings" contentTypeForTracking="training" />} />
//         <Route path="/visits/details/:id" element={<ContentDetailPage title="Visit" endpoint="/api/visits" contentTypeForTracking="visit" />} />
//         <Route path="/jobfairs/details/:id" element={<ContentDetailPage title="Job Fair" endpoint="/api/jobfairs" contentTypeForTracking="jobfair" />} />
//         <Route path="/workshops/details/:id" element={<ContentDetailPage title="Workshop" endpoint="/api/workshops" contentTypeForTracking="workshop" />} />

//         {/* NEW ROUTE FOR STUDENT APPLICATIONS */}
//         <Route path="/my-applications" element={<MyApplicationsPage />} />

//         {/* Admin Specific Protected Routes */}
//         <Route element={<AdminPrivateRoute />}>
//           <Route path="/admin-dashboard" element={<AdminDashboard />} />
//           <Route path="/admin/users" element={<AdminUserManagement />} />
//           {/* NEW ROUTE FOR ADMIN ALL APPLICATIONS */}
//           <Route path="/admin/applications" element={<AdminApplicationsPage />} />
//           {/* Add more admin routes here as needed */}
//         </Route>
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/SignupForm";
import ForgotPassword from "./pages/ForgotPassword";
import "./index.css";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Navbar from "./components/Navbar";
import AdminPrivateRoute from "./components/AdminPrivateRoute";
import AdminUserManagement from "./pages/AdminUserManagement";

// Import Content Listing Pages
import InternshipsPage from "./pages/InternshipsPage";
import JobsPage from "./pages/JobsPage";
import JobFairsPage from "./pages/JobFairsPage";
import SeminarsPage from "./pages/SeminarsPage";
import TrainingsPage from "./pages/TrainingsPage";
import VisitsPage from "./pages/VisitsPage";
import WorkshopsPage from "./pages/WorkshopsPage";
import ContentDetailPage from "./components/ContentDetailPage";

// NEW IMPORTS for Application Pages
import MyApplicationsPage from "./pages/MyApplicationsPage";
import AdminApplicationsPage from "./pages/AdminApplicationsPage";

// NEW IMPORTS for Podcast feature
import PodcastsPage from "./pages/PodcastsPage"; // Import the new PodcastsPage
import PodcastDetailPage from "./pages/PodcastDetailPage"; // Import the new PodcastDetailPage


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Default route for the root path, shows StudentDashboard */}
        <Route path="/" element={<StudentDashboard />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* Student dashboard can be accessed directly or via / */}
        <Route path="/student-dashboard" element={<StudentDashboard />} />

        {/* Content Listing Routes */}
        <Route path="/internships" element={<InternshipsPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/placements" element={<JobsPage />} /> {/* Alias if placements also show as jobs */}
        <Route path="/jobfairs" element={<JobFairsPage />} />
        <Route path="/seminars" element={<SeminarsPage />} />
        <Route path="/trainings" element={<TrainingsPage />} />
        <Route path="/visits" element={<VisitsPage />} />
        <Route path="/workshops" element={<WorkshopsPage />} />
        <Route path="/podcasts" element={<PodcastsPage />} /> {/* NEW: Route for Podcasts Listing */}

        {/* Content Detail Pages - CRITICAL: These now include '/details/' to match generated links */}
        <Route path="/internships/details/:id" element={<ContentDetailPage title="Internship" endpoint="/api/internships" contentTypeForTracking="internship" />} />
        <Route path="/jobs/details/:id" element={<ContentDetailPage title="Job" endpoint="/api/placements" contentTypeForTracking="job" />} />
        <Route path="/seminars/details/:id" element={<ContentDetailPage title="Seminar" endpoint="/api/seminars" contentTypeForTracking="seminar" />} />
        <Route path="/trainings/details/:id" element={<ContentDetailPage title="Training" endpoint="/api/trainings" contentTypeForTracking="training" />} />
        <Route path="/visits/details/:id" element={<ContentDetailPage title="Visit" endpoint="/api/visits" contentTypeForTracking="visit" />} />
        <Route path="/jobfairs/details/:id" element={<ContentDetailPage title="Job Fair" endpoint="/api/jobfairs" contentTypeForTracking="jobfair" />} />
        <Route path="/workshops/details/:id" element={<ContentDetailPage title="Workshop" endpoint="/api/workshops" contentTypeForTracking="workshop" />} />
        <Route path="/podcasts/details/:id" element={<PodcastDetailPage />} /> {/* NEW: Route for Podcast Detail */}

        {/* NEW ROUTE FOR STUDENT APPLICATIONS */}
        <Route path="/my-applications" element={<MyApplicationsPage />} />

        {/* Admin Specific Protected Routes */}
        <Route element={<AdminPrivateRoute />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUserManagement />} />
          {/* NEW ROUTE FOR ADMIN ALL APPLICATIONS */}
          <Route path="/admin/applications" element={<AdminApplicationsPage />} />
          {/* Add more admin routes here as needed */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;