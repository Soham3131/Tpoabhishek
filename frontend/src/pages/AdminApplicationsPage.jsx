// import React, { useEffect, useState } from 'react';
// import axiosInstance from '../utils/axios';
// import { useAuth } from '../context/AuthContext';

// const AdminApplicationReportPage = () => {
//   const { user } = useAuth();
//   const [reportData, setReportData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchApplicationReport = async () => {
//       if (!user || user.role !== 'admin') {
//         setError("You are not authorized to view this report.");
//         setLoading(false);
//         return;
//       }
//       setLoading(true);
//       setError(null);
//       try {
//         // This endpoint will be added in backend/controllers/applicationController.js
//         const res = await axiosInstance.get("/api/applications/report");
//         setReportData(res.data);
//       } catch (err) {
//         console.error("Error fetching application report:", err);
//         setError(err.response?.data?.msg || "Failed to load application report.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchApplicationReport();
//   }, [user]);

//   if (loading) {
//     return <div className="container mx-auto px-6 py-8 text-center text-lg">Loading Application Report...</div>;
//   }

//   if (error) {
//     return <div className="container mx-auto px-6 py-8 text-center text-red-600 text-lg">{error}</div>;
//   }

//   if (reportData.length === 0) {
//     return <div className="container mx-auto px-6 py-8 text-center text-gray-600">No applications to report yet.</div>;
//   }

//   return (
//     <div className="container mx-auto px-6 py-8">
//       <h1 className="text-3xl font-bold text-primary mb-6">Application Report by Content Type</h1>

//       {reportData.map((contentTypeGroup) => (
//         <div key={contentTypeGroup.contentType} className="mb-8 p-6 bg-white rounded-lg shadow-md">
//           <h2 className="text-2xl font-semibold text-secondary mb-4 capitalize">
//             {contentTypeGroup.contentType} Applications ({contentTypeGroup.totalCount})
//           </h2>

//           <div className="space-y-6">
//             {contentTypeGroup.items.map((item) => (
//               <div key={item.contentId} className="bg-gray-50 p-4 rounded-md shadow-sm border border-gray-200">
//                 <h3 className="text-lg font-medium text-gray-800 mb-2">
//                   {item.title || item.companyName || `[Unnamed ${contentTypeGroup.contentType}]`} ({item.applicationCount} applications)
//                 </h3>
//                 <p className="text-sm text-gray-600 mb-3">
//                   {item.location && `Location: ${item.location} | `}
//                   {item.company && `Company: ${item.company}`}
//                   {item.organizer && `Organizer: ${item.organizer}`}
//                   {item.provider && `Provider: ${item.provider}`}
//                 </p>

//                 {item.applicants.length > 0 ? (
//                   <div>
//                     <h4 className="text-md font-semibold text-gray-700 mb-2">Applied Students:</h4>
//                     <ul className="list-disc list-inside text-sm text-gray-700">
//                       {item.applicants.map((applicant) => (
//                         <li key={applicant._id}>
//                           {applicant.name} ({applicant.email}) {applicant.studentId && `[ID: ${applicant.studentId}]`}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 ) : (
//                   <p className="text-sm text-gray-500">No students found for this item.</p>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default AdminApplicationReportPage;
import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axios';
import { useAuth } from '../context/AuthContext';

const AdminApplicationReportPage = () => {
  const { user } = useAuth();
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplicationReport = async () => {
      if (!user || user.role !== 'admin') {
        setError("You are not authorized to view this report.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        // This endpoint will be added in backend/controllers/applicationController.js
        const res = await axiosInstance.get("/api/applications/report");
        setReportData(res.data);
      } catch (err) {
        console.error("Error fetching application report:", err);
        setError(err.response?.data?.msg || "Failed to load application report.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationReport();
  }, [user]);

  if (loading) {
    return <div className="container mx-auto px-6 py-8 text-center text-lg">Loading Application Report...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-6 py-8 text-center text-red-600 text-lg">{error}</div>;
  }

  if (reportData.length === 0) {
    return <div className="container mx-auto px-6 py-8 text-center text-gray-600">No applications to report yet.</div>;
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-primary mb-6">Application Report by Content Type</h1>

      {reportData.map((contentTypeGroup) => (
        <div key={contentTypeGroup.contentType} className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-secondary mb-4 capitalize">
            {contentTypeGroup.contentType} Applications ({contentTypeGroup.totalCount})
          </h2>

          <div className="space-y-6">
            {contentTypeGroup.items.map((item) => (
              <div key={item.contentId} className="bg-gray-50 p-4 rounded-md shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  {item.title || item.companyName || `[Unnamed ${contentTypeGroup.contentType}]`} ({item.applicationCount} applications)
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {item.location && `Location: ${item.location} | `}
                  {item.company && `Company: ${item.company}`}
                  {item.organizer && `Organizer: ${item.organizer}`}
                  {item.provider && `Provider: ${item.provider}`}
                </p>

                {item.applicants.length > 0 ? (
                  <div>
                    <h4 className="text-md font-semibold text-gray-700 mb-2">Applied Students:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-700">
                      {item.applicants.map((applicant) => (
                        <li key={applicant._id}>
                          {applicant.name} ({applicant.email}) {applicant.phone && ` | Phone: ${applicant.phone}`} {applicant.studentId && `[ID: ${applicant.studentId}]`}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No students found for this item.</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminApplicationReportPage;
