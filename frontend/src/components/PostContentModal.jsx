
import React, { useState } from 'react';
import axiosInstance from '../utils/axios';
import { XMarkIcon } from '@heroicons/react/24/solid';

const PostContentModal = ({ contentType, onClose }) => {
    // Initialize formData to include potential file objects
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const getEndpoint = () => {
        switch (contentType) {
            case 'job': return "/api/placements";
            case 'internship': return "/api/internships";
            case 'seminar': return "/api/seminars";
            case 'training': return "/api/trainings";
            case 'visit': return "/api/visits";
            case 'jobfair': return "/api/jobfairs";
            case 'workshop': return "/api/workshops";
            case 'podcast': return "/api/podcasts";
            default: return "";
        }
    };

    const getFormFields = () => {
        switch (contentType) {
            case 'job': return [
                { name: "title", label: "Job Title", type: "text", required: true },
                { name: "company", label: "Company", type: "text", required: true },
                { name: "location", label: "Location", type: "text", required: true },
                { name: "description", label: "Description", type: "textarea", required: true },
                { name: "requirements", label: "Requirements (comma-separated)", type: "text" },
                { name: "salary", label: "Salary (optional)", type: "text" },
                { name: "deadline", label: "Application Deadline", type: "date" },
                { name: "link", label: "Apply Link (optional)", type: "url" },
            ];
            case 'internship': return [
                { name: "title", label: "Internship Title", type: "text", required: true },
                { name: "company", label: "Company", type: "text", required: true },
                { name: "location", label: "Location", type: "text", required: true },
                { name: "description", label: "Description", type: "textarea", required: true },
                { name: "stipend", label: "Stipend (optional)", type: "text" },
                { name: "duration", label: "Duration", type: "text" },
                { name: "deadline", label: "Application Deadline", type: "date" },
                { name: "link", label: "Apply Link (optional)", type: "url" },
            ];
            case 'seminar': return [
                { name: "title", label: "Seminar Title", type: "text", required: true },
                { name: "organizer", label: "Organizer", type: "text", required: true },
                { name: "date", label: "Date", type: "date", required: true },
                { name: "time", label: "Time", type: "time" },
                { name: "location", label: "Location", type: "text", required: true },
                { name: "description", label: "Description", type: "textarea" },
                { name: "link", label: "Event Link (optional)", type: "url" },
            ];
            case 'training': return [
                { name: "title", label: "Training Title", type: "text", required: true },
                { name: "provider", label: "Provider", type: "text", required: true },
                { name: "startDate", label: "Start Date", type: "date", required: true },
                { name: "endDate", label: "End Date", type: "date" },
                { name: "location", label: "Location", type: "text" },
                { name: "description", label: "Description", type: "textarea" },
                { name: "cost", label: "Cost (optional)", type: "text" },
                { name: "link", label: "Enrollment Link (optional)", type: "url" },
            ];
            case 'visit': return [
                { name: "companyName", label: "Company Name", type: "text", required: true },
                { name: "date", label: "Date of Visit", type: "date", required: true },
                { name: "purpose", label: "Purpose of Visit", type: "textarea", required: true },
                { name: "contactPerson", label: "Contact Person (optional)", type: "text" },
                { name: "location", label: "Location", type: "text" },
                { name: "link", label: "Information Link (optional)", type: "url" },
            ];
            case 'jobfair': return [
                { name: "title", label: "Job Fair Title", type: "text", required: true },
                { name: "organizer", label: "Organizer", type: "text", required: true },
                { name: "date", label: "Date", type: "date", required: true },
                { name: "location", label: "Location", type: "text", required: true },
                { name: "description", label: "Description", type: "textarea" },
                { name: "participatingCompanies", label: "Participating Companies (comma-separated)", type: "text" },
                { name: "link", label: "Event Link (optional)", type: "url" },
            ];
            case 'workshop': return [
                { name: "title", label: "Workshop Title", type: "text", required: true },
                { name: "organizer", label: "Organizer", type: "text", required: true },
                { name: "date", label: "Date", type: "date", required: true },
                { name: "time", label: "Time", type: "time" },
                { name: "location", label: "Location", type: "text", required: true },
                { name: "description", label: "Description", type: "textarea" },
                { name: "link", label: "Enrollment Link (optional)", type: "url" },
            ];
            case 'podcast': return [
                { name: "title", label: "Podcast Title", type: "text", required: true },
                { name: "description", label: "Description", type: "textarea", required: true },
                { name: "youtubeLink", label: "YouTube Link (Video/Playlist URL)", type: "url", required: true }, // Changed to youtubeLink
                { name: "podcastImage", label: "Podcast Image", type: "file", required: true, accept: "image/*" }, // Added file input
            ];
            default: return [];
        }
    };

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'date' && value) {
            setFormData(prev => ({ ...prev, [name]: new Date(value).toISOString() }));
        } else if (type === 'file') {
            setFormData(prev => ({ ...prev, [name]: files[0] })); // Store the file object
        }
        else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        const endpoint = getEndpoint();
        if (!endpoint) {
            setError("Invalid content type for posting.");
            setLoading(false);
            return;
        }

        // Create FormData for file uploads
        const dataToSend = new FormData();

        // Append non-file fields to FormData
        for (const key in formData) {
            if (key === 'requirements' && formData[key]) {
                // Handle comma-separated arrays for 'requirements'
                formData[key].split(',').map(i => i.trim()).filter(Boolean).forEach(item => {
                    dataToSend.append(key + '[]', item); // Append as array for Express to parse
                });
            } else if (key === 'participatingCompanies' && formData[key]) {
                 // Handle comma-separated arrays for 'participatingCompanies'
                 formData[key].split(',').map(i => i.trim()).filter(Boolean).forEach(item => {
                    dataToSend.append(key + '[]', item); // Append as array for Express to parse
                });
            }
            else {
                dataToSend.append(key, formData[key]);
            }
        }

        // Special handling for the podcast image file
        if (contentType === 'podcast' && formData.podcastImage) {
            dataToSend.append('podcastImage', formData.podcastImage);
        } else if (contentType === 'podcast' && !formData.podcastImage) {
            setError("Please upload an image for the podcast.");
            setLoading(false);
            return;
        }


        try {
            // Set Content-Type to multipart/form-data for file uploads
            // const config = {
            //     headers: {
            //         'Content-Type': 'multipart/form-data', // Crucial for file uploads
            //         'X-CSRF-Token': localStorage.getItem('csrfToken'), // Ensure CSRF token is sent
            //     },
            // };

              const config = {
                headers: {
                    'Content-Type': 'multipart/form-data', // Keep this for file uploads
                    // 'X-CSRF-Token': localStorage.getItem('csrfToken'), // <-- REMOVE OR COMMENT OUT THIS LINE
                },
            };

            await axiosInstance.post(endpoint, dataToSend, config);
            setMessage(`${contentType} posted successfully!`);
            setFormData({}); // Clear form data
            setTimeout(onClose, 1500);
        } catch (err) {
            console.error("Error posting content:", err);
            if (err.response?.status === 403 && err.response?.data?.msg?.includes('CSRF token')) {
                setError('Invalid CSRF token. Please refresh the page, log in again, and try posting.');
            } else {
                setError(err.response?.data?.msg || `Failed to post ${contentType}. Please check inputs.`);
            }
        } finally {
            setLoading(false);
        }
    };

    const modalTitle = contentType.charAt(0).toUpperCase() + contentType.slice(1);
    const displayModalTitle = contentType === 'jobfair' ? 'Job Fair' : modalTitle;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl p-4 md:p-6 relative my-8 max-h-[95vh] overflow-y-auto">
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition">
                    <XMarkIcon className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold text-primary mb-6 text-center">Post New {displayModalTitle}</h2>

                {message && <p className="text-green-600 text-sm mb-4 text-center">{message}</p>}
                {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    {getFormFields().map((field) => (
                        <div key={field.name} className="w-full">
                            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
                                {field.label} {field.required && <span className="text-red-500">*</span>}
                            </label>
                            {field.type === "textarea" ? (
                                <textarea
                                    id={field.name}
                                    name={field.name}
                                    value={formData[field.name] || ''}
                                    onChange={handleChange}
                                    required={field.required}
                                    rows="3"
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                ></textarea>
                            ) : field.type === "file" ? (
                                <input
                                    type="file"
                                    id={field.name}
                                    name={field.name}
                                    accept={field.accept} // Use the accept attribute for file types
                                    onChange={handleChange}
                                    required={field.required}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            ) : (
                                <input
                                    type={field.type}
                                    id={field.name}
                                    name={field.name}
                                    value={field.type === 'date' && formData[field.name]
                                        ? new Date(formData[field.name]).toISOString().split('T')[0]
                                        : (formData[field.name] || '')
                                    }
                                    onChange={handleChange}
                                    required={field.required}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            )}
                        </div>
                    ))}

                    <div className="md:col-span-2 flex flex-col sm:flex-row justify-end items-center gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full sm:w-auto bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-md transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="w-full sm:w-auto bg-primary hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition"
                            disabled={loading}
                        >
                            {loading ? 'Posting...' : `Post ${displayModalTitle}`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostContentModal;