

// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import axiosInstance from "../utils/axios";
// import {
//     updateMyProfile,
//     getMyResumeDetails,
//     createOrUpdateMyResume,
//     logoutUser,
// } from '../services/authService';
// import { UserCircleIcon, CameraIcon, TrashIcon, PlusCircleIcon, DocumentArrowDownIcon } from '@heroicons/react/24/solid';


// const UserProfileEditor = ({ onCloseDropdown }) => {
//     const { user, setUser } = useAuth();
//     const [profileFormData, setProfileFormData] = useState({
//         name: user?.name || '',
//         email: user?.email || '',
//         profilePicture: user?.profilePicture || '',
//     });
//     const [resumeFormData, setResumeFormData] = useState({
//         phone: '',
//         linkedin: '',
//         github: '',
//         portfolio: '',
//         summary: '',
//         education: [],
//         experience: [],
//         projects: [],
//         skills: [],
//         achievements: [],
//         certifications: [],
//         languages: [],
//     });
//     const [profilePictureFile, setProfilePictureFile] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [saving, setSaving] = useState(false);
//     const [error, setError] = useState(null);
//     const [message, setMessage] = useState(null);
//     const [isEditing, setIsEditing] = useState(false);

//     useEffect(() => {
//         const fetchUserData = async () => {
//             if (!user) {
//                 setError("User not logged in.");
//                 setLoading(false);
//                 return;
//             }

//             setLoading(true);
//             setError(null);
//             setMessage(null);

//             setProfileFormData({
//                 name: user.name,
//                 email: user.email,
//                 profilePicture: user.profilePicture,
//             });

//             if (user.role === 'user') {
//                 try {
//                     const resumeRes = await getMyResumeDetails();
//                     const fetchedResumeData = resumeRes.data;

//                     setResumeFormData({
//                         phone: fetchedResumeData.phone || '',
//                         linkedin: fetchedResumeData.linkedin || '',
//                         github: fetchedResumeData.github || '',
//                         portfolio: fetchedResumeData.portfolio || '',
//                         summary: fetchedResumeData.summary || '',
//                         education: fetchedResumeData.education || [],
//                         experience: fetchedResumeData.experience || [],
//                         projects: fetchedResumeData.projects || [],
//                         skills: fetchedResumeData.skills || [],
//                         achievements: fetchedResumeData.achievements || [],
//                         certifications: fetchedResumeData.certifications || [],
//                         languages: fetchedResumeData.languages || [],
//                     });
//                     setMessage("Profile data loaded.");

//                 } catch (err) {
//                     console.error("Error fetching resume data:", err);
//                     if (err.response && err.response.status === 404 && err.response.data.msg === "Resume not found for this user") {
//                         setError("No resume found. Please add your details.");
//                         setResumeFormData({
//                             phone: '', linkedin: '', github: '', portfolio: '', summary: '',
//                             education: [], experience: [], projects: [], skills: [], achievements: [], certifications: [], languages: []
//                         });
//                         setIsEditing(true);
//                     } else {
//                         setError(err.response?.data?.msg || "Failed to load resume data.");
//                     }
//                 }
//             } else {
//                 setResumeFormData({
//                     phone: '', linkedin: '', github: '', portfolio: '', summary: '',
//                     education: [], experience: [], projects: [], skills: [], achievements: [], certifications: [], languages: []
//                 });
//             }
//             setLoading(false);
//         };

//         fetchUserData();
//     }, [user]);

//     const handleProfileChange = (e) => {
//         setProfileFormData({ ...profileFormData, [e.target.name]: e.target.value });
//     };

//     const handleResumeChange = (e) => {
//         setResumeFormData({ ...resumeFormData, [e.target.name]: e.target.value });
//     };

