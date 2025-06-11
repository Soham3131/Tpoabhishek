// // components/ProfileMenu.jsx
// import { useState, useEffect } from "react";
// import { Menu, Transition } from "@headlessui/react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// export default function ProfileMenu() {
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     axios.get("/api/resume", { withCredentials: true })
//       .then(res => setUser(res.data))
//       .catch(() => setUser(null));
//   }, []);

//   const handleLogout = async () => {
//     await axios.post("/api/auth/logout", {}, { withCredentials: true });
//     navigate("/login");
//   };

//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", "your_upload_preset"); // Cloudinary preset

//     const res = await axios.post("https://api.cloudinary.com/v1_1/your_cloud_name/image/upload", formData);
//     // Save `res.data.secure_url` in user DB later if needed
//   };

//   if (!user) return null;

//   return (
//     <Menu as="div" className="relative inline-block text-left">
//       <Menu.Button>
//         <img
//           src={user.image || "/default-profile.png"}
//           alt="profile"
//           className="w-10 h-10 rounded-full object-cover border-2 border-orange-500"
//         />
//       </Menu.Button>

//       <Transition>
//         <Menu.Items className="absolute right-0 z-10 mt-2 w-64 origin-top-right rounded-md bg-white shadow-lg p-4 space-y-2 text-sm">
//           <div className="text-lg font-bold">{user.fullName || "Set Name"}</div>
//           <div className="text-gray-500">{user.email}</div>

//           <hr />
//           <div className="text-sm">
//             <label className="font-medium">Profile Image</label>
//             <input type="file" onChange={handleImageUpload} className="mt-1" />
//           </div>

//           <div className="text-sm">
//             <label className="font-medium">Education</label>
//             {user.education?.length > 0 ? (
//               user.education.map((edu, idx) => (
//                 <div key={idx} className="mt-1">
//                   <div>{edu.degree} @ {edu.institution}</div>
//                 </div>
//               ))
//             ) : (
//               <div className="text-gray-400 italic">Not added yet</div>
//             )}
//           </div>

//           <button onClick={() => navigate("/edit-profile")} className="block w-full text-left text-blue-500">
//             Edit Profile
//           </button>
//           <button onClick={handleLogout} className="block w-full text-left text-red-500">
//             Logout
//           </button>
//         </Menu.Items>
//       </Transition>
//     </Menu>
//   );
// }
