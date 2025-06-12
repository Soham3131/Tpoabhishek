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
