// import React, { useEffect, useState } from 'react';
// import axiosInstance from '../utils/axios';
// import { useAuth } from '../context/AuthContext';
// import { TrashIcon } from '@heroicons/react/24/solid';

// const AdminUserManagement = () => {
//   const { user } = useAuth(); // To check if the current user is an admin for delete permissions
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [message, setMessage] = useState(null);

//   const fetchUsers = async () => {
//     setLoading(true);
//     setError(null);
//     setMessage(null);
//     try {
//       // This endpoint needs to be created in backend/routes/adminRoutes.js
//       const res = await axiosInstance.get("/api/admin/users");
//       setUsers(res.data);
//     } catch (err) {
//       console.error("Error fetching users:", err);
//       setError(err.response?.data?.msg || "Failed to load users.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     // Only fetch if the user is an admin. The backend will also enforce this.
//     if (user && user.role === 'admin') {
//       fetchUsers();
//     } else {
//       setError("You are not authorized to view user details.");
//       setLoading(false);
//     }
//   }, [user]);

//   const handleDeleteUser = async (userId, userName) => {
//     if (!window.confirm(`Are you sure you want to delete user: ${userName}? This action cannot be undone.`)) {
//       return; // User cancelled
//     }

//     setLoading(true);
//     setError(null);
//     setMessage(null);
//     try {
//       // This endpoint needs to be created in backend/routes/adminRoutes.js
//       await axiosInstance.delete(`/api/admin/users/${userId}`);
//       setMessage(`User '${userName}' deleted successfully!`);
//       fetchUsers(); // Refresh the list
//     } catch (err) {
//       console.error("Error deleting user:", err);
//       setError(err.response?.data?.msg || "Failed to delete user.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return <div className="container mx-auto px-6 py-8 text-center text-lg">Loading users...</div>;
//   }

//   if (error) {
//     return <div className="container mx-auto px-6 py-8 text-center text-red-600 text-lg">{error}</div>;
//   }

//   if (!users.length && !loading) {
//     return <div className="container mx-auto px-6 py-8 text-center text-gray-600">No users found.</div>;
//   }

//   return (
//     <div className="container mx-auto px-6 py-8">
//       <h1 className="text-3xl font-bold text-primary mb-6">User Management</h1>
//       {message && <p className="text-green-600 text-sm mb-4 text-center">{message}</p>}

//       <div className="bg-white shadow-md rounded-lg overflow-hidden">
//         <table className="min-w-full leading-normal">
//           <thead>
//             <tr>
//               <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                 Name
//               </th>
//               <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                 Email
//               </th>
//               <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                 Role
//               </th>
//               <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                 Verified
//               </th>
//               <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((userItem) => ( // Renamed to userItem to avoid conflict with 'user' from useAuth
//               <tr key={userItem._id} className="hover:bg-gray-50">
//                 <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
//                   <p className="text-gray-900 whitespace-no-wrap">{userItem.name}</p>
//                 </td>
//                 <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
//                   <p className="text-gray-900 whitespace-no-wrap">{userItem.email}</p>
//                 </td>
//                 <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm capitalize">
//                   <p className="text-gray-900 whitespace-no-wrap">{userItem.role}</p>
//                 </td>
//                 <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
//                   <span
//                     className={`relative inline-block px-3 py-1 font-semibold leading-tight ${
//                       userItem.isVerified ? 'text-green-900' : 'text-red-900'
//                     }`}
//                   >
//                     <span
//                       aria-hidden
//                       className={`absolute inset-0 opacity-50 rounded-full ${
//                         userItem.isVerified ? 'bg-green-200' : 'bg-red-200'
//                       }`}
//                     ></span>
//                     <span className="relative">{userItem.isVerified ? 'Yes' : 'No'}</span>
//                   </span>
//                 </td>
//                 <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
//                   <button
//                     onClick={() => handleDeleteUser(userItem._id, userItem.name)}
//                     className="text-red-600 hover:text-red-900 focus:outline-none focus:shadow-outline-red active:text-red-700"
//                     title="Delete User"
//                   >
//                     <TrashIcon className="w-5 h-5" />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default AdminUserManagement;

import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { TrashIcon } from '@heroicons/react/24/solid';

const AdminUserManagement = () => {
  const { user } = useAuth(); // To check if the current user is an admin for delete permissions
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await axiosInstance.get("/api/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.response?.data?.msg || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchUsers();
    } else {
      setError("You are not authorized to view user details.");
      setLoading(false);
    }
  }, [user]);

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user: ${userName}? This action cannot be undone.`)) {
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      await axiosInstance.delete(`/api/admin/users/${userId}`);
      setMessage(`User '${userName}' deleted successfully!`);
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
      setError(err.response?.data?.msg || "Failed to delete user.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto px-6 py-8 text-center text-lg">Loading users...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-6 py-8 text-center text-red-600 text-lg">{error}</div>;
  }

  if (!users.length && !loading) {
    return <div className="container mx-auto px-6 py-8 text-center text-gray-600">No users found.</div>;
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-primary mb-6">User Management</h1>
      {message && <p className="text-green-600 text-sm mb-4 text-center">{message}</p>}

      <div className="bg-white shadow-md rounded-lg overflow-x-auto w-full">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full leading-normal table-auto">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Verified
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((userItem) => (
                <tr key={userItem._id} className="hover:bg-gray-50">
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{userItem.name}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{userItem.email}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm capitalize">
                    <p className="text-gray-900 whitespace-no-wrap">{userItem.role}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <span
                      className={`relative inline-block px-3 py-1 font-semibold leading-tight ${
                        userItem.isVerified ? 'text-green-900' : 'text-red-900'
                      }`}
                    >
                      <span
                        aria-hidden
                        className={`absolute inset-0 opacity-50 rounded-full ${
                          userItem.isVerified ? 'bg-green-200' : 'bg-red-200'
                        }`}
                      ></span>
                      <span className="relative">{userItem.isVerified ? 'Yes' : 'No'}</span>
                    </span>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                    <button
                      onClick={() => handleDeleteUser(userItem._id, userItem.name)}
                      className="text-red-600 hover:text-red-900 focus:outline-none focus:shadow-outline-red active:text-red-700"
                      title="Delete User"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUserManagement;
