import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import axiosInstance from '../utils/axios';

const ApplicationFormModal = ({ contentId, contentType, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        contactNo: '',
        email: '',
        date: '',
        message: '',
        cvFile: null,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'cvFile') {
            setFormData(prev => ({ ...prev, cvFile: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        const dataToSend = new FormData();
        dataToSend.append('contentId', contentId);
        dataToSend.append('contentType', contentType);
        for (const key in formData) {
            dataToSend.append(key, formData[key]);
        }
        
        try {
            await axiosInstance.post('/api/applications', dataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage('Application submitted successfully! Redirecting...');
            setLoading(false);
            onSuccess();
            setTimeout(onClose, 2000);
        } catch (err) {
            console.error('Error submitting application:', err);
            setError(err.response?.data?.msg || 'Failed to submit application. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition">
                    <XMarkIcon className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold text-primary mb-6 text-center">Contact Forms</h2>
                
                {message && <p className="text-green-600 text-sm mb-4 text-center">{message}</p>}
                {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Your Name (required)</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Contact No.(required)</label>
                        <input type="tel" name="contactNo" value={formData.contactNo} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Your Email (required)</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Date</label>
                        <input type="date" name="date" value={formData.date} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Your Message (required)</label>
                        <textarea name="message" value={formData.message} onChange={handleChange} required rows="3" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Your CV (required)</label>
                        <input type="file" name="cvFile" onChange={handleChange} required className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100" />
                    </div>
                    
                    <div className="flex justify-end space-x-3 mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50">
                            {loading ? 'Submitting...' : 'Send'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ApplicationFormModal;