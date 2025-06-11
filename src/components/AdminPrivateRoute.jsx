import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminPrivateRoute = () => {
  const { user, isLoggedIn } = useAuth(); // Get user and isLoggedIn from context

  // If not logged in, redirect to login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // If logged in but not an admin, redirect to student dashboard (or a generic forbidden page)
  if (user && user.role !== 'admin') {
    // You can customize this redirect. Student dashboard is a good default.
    return <Navigate to="/student-dashboard" replace />;
  }

  // If logged in and is an admin, render the child route (AdminDashboard)
  return <Outlet />;
};

export default AdminPrivateRoute;