//     const handleProfilePictureFileChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setProfilePictureFile(file);
//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 setProfileFormData(prev => ({ ...prev, profilePicture: reader.result }));
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     const handleEducationChange = (index, e) => {
//         const updatedEducation = [...resumeFormData.education];
//         updatedEducation[index] = { ...updatedEducation[index], [e.target.name]: e.target.value };
//         setResumeFormData(prev => ({ ...prev, education: updatedEducation }));
//     };
//     const addEducation = () => {
//         setResumeFormData(prev => ({
//             ...prev,
//             education: [...prev.education, { degree: "", institution: "", startDate: "", endDate: "", description: "" }]
//         }));
//     };
//     const removeEducation = (index) => {
//         const updatedEducation = resumeFormData.education.filter((_, i) => i !== index);
//         setResumeFormData(prev => ({ ...prev, education: updatedEducation }));
//     };

//     const handleExperienceChange = (index, e) => {
//         const updatedExperience = [...resumeFormData.experience];
//         updatedExperience[index] = { ...updatedExperience[index], [e.target.name]: e.target.value };
//         setResumeFormData(prev => ({ ...prev, experience: updatedExperience }));
//     };
//     const addExperience = () => {
//         setResumeFormData(prev => ({
//             ...prev,
//             experience: [...prev.experience, { jobTitle: "", company: "", location: "", startDate: "", endDate: "", description: "" }]
//         }));
//     };
//     const removeExperience = (index) => {
//         const updatedExperience = resumeFormData.experience.filter((_, i) => i !== index);
//         setResumeFormData(prev => ({ ...prev, experience: updatedExperience }));
//     };

//     const handleProjectChange = (index, e) => {
//         const updatedProjects = [...resumeFormData.projects];
//         if (e.target.name === "technologies") {
//             updatedProjects[index] = { ...updatedProjects[index], technologies: e.target.value.split(',').map(tech => tech.trim()) };
//         } else {
//             updatedProjects[index] = { ...updatedProjects[index], [e.target.name]: e.target.value };
//         }
//         setResumeFormData(prev => ({ ...prev, projects: updatedProjects }));
//     };
//     const addProject = () => {
//         setResumeFormData(prev => ({
//             ...prev,
//             projects: [...prev.projects, { projectName: "", description: "", technologies: [], projectLink: "" }]
//         }));
//     };
//     const removeProject = (index) => {
//         const updatedProjects = resumeFormData.projects.filter((_, i) => i !== index);
//         setResumeFormData(prev => ({ ...prev, projects: updatedProjects }));
//     };

//     const handleSkillChange = (index, e) => {
//         const updatedSkills = [...resumeFormData.skills];
//         updatedSkills[index] = { ...updatedSkills[index], [e.target.name]: e.target.value };
//         setResumeFormData(prev => ({ ...prev, skills: updatedSkills }));
//     };
//     const addSkill = () => {
//         setResumeFormData(prev => ({
//             ...prev,
//             skills: [...prev.skills, { name: "", level: "" }]
//         }));
//     };
//     const removeSkill = (index) => {
//         const updatedSkills = resumeFormData.skills.filter((_, i) => i !== index);
//         setResumeFormData(prev => ({ ...prev, skills: updatedSkills }));
//     };

//     const handleAchievementChange = (index, e) => {
//         const updatedAchievements = [...resumeFormData.achievements];
//         updatedAchievements[index] = e.target.value;
//         setResumeFormData(prev => ({ ...prev, achievements: updatedAchievements }));
//     };
//     const addAchievement = () => {
//         setResumeFormData(prev => ({
//             ...prev,
//             achievements: [...prev.achievements, ""]
//         }));
//     };
//     const removeAchievement = (index) => {
//         const updatedAchievements = resumeFormData.achievements.filter((_, i) => i !== index);
//         setResumeFormData(prev => ({ ...prev, achievements: updatedAchievements }));
//     };

//     const handleCertificationChange = (index, e) => {
//         const updatedCerts = [...resumeFormData.certifications];
//         updatedCerts[index] = { ...updatedCerts[index], [e.target.name]: e.target.value };
//         setResumeFormData(prev => ({ ...prev, certifications: updatedCerts }));
//     };
//     const addCertification = () => {
//         setResumeFormData(prev => ({
//             ...prev,
//             certifications: [...prev.certifications, { name: "", issuer: "" }]
//         }));
//     };
//     const removeCertification = (index) => {
//         const updatedCerts = resumeFormData.certifications.filter((_, i) => i !== index);
//         setResumeFormData(prev => ({ ...prev, certifications: updatedCerts }));
//     };

//     const handleLanguageChange = (index, e) => {
//         const updatedLangs = [...resumeFormData.languages];
//         updatedLangs[index] = { ...updatedLangs[index], [e.target.name]: e.target.value };
//         setResumeFormData(prev => ({ ...prev, languages: updatedLangs }));
//     };
//     const addLanguage = () => {
//         setResumeFormData(prev => ({
//             ...prev,
//             languages: [...prev.languages, { name: "", proficiency: "" }]
//         }));
//     };
//     const removeLanguage = (index) => {
//         const updatedLangs = resumeFormData.languages.filter((_, i) => i !== index);
//         setResumeFormData(prev => ({ ...prev, languages: updatedLangs }));
//     };

//     const handleSave = async () => {
//         setSaving(true);
//         setError(null);
//         setMessage(null);

//         try {
//             const userUpdatePayload = new FormData();
//             userUpdatePayload.append('name', profileFormData.name);
//             userUpdatePayload.append('email', profileFormData.email);
//             if (profilePictureFile) {
//                 userUpdatePayload.append('profilePicture', profilePictureFile);
//             }

//             const userUpdateRes = await updateMyProfile(userUpdatePayload);
//             setUser(userUpdateRes.data.user);
//             setProfileFormData(prev => ({ ...prev, profilePicture: userUpdateRes.data.user.profilePicture }));
//             setProfilePictureFile(null);

//             if (user.role === 'user') {
//                 // Filter out empty fields to prevent Mongoose validation errors
//                 const cleanedEducation = resumeFormData.education.filter(edu => edu.degree && edu.degree.trim() !== '' && edu.institution && edu.institution.trim() !== '');
//                 const cleanedExperience = resumeFormData.experience.filter(exp => exp.jobTitle && exp.jobTitle.trim() !== '' && exp.company && exp.company.trim() !== '');
//                 const cleanedProjects = resumeFormData.projects.filter(proj => proj.projectName && proj.projectName.trim() !== '');
//                 const cleanedSkills = resumeFormData.skills.filter(skill => skill.name && skill.name.trim() !== '');
//                 const cleanedAchievements = resumeFormData.achievements.filter(ach => ach && ach.trim() !== '');
//                 const cleanedCertifications = resumeFormData.certifications.filter(cert => cert.name && cert.name.trim() !== '');
//                 const cleanedLanguages = resumeFormData.languages.filter(lang => lang.name && lang.name.trim() !== '');

//                 const resumeUpdatePayload = {
//                     user: user._id,
//                     fullName: profileFormData.name,
//                     email: profileFormData.email,
//                     phone: resumeFormData.phone,
//                     linkedin: resumeFormData.linkedin,
//                     github: resumeFormData.github,
//                     portfolio: resumeFormData.portfolio,
//                     summary: resumeFormData.summary,
//                     education: cleanedEducation.map(edu => ({
//                         ...edu,
//                         startDate: edu.startDate ? new Date(edu.startDate).toISOString() : null,
//                         endDate: edu.endDate ? new Date(edu.endDate).toISOString() : null,
//                     })),
//                     experience: cleanedExperience.map(exp => ({
//                         ...exp,
//                         startDate: exp.startDate ? new Date(exp.startDate).toISOString() : null,
//                         endDate: exp.endDate ? new Date(exp.endDate).toISOString() : null,
//                     })),
//                     projects: cleanedProjects.map(proj => ({
//                         ...proj,
//                         technologies: Array.isArray(proj.technologies) ? proj.technologies : (proj.technologies || '').split(',').map(t => t.trim()).filter(Boolean)
//                     })),
//                     skills: cleanedSkills,
//                     achievements: cleanedAchievements,
//                     certifications: cleanedCertifications,
//                     languages: cleanedLanguages,
//                 };
//                 await createOrUpdateMyResume(resumeUpdatePayload);
//             }

//             setMessage("Profile updated successfully!");
//             setIsEditing(false);
//         } catch (err) {
//             console.error("Error saving profile:", err);
//             setError(err.response?.data?.msg || err.response?.data?.error || "Failed to save profile. Please check your inputs.");
//         } finally {
//             setSaving(false);
//         }
//     };

//     const handleDownloadPdf = async () => {
//         setLoading(true);
//         setError(null);
//         setMessage(null);
//         try {
//             const response = await axiosInstance.get(`/api/resume/pdf`, {
//                 responseType: 'blob'
//             });

//             const contentDisposition = response.headers['content-disposition'];
//             let filename = 'resume.pdf';
//             if (contentDisposition && contentDisposition.includes('filename=')) {
//                 filename = contentDisposition.split('filename=')[1].split(';')[0].replace(/"/g, '');
//             }

//             const url = window.URL.createObjectURL(new Blob([response.data]));
//             const a = document.createElement('a');
//             a.href = url;
//             a.download = filename;
//             document.body.appendChild(a);
//             a.click();
//             a.remove();
//             window.URL.revokeObjectURL(url);

//             setMessage("Resume PDF downloaded successfully!");
//         } catch (err) {
//             console.error("Error downloading PDF:", err);
//             setError("Failed to download PDF. Please ensure your resume is complete. Error: " + err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleLogout = async () => {
//         try {
//             await logoutUser();
//             setUser(null);
//         } catch (err) {
//             console.error("Logout failed:", err);
//             setError(err.response?.data?.msg || "Logout failed");
//         } finally {
//             onCloseDropdown();
//         }
//     };

//     if (loading && !user) {
//         return <div className="p-4 text-center text-gray-700">Loading user data...</div>;
//     }
//     if (loading) {
//         return <div className="p-4 text-center text-gray-700">Loading profile details...</div>;
//     }

//     const isStudent = user?.role === 'user';

//     return (
//         <div className="px-4 py-2 max-h-[80vh] overflow-y-auto custom-scrollbar">
//             {message && <p className="text-green-600 text-sm mb-2 text-center">{message}</p>}
//             {error && <p className="text-red-600 text-sm mb-2 text-center">{error}</p>}
//             {saving && <p className="text-blue-600 text-sm mb-2 text-center">Saving...</p>}

//             {/* Profile Header (Name, Email, Profile Picture) */}
//             <div className="flex flex-col items-center border-b pb-4 mb-4">
//                 <div className="relative w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-2">
//                     {profileFormData.profilePicture ? (
//                         <img src={profileFormData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
//                     ) : (
//                         <UserCircleIcon className="w-16 h-16 text-gray-500" />
//                     )}
//                     {isEditing && (
//                         <label htmlFor="profilePictureInput" className="absolute bottom-0 right-0 p-1 bg-primary rounded-full cursor-pointer hover:bg-primary/80 transition">
//                             <CameraIcon className="w-5 h-5 text-white" />
//                             <input
//                                 id="profilePictureInput"
//                                 type="file"
//                                 accept="image/*"
//                                 onChange={handleProfilePictureFileChange}
//                                 className="hidden"
//                             />
//                         </label>
//                     )}
//                 </div>
//                 <p className="font-bold text-lg">{profileFormData.name}</p>
//                 <p className="text-sm text-gray-600">{profileFormData.email}</p>
//                 <p className="text-xs text-gray-500 capitalize">Role: {user?.role}</p>
//             </div>

//             {!isEditing ? (
//                 <>
//                     <h3 className="font-semibold text-md mb-2 border-b pb-1">Basic Info</h3>
//                     <div className="mb-4 text-sm">
//                         <p><strong>Name:</strong> {profileFormData.name || "N/A"}</p>
//                         <p><strong>Email:</strong> {profileFormData.email || "N/A"}</p>
//                     </div>

//                     {isStudent && (
//                         <>
//                             <h3 className="font-semibold text-md mb-2 border-b pb-1">Contact & Social</h3>
//                             <div className="mb-4 text-sm">
//                                 <p><strong>Phone:</strong> {resumeFormData.phone || "N/A"}</p>
//                                 <p><strong>LinkedIn:</strong> {resumeFormData.linkedin ? <a href={resumeFormData.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{resumeFormData.linkedin}</a> : "N/A"}</p>
//                                 <p><strong>GitHub:</strong> {resumeFormData.github ? <a href={resumeFormData.github} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{resumeFormData.github}</a> : "N/A"}</p>
//                                 <p><strong>Portfolio:</strong> {resumeFormData.portfolio ? <a href={resumeFormData.portfolio} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{resumeFormData.portfolio}</a> : "N/A"}</p>
//                             </div>
                            
//                             <h3 className="font-semibold text-md mb-2 border-b pb-1">Summary</h3>
//                             <p className="text-sm mb-4">{resumeFormData.summary || "N/A"}</p>

//                             <h3 className="font-semibold text-md mb-2 border-b pb-1">Education</h3>
//                             {resumeFormData.education.length > 0 ? (
//                                 resumeFormData.education.map((edu, index) => (
//                                     <div key={index} className="mb-3 border-b border-gray-200 pb-2 last:border-b-0">
//                                         <p className="text-sm font-semibold">{edu.degree} from {edu.institution}</p>
//                                         <p className="text-xs text-gray-500">
//                                             {edu.startDate ? new Date(edu.startDate).toLocaleDateString() : 'N/A'} - {edu.endDate ? new Date(edu.endDate).toLocaleDateString() : 'Present'}
//                                         </p>
//                                         <p className="text-xs text-gray-700">{edu.description || 'No description.'}</p>
//                                     </div>
//                                 ))
//                             ) : (
//                                 <p className="text-sm text-gray-500 mb-4">No education details added yet.</p>
//                             )}

//                             <h3 className="font-semibold text-md mb-2 border-b pb-1">Experience</h3>
//                             {resumeFormData.experience.length > 0 ? (
//                                 resumeFormData.experience.map((exp, index) => (
//                                     <div key={index} className="mb-3 border-b border-gray-200 pb-2 last:border-b-0">
//                                         <p className="text-sm font-semibold">{exp.jobTitle} at {exp.company}</p>
//                                         <p className="text-xs text-gray-500">
//                                             {exp.location} | {exp.startDate ? new Date(exp.startDate).toLocaleDateString() : 'N/A'} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}
//                                         </p>
//                                         <p className="text-xs text-gray-700">{exp.description || 'No description.'}</p>
//                                     </div>
//                                 ))
//                             ) : (
//                                 <p className="text-sm text-gray-500 mb-4">No experience details added yet.</p>
//                             )}

//                             <h3 className="font-semibold text-md mb-2 border-b pb-1">Projects</h3>
//                             {resumeFormData.projects.length > 0 ? (
//                                 resumeFormData.projects.map((proj, index) => (
//                                     <div key={index} className="mb-3 border-b border-gray-200 pb-2 last:border-b-0">
//                                         <p className="text-sm font-semibold">{proj.projectName}</p>
//                                         {proj.technologies && proj.technologies.length > 0 && <p className="text-xs text-gray-500">Technologies: {proj.technologies.join(', ')}</p>}
//                                         {proj.projectLink && <p className="text-xs text-gray-500"><a href={proj.projectLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View Project</a></p>}
//                                         <p className="text-xs text-gray-700">{proj.description || 'No description.'}</p>
//                                     </div>
//                                 ))
//                             ) : (
//                                 <p className="text-sm text-gray-500 mb-4">No projects added yet.</p>
//                             )}

//                             <h3 className="font-semibold text-md mb-2 border-b pb-1">Skills</h3>
//                             {resumeFormData.skills.length > 0 ? (
//                                 <ul className="list-disc list-inside text-sm mb-4">
//                                     {resumeFormData.skills.map((skill, index) => (
//                                         <li key={index}>{skill.name}{skill.level ? ` (${skill.level})` : ''}</li>
//                                     ))}
//                                 </ul>
//                             ) : (
//                                 <p className="text-sm text-gray-500 mb-4">No skills added yet.</p>
//                             )}

//                             <h3 className="font-semibold text-md mb-2 border-b pb-1">Achievements</h3>
//                             {resumeFormData.achievements.length > 0 ? (
//                                 <ul className="list-disc list-inside text-sm mb-4">
//                                     {resumeFormData.achievements.map((ach, index) => (
//                                         <li key={index}>{ach}</li>
//                                     ))}
//                                 </ul>
//                             ) : (
//                                 <p className="text-sm text-gray-500 mb-4">No achievements added yet.</p>
//                             )}

//                             <h3 className="font-semibold text-md mb-2 border-b pb-1">Certifications</h3>
//                             {resumeFormData.certifications.length > 0 ? (
//                                 <ul className="list-disc list-inside text-sm mb-4">
//                                     {resumeFormData.certifications.map((cert, index) => (
//                                         <li key={index}>{cert.name}{cert.issuer ? ` (${cert.issuer})` : ''}</li>
//                                     ))}
//                                 </ul>
//                             ) : (
//                                 <p className="text-sm text-gray-500 mb-4">No certifications added yet.</p>
//                             )}

//                             <h3 className="font-semibold text-md mb-2 border-b pb-1">Languages</h3>
//                             {resumeFormData.languages.length > 0 ? (
//                                 <ul className="list-disc list-inside text-sm mb-4">
//                                     {resumeFormData.languages.map((lang, index) => (
//                                         <li key={index}>{lang.name}{lang.proficiency ? ` (${lang.proficiency})` : ''}</li>
//                                     ))}
//                                 </ul>
//                             ) : (
//                                 <p className="text-sm text-gray-500 mb-4">No languages added yet.</p>
//                             )}
//                         </>
//                     )}

//                     <button
//                         onClick={() => setIsEditing(true)}
//                         className="w-full bg-blue-500 text-white py-2 rounded-md font-semibold hover:bg-blue-600 transition mt-4"
//                     >
//                         Edit Profile {isStudent && "& Resume"}
//                     </button>
                    
//                     {isStudent && (
//                         <button
//                             onClick={handleDownloadPdf}
//                             className="w-full bg-indigo-600 text-white py-2 rounded-md font-semibold hover:bg-indigo-700 transition mt-2 flex items-center justify-center"
//                             disabled={loading}
//                         >
//                             <DocumentArrowDownIcon className="w-5 h-5 mr-2" /> Download Resume PDF
//                         </button>
//                     )}
//                 </>
//             ) : (
//                 <>
//                     <h3 className="font-semibold text-md mb-2 border-b pb-1">Basic Info</h3>
//                     <div className="mb-2">
//                         <label className="block text-xs font-medium text-gray-500">Name</label>
//                         <input
//                             type="text"
//                             name="name"
//                             value={profileFormData.name}
//                             onChange={handleProfileChange}
//                             className="input-field"
//                             placeholder="Full Name"
//                             required
//                         />
//                     </div>
//                     <div className="mb-4">
//                         <label className="block text-xs font-medium text-gray-500">Email</label>
//                         <input
//                             type="email"
//                             name="email"
//                             value={profileFormData.email}
//                             onChange={handleProfileChange}
//                             className="input-field"
//                             placeholder="Email Address"
//                             required
//                         />
//                     </div>

//                     {isStudent && (
//                         <>
//                             <h3 className="font-semibold text-md mb-2 border-b pb-1">Contact & Social</h3>
//                             <div className="mb-2">
//                                 <label className="block text-xs font-medium text-gray-500">Phone</label>
//                                 <input type="text" name="phone" value={resumeFormData.phone} onChange={handleResumeChange} className="input-field" placeholder="Phone Number" />
//                             </div>
//                             <div className="mb-2">
//                                 <label className="block text-xs font-medium text-gray-500">LinkedIn URL</label>
//                                 <input type="text" name="linkedin" value={resumeFormData.linkedin} onChange={handleResumeChange} className="input-field" placeholder="https://linkedin.com/in/..." />
//                             </div>
//                             <div className="mb-2">
//                                 <label className="block text-xs font-medium text-gray-500">GitHub URL</label>
//                                 <input type="text" name="github" value={resumeFormData.github} onChange={handleResumeChange} className="input-field" placeholder="https://github.com/..." />
//                             </div>
//                             <div className="mb-4">
//                                 <label className="block text-xs font-medium text-gray-500">Portfolio URL</label>
//                                 <input type="text" name="portfolio" value={resumeFormData.portfolio} onChange={handleResumeChange} className="input-field" placeholder="https://yourportfolio.com" />
//                             </div>

//                             <h3 className="font-semibold text-md mb-2 border-b pb-1">Summary/Objective</h3>
//                             <div className="mb-4">
//                                 <textarea name="summary" value={resumeFormData.summary} onChange={handleResumeChange} className="input-field h-24 resize-y" placeholder="A brief summary of your professional experience..."></textarea>
//                             </div>

//                             <h3 className="font-semibold text-md mb-2 border-b pb-1">Education Details</h3>
//                             {resumeFormData.education.map((edu, index) => (
//                                 <div key={index} className="border border-gray-200 p-3 rounded-md mb-3 bg-gray-50">
//                                     <label className="block text-xs font-medium text-gray-500">Degree</label>
//                                     <input type="text" name="degree" value={edu.degree} onChange={(e) => handleEducationChange(index, e)} className="input-field mb-1" placeholder="Degree" />
//                                     <label className="block text-xs font-medium text-gray-500">Institution</label>
//                                     <input type="text" name="institution" value={edu.institution} onChange={(e) => handleEducationChange(index, e)} className="input-field mb-1" placeholder="Institution" />
//                                     <label className="block text-xs font-medium text-gray-500">Start Date</label>
//                                     <input type="date" name="startDate" value={edu.startDate ? new Date(edu.startDate).toISOString().split('T')[0] : ''} onChange={(e) => handleEducationChange(index, e)} className="input-field mb-1" />
//                                     <label className="block text-xs font-medium text-gray-500">End Date (optional)</label>
//                                     <input type="date" name="endDate" value={edu.endDate ? new Date(edu.endDate).toISOString().split('T')[0] : ''} onChange={(e) => handleEducationChange(index, e)} className="input-field mb-1" />
//                                     <label className="block text-xs font-medium text-gray-500">Description</label>
//                                     <textarea name="description" value={edu.description} onChange={(e) => handleEducationChange(index, e)} className="input-field h-16 resize-y mb-2" placeholder="Relevant coursework, achievements..."></textarea>
//                                     <button type="button" onClick={() => removeEducation(index)} className="btn-remove"><TrashIcon className="w-4 h-4 mr-1" /> Remove Education</button>
//                                 </div>
//                             ))}
//                             <button type="button" onClick={addEducation} className="btn-add"><PlusCircleIcon className="w-4 h-4 mr-1" /> Add Education</button>

//                             <h3 className="font-semibold text-md mb-2 border-b pb-1 mt-4">Experience</h3>
//                             {resumeFormData.experience.map((exp, index) => (
//                                 <div key={index} className="border border-gray-200 p-3 rounded-md mb-3 bg-gray-50">
//                                     <label className="block text-xs font-medium text-gray-500">Job Title</label>
//                                     <input type="text" name="jobTitle" value={exp.jobTitle} onChange={(e) => handleExperienceChange(index, e)} className="input-field mb-1" placeholder="Job Title" />
//                                     <label className="block text-xs font-medium text-gray-500">Company</label>
//                                     <input type="text" name="company" value={exp.company} onChange={(e) => handleExperienceChange(index, e)} className="input-field mb-1" placeholder="Company Name" />
//                                     <label className="block text-xs font-medium text-gray-500">Location</label>
//                                     <input type="text" name="location" value={exp.location} onChange={(e) => handleExperienceChange(index, e)} className="input-field mb-1" placeholder="Location" />
//                                     <label className="block text-xs font-medium text-gray-500">Start Date</label>
//                                     <input type="date" name="startDate" value={exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : ''} onChange={(e) => handleExperienceChange(index, e)} className="input-field mb-1" />
//                                     <label className="block text-xs font-medium text-gray-500">End Date (optional)</label>
//                                     <input type="date" name="endDate" value={exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : ''} onChange={(e) => handleExperienceChange(index, e)} className="input-field mb-1" />
//                                     <label className="block text-xs font-medium text-gray-500">Description</label>
//                                     <textarea name="description" value={exp.description} onChange={(e) => handleExperienceChange(index, e)} className="input-field h-20 resize-y mb-2" placeholder="Responsibilities and achievements..."></textarea>
//                                     <button type="button" onClick={() => removeExperience(index)} className="btn-remove"><TrashIcon className="w-4 h-4 mr-1" /> Remove Experience</button>
//                                 </div>
//                             ))}
//                             <button type="button" onClick={addExperience} className="btn-add"><PlusCircleIcon className="w-4 h-4 mr-1" /> Add Experience</button>

//                             <h3 className="font-semibold text-md mb-2 border-b pb-1 mt-4">Projects</h3>
//                             {resumeFormData.projects.map((proj, index) => (
//                                 <div key={index} className="border border-gray-200 p-3 rounded-md mb-3 bg-gray-50">
//                                     <label className="block text-xs font-medium text-gray-500">Project Name</label>
//                                     <input type="text" name="projectName" value={proj.projectName} onChange={(e) => handleProjectChange(index, e)} className="input-field mb-1" placeholder="Project Name" />
//                                     <label className="block text-xs font-medium text-gray-500">Description</label>
//                                     <textarea name="description" value={proj.description} onChange={(e) => handleProjectChange(index, e)} className="input-field h-16 resize-y mb-1" placeholder="Brief description of the project..."></textarea>
//                                     <label className="block text-xs font-medium text-gray-500">Technologies (comma-separated)</label>
//                                     <input type="text" name="technologies" value={proj.technologies.join(', ')} onChange={(e) => handleProjectChange(index, e)} className="input-field mb-1" placeholder="e.g., React, Node.js, MongoDB" />
//                                     <label className="block text-xs font-medium text-gray-500">Project Link</label>
//                                     <input type="text" name="projectLink" value={proj.projectLink} onChange={(e) => handleProjectChange(index, e)} className="input-field mb-2" placeholder="URL to GitHub or live demo" />
//                                     <button type="button" onClick={() => removeProject(index)} className="btn-remove"><TrashIcon className="w-4 h-4 mr-1" /> Remove Project</button>
//                                 </div>
//                             ))}
//                             <button type="button" onClick={addProject} className="btn-add"><PlusCircleIcon className="w-4 h-4 mr-1" /> Add Project</button>

//                             <h3 className="font-semibold text-md mb-2 border-b pb-1 mt-4">Skills</h3>
//                             {resumeFormData.skills.map((skill, index) => (
//                                 <div key={index} className="flex items-center gap-2 mb-2">
//                                     <input type="text" name="name" value={skill.name} onChange={(e) => handleSkillChange(index, e)} className="input-field flex-1" placeholder="Skill Name" />
//                                     <select name="level" value={skill.level} onChange={(e) => handleSkillChange(index, e)} className="input-field w-24">
//                                         <option value="">Level</option>
//                                         <option value="Beginner">Beginner</option>
//                                         <option value="Intermediate">Intermediate</option>
//                                         <option value="Advanced">Advanced</option>
//                                         <option value="Expert">Expert</option>
//                                     </select>
//                                     <button type="button" onClick={() => removeSkill(index)} className="btn-icon-remove"><TrashIcon className="w-4 h-4" /></button>
//                                 </div>
//                             ))}
//                             <button type="button" onClick={addSkill} className="btn-add"><PlusCircleIcon className="w-4 h-4 mr-1" /> Add Skill</button>

//                             <h3 className="font-semibold text-md mb-2 border-b pb-1 mt-4">Achievements</h3>
//                             {resumeFormData.achievements.map((ach, index) => (
//                                 <div key={index} className="flex items-center gap-2 mb-2">
//                                     <input type="text" value={ach} onChange={(e) => handleAchievementChange(index, e)} className="input-field flex-1" placeholder="Achievement description" />
//                                     <button type="button" onClick={() => removeAchievement(index)} className="btn-icon-remove"><TrashIcon className="w-4 h-4" /></button>
//                                 </div>
//                             ))}
//                             <button type="button" onClick={addAchievement} className="btn-add"><PlusCircleIcon className="w-4 h-4 mr-1" /> Add Achievement</button>

//                             <h3 className="font-semibold text-md mb-2 border-b pb-1 mt-4">Certifications</h3>
//                             {resumeFormData.certifications.map((cert, index) => (
//                                 <div key={index} className="flex items-center gap-2 mb-2">
//                                     <input type="text" name="name" value={cert.name} onChange={(e) => handleCertificationChange(index, e)} className="input-field flex-1" placeholder="Certification Name" />
//                                     <input type="text" name="issuer" value={cert.issuer} onChange={(e) => handleCertificationChange(index, e)} className="input-field flex-1" placeholder="Issuer (e.g., Google, IBM)" />
//                                     <button type="button" onClick={() => removeCertification(index)} className="btn-icon-remove"><TrashIcon className="w-4 h-4" /></button>
//                                 </div>
//                             ))}
//                             <button type="button" onClick={addCertification} className="btn-add"><PlusCircleIcon className="w-4 h-4 mr-1" /> Add Certification</button>

//                             <h3 className="font-semibold text-md mb-2 border-b pb-1 mt-4">Languages</h3>
//                             {resumeFormData.languages.map((lang, index) => (
//                                 <div key={index} className="flex items-center gap-2 mb-2">
//                                     {/* Corrected: Added the input field for the language name */}
//                                     <input type="text" name="name" value={lang.name} onChange={(e) => handleLanguageChange(index, e)} className="input-field flex-1" placeholder="Language Name" />
//                                     <select name="proficiency" value={lang.proficiency} onChange={(e) => handleLanguageChange(index, e)} className="input-field w-24">
//                                         <option value="">Proficiency</option>
//                                         <option value="Beginner">Beginner</option>
//                                         <option value="Intermediate">Intermediate</option>
//                                         <option value="Advanced">Advanced</option>
//                                         <option value="Native">Native</option>
//                                     </select>
//                                     <button type="button" onClick={() => removeLanguage(index)} className="btn-icon-remove"><TrashIcon className="w-4 h-4" /></button>
//                                 </div>
//                             ))}
//                             <button type="button" onClick={addLanguage} className="btn-add"><PlusCircleIcon className="w-4 h-4 mr-1" /> Add Language</button>
//                         </>
//                     )}

//                     <div className="flex justify-between items-center gap-2 mt-4">
//                         <button
//                             type="button"
//                             onClick={handleSave}
//                             className="flex-1 bg-green-600 text-white py-2 rounded-md font-semibold hover:bg-green-700 transition"
//                             disabled={saving}
//                         >
//                             {saving ? "Saving..." : "Save Changes"}
//                         </button>
//                         <button
//                             type="button"
//                             onClick={() => setIsEditing(false)}
//                             className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-md font-semibold hover:bg-gray-400 transition"
//                         >
//                             Cancel
//                         </button>
//                     </div>
//                 </>
//             )}

//             <div className="border-t border-gray-200 mt-4 pt-4">
//                 <button
//                     onClick={handleLogout}
//                     className="w-full bg-red-500 text-white py-2 rounded-md font-semibold hover:bg-red-600 transition"
//                 >
//                     Logout
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default UserProfileEditor;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from "../utils/axios";
import {
    updateMyProfile,
    getMyResumeDetails,
    createOrUpdateMyResume,
    logoutUser,
} from '../services/authService';
import { UserCircleIcon, CameraIcon, TrashIcon, PlusCircleIcon, DocumentArrowDownIcon } from '@heroicons/react/24/solid';


const UserProfileEditor = ({ onCloseDropdown }) => {
    const { user, setUser } = useAuth();
    const [profileFormData, setProfileFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        profilePicture: user?.profilePicture || '',
    });
    const [resumeFormData, setResumeFormData] = useState({
        phone: '',
        linkedin: '',
        github: '',
        portfolio: '',
        summary: '',
        education: [],
        experience: [],
        projects: [],
        skills: [],
        achievements: [],
        certifications: [],
        languages: [],
    });
    const [profilePictureFile, setProfilePictureFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user) {
                setError("User not logged in.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            setMessage(null);

            setProfileFormData({
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture,
            });

            if (user.role === 'user') {
                try {
                    const resumeRes = await getMyResumeDetails();
                    const fetchedResumeData = resumeRes.data;

                    setResumeFormData({
                        phone: fetchedResumeData.phone || '',
                        linkedin: fetchedResumeData.linkedin || '',
                        github: fetchedResumeData.github || '',
                        portfolio: fetchedResumeData.portfolio || '',
                        summary: fetchedResumeData.summary || '',
                        education: fetchedResumeData.education || [],
                        experience: fetchedResumeData.experience || [],
                        projects: fetchedResumeData.projects || [],
                        skills: fetchedResumeData.skills || [],
                        achievements: fetchedResumeData.achievements || [],
                        certifications: fetchedResumeData.certifications || [],
                        languages: fetchedResumeData.languages || [],
                    });
                    setMessage("Profile data loaded.");

                } catch (err) {
                    console.error("Error fetching resume data:", err);
                    if (err.response && err.response.status === 404 && err.response.data.msg === "Resume not found for this user") {
                        setError("No resume found. Please add your details.");
                        setResumeFormData({
                            phone: '', linkedin: '', github: '', portfolio: '', summary: '',
                            education: [], experience: [], projects: [], skills: [], achievements: [], certifications: [], languages: []
                        });
                        setIsEditing(true);
                    } else {
                        setError(err.response?.data?.msg || "Failed to load resume data.");
                    }
                }
            } else {
                setResumeFormData({
                    phone: '', linkedin: '', github: '', portfolio: '', summary: '',
                    education: [], experience: [], projects: [], skills: [], achievements: [], certifications: [], languages: []
                });
            }
            setLoading(false);
        };

        fetchUserData();
    }, [user]);

    const handleProfileChange = (e) => {
        setProfileFormData({ ...profileFormData, [e.target.name]: e.target.value });
    };

    const handleResumeChange = (e) => {
        setResumeFormData({ ...resumeFormData, [e.target.name]: e.target.value });
    };

    const handleProfilePictureFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePictureFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileFormData(prev => ({ ...prev, profilePicture: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEducationChange = (index, e) => {
        const updatedEducation = [...resumeFormData.education];
        updatedEducation[index] = { ...updatedEducation[index], [e.target.name]: e.target.value };
        setResumeFormData(prev => ({ ...prev, education: updatedEducation }));
    };
    const addEducation = () => {
        setResumeFormData(prev => ({
            ...prev,
            education: [...prev.education, { degree: "", institution: "", startDate: "", endDate: "", description: "" }]
        }));
    };
    const removeEducation = (index) => {
        const updatedEducation = resumeFormData.education.filter((_, i) => i !== index);
        setResumeFormData(prev => ({ ...prev, education: updatedEducation }));
    };

    const handleExperienceChange = (index, e) => {
        const updatedExperience = [...resumeFormData.experience];
        updatedExperience[index] = { ...updatedExperience[index], [e.target.name]: e.target.value };
        setResumeFormData(prev => ({ ...prev, experience: updatedExperience }));
    };
    const addExperience = () => {
        setResumeFormData(prev => ({
            ...prev,
            experience: [...prev.experience, { jobTitle: "", company: "", location: "", startDate: "", endDate: "", description: "" }]
        }));
    };
    const removeExperience = (index) => {
        const updatedExperience = resumeFormData.experience.filter((_, i) => i !== index);
        setResumeFormData(prev => ({ ...prev, experience: updatedExperience }));
    };

    const handleProjectChange = (index, e) => {
        const updatedProjects = [...resumeFormData.projects];
        if (e.target.name === "technologies") {
            updatedProjects[index] = { ...updatedProjects[index], technologies: e.target.value.split(',').map(tech => tech.trim()) };
        } else {
            updatedProjects[index] = { ...updatedProjects[index], [e.target.name]: e.target.value };
        }
        setResumeFormData(prev => ({ ...prev, projects: updatedProjects }));
    };
    const addProject = () => {
        setResumeFormData(prev => ({
            ...prev,
            projects: [...prev.projects, { projectName: "", description: "", technologies: [], projectLink: "" }]
        }));
    };
    const removeProject = (index) => {
        const updatedProjects = resumeFormData.projects.filter((_, i) => i !== index);
        setResumeFormData(prev => ({ ...prev, projects: updatedProjects }));
    };

    const handleSkillChange = (index, e) => {
        const updatedSkills = [...resumeFormData.skills];
        updatedSkills[index] = { ...updatedSkills[index], [e.target.name]: e.target.value };
        setResumeFormData(prev => ({ ...prev, skills: updatedSkills }));
    };
    const addSkill = () => {
        setResumeFormData(prev => ({
            ...prev,
            skills: [...prev.skills, { name: "", level: "" }]
        }));
    };
    const removeSkill = (index) => {
        const updatedSkills = resumeFormData.skills.filter((_, i) => i !== index);
        setResumeFormData(prev => ({ ...prev, skills: updatedSkills }));
    };

    const handleAchievementChange = (index, e) => {
        const updatedAchievements = [...resumeFormData.achievements];
        updatedAchievements[index] = e.target.value;
        setResumeFormData(prev => ({ ...prev, achievements: updatedAchievements }));
    };
    const addAchievement = () => {
        setResumeFormData(prev => ({
            ...prev,
            achievements: [...prev.achievements, ""]
        }));
    };
    const removeAchievement = (index) => {
        const updatedAchievements = resumeFormData.achievements.filter((_, i) => i !== index);
        setResumeFormData(prev => ({ ...prev, achievements: updatedAchievements }));
    };

    const handleCertificationChange = (index, e) => {
        const updatedCerts = [...resumeFormData.certifications];
        updatedCerts[index] = { ...updatedCerts[index], [e.target.name]: e.target.value };
        setResumeFormData(prev => ({ ...prev, certifications: updatedCerts }));
    };
    const addCertification = () => {
        setResumeFormData(prev => ({
            ...prev,
            certifications: [...prev.certifications, { name: "", issuer: "" }]
        }));
    };
    const removeCertification = (index) => {
        const updatedCerts = resumeFormData.certifications.filter((_, i) => i !== index);
        setResumeFormData(prev => ({ ...prev, certifications: updatedCerts }));
    };

    const handleLanguageChange = (index, e) => {
        const updatedLangs = [...resumeFormData.languages];
        updatedLangs[index] = { ...updatedLangs[index], [e.target.name]: e.target.value };
        setResumeFormData(prev => ({ ...prev, languages: updatedLangs }));
    };
    const addLanguage = () => {
        setResumeFormData(prev => ({
            ...prev,
            languages: [...prev.languages, { name: "", proficiency: "" }]
        }));
    };
    const removeLanguage = (index) => {
        const updatedLangs = resumeFormData.languages.filter((_, i) => i !== index);
        setResumeFormData(prev => ({ ...prev, languages: updatedLangs }));
    };

const handleSave = async () => {
  setSaving(true);
  setError(null);
  setMessage(null);

  try {
    const userUpdatePayload = new FormData();
    userUpdatePayload.append('name', profileFormData.name);
    userUpdatePayload.append('email', profileFormData.email);
    if (profilePictureFile) {
      userUpdatePayload.append('profilePicture', profilePictureFile);
    }

    const userUpdateRes = await updateMyProfile(userUpdatePayload);
    setUser(userUpdateRes.data.user);
    setProfileFormData(prev => ({ ...prev, profilePicture: userUpdateRes.data.user.profilePicture }));
    setProfilePictureFile(null);

    if (user.role === 'user') {
      // Filter out incomplete entries to prevent Mongoose validation errors
      const cleanedEducation = resumeFormData.education.filter(edu => edu.degree && edu.degree.trim() !== '' && edu.institution && edu.institution.trim() !== '');
      const cleanedExperience = resumeFormData.experience.filter(exp => exp.jobTitle && exp.jobTitle.trim() !== '' && exp.company && exp.company.trim() !== '');
      const cleanedProjects = resumeFormData.projects.filter(proj => proj.projectName && proj.projectName.trim() !== '');
      
      // Filter out skills that are missing a name or level
      const cleanedSkills = resumeFormData.skills.filter(skill => skill.name && skill.name.trim() !== '' && skill.level && skill.level.trim() !== '');
      
      const cleanedAchievements = resumeFormData.achievements.filter(ach => ach && ach.trim() !== '');
      const cleanedCertifications = resumeFormData.certifications.filter(cert => cert.name && cert.name.trim() !== '');

      // Filter out languages that are missing a name or proficiency
      const cleanedLanguages = resumeFormData.languages.filter(lang => lang.name && lang.name.trim() !== '' && lang.proficiency && lang.proficiency.trim() !== '');

      const resumeUpdatePayload = {
        user: user._id,
        fullName: profileFormData.name,
        email: profileFormData.email,
        phone: resumeFormData.phone,
        linkedin: resumeFormData.linkedin,
        github: resumeFormData.github,
        portfolio: resumeFormData.portfolio,
        summary: resumeFormData.summary,
        education: cleanedEducation.map(edu => ({
          ...edu,
          startDate: edu.startDate ? new Date(edu.startDate).toISOString() : null,
          endDate: edu.endDate ? new Date(edu.endDate).toISOString() : null,
        })),
        experience: cleanedExperience.map(exp => ({
          ...exp,
          startDate: exp.startDate ? new Date(exp.startDate).toISOString() : null,
          endDate: exp.endDate ? new Date(exp.endDate).toISOString() : null,
        })),
        projects: cleanedProjects.map(proj => ({
          ...proj,
          technologies: Array.isArray(proj.technologies) ? proj.technologies : (proj.technologies || '').split(',').map(t => t.trim()).filter(Boolean)
        })),
        skills: cleanedSkills,
        achievements: cleanedAchievements,
        certifications: cleanedCertifications,
        languages: cleanedLanguages,
      };

      await createOrUpdateMyResume(resumeUpdatePayload);
    }

    setMessage("Profile updated successfully!");
    setIsEditing(false);
  } catch (err) {
    console.error("Error saving profile:", err);
    setError(err.response?.data?.msg || err.response?.data?.error || "Failed to save profile. Please check your inputs.");
  } finally {
    setSaving(false);
  }
};
    const handleDownloadPdf = async () => {
        setLoading(true);
        setError(null);
        setMessage(null);
        try {
            const response = await axiosInstance.get(`/api/resume/pdf`, {
                responseType: 'blob'
            });

            const contentDisposition = response.headers['content-disposition'];
            let filename = 'resume.pdf';
            if (contentDisposition && contentDisposition.includes('filename=')) {
                filename = contentDisposition.split('filename=')[1].split(';')[0].replace(/"/g, '');
            }

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

            setMessage("Resume PDF downloaded successfully!");
        } catch (err) {
            console.error("Error downloading PDF:", err);
            setError("Failed to download PDF. Please ensure your resume is complete. Error: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logoutUser();
            setUser(null);
        } catch (err) {
            console.error("Logout failed:", err);
            setError(err.response?.data?.msg || "Logout failed");
        } finally {
            onCloseDropdown();
        }
    };

    if (loading && !user) {
        return <div style={{padding: '1rem', textAlign: 'center', color: '#4b5563'}}>Loading user data...</div>;
    }
    if (loading) {
        return <div style={{padding: '1rem', textAlign: 'center', color: '#4b5563'}}>Loading profile details...</div>;
    }

    const isStudent = user?.role === 'user';

    return (
        <div style={{ padding: '0 1rem', maxHeight: '80vh', overflowY: 'auto' }} className="custom-scrollbar">
            {/* Inline styles for components */}
            <style jsx="true">{`
                .custom-scrollbar::-webkit-scrollbar { width: 8px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #888; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #555; }
                .input-field {
                    width: 100%;
                    padding: 0.5rem;
                    border: 1px solid #d1d5db;
                    border-radius: 0.375rem;
                    font-size: 1rem;
                    margin-bottom: 0.25rem;
                    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
                }
                .input-field:focus {
                    outline: none;
                    box-shadow: 0 0 0 1px #3b82f6; /* Equivalent to focus:ring-1 focus:ring-blue-500 */
                    border-color: #3b82f6; /* Equivalent to focus:border-blue-500 */
                }
                .btn-add {
                    background-color: #3b82f6;
                    color: white;
                    font-size: 0.875rem;
                    padding: 0.5rem 1rem;
                    border-radius: 0.375rem;
                    transition: background-color 0.15s ease-in-out;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .btn-add:hover { background-color: #2563eb; }
                .btn-remove {
                    color: #ef4444;
                    font-size: 0.875rem;
                    display: flex;
                    align-items: center;
                    transition: color 0.15s ease-in-out;
                }
                .btn-remove:hover { color: #b91c1c; }
                .btn-icon-remove {
                    padding: 0.25rem;
                    border-radius: 9999px; /* rounded-full */
                    color: #ef4444;
                    transition: background-color 0.15s ease-in-out, color 0.15s ease-in-out;
                }
                .btn-icon-remove:hover {
                    background-color: #fee2e2;
                    color: #b91c1c;
                }
            `}</style>
            {message && <p style={{ color: '#16a34a', fontSize: '0.875rem', marginBottom: '0.5rem', textAlign: 'center' }}>{message}</p>}
            {error && <p style={{ color: '#dc2626', fontSize: '0.875rem', marginBottom: '0.5rem', textAlign: 'center' }}>{error}</p>}
            {saving && <p style={{ color: '#2563eb', fontSize: '0.875rem', marginBottom: '0.5rem', textAlign: 'center' }}>Saving...</p>}

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <div style={{ position: 'relative', width: '6rem', height: '6rem', borderRadius: '9999px', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: '0.5rem' }}>
                    {profileFormData.profilePicture ? (
                        <img src={profileFormData.profilePicture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <UserCircleIcon style={{ width: '4rem', height: '4rem', color: '#6b7280' }} />
                    )}
                    {isEditing && (
                        <label htmlFor="profilePictureInput" style={{ position: 'absolute', bottom: 0, right: 0, padding: '0.25rem', backgroundColor: '#3b82f6', borderRadius: '9999px', cursor: 'pointer', transition: 'background-color 0.15s ease-in-out' }}>
                            <CameraIcon style={{ width: '1.25rem', height: '1.25rem', color: 'white' }} />
                            <input
                                id="profilePictureInput"
                                type="file"
                                accept="image/*"
                                onChange={handleProfilePictureFileChange}
                                style={{ display: 'none' }}
                            />
                        </label>
                    )}
                </div>
                <p style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>{profileFormData.name}</p>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{profileFormData.email}</p>
                <p style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'capitalize' }}>Role: {user?.role}</p>
            </div>

            {!isEditing ? (
                <>
                    <h3 style={{ fontWeight: '600', fontSize: '1.125rem', marginBottom: '0.5rem', borderBottom: '1px solid #d1d5db', paddingBottom: '0.25rem' }}>Basic Info</h3>
                    <div style={{ marginBottom: '1rem', fontSize: '0.875rem' }}>
                        <p><strong>Name:</strong> {profileFormData.name || "N/A"}</p>
                        <p><strong>Email:</strong> {profileFormData.email || "N/A"}</p>
                    </div>

                    {isStudent && (
                        <>
                            <h3 style={{ fontWeight: '600', fontSize: '1.125rem', marginBottom: '0.5rem', borderBottom: '1px solid #d1d5db', paddingBottom: '0.25rem' }}>Contact & Social</h3>
                            <div style={{ marginBottom: '1rem', fontSize: '0.875rem' }}>
                                <p><strong>Phone:</strong> {resumeFormData.phone || "N/A"}</p>
                                <p><strong>LinkedIn:</strong> {resumeFormData.linkedin ? <a href={resumeFormData.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'none' }}>{resumeFormData.linkedin}</a> : "N/A"}</p>
                                <p><strong>GitHub:</strong> {resumeFormData.github ? <a href={resumeFormData.github} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'none' }}>{resumeFormData.github}</a> : "N/A"}</p>
                                <p><strong>Portfolio:</strong> {resumeFormData.portfolio ? <a href={resumeFormData.portfolio} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'none' }}>{resumeFormData.portfolio}</a> : "N/A"}</p>
                            </div>
                            
                            <h3 style={{ fontWeight: '600', fontSize: '1.125rem', marginBottom: '0.5rem', borderBottom: '1px solid #d1d5db', paddingBottom: '0.25rem' }}>Summary</h3>
                            <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>{resumeFormData.summary || "N/A"}</p>

                            <h3 style={{ fontWeight: '600', fontSize: '1.125rem', marginBottom: '0.5rem', borderBottom: '1px solid #d1d5db', paddingBottom: '0.25rem' }}>Education</h3>
                            {resumeFormData.education.length > 0 ? (
                                resumeFormData.education.map((edu, index) => (
                                    <div key={index} style={{ marginBottom: '0.75rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem', lastChild: { borderBottom: 'none' } }}>
                                        <p style={{ fontSize: '0.875rem', fontWeight: '600' }}>{edu.degree} from {edu.institution}</p>
                                        <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                            {edu.startDate ? new Date(edu.startDate).toLocaleDateString() : 'N/A'} - {edu.endDate ? new Date(edu.endDate).toLocaleDateString() : 'Present'}
                                        </p>
                                        <p style={{ fontSize: '0.75rem', color: '#4b5563' }}>{edu.description || 'No description.'}</p>
                                    </div>
                                ))
                            ) : (
                                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>No education details added yet.</p>
                            )}

                            <h3 style={{ fontWeight: '600', fontSize: '1.125rem', marginBottom: '0.5rem', borderBottom: '1px solid #d1d5db', paddingBottom: '0.25rem' }}>Experience</h3>
                            {resumeFormData.experience.length > 0 ? (
                                resumeFormData.experience.map((exp, index) => (
                                    <div key={index} style={{ marginBottom: '0.75rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem', lastChild: { borderBottom: 'none' } }}>
                                        <p style={{ fontSize: '0.875rem', fontWeight: '600' }}>{exp.jobTitle} at {exp.company}</p>
                                        <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                            {exp.location} | {exp.startDate ? new Date(exp.startDate).toLocaleDateString() : 'N/A'} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}
                                        </p>
                                        <p style={{ fontSize: '0.75rem', color: '#4b5563' }}>{exp.description || 'No description.'}</p>
                                    </div>
                                ))
                            ) : (
                                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>No experience details added yet.</p>
                            )}

                            <h3 style={{ fontWeight: '600', fontSize: '1.125rem', marginBottom: '0.5rem', borderBottom: '1px solid #d1d5db', paddingBottom: '0.25rem' }}>Projects</h3>
                            {resumeFormData.projects.length > 0 ? (
                                resumeFormData.projects.map((proj, index) => (
                                    <div key={index} style={{ marginBottom: '0.75rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem', lastChild: { borderBottom: 'none' } }}>
                                        <p style={{ fontSize: '0.875rem', fontWeight: '600' }}>{proj.projectName}</p>
                                        {proj.technologies && proj.technologies.length > 0 && <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Technologies: {proj.technologies.join(', ')}</p>}
                                        {proj.projectLink && <p style={{ fontSize: '0.75rem', color: '#6b7280' }}><a href={proj.projectLink} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'none' }}>View Project</a></p>}
                                        <p style={{ fontSize: '0.75rem', color: '#4b5563' }}>{proj.description || 'No description.'}</p>
                                    </div>
                                ))
                            ) : (
                                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>No projects added yet.</p>
                            )}

                            <h3 style={{ fontWeight: '600', fontSize: '1.125rem', marginBottom: '0.5rem', borderBottom: '1px solid #d1d5db', paddingBottom: '0.25rem' }}>Skills</h3>
                            {resumeFormData.skills.length > 0 ? (
                                <ul style={{ listStyleType: 'disc', listStylePosition: 'inside', fontSize: '0.875rem', marginBottom: '1rem' }}>
                                    {resumeFormData.skills.map((skill, index) => (
                                        <li key={index}>{skill.name}{skill.level ? ` (${skill.level})` : ''}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>No skills added yet.</p>
                            )}

                            <h3 style={{ fontWeight: '600', fontSize: '1.125rem', marginBottom: '0.5rem', borderBottom: '1px solid #d1d5db', paddingBottom: '0.25rem' }}>Achievements</h3>
                            {resumeFormData.achievements.length > 0 ? (
                                <ul style={{ listStyleType: 'disc', listStylePosition: 'inside', fontSize: '0.875rem', marginBottom: '1rem' }}>
                                    {resumeFormData.achievements.map((ach, index) => (
                                        <li key={index}>{ach}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>No achievements added yet.</p>
                            )}

                            <h3 style={{ fontWeight: '600', fontSize: '1.125rem', marginBottom: '0.5rem', borderBottom: '1px solid #d1d5db', paddingBottom: '0.25rem' }}>Certifications</h3>
                            {resumeFormData.certifications.length > 0 ? (
                                <ul style={{ listStyleType: 'disc', listStylePosition: 'inside', fontSize: '0.875rem', marginBottom: '1rem' }}>
                                    {resumeFormData.certifications.map((cert, index) => (
                                        <li key={index}>{cert.name}{cert.issuer ? ` (${cert.issuer})` : ''}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>No certifications added yet.</p>
                            )}

                            <h3 style={{ fontWeight: '600', fontSize: '1.125rem', marginBottom: '0.5rem', borderBottom: '1px solid #d1d5db', paddingBottom: '0.25rem' }}>Languages</h3>
                            {resumeFormData.languages.length > 0 ? (
                                <ul style={{ listStyleType: 'disc', listStylePosition: 'inside', fontSize: '0.875rem', marginBottom: '1rem' }}>
                                    {resumeFormData.languages.map((lang, index) => (
                                        <li key={index}>{lang.name}{lang.proficiency ? ` (${lang.proficiency})` : ''}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>No languages added yet.</p>
                            )}
                        </>
                    )}

                    <button
                        onClick={() => setIsEditing(true)}
                        style={{ width: '100%', backgroundColor: '#3b82f6', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.375rem', fontWeight: '600', transition: 'background-color 0.15s ease-in-out', marginTop: '1rem' }}
                    >
                        Edit Profile {isStudent && "& Resume"}
                    </button>
                    
                    {isStudent && (
                        <button
                            onClick={handleDownloadPdf}
                            style={{ width: '100%', backgroundColor: '#4f46e5', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.375rem', fontWeight: '600', transition: 'background-color 0.15s ease-in-out', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            disabled={loading}
                        >
                            <DocumentArrowDownIcon style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} /> Download Resume PDF
                        </button>
                    )}
                </>
            ) : (
                <>
                    <h3 style={{ fontWeight: '600', fontSize: '1.125rem', marginBottom: '0.5rem', borderBottom: '1px solid #d1d5db', paddingBottom: '0.25rem' }}>Basic Info</h3>
                    <div style={{ marginBottom: '0.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280' }}>Name</label>
                        <input
                            type="text"
                            name="name"
                            value={profileFormData.name}
                            onChange={handleProfileChange}
                            className="input-field"
                            placeholder="Full Name"
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280' }}>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={profileFormData.email}
                            onChange={handleProfileChange}
                            className="input-field"
                            placeholder="Email Address"
                            required
                        />
                    </div>

                    {isStudent && (
                        <>
                            <h3 style={{ fontWeight: '600', fontSize: '1.125rem', marginBottom: '0.5rem', borderBottom: '1px solid #d1d5db', paddingBottom: '0.25rem' }}>Contact & Social</h3>
                            <div style={{ marginBottom: '0.5rem' }}>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280' }}>Phone</label>
                                <input type="text" name="phone" value={resumeFormData.phone} onChange={handleResumeChange} className="input-field" placeholder="Phone Number" />
                            </div>
                            <div style={{ marginBottom: '0.5rem' }}>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280' }}>LinkedIn URL</label>
                                <input type="text" name="linkedin" value={resumeFormData.linkedin} onChange={handleResumeChange} className="input-field" placeholder="https://linkedin.com/in/..." />
                            </div>
                            <div style={{ marginBottom: '0.5rem' }}>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280' }}>GitHub URL</label>
                                <input type="text" name="github" value={resumeFormData.github} onChange={handleResumeChange} className="input-field" placeholder="https://github.com/..." />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280' }}>Portfolio URL</label>
                                <input type="text" name="portfolio" value={resumeFormData.portfolio} onChange={handleResumeChange} className="input-field" placeholder="https://yourportfolio.com" />
                            </div>

                            <h3 style={{ fontWeight: '600', fontSize: '1.125rem', marginBottom: '0.5rem', borderBottom: '1px solid #d1d5db', paddingBottom: '0.25rem' }}>Summary/Objective</h3>
                            <div style={{ marginBottom: '1rem' }}>
                                <textarea name="summary" value={resumeFormData.summary} onChange={handleResumeChange} className="input-field" style={{ height: '6rem', resize: 'vertical' }} placeholder="A brief summary of your professional experience..."></textarea>
                            </div>

                            <h3 style={{ fontWeight: '600', fontSize: '1.125rem', marginBottom: '0.5rem', borderBottom: '1px solid #d1d5db', paddingBottom: '0.25rem' }}>Education Details</h3>
                            {resumeFormData.education.map((edu, index) => (
                                <div key={index} style={{ border: '1px solid #e5e7eb', padding: '0.75rem', borderRadius: '0.375rem', marginBottom: '0.75rem', backgroundColor: '#f9fafb' }}>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280' }}>Degree</label>
                                    <input type="text" name="degree" value={edu.degree} onChange={(e) => handleEducationChange(index, e)} className="input-field" placeholder="Degree" />
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280' }}>Institution</label>
                                    <input type="text" name="institution" value={edu.institution} onChange={(e) => handleEducationChange(index, e)} className="input-field" placeholder="Institution" />
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280' }}>Start Date</label>
                                    <input type="date" name="startDate" value={edu.startDate ? new Date(edu.startDate).toISOString().split('T')[0] : ''} onChange={(e) => handleEducationChange(index, e)} className="input-field" />
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280' }}>End Date (optional)</label>
                                    <input type="date" name="endDate" value={edu.endDate ? new Date(edu.endDate).toISOString().split('T')[0] : ''} onChange={(e) => handleEducationChange(index, e)} className="input-field" />
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280' }}>Description</label>
                                    <textarea name="description" value={edu.description} onChange={(e) => handleEducationChange(index, e)} className="input-field" style={{ height: '4rem', resize: 'vertical' }} placeholder="Relevant coursework, achievements..."></textarea>
                                    <button type="button" onClick={() => removeEducation(index)} className="btn-remove"><TrashIcon style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }} /> Remove Education</button>
                                </div>
                            ))}
                            <button type="button" onClick={addEducation} className="btn-add" style={{marginTop: '0.5rem'}}><PlusCircleIcon style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }} /> Add Education</button>

                            <h3 style={{ fontWeight: '600', fontSize: '1.125rem', marginBottom: '0.5rem', borderBottom: '1px solid #d1d5db', paddingBottom: '0.25rem', marginTop: '1rem' }}>Experience</h3>
                            {resumeFormData.experience.map((exp, index) => (
                                <div key={index} style={{ border: '1px solid #e5e7eb', padding: '0.75rem', borderRadius: '0.375rem', marginBottom: '0.75rem', backgroundColor: '#f9fafb' }}>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280' }}>Job Title</label>
                                    <input type="text" name="jobTitle" value={exp.jobTitle} onChange={(e) => handleExperienceChange(index, e)} className="input-field" placeholder="Job Title" />
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280' }}>Company</label>
                                    <input type="text" name="company" value={exp.company} onChange={(e) => handleExperienceChange(index, e)} className="input-field" placeholder="Company Name" />
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280' }}>Location</label>
                                    <input type="text" name="location" value={exp.location} onChange={(e) => handleExperienceChange(index, e)} className="input-field" placeholder="Location" />
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280' }}>Start Date</label>
                                    <input type="date" name="startDate" value={exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : ''} onChange={(e) => handleExperienceChange(index, e)} className="input-field" />
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280' }}>End Date (optional)</label>
                                    <input type="date" name="endDate" value={exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : ''} onChange={(e) => handleExperienceChange(index, e)} className="input-field" />
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280' }}>Description</label>
                                    <textarea name="description" value={exp.description} onChange={(e) => handleExperienceChange(index, e)} className="input-field" style={{ height: '5rem', resize: 'vertical' }} placeholder="Responsibilities and achievements..."></textarea>
                                    <button type="button" onClick={() => removeExperience(index)} className="btn-remove"><TrashIcon style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }} /> Remove Experience</button>
                                </div>
                            ))}
                            <button type="button" onClick={addExperience} className="btn-add" style={{marginTop: '0.5rem'}}><PlusCircleIcon style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }} /> Add Experience</button>

                            <h3 style={{ fontWeight: '600', fontSize: '1.125rem', marginBottom: '0.5rem', borderBottom: '1px solid #d1d5db', paddingBottom: '0.25rem', marginTop: '1rem' }}>Projects</h3>
                            {resumeFormData.projects.map((proj, index) => (
                                <div key={index} style={{ border: '1px solid #e5e7eb', padding: '0.75rem', borderRadius: '0.375rem', marginBottom: '0.75rem', backgroundColor: '#f9fafb' }}>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280' }}>Project Name</label>
                                    <input type="text" name="projectName" value={proj.projectName} onChange={(e) => handleProjectChange(index, e)} className="input-field" placeholder="Project Name" />
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280' }}>Description</label>
                                    <textarea name="description" value={proj.description} onChange={(e) => handleProjectChange(index, e)} className="input-field" style={{ height: '4rem', resize: 'vertical' }} placeholder="Brief description of the project..."></textarea>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280' }}>Technologies (comma-separated)</label>
                                    <input type="text" name="technologies" value={proj.technologies.join(', ')} onChange={(e) => handleProjectChange(index, e)} className="input-field" placeholder="e.g., React, Node.js, MongoDB" />
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280' }}>Project Link</label>
                                    <input type="text" name="projectLink" value={proj.projectLink} onChange={(e) => handleProjectChange(index, e)} className="input-field" placeholder="URL to GitHub or live demo" />
                                    <button type="button" onClick={() => removeProject(index)} className="btn-remove"><TrashIcon style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }} /> Remove Project</button>
                                </div>
                            ))}
                            <button type="button" onClick={addProject} className="btn-add" style={{marginTop: '0.5rem'}}><PlusCircleIcon style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }} /> Add Project</button>

                            <h3 style={{ fontWeight: '600', fontSize: '1.125rem', marginBottom: '0.5rem', borderBottom: '1px solid #d1d5db', paddingBottom: '0.25rem', marginTop: '1rem' }}>Skills</h3>
                            {resumeFormData.skills.map((skill, index) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <input type="text" name="name" value={skill.name} onChange={(e) => handleSkillChange(index, e)} className="input-field" style={{ flex: 1 }} placeholder="Skill Name" />
                                    <select name="level" value={skill.level} onChange={(e) => handleSkillChange(index, e)} className="input-field" style={{ width: '6rem' }}>
                                        <option value="">Level</option>
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                        <option value="Expert">Expert</option>
                                    </select>
                                    <button type="button" onClick={() => removeSkill(index)} className="btn-icon-remove"><TrashIcon style={{ width: '1rem', height: '1rem' }} /></button>
                                </div>
                            ))}
                            <button type="button" onClick={addSkill} className="btn-add" style={{marginTop: '0.5rem'}}><PlusCircleIcon style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }} /> Add Skill</button>

                            <h3 style={{ fontWeight: '600', fontSize: '1.125rem', marginBottom: '0.5rem', borderBottom: '1px solid #d1d5db', paddingBottom: '0.25rem', marginTop: '1rem' }}>Achievements</h3>
                            {resumeFormData.achievements.map((ach, index) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <input type="text" value={ach} onChange={(e) => handleAchievementChange(index, e)} className="input-field" style={{ flex: 1 }} placeholder="Achievement description" />
                                    <button type="button" onClick={() => removeAchievement(index)} className="btn-icon-remove"><TrashIcon style={{ width: '1rem', height: '1rem' }} /></button>
                                </div>
                            ))}
                            <button type="button" onClick={addAchievement} className="btn-add" style={{marginTop: '0.5rem'}}><PlusCircleIcon style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }} /> Add Achievement</button>

                            <h3 style={{ fontWeight: '600', fontSize: '1.125rem', marginBottom: '0.5rem', borderBottom: '1px solid #d1d5db', paddingBottom: '0.25rem', marginTop: '1rem' }}>Certifications</h3>
                            {resumeFormData.certifications.map((cert, index) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <input type="text" name="name" value={cert.name} onChange={(e) => handleCertificationChange(index, e)} className="input-field" style={{ flex: 1 }} placeholder="Certification Name" />
                                    <input type="text" name="issuer" value={cert.issuer} onChange={(e) => handleCertificationChange(index, e)} className="input-field" style={{ flex: 1 }} placeholder="Issuer (e.g., Google, IBM)" />
                                    <button type="button" onClick={() => removeCertification(index)} className="btn-icon-remove"><TrashIcon style={{ width: '1rem', height: '1rem' }} /></button>
                                </div>
                            ))}
                            <button type="button" onClick={addCertification} className="btn-add" style={{marginTop: '0.5rem'}}><PlusCircleIcon style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }} /> Add Certification</button>

                            <h3 style={{ fontWeight: '600', fontSize: '1.125rem', marginBottom: '0.5rem', borderBottom: '1px solid #d1d5db', paddingBottom: '0.25rem', marginTop: '1rem' }}>Languages</h3>
                            {resumeFormData.languages.map((lang, index) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <input type="text" name="name" value={lang.name} onChange={(e) => handleLanguageChange(index, e)} className="input-field" style={{ flex: 1 }} placeholder="Language Name" />
                                    <select name="proficiency" value={lang.proficiency} onChange={(e) => handleLanguageChange(index, e)} className="input-field" style={{ width: '6rem' }}>
                                        <option value="">Select</option>
                                        <option value="">Proficiency</option>
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                        <option value="Native">Native</option>
                                    </select>
                                    <button type="button" onClick={() => removeLanguage(index)} className="btn-icon-remove"><TrashIcon style={{ width: '1rem', height: '1rem' }} /></button>
                                </div>
                            ))}
                            <button type="button" onClick={addLanguage} className="btn-add" style={{marginTop: '0.5rem'}}><PlusCircleIcon style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }} /> Add Language</button>
                        </>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                        <button
                            type="button"
                            onClick={handleSave}
                            style={{ flex: 1, backgroundColor: '#16a34a', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.375rem', fontWeight: '600', transition: 'background-color 0.15s ease-in-out' }}
                            disabled={saving}
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            style={{ flex: 1, backgroundColor: '#d1d5db', color: '#4b5563', padding: '0.5rem 1rem', borderRadius: '0.375rem', fontWeight: '600', transition: 'background-color 0.15s ease-in-out' }}
                        >
                            Cancel
                        </button>
                    </div>
                </>
            )}

            <div style={{ borderTop: '1px solid #e5e7eb', marginTop: '1rem', paddingTop: '1rem' }}>
                <button
                    onClick={handleLogout}
                    style={{ width: '100%', backgroundColor: '#ef4444', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.375rem', fontWeight: '600', transition: 'background-color 0.15s ease-in-out' }}
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default UserProfileEditor;