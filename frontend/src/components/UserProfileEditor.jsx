import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  updateMyProfile,
  getMyResumeDetails,
  createOrUpdateMyResume,
  logoutUser,
} from '../services/authService';
import { UserCircleIcon, CameraIcon, TrashIcon, PlusCircleIcon, DocumentArrowDownIcon } from '@heroicons/react/24/solid';

const UserProfileEditor = ({ onCloseDropdown }) => {
  const { user, setUser } = useAuth(); // user object now includes role
  const [profileFormData, setProfileFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    profilePicture: user?.profilePicture || '',
  });
  // Initialize resumeFormData with all fields, even if not for student role
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

  // --- Initial Data Fetch ---
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

      // Initialize profileFormData from the current user context
      setProfileFormData({
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
      });

      // Only attempt to fetch resume data if the user is a 'user' (student)
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
            // Initialize resumeFormData to empty arrays/strings for new entry
            setResumeFormData({
              phone: '', linkedin: '', github: '', portfolio: '', summary: '',
              education: [], experience: [], projects: [], skills: [], achievements: [], certifications: [], languages: []
            });
            setIsEditing(true); // Automatically go to edit mode if no resume exists for a student
          } else {
            setError(err.response?.data?.msg || "Failed to load resume data.");
          }
        }
      } else {
        // For non-student roles, ensure resume data is cleared/not attempted
        setResumeFormData({
          phone: '', linkedin: '', github: '', portfolio: '', summary: '',
          education: [], experience: [], projects: [], skills: [], achievements: [], certifications: [], languages: []
        });
      }
      setLoading(false);
    };

    fetchUserData();
  }, [user]); // Re-fetch if user object in context changes

  // Handlers for input changes (remain mostly the same)
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

  // --- Repeatable Section Handlers (remain the same) ---
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

  const handleArrayChange = (field, index, e) => {
    const updatedArray = [...resumeFormData[field]];
    updatedArray[index] = e.target.value;
    setResumeFormData(prev => ({ ...prev, [field]: updatedArray }));
  };
  const addToArray = (field) => {
    setResumeFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ""]
    }));
  };
  const removeFromArray = (field, index) => {
    const updatedArray = resumeFormData[field].filter((_, i) => i !== index);
    setResumeFormData(prev => ({ ...prev, [field]: updatedArray }));
  };

  // --- Save Profile Handler ---
  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      // 1. Always update User model (name, email, profilePicture)
      const userUpdatePayload = new FormData();
      userUpdatePayload.append('name', profileFormData.name);
      userUpdatePayload.append('email', profileFormData.email);
      if (profilePictureFile) {
        userUpdatePayload.append('profilePicture', profilePictureFile);
      }

      const userUpdateRes = await updateMyProfile(userUpdatePayload);
      setUser(userUpdateRes.data.user); // Update user in AuthContext
      setProfileFormData(prev => ({ ...prev, profilePicture: userUpdateRes.data.user.profilePicture }));
      setProfilePictureFile(null); // Clear file input


      // 2. ONLY update Resume model if the user is a 'user' (student)
      if (user.role === 'user') {
        const resumeUpdatePayload = {
          user: user._id, // Pass user ID to associate with resume
          fullName: profileFormData.name,
          email: profileFormData.email,
          phone: resumeFormData.phone,
          linkedin: resumeFormData.linkedin,
          github: resumeFormData.github,
          portfolio: resumeFormData.portfolio,
          summary: resumeFormData.summary,
          education: resumeFormData.education.map(edu => ({
            ...edu,
            startDate: edu.startDate ? new Date(edu.startDate).toISOString() : null,
            endDate: edu.endDate ? new Date(edu.endDate).toISOString() : null,
          })),
          experience: resumeFormData.experience.map(exp => ({
            ...exp,
            startDate: exp.startDate ? new Date(exp.startDate).toISOString() : null,
            endDate: exp.endDate ? new Date(exp.endDate).toISOString() : null,
          })),
          projects: resumeFormData.projects.map(proj => ({
            ...proj,
            technologies: Array.isArray(proj.technologies) ? proj.technologies : (proj.technologies || '').split(',').map(t => t.trim()).filter(Boolean)
          })),
          skills: resumeFormData.skills,
          achievements: resumeFormData.achievements,
          certifications: resumeFormData.certifications,
          languages: resumeFormData.languages,
        };
        await createOrUpdateMyResume(resumeUpdatePayload);
      }

      setMessage("Profile updated successfully!"); // Generic message for all roles
      setIsEditing(false); // Exit editing mode
    } catch (err) {
      console.error("Error saving profile:", err);
      setError(err.response?.data?.msg || err.response?.data?.error || "Failed to save profile. Please check your inputs.");
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPdf = async () => {
    setLoading(true); // Reusing loading state, consider a separate one for download
    setError(null);
    setMessage(null);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/resume/pdf`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("PDF download error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'resume.pdf';
      if (contentDisposition && contentDisposition.includes('filename=')) {
          filename = contentDisposition.split('filename=')[1].split(';')[0].replace(/"/g, '');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
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
      onCloseDropdown(); // Close dropdown after attempting logout
    }
  };

  if (loading && !user) {
    return <div className="p-4 text-center text-gray-700">Loading user data...</div>;
  }
  if (loading) {
    return <div className="p-4 text-center text-gray-700">Loading profile details...</div>;
  }

  const isStudent = user?.role === 'user';

  return (
    <div className="px-4 py-2 max-h-[80vh] overflow-y-auto custom-scrollbar">
      {message && <p className="text-green-600 text-sm mb-2 text-center">{message}</p>}
      {error && <p className="text-red-600 text-sm mb-2 text-center">{error}</p>}
      {saving && <p className="text-blue-600 text-sm mb-2 text-center">Saving...</p>}

      {/* Profile Header (Name, Email, Profile Picture) */}
      <div className="flex flex-col items-center border-b pb-4 mb-4">
        <div className="relative w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-2">
          {profileFormData.profilePicture ? (
            <img src={profileFormData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <UserCircleIcon className="w-16 h-16 text-gray-500" />
          )}
          {isEditing && (
            <label htmlFor="profilePictureInput" className="absolute bottom-0 right-0 p-1 bg-primary rounded-full cursor-pointer hover:bg-primary/80 transition">
              <CameraIcon className="w-5 h-5 text-white" />
              <input
                id="profilePictureInput"
                type="file"
                accept="image/*"
                onChange={handleProfilePictureFileChange}
                className="hidden"
              />
            </label>
          )}
        </div>
        <p className="font-bold text-lg">{profileFormData.name}</p>
        <p className="text-sm text-gray-600">{profileFormData.email}</p>
        <p className="text-xs text-gray-500 capitalize">Role: {user?.role}</p> {/* Display User Role */}
      </div>

      {!isEditing ? (
        // --- View Mode ---
        <>
          {/* Always show Basic Info for all roles */}
          <h3 className="font-semibold text-md mb-2 border-b pb-1">Basic Info</h3>
          <div className="mb-4 text-sm">
            <p><strong>Name:</strong> {profileFormData.name || "N/A"}</p>
            <p><strong>Email:</strong> {profileFormData.email || "N/A"}</p>
          </div>

          {isStudent && (
            <>
              <h3 className="font-semibold text-md mb-2 border-b pb-1">Contact & Social</h3>
              <div className="mb-4 text-sm">
                <p><strong>Phone:</strong> {resumeFormData.phone || "N/A"}</p>
                <p><strong>LinkedIn:</strong> {resumeFormData.linkedin ? <a href={resumeFormData.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{resumeFormData.linkedin}</a> : "N/A"}</p>
                <p><strong>GitHub:</strong> {resumeFormData.github ? <a href={resumeFormData.github} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{resumeFormData.github}</a> : "N/A"}</p>
                <p><strong>Portfolio:</strong> {resumeFormData.portfolio ? <a href={resumeFormData.portfolio} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{resumeFormData.portfolio}</a> : "N/A"}</p>
              </div>
              
              <h3 className="font-semibold text-md mb-2 border-b pb-1">Summary</h3>
              <p className="text-sm mb-4">{resumeFormData.summary || "N/A"}</p>

              <h3 className="font-semibold text-md mb-2 border-b pb-1">Education</h3>
              {resumeFormData.education.length > 0 ? (
                resumeFormData.education.map((edu, index) => (
                  <div key={index} className="mb-3 border-b border-gray-200 pb-2 last:border-b-0">
                    <p className="text-sm font-semibold">{edu.degree} from {edu.institution}</p>
                    <p className="text-xs text-gray-500">
                      {edu.startDate ? new Date(edu.startDate).toLocaleDateString() : 'N/A'} - {edu.endDate ? new Date(edu.endDate).toLocaleDateString() : 'Present'}
                    </p>
                    <p className="text-xs text-gray-700">{edu.description || 'No description.'}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 mb-4">No education details added yet.</p>
              )}

              <h3 className="font-semibold text-md mb-2 border-b pb-1">Experience</h3>
              {resumeFormData.experience.length > 0 ? (
                resumeFormData.experience.map((exp, index) => (
                  <div key={index} className="mb-3 border-b border-gray-200 pb-2 last:border-b-0">
                    <p className="text-sm font-semibold">{exp.jobTitle} at {exp.company}</p>
                    <p className="text-xs text-gray-500">
                      {exp.location} | {exp.startDate ? new Date(exp.startDate).toLocaleDateString() : 'N/A'} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}
                    </p>
                    <p className="text-xs text-gray-700">{exp.description || 'No description.'}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 mb-4">No experience details added yet.</p>
              )}

              <h3 className="font-semibold text-md mb-2 border-b pb-1">Projects</h3>
              {resumeFormData.projects.length > 0 ? (
                resumeFormData.projects.map((proj, index) => (
                  <div key={index} className="mb-3 border-b border-gray-200 pb-2 last:border-b-0">
                    <p className="text-sm font-semibold">{proj.projectName}</p>
                    {proj.technologies && proj.technologies.length > 0 && <p className="text-xs text-gray-500">Technologies: {proj.technologies.join(', ')}</p>}
                    {proj.projectLink && <p className="text-xs text-gray-500"><a href={proj.projectLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View Project</a></p>}
                    <p className="text-xs text-gray-700">{proj.description || 'No description.'}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 mb-4">No projects added yet.</p>
              )}

              <h3 className="font-semibold text-md mb-2 border-b pb-1">Skills</h3>
              {resumeFormData.skills.length > 0 ? (
                <ul className="list-disc list-inside text-sm mb-4">
                  {resumeFormData.skills.map((skill, index) => (
                    <li key={index}>{skill.name}{skill.level ? ` (${skill.level})` : ''}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 mb-4">No skills added yet.</p>
              )}

              <h3 className="font-semibold text-md mb-2 border-b pb-1">Achievements</h3>
              {resumeFormData.achievements.length > 0 ? (
                <ul className="list-disc list-inside text-sm mb-4">
                  {resumeFormData.achievements.map((ach, index) => (
                    <li key={index}>{ach}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 mb-4">No achievements added yet.</p>
              )}

              <h3 className="font-semibold text-md mb-2 border-b pb-1">Certifications</h3>
              {resumeFormData.certifications.length > 0 ? (
                <ul className="list-disc list-inside text-sm mb-4">
                  {resumeFormData.certifications.map((cert, index) => (
                    <li key={index}>{cert}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 mb-4">No certifications added yet.</p>
              )}

              <h3 className="font-semibold text-md mb-2 border-b pb-1">Languages</h3>
              {resumeFormData.languages.length > 0 ? (
                <ul className="list-disc list-inside text-sm mb-4">
                  {resumeFormData.languages.map((lang, index) => (
                    <li key={index}>{lang}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 mb-4">No languages added yet.</p>
              )}
            </>
          )} {/* End isStudent conditional for view mode */}

          <button
            onClick={() => setIsEditing(true)}
            className="w-full bg-blue-500 text-white py-2 rounded-md font-semibold hover:bg-blue-600 transition mt-4"
          >
            Edit Profile {isStudent && "& Resume"}
          </button>
          
          {isStudent && ( // Only show download PDF for students
            <button
              onClick={handleDownloadPdf}
              className="w-full bg-indigo-600 text-white py-2 rounded-md font-semibold hover:bg-indigo-700 transition mt-2 flex items-center justify-center"
              disabled={loading}
            >
              <DocumentArrowDownIcon className="w-5 h-5 mr-2" /> Download Resume PDF
            </button>
          )}
        </>
      ) : (
        // --- Edit Mode ---
        <>
          {/* Basic User Info (Name, Email) - Always editable */}
          <h3 className="font-semibold text-md mb-2 border-b pb-1">Basic Info</h3>
          <div className="mb-2">
            <label className="block text-xs font-medium text-gray-500">Name</label>
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
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-500">Email</label>
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

          {isStudent && ( // Only show resume-related sections if student
            <>
              {/* Contact & Social Links */}
              <h3 className="font-semibold text-md mb-2 border-b pb-1">Contact & Social</h3>
              <div className="mb-2">
                <label className="block text-xs font-medium text-gray-500">Phone</label>
                <input type="text" name="phone" value={resumeFormData.phone} onChange={handleResumeChange} className="input-field" placeholder="Phone Number" />
              </div>
              <div className="mb-2">
                <label className="block text-xs font-medium text-gray-500">LinkedIn URL</label>
                <input type="text" name="linkedin" value={resumeFormData.linkedin} onChange={handleResumeChange} className="input-field" placeholder="https://linkedin.com/in/..." />
              </div>
              <div className="mb-2">
                <label className="block text-xs font-medium text-gray-500">GitHub URL</label>
                <input type="text" name="github" value={resumeFormData.github} onChange={handleResumeChange} className="input-field" placeholder="https://github.com/..." />
              </div>
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-500">Portfolio URL</label>
                <input type="text" name="portfolio" value={resumeFormData.portfolio} onChange={handleResumeChange} className="input-field" placeholder="https://yourportfolio.com" />
              </div>

              {/* Summary/Objective */}
              <h3 className="font-semibold text-md mb-2 border-b pb-1">Summary/Objective</h3>
              <div className="mb-4">
                <textarea name="summary" value={resumeFormData.summary} onChange={handleResumeChange} className="input-field h-24 resize-y" placeholder="A brief summary of your professional experience..."></textarea>
              </div>

              {/* Education Section */}
              <h3 className="font-semibold text-md mb-2 border-b pb-1">Education Details</h3>
              {resumeFormData.education.map((edu, index) => (
                <div key={index} className="border border-gray-200 p-3 rounded-md mb-3 bg-gray-50">
                  <label className="block text-xs font-medium text-gray-500">Degree</label>
                  <input type="text" name="degree" value={edu.degree} onChange={(e) => handleEducationChange(index, e)} className="input-field mb-1" placeholder="Degree" />
                  <label className="block text-xs font-medium text-gray-500">Institution</label>
                  <input type="text" name="institution" value={edu.institution} onChange={(e) => handleEducationChange(index, e)} className="input-field mb-1" placeholder="Institution" />
                  <label className="block text-xs font-medium text-gray-500">Start Date</label>
                  <input type="date" name="startDate" value={edu.startDate ? new Date(edu.startDate).toISOString().split('T')[0] : ''} onChange={(e) => handleEducationChange(index, e)} className="input-field mb-1" />
                  <label className="block text-xs font-medium text-gray-500">End Date (optional)</label>
                  <input type="date" name="endDate" value={edu.endDate ? new Date(edu.endDate).toISOString().split('T')[0] : ''} onChange={(e) => handleEducationChange(index, e)} className="input-field mb-1" />
                  <label className="block text-xs font-medium text-gray-500">Description</label>
                  <textarea name="description" value={edu.description} onChange={(e) => handleEducationChange(index, e)} className="input-field h-16 resize-y mb-2" placeholder="Relevant coursework, achievements..."></textarea>
                  <button type="button" onClick={() => removeEducation(index)} className="btn-remove"><TrashIcon className="w-4 h-4 mr-1" /> Remove Education</button>
                </div>
              ))}
              <button type="button" onClick={addEducation} className="btn-add"><PlusCircleIcon className="w-4 h-4 mr-1" /> Add Education</button>

              {/* Experience Section */}
              <h3 className="font-semibold text-md mb-2 border-b pb-1 mt-4">Experience</h3>
              {resumeFormData.experience.map((exp, index) => (
                <div key={index} className="border border-gray-200 p-3 rounded-md mb-3 bg-gray-50">
                  <label className="block text-xs font-medium text-gray-500">Job Title</label>
                  <input type="text" name="jobTitle" value={exp.jobTitle} onChange={(e) => handleExperienceChange(index, e)} className="input-field mb-1" placeholder="Job Title" />
                  <label className="block text-xs font-medium text-gray-500">Company</label>
                  <input type="text" name="company" value={exp.company} onChange={(e) => handleExperienceChange(index, e)} className="input-field mb-1" placeholder="Company Name" />
                  <label className="block text-xs font-medium text-gray-500">Location</label>
                  <input type="text" name="location" value={exp.location} onChange={(e) => handleExperienceChange(index, e)} className="input-field mb-1" placeholder="Location" />
                  <label className="block text-xs font-medium text-gray-500">Start Date</label>
                  <input type="date" name="startDate" value={exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : ''} onChange={(e) => handleExperienceChange(index, e)} className="input-field mb-1" />
                  <label className="block text-xs font-medium text-gray-500">End Date (optional)</label>
                  <input type="date" name="endDate" value={exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : ''} onChange={(e) => handleExperienceChange(index, e)} className="input-field mb-1" />
                  <label className="block text-xs font-medium text-gray-500">Description</label>
                  <textarea name="description" value={exp.description} onChange={(e) => handleExperienceChange(index, e)} className="input-field h-20 resize-y mb-2" placeholder="Responsibilities and achievements..."></textarea>
                  <button type="button" onClick={() => removeExperience(index)} className="btn-remove"><TrashIcon className="w-4 h-4 mr-1" /> Remove Experience</button>
                </div>
              ))}
              <button type="button" onClick={addExperience} className="btn-add"><PlusCircleIcon className="w-4 h-4 mr-1" /> Add Experience</button>

              {/* Projects Section */}
              <h3 className="font-semibold text-md mb-2 border-b pb-1 mt-4">Projects</h3>
              {resumeFormData.projects.map((proj, index) => (
                <div key={index} className="border border-gray-200 p-3 rounded-md mb-3 bg-gray-50">
                  <label className="block text-xs font-medium text-gray-500">Project Name</label>
                  <input type="text" name="projectName" value={proj.projectName} onChange={(e) => handleProjectChange(index, e)} className="input-field mb-1" placeholder="Project Name" />
                  <label className="block text-xs font-medium text-gray-500">Description</label>
                  <textarea name="description" value={proj.description} onChange={(e) => handleProjectChange(index, e)} className="input-field h-16 resize-y mb-1" placeholder="Brief description of the project..."></textarea>
                  <label className="block text-xs font-medium text-gray-500">Technologies (comma-separated)</label>
                  <input type="text" name="technologies" value={proj.technologies.join(', ')} onChange={(e) => handleProjectChange(index, e)} className="input-field mb-1" placeholder="e.g., React, Node.js, MongoDB" />
                  <label className="block text-xs font-medium text-gray-500">Project Link</label>
                  <input type="text" name="projectLink" value={proj.projectLink} onChange={(e) => handleProjectChange(index, e)} className="input-field mb-2" placeholder="URL to GitHub or live demo" />
                  <button type="button" onClick={() => removeProject(index)} className="btn-remove"><TrashIcon className="w-4 h-4 mr-1" /> Remove Project</button>
                </div>
              ))}
              <button type="button" onClick={addProject} className="btn-add"><PlusCircleIcon className="w-4 h-4 mr-1" /> Add Project</button>

              {/* Skills Section */}
              <h3 className="font-semibold text-md mb-2 border-b pb-1 mt-4">Skills</h3>
              {resumeFormData.skills.map((skill, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input type="text" name="name" value={skill.name} onChange={(e) => handleSkillChange(index, e)} className="input-field flex-1" placeholder="Skill Name" />
                  <select name="level" value={skill.level} onChange={(e) => handleSkillChange(index, e)} className="input-field w-24">
                    <option value="">Level</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                  <button type="button" onClick={() => removeSkill(index)} className="btn-icon-remove"><TrashIcon className="w-4 h-4" /></button>
                </div>
              ))}
              <button type="button" onClick={addSkill} className="btn-add"><PlusCircleIcon className="w-4 h-4 mr-1" /> Add Skill</button>

              {/* Achievements Section */}
              <h3 className="font-semibold text-md mb-2 border-b pb-1 mt-4">Achievements</h3>
              {resumeFormData.achievements.map((ach, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <textarea type="text" value={ach} onChange={(e) => handleArrayChange('achievements', index, e)} className="input-field flex-1 resize-y" placeholder="Achievement description"></textarea>
                  <button type="button" onClick={() => removeFromArray('achievements', index)} className="btn-icon-remove"><TrashIcon className="w-4 h-4" /></button>
                </div>
              ))}
              <button type="button" onClick={() => addToArray('achievements')} className="btn-add"><PlusCircleIcon className="w-4 h-4 mr-1" /> Add Achievement</button>

              {/* Certifications Section */}
              <h3 className="font-semibold text-md mb-2 border-b pb-1 mt-4">Certifications</h3>
              {resumeFormData.certifications.map((cert, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <textarea type="text" value={cert} onChange={(e) => handleArrayChange('certifications', index, e)} className="input-field flex-1 resize-y" placeholder="Certification name"></textarea>
                  <button type="button" onClick={() => removeFromArray('certifications', index)} className="btn-icon-remove"><TrashIcon className="w-4 h-4" /></button>
                </div>
              ))}
              <button type="button" onClick={() => addToArray('certifications')} className="btn-add"><PlusCircleIcon className="w-4 h-4 mr-1" /> Add Certification</button>

              {/* Languages Section */}
              <h3 className="font-semibold text-md mb-2 border-b pb-1 mt-4">Languages</h3>
              {resumeFormData.languages.map((lang, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input type="text" value={lang} onChange={(e) => handleArrayChange('languages', index, e)} className="input-field flex-1" placeholder="Language" />
                  <button type="button" onClick={() => removeFromArray('languages', index)} className="btn-icon-remove"><TrashIcon className="w-4 h-4" /></button>
                </div>
              ))}
              <button type="button" onClick={() => addToArray('languages')} className="btn-add"><PlusCircleIcon className="w-4 h-4 mr-1" /> Add Language</button>
            </>
          )} {/* End isStudent conditional for edit mode */}


          {/* Save/Cancel Buttons */}
          <div className="flex justify-between items-center gap-2 mt-4">
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 bg-green-600 text-white py-2 rounded-md font-semibold hover:bg-green-700 transition"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-md font-semibold hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </>
      )}

      {/* Logout Button */}
      <div className="border-t border-gray-200 mt-4 pt-4">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-2 rounded-md font-semibold hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserProfileEditor;


// import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback
// import { useAuth } from '../context/AuthContext';
// import {
//   updateMyProfile,
//   getMyResumeDetails,
//   createOrUpdateMyResume,
//   logoutUser,
// } from '../services/authService';
// import {
//   UserCircleIcon,
//   CameraIcon,
//   TrashIcon,
//   PlusCircleIcon,
//   DocumentArrowDownIcon,
//   PencilSquareIcon, // For edit button
//   XCircleIcon, // For cancel button
//   ArrowLeftOnRectangleIcon // For logout
// } from '@heroicons/react/24/solid';

// const UserProfileEditor = ({ onCloseDropdown }) => {
//   const { user, setUser } = useAuth(); // user object now includes role

//   // Define the new color scheme
//   const primaryNavyBlue = "bg-[#1E3A5F]";
//   const secondarySteelBlue = "bg-[#4A789C]";
//   const accentOrange = "bg-[#FF6B35]";
//   const lightGrayBackground = "bg-[#F5F7FA]";
//   const darkGrayText = "text-[#2D3436]";

//   const primaryTextColor = "text-[#1E3A5F]";
//   const secondaryTextColor = "text-[#4A789C]";
//   const accentTextColor = "text-[#FF6B35]";

//   // Lighter shades for card backgrounds/icon circles - good for borders/backgrounds
//   const lighterSteelBlue = "bg-[#E1EBF2]"; // Lighter variant of secondarySteelBlue
//   // const lighterOrange = "bg-[#FFE0D3]"; // Lighter variant of accentOrange (not directly used as bg)
//   // const lighterNavyBlue = "bg-[#CCDDEE]"; // Lighter variant of primaryNavyBlue (not directly used as bg)
//   // const lighterGray = "bg-[#F5F7FA]"; // Same as background, for simple cards


//   const [profileFormData, setProfileFormData] = useState({
//     name: user?.name || '',
//     email: user?.email || '',
//     profilePicture: user?.profilePicture || '',
//   });
//   const [resumeFormData, setResumeFormData] = useState({
//     phone: '',
//     linkedin: '',
//     github: '',
//     portfolio: '',
//     summary: '',
//     education: [],
//     experience: [],
//     projects: [],
//     skills: [],
//     achievements: [],
//     certifications: [],
//     languages: [],
//   });
//   const [profilePictureFile, setProfilePictureFile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState(null);
//   const [message, setMessage] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);

//   // Store original data to revert on cancel
//   const [originalProfileData, setOriginalProfileData] = useState({});
//   const [originalResumeData, setOriginalResumeData] = useState({});

//   // Helper function to add https:// if missing
//   const addHttpsIfMissing = useCallback((url) => {
//     if (!url) return '';
//     if (url.startsWith('http://') || url.startsWith('https://')) {
//       return url;
//     }
//     return `https://${url}`;
//   }, []);

//   // --- Initial Data Fetch ---
//   useEffect(() => {
//     const fetchUserData = async () => {
//       if (!user) {
//         setError("User not logged in.");
//         setLoading(false);
//         return;
//       }

//       setLoading(true);
//       setError(null);
//       setMessage(null);

//       // Initialize profileFormData from the current user context
//       const initialProfile = {
//         name: user.name,
//         email: user.email,
//         profilePicture: user.profilePicture,
//       };
//       setProfileFormData(initialProfile);
//       setOriginalProfileData(initialProfile); // Store for potential revert

//       // Only attempt to fetch resume data if the user is a 'user' (student)
//       if (user.role === 'user') {
//         try {
//           const resumeRes = await getMyResumeDetails();
//           const fetchedResumeData = resumeRes.data;

//           const initialResume = {
//             phone: fetchedResumeData.phone || '',
//             linkedin: fetchedResumeData.linkedin || '',
//             github: fetchedResumeData.github || '',
//             portfolio: fetchedResumeData.portfolio || '',
//             summary: fetchedResumeData.summary || '',
//             education: fetchedResumeData.education || [],
//             experience: fetchedResumeData.experience || [],
//             projects: fetchedResumeData.projects || [],
//             skills: fetchedResumeData.skills || [],
//             achievements: fetchedResumeData.achievements || [],
//             certifications: fetchedResumeData.certifications || [],
//             languages: fetchedResumeData.languages || [],
//           };
//           setResumeFormData(initialResume);
//           setOriginalResumeData(initialResume); // Store for potential revert
//           setMessage("Profile data loaded.");

//         } catch (err) {
//           console.error("Error fetching resume data:", err);
//           if (err.response && err.response.status === 404 && err.response.data.msg === "Resume not found for this user") {
//             setError("No resume found. Please add your details.");
//             // Initialize resumeFormData to empty arrays/strings for new entry
//             const emptyResume = {
//               phone: '', linkedin: '', github: '', portfolio: '', summary: '',
//               education: [], experience: [], projects: [], skills: [], achievements: [], certifications: [], languages: []
//             };
//             setResumeFormData(emptyResume);
//             setOriginalResumeData(emptyResume); // Store empty for revert
//             setIsEditing(true); // Automatically go to edit mode if no resume exists for a student
//           } else {
//             setError(err.response?.data?.msg || "Failed to load resume data.");
//           }
//         }
//       } else {
//         // For non-student roles, ensure resume data is cleared/not attempted
//         const emptyResume = {
//           phone: '', linkedin: '', github: '', portfolio: '', summary: '',
//           education: [], experience: [], projects: [], skills: [], achievements: [], certifications: [], languages: []
//         };
//         setResumeFormData(emptyResume);
//         setOriginalResumeData(emptyResume); // Store empty for revert
//       }
//       setLoading(false);
//     };

//     fetchUserData();
//   }, [user]); // Re-fetch if user object in context changes

//   // Handlers for input changes
//   const handleProfileChange = (e) => {
//     setProfileFormData({ ...profileFormData, [e.target.name]: e.target.value });
//   };

//   const handleResumeChange = (e) => {
//     setResumeFormData({ ...resumeFormData, [e.target.name]: e.target.value });
//   };

//   const handleProfilePictureFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setProfilePictureFile(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setProfileFormData(prev => ({ ...prev, profilePicture: reader.result }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // --- Repeatable Section Handlers ---
//   const handleEducationChange = (index, e) => {
//     const updatedEducation = [...resumeFormData.education];
//     updatedEducation[index] = { ...updatedEducation[index], [e.target.name]: e.target.value };
//     setResumeFormData(prev => ({ ...prev, education: updatedEducation }));
//   };
//   const addEducation = () => {
//     setResumeFormData(prev => ({
//       ...prev,
//       education: [...prev.education, { degree: "", institution: "", startDate: "", endDate: "", description: "" }]
//     }));
//   };
//   const removeEducation = (index) => {
//     const updatedEducation = resumeFormData.education.filter((_, i) => i !== index);
//     setResumeFormData(prev => ({ ...prev, education: updatedEducation }));
//   };

//   const handleExperienceChange = (index, e) => {
//     const updatedExperience = [...resumeFormData.experience];
//     updatedExperience[index] = { ...updatedExperience[index], [e.target.name]: e.target.value };
//     setResumeFormData(prev => ({ ...prev, experience: updatedExperience }));
//   };
//   const addExperience = () => {
//     setResumeFormData(prev => ({
//       ...prev,
//       experience: [...prev.experience, { jobTitle: "", company: "", location: "", startDate: "", endDate: "", description: "" }]
//     }));
//   };
//   const removeExperience = (index) => {
//     const updatedExperience = resumeFormData.experience.filter((_, i) => i !== index);
//     setResumeFormData(prev => ({ ...prev, experience: updatedExperience }));
//   };

//   const handleProjectChange = (index, e) => {
//     const updatedProjects = [...resumeFormData.projects];
//     if (e.target.name === "technologies") {
//       updatedProjects[index] = { ...updatedProjects[index], technologies: e.target.value.split(',').map(tech => tech.trim()).filter(Boolean) }; // Ensure technologies are clean
//     } else {
//       updatedProjects[index] = { ...updatedProjects[index], [e.target.name]: e.target.value };
//     }
//     setResumeFormData(prev => ({ ...prev, projects: updatedProjects }));
//   };
//   const addProject = () => {
//     setResumeFormData(prev => ({
//       ...prev,
//       projects: [...prev.projects, { projectName: "", description: "", technologies: [], projectLink: "" }]
//     }));
//   };
//   const removeProject = (index) => {
//     const updatedProjects = resumeFormData.projects.filter((_, i) => i !== index);
//     setResumeFormData(prev => ({ ...prev, projects: updatedProjects }));
//   };

//   const handleSkillChange = (index, e) => {
//     const updatedSkills = [...resumeFormData.skills];
//     updatedSkills[index] = { ...updatedSkills[index], [e.target.name]: e.target.value };
//     setResumeFormData(prev => ({ ...prev, skills: updatedSkills }));
//   };
//   const addSkill = () => {
//     setResumeFormData(prev => ({
//       ...prev,
//       skills: [...prev.skills, { name: "", level: "" }]
//     }));
//   };
//   const removeSkill = (index) => {
//     const updatedSkills = resumeFormData.skills.filter((_, i) => i !== index);
//     setResumeFormData(prev => ({ ...prev, skills: updatedSkills }));
//   };

//   const handleArrayChange = (field, index, e) => {
//     const updatedArray = [...resumeFormData[field]];
//     updatedArray[index] = e.target.value;
//     setResumeFormData(prev => ({ ...prev, [field]: updatedArray }));
//   };
//   const addToArray = (field) => {
//     setResumeFormData(prev => ({
//       ...prev,
//       [field]: [...prev[field], ""]
//     }));
//   };
//   const removeFromArray = (field, index) => {
//     const updatedArray = resumeFormData[field].filter((_, i) => i !== index);
//     setResumeFormData(prev => ({ ...prev, [field]: updatedArray }));
//   };

//   // --- Save Profile Handler ---
//   const handleSave = async () => {
//     setSaving(true);
//     setError(null);
//     setMessage(null);

//     try {
//       // 1. Always update User model (name, email, profilePicture)
//       const userUpdatePayload = new FormData();
//       userUpdatePayload.append('name', profileFormData.name);
//       userUpdatePayload.append('email', profileFormData.email);
//       if (profilePictureFile) {
//         userUpdatePayload.append('profilePicture', profilePictureFile);
//       }

//       const userUpdateRes = await updateMyProfile(userUpdatePayload);
//       setUser(userUpdateRes.data.user); // Update user in AuthContext
//       setProfileFormData(prev => ({ ...prev, profilePicture: userUpdateRes.data.user.profilePicture }));
//       setProfilePictureFile(null); // Clear file input
//       setOriginalProfileData(userUpdateRes.data.user); // Update original with new data


//       // 2. ONLY update Resume model if the user is a 'user' (student)
//       if (user.role === 'user') {
//         const resumeUpdatePayload = {
//           user: user._id, // Pass user ID to associate with resume
//           fullName: profileFormData.name,
//           email: profileFormData.email,
//           phone: resumeFormData.phone,
//           linkedin: resumeFormData.linkedin,
//           github: resumeFormData.github,
//           portfolio: resumeFormData.portfolio,
//           summary: resumeFormData.summary,
//           education: resumeFormData.education.map(edu => ({
//             ...edu,
//             startDate: edu.startDate ? new Date(edu.startDate).toISOString() : null,
//             endDate: edu.endDate ? new Date(edu.endDate).toISOString() : null,
//           })), // Fixed semicolon to comma
//           experience: resumeFormData.experience.map(exp => ({
//             ...exp,
//             startDate: exp.startDate ? new Date(exp.startDate).toISOString() : null,
//             endDate: exp.endDate ? new Date(exp.endDate).toISOString() : null,
//           })), // Fixed semicolon to comma
//           projects: resumeFormData.projects.map(proj => ({
//             ...proj,
//             technologies: Array.isArray(proj.technologies) ? proj.technologies : (proj.technologies || '').split(',').map(t => t.trim()).filter(Boolean)
//           })), // Fixed semicolon to comma
//           skills: resumeFormData.skills,
//           achievements: resumeFormData.achievements,
//           certifications: resumeFormData.certifications,
//           languages: resumeFormData.languages,
//         };
//         await createOrUpdateMyResume(resumeUpdatePayload);
//         setOriginalResumeData(resumeFormData); // Update original with new data
//       }

//       setMessage("Profile updated successfully!"); // Generic message for all roles
//       setIsEditing(false); // Exit editing mode
//     } catch (err) {
//       console.error("Error saving profile:", err);
//       setError(err.response?.data?.msg || err.response?.data?.error || "Failed to save profile. Please check your inputs.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleCancelEdit = () => {
//     setProfileFormData(originalProfileData);
//     setResumeFormData(originalResumeData);
//     setProfilePictureFile(null);
//     setError(null);
//     setMessage(null);
//     setIsEditing(false);
//   };

//   const handleDownloadPdf = async () => {
//     setLoading(true); // Reusing loading state, consider a separate one for download
//     setError(null);
//     setMessage(null);
//     try {
//       const response = await fetch("http://localhost:5000/api/resume/pdf", {
//         method: "GET",
//         credentials: "include",
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error("PDF download error response:", errorText);
//         throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
//       }

//       const contentDisposition = response.headers.get('Content-Disposition');
//       let filename = 'resume.pdf';
//       if (contentDisposition && contentDisposition.includes('filename=')) {
//           filename = contentDisposition.split('filename=')[1].split(';')[0].replace(/"/g, '');
//       }

//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = filename;
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
//       window.URL.revokeObjectURL(url);
//       setMessage("Resume PDF downloaded successfully!");
//     } catch (err) {
//       console.error("Error downloading PDF:", err);
//       setError("Failed to download PDF. Please ensure your resume is complete. Error: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       await logoutUser();
//       setUser(null);
//     } catch (err) {
//       console.error("Logout failed:", err);
//       setError(err.response?.data?.msg || "Logout failed");
//     } finally {
//       onCloseDropdown(); // Close dropdown after attempting logout
//     }
//   };

//   if (loading && !user) {
//     return <div className={`p-4 text-center ${darkGrayText}`}>Loading user data...</div>;
//   }
//   if (loading) {
//     return <div className={`p-4 text-center ${darkGrayText}`}>Loading profile details...</div>;
//   }

//   const isStudent = user?.role === 'user';

//   return (
//     <div className={`relative p-6 max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl ${lightGrayBackground} border border-gray-200 animate-slide-in-right`}>
//       {/* Messages */}
//       {message && <p className={`text-green-600 text-sm mb-3 text-center animate-fade-in`}>{message}</p>}
//       {error && <p className={`text-red-600 text-sm mb-3 text-center animate-fade-in`}>{error}</p>}
//       {saving && <p className={`text-blue-600 text-sm mb-3 text-center animate-pulse`}>Saving changes...</p>}

//       {/* Profile Header */}
//       <div className="flex flex-col items-center pb-6 mb-6 border-b border-gray-300">
//         <div className="relative w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-3 shadow-inner ring-4 ring-offset-2 ring-blue-200">
//           {profileFormData.profilePicture ? (
//             <img src={profileFormData.profilePicture} alt="Profile" className="w-full h-full object-cover animate-zoom-in" />
//           ) : (
//             <UserCircleIcon className={`w-20 h-20 ${secondaryTextColor} animate-fade-in`} />
//           )}
//           {isEditing && (
//             <label htmlFor="profilePictureInput" className={`absolute bottom-0 right-0 p-2 ${accentOrange} rounded-full cursor-pointer hover:bg-opacity-90 transition-all duration-300 shadow-md transform hover:scale-110`}>
//               <CameraIcon className="w-6 h-6 text-white" />
//               <input
//                 id="profilePictureInput"
//                 type="file"
//                 accept="image/*"
//                 onChange={handleProfilePictureFileChange}
//                 className="hidden"
//               />
//             </label>
//           )}
//         </div>
//         <h2 className={`font-extrabold text-2xl mb-1 ${primaryTextColor} animate-fade-in-up`}>{profileFormData.name}</h2>
//         <p className={`text-md ${darkGrayText} opacity-80 animate-fade-in-up delay-100`}>{profileFormData.email}</p>
//         <p className={`text-sm text-gray-500 capitalize mt-1 animate-fade-in-up delay-200`}>Role: <span className="font-semibold">{user?.role}</span></p>
//       </div>

//       {!isEditing ? (
//         // --- View Mode ---
//         <div className="space-y-6">
//           {/* Always show Basic Info for all roles */}
//           <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 animate-fade-in">
//             <h3 className={`font-bold text-lg mb-3 ${primaryTextColor} border-b pb-2 border-gray-200`}>Basic Information</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 text-sm">
//               <p><strong className={secondaryTextColor}>Name:</strong> {profileFormData.name || "N/A"}</p>
//               <p><strong className={secondaryTextColor}>Email:</strong> {profileFormData.email || "N/A"}</p>
//             </div>
//           </div>

//           {isStudent && (
//             <>
//               {/* Contact & Social */}
//               <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 animate-fade-in delay-100">
//                 <h3 className={`font-bold text-lg mb-3 ${primaryTextColor} border-b pb-2 border-gray-200`}>Contact & Social</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 text-sm">
//                   <p><strong className={secondaryTextColor}>Phone:</strong> {resumeFormData.phone || "N/A"}</p>
//                   {/* FIX: Displaying full URL string as link text */}
//                   <p><strong className={secondaryTextColor}>LinkedIn:</strong> {resumeFormData.linkedin ? <a href={addHttpsIfMissing(resumeFormData.linkedin)} target="_blank" rel="noopener noreferrer" className={`text-blue-500 hover:underline ${accentTextColor} transition-colors`}>{resumeFormData.linkedin}</a> : "N/A"}</p>
//                   <p><strong className={secondaryTextColor}>GitHub:</strong> {resumeFormData.github ? <a href={addHttpsIfMissing(resumeFormData.github)} target="_blank" rel="noopener noreferrer" className={`text-blue-500 hover:underline ${accentTextColor} transition-colors`}>{resumeFormData.github}</a> : "N/A"}</p>
//                   <p><strong className={secondaryTextColor}>Portfolio:</strong> {resumeFormData.portfolio ? <a href={addHttpsIfMissing(resumeFormData.portfolio)} target="_blank" rel="noopener noreferrer" className={`text-blue-500 hover:underline ${accentTextColor} transition-colors`}>{resumeFormData.portfolio}</a> : "N/A"}</p>
//                 </div>
//               </div>
              
//               {/* Summary */}
//               <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 animate-fade-in delay-200">
//                 <h3 className={`font-bold text-lg mb-3 ${primaryTextColor} border-b pb-2 border-gray-200`}>Summary</h3>
//                 <p className={`text-sm ${darkGrayText} leading-relaxed`}>{resumeFormData.summary || "No summary provided."}</p>
//               </div>

//               {/* Education Section */}
//               <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 animate-fade-in delay-300">
//                 <h3 className={`font-bold text-lg mb-3 ${primaryTextColor} border-b pb-2 border-gray-200`}>Education</h3>
//                 {resumeFormData.education.length > 0 ? (
//                   resumeFormData.education.map((edu, index) => (
//                     <div key={index} className="mb-4 pb-4 border-b border-gray-100 last:border-b-0 last:mb-0">
//                       <p className={`text-md font-semibold ${secondaryTextColor}`}>{edu.degree} from {edu.institution}</p>
//                       <p className="text-xs text-gray-500 mt-1">
//                         {edu.startDate ? new Date(edu.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'N/A'} - {edu.endDate ? new Date(edu.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'Present'}
//                       </p>
//                       <p className={`text-sm ${darkGrayText} mt-2`}>{edu.description || 'No description provided.'}</p>
//                     </div>
//                   ))
//                 ) : (
//                   <p className="text-sm text-gray-500">No education details added yet.</p>
//                 )}
//               </div>

//               {/* Experience Section */}
//               <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 animate-fade-in delay-400">
//                 <h3 className={`font-bold text-lg mb-3 ${primaryTextColor} border-b pb-2 border-gray-200`}>Experience</h3>
//                 {resumeFormData.experience.length > 0 ? (
//                   resumeFormData.experience.map((exp, index) => (
//                     <div key={index} className="mb-4 pb-4 border-b border-gray-100 last:border-b-0 last:mb-0">
//                       <p className={`text-md font-semibold ${secondaryTextColor}`}>{exp.jobTitle} at {exp.company}</p>
//                       <p className="text-sm text-gray-500 mt-1">
//                         {exp.location} | {exp.startDate ? new Date(exp.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'N/A'} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'Present'}
//                       </p>
//                       <p className={`text-sm ${darkGrayText} mt-2`}>{exp.description || 'No description provided.'}</p>
//                     </div>
//                   ))
//                 ) : (
//                   <p className="text-sm text-gray-500">No experience details added yet.</p>
//                 )}
//               </div>

//               {/* Projects Section */}
//               <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 animate-fade-in delay-500">
//                 <h3 className={`font-bold text-lg mb-3 ${primaryTextColor} border-b pb-2 border-gray-200`}>Projects</h3>
//                 {resumeFormData.projects.length > 0 ? (
//                   resumeFormData.projects.map((proj, index) => (
//                     <div key={index} className="mb-4 pb-4 border-b border-gray-100 last:border-b-0 last:mb-0">
//                       <p className={`text-md font-semibold ${secondaryTextColor}`}>{proj.projectName}</p>
//                       {proj.technologies && proj.technologies.length > 0 && <p className="text-xs text-gray-500 mt-1">Technologies: <span className="font-medium">{proj.technologies.join(', ')}</span></p>}
//                       {/* FIX: Displaying full URL string as link text */}
//                       {proj.projectLink && <p className="text-xs text-gray-500 mt-1"><a href={addHttpsIfMissing(proj.projectLink)} target="_blank" rel="noopener noreferrer" className={`text-blue-500 hover:underline ${accentTextColor} transition-colors`}>{proj.projectLink}</a></p>}
//                       <p className={`text-sm ${darkGrayText} mt-2`}>{proj.description || 'No description provided.'}</p>
//                     </div>
//                   ))
//                 ) : (
//                   <p className="text-sm text-gray-500">No projects added yet.</p>
//                 )}
//               </div>

//               {/* Skills Section */}
//               <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 animate-fade-in delay-600">
//                 <h3 className={`font-bold text-lg mb-3 ${primaryTextColor} border-b pb-2 border-gray-200`}>Skills</h3>
//                 {resumeFormData.skills.length > 0 ? (
//                   <ul className="list-disc list-inside text-sm grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-1">
//                     {resumeFormData.skills.map((skill, index) => (
//                       <li key={index} className={`${darkGrayText}`}>{skill.name}{skill.level ? ` (${skill.level})` : ''}</li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <p className="text-sm text-gray-500">No skills added yet.</p>
//                 )}
//               </div>

//               {/* Achievements Section (Simple Array) */}
//               <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 animate-fade-in delay-700">
//                 <h3 className={`font-bold text-lg mb-3 ${primaryTextColor} border-b pb-2 border-gray-200`}>Achievements</h3>
//                 {resumeFormData.achievements.length > 0 ? (
//                   <ul className="list-disc list-inside text-sm">
//                     {resumeFormData.achievements.map((ach, index) => (
//                       <li key={index} className={`${darkGrayText}`}>{ach}</li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <p className="text-sm text-gray-500">No achievements added yet.</p>
//                 )}
//               </div>

//               {/* Certifications Section (Simple Array) */}
//               <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 animate-fade-in delay-800">
//                 <h3 className={`font-bold text-lg mb-3 ${primaryTextColor} border-b pb-2 border-gray-200`}>Certifications</h3>
//                 {resumeFormData.certifications.length > 0 ? (
//                   <ul className="list-disc list-inside text-sm">
//                     {resumeFormData.certifications.map((cert, index) => (
//                       <li key={index} className={`${darkGrayText}`}>{cert}</li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <p className="text-sm text-gray-500">No certifications added yet.</p>
//                 )}
//               </div>

//               {/* Languages Section (Simple Array) */}
//               <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 animate-fade-in delay-900">
//                 <h3 className={`font-bold text-lg mb-3 ${primaryTextColor} border-b pb-2 border-gray-200`}>Languages</h3>
//                 {resumeFormData.languages.length > 0 ? (
//                   <ul className="list-disc list-inside text-sm">
//                     {resumeFormData.languages.map((lang, index) => (
//                       <li key={index} className={`${darkGrayText}`}>{lang}</li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <p className="text-sm text-gray-500">No languages added yet.</p>
//                 )}
//               </div>
//             </>
//           )} {/* End isStudent conditional for view mode */}

//           <div className="flex flex-col gap-3 mt-6">
//             <button
//               onClick={() => setIsEditing(true)}
//               className={`w-full ${primaryNavyBlue} text-white py-3 rounded-lg font-semibold shadow-md hover:bg-opacity-90 transition-all duration-300 flex items-center justify-center transform hover:-translate-y-0.5`}
//             >
//               <PencilSquareIcon className="w-5 h-5 mr-2" /> Edit Profile {isStudent && "& Resume"}
//             </button>
            
//             {isStudent && ( // Only show download PDF for students
//               <button
//                 onClick={handleDownloadPdf}
//                 className={`w-full ${secondarySteelBlue} text-white py-3 rounded-lg font-semibold shadow-md hover:bg-opacity-90 transition-all duration-300 flex items-center justify-center transform hover:-translate-y-0.5`}
//                 disabled={loading}
//               >
//                 <DocumentArrowDownIcon className="w-5 h-5 mr-2" /> Download Resume PDF
//               </button>
//             )}
//           </div>
//         </div>
//       ) : (
//         // --- Edit Mode ---
//         <div className="space-y-6">
//           {/* Basic User Info (Name, Email) - Always editable */}
//           <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 animate-fade-in">
//             <h3 className={`font-bold text-lg mb-3 ${primaryTextColor} border-b pb-2 border-gray-200`}>Basic Information</h3>
//             <div className="mb-4">
//               <label className={`block text-sm font-medium ${secondaryTextColor} mb-1`}>Name</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={profileFormData.name}
//                 onChange={handleProfileChange}
//                 className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-${accentOrange} focus:border-transparent transition-all duration-200 ${darkGrayText} placeholder-gray-400`}
//                 placeholder="Full Name"
//                 required
//               />
//             </div>
//             <div className="mb-4">
//               <label className={`block text-sm font-medium ${secondaryTextColor} mb-1`}>Email</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={profileFormData.email}
//                 onChange={handleProfileChange}
//                 className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-${accentOrange} focus:border-transparent transition-all duration-200 ${darkGrayText} placeholder-gray-400`}
//                 placeholder="Email Address"
//                 required
//               />
//             </div>
//           </div>

//           {isStudent && ( // Only show resume-related sections if student
//             <>
//               {/* Contact & Social Links */}
//               <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 animate-fade-in delay-100">
//                 <h3 className={`font-bold text-lg mb-3 ${primaryTextColor} border-b pb-2 border-gray-200`}>Contact & Social</h3>
//                 <div className="mb-4">
//                   <label className={`block text-sm font-medium ${secondaryTextColor} mb-1`}>Phone</label>
//                   <input type="text" name="phone" value={resumeFormData.phone} onChange={handleResumeChange} className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-${accentOrange} focus:border-transparent transition-all duration-200 ${darkGrayText} placeholder-gray-400`} placeholder="Phone Number" />
//                 </div>
//                 <div className="mb-4">
//                   <label className={`block text-sm font-medium ${secondaryTextColor} mb-1`}>LinkedIn URL</label>
//                   <input type="text" name="linkedin" value={resumeFormData.linkedin} onChange={handleResumeChange} className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-${accentOrange} focus:border-transparent transition-all duration-200 ${darkGrayText} placeholder-gray-400`} placeholder="https://linkedin.com/in/..." />
//                 </div>
//                 <div className="mb-4">
//                   <label className={`block text-sm font-medium ${secondaryTextColor} mb-1`}>GitHub URL</label>
//                   <input type="text" name="github" value={resumeFormData.github} onChange={handleResumeChange} className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-${accentOrange} focus:border-transparent transition-all duration-200 ${darkGrayText} placeholder-gray-400`} placeholder="https://github.com/..." />
//                 </div>
//                 <div className="mb-4">
//                   <label className={`block text-sm font-medium ${secondaryTextColor} mb-1`}>Portfolio URL</label>
//                   <input type="text" name="portfolio" value={resumeFormData.portfolio} onChange={handleResumeChange} className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-${accentOrange} focus:border-transparent transition-all duration-200 ${darkGrayText} placeholder-gray-400`} placeholder="https://yourportfolio.com" />
//                 </div>
//               </div>

//               {/* Summary/Objective */}
//               <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 animate-fade-in delay-200">
//                 <h3 className={`font-bold text-lg mb-3 ${primaryTextColor} border-b pb-2 border-gray-200`}>Summary/Objective</h3>
//                 <div className="mb-4">
//                   <textarea name="summary" value={resumeFormData.summary} onChange={handleResumeChange} className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-${accentOrange} focus:border-transparent transition-all duration-200 ${darkGrayText} placeholder-gray-400 h-32 resize-y`} placeholder="A brief summary of your professional experience, skills, and goals..."></textarea>
//                 </div>
//               </div>

//               {/* Education Section */}
//               <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 animate-fade-in delay-300">
//                 <h3 className={`font-bold text-lg mb-4 ${primaryTextColor} border-b pb-2 border-gray-200`}>Education Details</h3>
//                 {resumeFormData.education.map((edu, index) => (
//                   <div key={index} className="border border-gray-200 p-4 rounded-md mb-4 bg-gray-50 shadow-inner animate-slide-in-bottom">
//                     <label className={`block text-xs font-medium ${secondaryTextColor} mb-1`}>Degree</label>
//                     <input type="text" name="degree" value={edu.degree} onChange={(e) => handleEducationChange(index, e)} className={`input-field mb-2`} placeholder="e.g., Bachelor of Technology" />
//                     <label className={`block text-xs font-medium ${secondaryTextColor} mb-1`}>Institution</label>
//                     <input type="text" name="institution" value={edu.institution} onChange={(e) => handleEducationChange(index, e)} className={`input-field mb-2`} placeholder="e.g., University Name" />
//                     <label className={`block text-xs font-medium ${secondaryTextColor} mb-1`}>Start Date</label>
//                     <input type="date" name="startDate" value={edu.startDate ? new Date(edu.startDate).toISOString().split('T')[0] : ''} onChange={(e) => handleEducationChange(index, e)} className={`input-field mb-2`} />
//                     <label className={`block text-xs font-medium ${secondaryTextColor} mb-1`}>End Date (optional)</label>
//                     <input type="date" name="endDate" value={edu.endDate ? new Date(edu.endDate).toISOString().split('T')[0] : ''} onChange={(e) => handleEducationChange(index, e)} className={`input-field mb-2`} />
//                     <label className={`block text-xs font-medium ${secondaryTextColor} mb-1`}>Description</label>
//                     <textarea name="description" value={edu.description} onChange={(e) => handleEducationChange(index, e)} className={`input-field h-20 resize-y mb-4`} placeholder="Relevant coursework, academic achievements, GPA if applicable..."></textarea>
//                     <button type="button" onClick={() => removeEducation(index)} className={`btn-remove group ${accentOrange} hover:bg-red-700`}>
//                       <TrashIcon className="w-4 h-4 mr-2 text-white group-hover:text-gray-100" /> Remove Education
//                     </button>
//                   </div>
//                 ))}
//                 <button type="button" onClick={addEducation} className={`btn-add ${secondarySteelBlue} hover:bg-blue-700`}>
//                   <PlusCircleIcon className="w-5 h-5 mr-2 text-white" /> Add Education
//                 </button>
//               </div>

//               {/* Experience Section */}
//               <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 animate-fade-in delay-400">
//                 <h3 className={`font-bold text-lg mb-4 ${primaryTextColor} border-b pb-2 border-gray-200`}>Experience</h3>
//                 {resumeFormData.experience.map((exp, index) => (
//                   <div key={index} className="border border-gray-200 p-4 rounded-md mb-4 bg-gray-50 shadow-inner animate-slide-in-bottom">
//                     <label className={`block text-xs font-medium ${secondaryTextColor} mb-1`}>Job Title</label>
//                     <input type="text" name="jobTitle" value={exp.jobTitle} onChange={(e) => handleExperienceChange(index, e)} className={`input-field mb-2`} placeholder="e.g., Software Engineer Intern" />
//                     <label className={`block text-xs font-medium ${secondaryTextColor} mb-1`}>Company</label>
//                     <input type="text" name="company" value={exp.company} onChange={(e) => handleExperienceChange(index, e)} className={`input-field mb-2`} placeholder="Company Name" />
//                     <label className={`block text-xs font-medium ${secondaryTextColor} mb-1`}>Location</label>
//                     <input type="text" name="location" value={exp.location} onChange={(e) => handleExperienceChange(index, e)} className={`input-field mb-2`} placeholder="e.g., San Francisco, CA" />
//                     <label className={`block text-xs font-medium ${secondaryTextColor} mb-1`}>Start Date</label>
//                     <input type="date" name="startDate" value={exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : ''} onChange={(e) => handleExperienceChange(index, e)} className={`input-field mb-2`} />
//                     <label className={`block text-xs font-medium ${secondaryTextColor} mb-1`}>End Date (optional)</label>
//                     <input type="date" name="endDate" value={exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : ''} onChange={(e) => handleExperienceChange(index, e)} className={`input-field mb-2`} />
//                     <label className={`block text-xs font-medium ${secondaryTextColor} mb-1`}>Description</label>
//                     <textarea name="description" value={exp.description} onChange={(e) => handleExperienceChange(index, e)} className={`input-field h-24 resize-y mb-4`} placeholder="Key responsibilities, achievements, technologies used (use bullet points if preferred in final display)..."></textarea>
//                     <button type="button" onClick={() => removeExperience(index)} className={`btn-remove group ${accentOrange} hover:bg-red-700`}>
//                       <TrashIcon className="w-4 h-4 mr-2 text-white group-hover:text-gray-100" /> Remove Experience
//                     </button>
//                   </div>
//                 ))}
//                 <button type="button" onClick={addExperience} className={`btn-add ${secondarySteelBlue} hover:bg-blue-700`}>
//                   <PlusCircleIcon className="w-5 h-5 mr-2 text-white" /> Add Experience
//                 </button>
//               </div>

//               {/* Projects Section */}
//               <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 animate-fade-in delay-500">
//                 <h3 className={`font-bold text-lg mb-4 ${primaryTextColor} border-b pb-2 border-gray-200`}>Projects</h3>
//                 {resumeFormData.projects.map((proj, index) => (
//                   <div key={index} className="border border-gray-200 p-4 rounded-md mb-4 bg-gray-50 shadow-inner animate-slide-in-bottom">
//                     <label className={`block text-xs font-medium ${secondaryTextColor} mb-1`}>Project Name</label>
//                     <input type="text" name="projectName" value={proj.projectName} onChange={(e) => handleProjectChange(index, e)} className={`input-field mb-2`} placeholder="e.g., E-commerce Platform Redesign" />
//                     <label className={`block text-xs font-medium ${secondaryTextColor} mb-1`}>Description</label>
//                     <textarea name="description" value={proj.description} onChange={(e) => handleProjectChange(index, e)} className={`input-field h-20 resize-y mb-2`} placeholder="Brief description of the project and your role..."></textarea>
//                     <label className={`block text-xs font-medium ${secondaryTextColor} mb-1`}>Technologies (comma-separated)</label>
//                     <input type="text" name="technologies" value={Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies || ''} onChange={(e) => handleProjectChange(index, e)} className={`input-field mb-2`} placeholder="e.g., React, Node.js, MongoDB, AWS" />
//                     <label className={`block text-xs font-medium ${secondaryTextColor} mb-1`}>Project Link (GitHub/Live Demo)</label>
//                     <input type="text" name="projectLink" value={proj.projectLink} onChange={(e) => handleProjectChange(index, e)} className={`input-field mb-4`} placeholder="URL to GitHub repository or live demo" />
//                     <button type="button" onClick={() => removeProject(index)} className={`btn-remove group ${accentOrange} hover:bg-red-700`}>
//                       <TrashIcon className="w-4 h-4 mr-2 text-white group-hover:text-gray-100" /> Remove Project
//                     </button>
//                   </div>
//                 ))}
//                 <button type="button" onClick={addProject} className={`btn-add ${secondarySteelBlue} hover:bg-blue-700`}>
//                   <PlusCircleIcon className="w-5 h-5 mr-2 text-white" /> Add Project
//                 </button>
//               </div>

//               {/* Skills Section */}
//               <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 animate-fade-in delay-600">
//                 <h3 className={`font-bold text-lg mb-4 ${primaryTextColor} border-b pb-2 border-gray-200`}>Skills</h3>
//                 {resumeFormData.skills.map((skill, index) => (
//                   <div key={index} className="flex items-center gap-3 mb-3 p-2 border border-gray-100 rounded-md bg-gray-50 animate-slide-in-bottom">
//                     <div className="flex-grow">
//                       <label className={`block text-xs font-medium ${secondaryTextColor} mb-1`}>Skill Name</label>
//                       <input type="text" name="name" value={skill.name} onChange={(e) => handleSkillChange(index, e)} className={`input-field inline-block w-full`} placeholder="e.g., JavaScript" />
//                     </div>
//                     <div className="flex-shrink-0">
//                       <label className={`block text-xs font-medium ${secondaryTextColor} mb-1`}>Level</label>
//                       <select name="level" value={skill.level} onChange={(e) => handleSkillChange(index, e)} className={`input-field inline-block w-24`}>
//                         <option value="">Select</option>
//                         <option value="Beginner">Beginner</option>
//                         <option value="Intermediate">Intermediate</option>
//                         <option value="Advanced">Advanced</option>
//                         <option value="Expert">Expert</option>
//                       </select>
//                     </div>
//                     <button type="button" onClick={() => removeSkill(index)} className={`btn-remove-icon group ${accentOrange} hover:bg-red-700 w-8 h-8 flex-shrink-0`}>
//                       <TrashIcon className="w-4 h-4 text-white group-hover:text-gray-100" />
//                     </button>
//                   </div>
//                 ))}
//                 <button type="button" onClick={addSkill} className={`btn-add ${secondarySteelBlue} hover:bg-blue-700`}>
//                   <PlusCircleIcon className="w-5 h-5 mr-2 text-white" /> Add Skill
//                 </button>
//               </div>

//               {/* Achievements Section (Simple Array) */}
//               <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 animate-fade-in delay-700">
//                 <h3 className={`font-bold text-lg mb-4 ${primaryTextColor} border-b pb-2 border-gray-200`}>Achievements</h3>
//                 {resumeFormData.achievements.map((ach, index) => (
//                   <div key={index} className="flex items-center gap-3 mb-3 p-2 border border-gray-100 rounded-md bg-gray-50 animate-slide-in-bottom">
//                     <input type="text" value={ach} onChange={(e) => handleArrayChange('achievements', index, e)} className={`input-field flex-grow`} placeholder="e.g., Awarded 'Top Performer' for Q3 2023" />
//                     <button type="button" onClick={() => removeFromArray('achievements', index)} className={`btn-remove-icon group ${accentOrange} hover:bg-red-700 w-8 h-8 flex-shrink-0`}>
//                       <TrashIcon className="w-4 h-4 text-white group-hover:text-gray-100" />
//                     </button>
//                   </div>
//                 ))}
//                 <button type="button" onClick={() => addToArray('achievements')} className={`btn-add ${secondarySteelBlue} hover:bg-blue-700`}>
//                   <PlusCircleIcon className="w-5 h-5 mr-2 text-white" /> Add Achievement
//                 </button>
//               </div>

//               {/* Certifications Section (Simple Array) */}
//               <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 animate-fade-in delay-800">
//                 <h3 className={`font-bold text-lg mb-4 ${primaryTextColor} border-b pb-2 border-gray-200`}>Certifications</h3>
//                 {resumeFormData.certifications.map((cert, index) => (
//                   <div key={index} className="flex items-center gap-3 mb-3 p-2 border border-gray-100 rounded-md bg-gray-50 animate-slide-in-bottom">
//                     <input type="text" value={cert} onChange={(e) => handleArrayChange('certifications', index, e)} className={`input-field flex-grow`} placeholder="e.g., AWS Certified Developer - Associate" />
//                     <button type="button" onClick={() => removeFromArray('certifications', index)} className={`btn-remove-icon group ${accentOrange} hover:bg-red-700 w-8 h-8 flex-shrink-0`}>
//                       <TrashIcon className="w-4 h-4 text-white group-hover:text-gray-100" />
//                     </button>
//                   </div>
//                 ))}
//                 <button type="button" onClick={() => addToArray('certifications')} className={`btn-add ${secondarySteelBlue} hover:bg-blue-700`}>
//                   <PlusCircleIcon className="w-5 h-5 mr-2 text-white" /> Add Certification
//                 </button>
//               </div>

//               {/* Languages Section (Simple Array) */}
//               <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 animate-fade-in delay-900">
//                 <h3 className={`font-bold text-lg mb-4 ${primaryTextColor} border-b pb-2 border-gray-200`}>Languages</h3>
//                 {resumeFormData.languages.map((lang, index) => (
//                   <div key={index} className="flex items-center gap-3 mb-3 p-2 border border-gray-100 rounded-md bg-gray-50 animate-slide-in-bottom">
//                     <input type="text" value={lang} onChange={(e) => handleArrayChange('languages', index, e)} className={`input-field flex-grow`} placeholder="e.g., English (Fluent)" />
//                     <button type="button" onClick={() => removeFromArray('languages', index)} className={`btn-remove-icon group ${accentOrange} hover:bg-red-700 w-8 h-8 flex-shrink-0`}>
//                       <TrashIcon className="w-4 h-4 text-white group-hover:text-gray-100" />
//                     </button>
//                   </div>
//                 ))}
//                 <button type="button" onClick={() => addToArray('languages')} className={`btn-add ${secondarySteelBlue} hover:bg-blue-700`}>
//                   <PlusCircleIcon className="w-5 h-5 mr-2 text-white" /> Add Language
//                 </button>
//               </div>
//             </>
//           )} {/* End isStudent conditional for edit mode */}

//           {/* Action Buttons for Edit Mode */}
//           <div className="flex flex-col gap-3 mt-6">
//             <button
//               onClick={handleSave}
//               disabled={saving}
//               className={`w-full ${primaryNavyBlue} text-white py-3 rounded-lg font-semibold shadow-md hover:bg-opacity-90 transition-all duration-300 flex items-center justify-center transform hover:-translate-y-0.5 ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
//             >
//               {saving ? (
//                 <>
//                   <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></span> Saving...
//                 </>
//               ) : (
//                 <>
//                   <PencilSquareIcon className="w-5 h-5 mr-2" /> Save Changes
//                 </>
//               )}
//             </button>
//             <button
//               onClick={handleCancelEdit}
//               className={`w-full ${secondarySteelBlue} text-white py-3 rounded-lg font-semibold shadow-md hover:bg-opacity-90 transition-all duration-300 flex items-center justify-center transform hover:-translate-y-0.5`}
//             >
//               <XCircleIcon className="w-5 h-5 mr-2" /> Cancel Edit
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Logout Button (Always visible) */}
//       <div className="mt-8 pt-6 border-t border-gray-300">
//         <button
//           onClick={handleLogout}
//           className={`w-full bg-red-600 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-red-700 transition-all duration-300 flex items-center justify-center transform hover:-translate-y-0.5`}
//         >
//           <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-2" /> Logout
//         </button>
//       </div>

//       {/* Custom CSS for base styles and animations */}
//       <style>{`
//         /* Base input field styling */
//         .input-field {
//           @apply w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-all duration-200 text-[#2D3436] placeholder-gray-400; /* Used explicit hex for focus ring */
//         }

//         /* Base button styles for add/remove in repeatable sections */
//         .btn-add {
//           @apply mt-2 px-4 py-2 rounded-md text-white font-medium flex items-center justify-center transition-all duration-200 hover:opacity-90 shadow-sm;
//         }
//         .btn-remove {
//           @apply px-4 py-2 rounded-md text-white font-medium flex items-center justify-center transition-all duration-200 hover:opacity-90 shadow-sm text-sm;
//         }
//         .btn-remove-icon {
//           @apply flex-shrink-0 p-2 rounded-full text-white flex items-center justify-center transition-all duration-200 hover:opacity-90 shadow-sm;
//         }

//         /* Animations */
//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
//         @keyframes slideInRight {
//           from { opacity: 0; transform: translateX(20px); }
//           to { opacity: 1; transform: translateX(0); }
//         }
//         @keyframes fadeInUp {
//           from { opacity: 0; transform: translateY(10px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         @keyframes zoomIn {
//           from { transform: scale(0.9); opacity: 0; }
//           to { transform: scale(1); opacity: 1; }
//         }
//         @keyframes pulse {
//           0%, 100% { opacity: 1; }
//           50% { opacity: 0.6; }
//         }
//         @keyframes slideInBottom {
//           from { opacity: 0; transform: translateY(10px); }
//           to { opacity: 1; transform: translateY(0); }
//         }

//         .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
//         .animate-slide-in-right { animation: slideInRight 0.5s ease-out forwards; }
//         .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
//         .animate-zoom-in { animation: zoomIn 0.5s ease-out forwards; }
//         .animate-pulse { animation: pulse 1.5s infinite; }
//         .animate-slide-in-bottom { animation: slideInBottom 0.4s ease-out forwards; }

//         /* Staggered animation delays (adjust as needed for desired effect) */
//         .delay-100 { animation-delay: 0.1s; }
//         .delay-200 { animation-delay: 0.2s; }
//         .delay-300 { animation-delay: 0.3s; }
//         .delay-400 { animation-delay: 0.4s; }
//         .delay-500 { animation-delay: 0.5s; }
//         .delay-600 { animation-delay: 0.6s; }
//         .delay-700 { animation-delay: 0.7s; }
//         .delay-800 { animation-delay: 0.8s; }
//         .delay-900 { animation-delay: 0.9s; }
//       `}</style>
//     </div>
//   );
// };

// export default UserProfileEditor;
