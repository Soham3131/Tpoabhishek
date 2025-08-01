

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { LinkIcon, CalendarIcon, BriefcaseIcon, MapPinIcon, UserIcon, ClockIcon, CurrencyDollarIcon, TagIcon } from '@heroicons/react/24/solid';

const ContentDetailPage = ({ title, endpoint, contentTypeForTracking }) => {
  const { id } = useParams();
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applyMessage, setApplyMessage] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false); // New state for terms acceptance

  const themeColors = {
    primary: '#1E3A5F',       // Navy Blue
    secondary: '#4A789C',     // Steel Blue
    accent: '#FF6B35',        // Orange
    background: '#F5F7FA',    // Light Gray
    text: '#2D3436',          // Dark Gray
  };

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get(`${endpoint}/${id}`);
        setItem(res.data);
      } catch (err) {
        console.error(`Error fetching ${title.toLowerCase()} details:`, err);
        setError(err.response?.data?.msg || `Failed to load ${title.toLowerCase()} details.`);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id, endpoint, title]);

  const handleApplyNow = async () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    if (user?.role !== 'user') {
      setApplyMessage('Only students can apply to this opportunity.');
      return;
    }

    if (!termsAccepted) { // Check if terms are accepted
      setApplyMessage('Please read and accept the terms and conditions to proceed.');
      return;
    }

    if (!item?.link) {
      setApplyMessage("Application/Information link is not available for this item.");
      return;
    }

    try {
      await axiosInstance.post('/api/applications/track', {
        contentId: item._id,
        contentType: contentTypeForTracking,
        appliedLink: item.link,
      });
      setApplyMessage("Application click tracked successfully!");

      setTimeout(() => {
        window.open(item.link, '_blank');
      }, 500);

    } catch (err) {
      console.error("Error tracking application:", err);
      if (err.response?.status === 409) {
        setApplyMessage("You have already applied to this opportunity.");
      } else {
        setApplyMessage(err.response?.data?.msg || "Failed to track application. Please try again.");
      }
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] text-[#2D3436] p-8">Loading {title.toLowerCase()} details...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] text-red-600 p-8">{error}</div>;
  }

  if (!item) {
    return <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] text-[#2D3436] p-8">{title} details not found.</div>;
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#2D3436] pb-12">
      {/* Hero Section - similar to listings page */}
      <div className="relative w-full bg-gradient-to-br from-[#1E3A5F] to-[#4A789C] text-white py-16 px-4 sm:px-6 lg:px-8 shadow-lg overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10 animate-pulse-slow"></div> 
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 animate-fade-in-up">
            {item.title || item.companyName || item.organization || title} Details
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 mb-8 animate-fade-in-up animation-delay-200">
            Comprehensive information about this {title.toLowerCase()} opportunity.
          </p>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
        {applyMessage && (
          <p className={`text-sm mb-6 p-3 rounded-lg text-center ${applyMessage.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {applyMessage}
          </p>
        )}

        <div className="bg-white rounded-xl shadow-xl p-8 lg:p-10 border border-gray-100">
          <h2 className="text-3xl font-bold text-[#1E3A5F] mb-6 border-b pb-4">{item.title || item.companyName || item.organization}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-lg">
            {item.company && <p className="flex items-center text-[#2D3436]"><BriefcaseIcon className="w-5 h-5 mr-2 text-[#4A789C]" /> <strong>Company:</strong> <span className="ml-2">{item.company}</span></p>}
            {item.organization && <p className="flex items-center text-[#2D3436]"><BriefcaseIcon className="w-5 h-5 mr-2 text-[#4A789C]" /> <strong>Organization:</strong> <span className="ml-2">{item.organization}</span></p>}
            {item.location && <p className="flex items-center text-[#2D3436]"><MapPinIcon className="w-5 h-5 mr-2 text-[#4A789C]" /> <strong>Location:</strong> <span className="ml-2">{item.location}</span></p>}

            {item.stipend && <p className="flex items-center text-[#2D3436]"><CurrencyDollarIcon className="w-5 h-5 mr-2 text-[#4A789C]" /> <strong>Stipend:</strong> <span className="ml-2">{item.stipend}</span></p>}
            {item.salary && <p className="flex items-center text-[#2D3436]"><CurrencyDollarIcon className="w-5 h-5 mr-2 text-[#4A789C]" /> <strong>Salary:</strong> <span className="ml-2">{item.salary}</span></p>}
            {item.duration && <p className="flex items-center text-[#2D3436]"><ClockIcon className="w-5 h-5 mr-2 text-[#4A789C]" /> <strong>Duration:</strong> <span className="ml-2">{item.duration}</span></p>}
            
            {item.organizer && <p className="flex items-center text-[#2D3436]"><UserIcon className="w-5 h-5 mr-2 text-[#4A789C]" /> <strong>Organizer:</strong> <span className="ml-2">{item.organizer}</span></p>}
            {item.provider && <p className="flex items-center text-[#2D3436]"><UserIcon className="w-5 h-5 mr-2 text-[#4A789C]" /> <strong>Provider:</strong> <span className="ml-2">{item.provider}</span></p>}
            {item.contactPerson && <p className="flex items-center text-[#2D3436]"><UserIcon className="w-5 h-5 mr-2 text-[#4A789C]" /> <strong>Contact:</strong> <span className="ml-2">{item.contactPerson}</span></p>}
            {item.cost && <p className="flex items-center text-[#2D3436]"><CurrencyDollarIcon className="w-5 h-5 mr-2 text-[#4A789C]" /> <strong>Cost:</strong> <span className="ml-2">{item.cost}</span></p>}

            {item.date && <p className="flex items-center text-[#2D3436]"><CalendarIcon className="w-5 h-5 mr-2 text-[#4A789C]" /> <strong>Date:</strong> <span className="ml-2">{new Date(item.date).toLocaleDateString()}</span></p>}
            {item.startDate && <p className="flex items-center text-[#2D3436]"><CalendarIcon className="w-5 h-5 mr-2 text-[#4A789C]" /> <strong>Start Date:</strong> <span className="ml-2">{new Date(item.startDate).toLocaleDateString()}</span></p>}
            {item.endDate && <p className="flex items-center text-[#2D3436]"><CalendarIcon className="w-5 h-5 mr-2 text-[#4A789C]" /> <strong>End Date:</strong> <span className="ml-2">{new Date(item.endDate).toLocaleDateString()}</span></p>}
            {item.time && <p className="flex items-center text-[#2D3436]"><ClockIcon className="w-5 h-5 mr-2 text-[#4A789C]" /> <strong>Time:</strong> <span className="ml-2">{item.time}</span></p>}
            {item.deadline && <p className="flex items-center text-[#2D3436]"><CalendarIcon className="w-5 h-5 mr-2 text-[#4A789C]" /> <strong>Deadline:</strong> <span className="ml-2">{new Date(item.deadline).toLocaleDateString()}</span></p>}


            {item.requirements && item.requirements.length > 0 && (
              <p className="md:col-span-2 text-[#2D3436]"><TagIcon className="w-5 h-5 mr-2 text-[#4A789C] inline-block align-middle" /> <strong>Requirements:</strong> <span className="ml-2">{item.requirements.join(', ')}</span></p>
            )}
            {item.participatingCompanies && item.participatingCompanies.length > 0 && (
              <p className="md:col-span-2 text-[#2D3436]"><TagIcon className="w-5 h-5 mr-2 text-[#4A789C] inline-block align-middle" /> <strong>Participating Companies:</strong> <span className="ml-2">{item.participatingCompanies.join(', ')}</span></p>
            )}
          </div>
          
          {item.description && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="text-xl font-bold text-[#1E3A5F] mb-3">Description:</h3>
              <p className="text-[#2D3436] leading-relaxed whitespace-pre-line text-lg">{item.description}</p>
            </div>
          )}

          {/* Terms and Conditions Section */}
          <div className="mt-10 pt-6 border-t border-gray-100">
            <h3 className="text-2xl font-bold text-[#1E3A5F] mb-5">Terms and Conditions for Application</h3>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm max-h-96 overflow-y-auto custom-scrollbar"> {/* Added custom-scrollbar class */}
              <p className="mb-4 text-gray-700 leading-relaxed text-base">
                You are deemed to have read and agreed to the following terms, conditions and use of service. Recruitment of
                personnel will be effective through "TpoAbhishek". "TpoAbhishek", a leading recruitment agency,
                provides its clients the most effective solutions with a committed approach. Our team of consultants personally
                handles every step of each assignment following the strictest ethical standards.
              </p>

              <h4 className="text-lg font-semibold text-[#1E3A5F] mb-3">i. Your profile on TpoAbhishek.</h4>
              <ul className="list-disc pl-5 mb-4 text-gray-700 text-base space-y-2">
                <li>You are agreeing for the terms and conditions mention by TpoAbhishek services.</li>
                <li>You are agreeing to share your contact details and resume to recruiters of TpoAbhishek.</li>
                <li>You are agreeing to receive the phone calls and emails related to recruitment.</li>
                <li>Your candidate profile will not be deleted in any situation.</li>
                <li>You are responsible to maintain and update the correct information and profile on website.</li>
              </ul>

              <h4 className="text-lg font-semibold text-[#1E3A5F] mb-3">ii. Attending the Interviews.</h4>
              <ul className="list-disc pl-5 mb-4 text-gray-700 text-base space-y-2">
                <li>Interview will be conducted on given appointment time at provided address only.</li>
                <li>Interviews are to be attended at your own cost.</li>
                <li>If company provides transportation expenses, you claim such expenses to company.</li>
                <li>TpoAbhishek Services are not responsible for expenses done on attending the interview.</li>
                <li>Required documents should be available.</li>
              </ul>

              <h4 className="text-lg font-semibold text-[#1E3A5F] mb-3">iii. Required documents at the time of interview.</h4>
              <ul className="list-disc pl-5 mb-4 text-gray-700 text-base space-y-2">
                <li>Hard or Soft copy of interview appointment letter provided by TpoAbhishek Services.</li>
                <li>Recent 2 passport size photographs.</li>
                <li>Two hard copy of Curriculum Vitae/ Resume.</li>
                <li>Xerox & Original Copies of academic certificates.</li>
                <li>Xerox & Original Copies of experience certificates.</li>
                <li>For experienced: Last two months salary slips OR Offer & Joining letter of last employer.</li>
              </ul>

              <h4 className="text-lg font-semibold text-[#1E3A5F] mb-3">iv. Administration / Recruitment Charges</h4>
              <ul className="list-disc pl-5 mb-4 text-gray-700 text-base space-y-2">
                <li>First one month's 50% decided CTC (Cost To Company) salary is to be paid as recruitment charges to "TpoAbhishek" after selection & before joining.</li>
                <li>Recruitment charges are also applicable to candidate who accept the offer letter or confirm the joining date to company and can't join the company on provided joining date.</li>
                <li>Recruitment charges are acceptable in the form of cash, Personal Cheque or electronic fund transfer to "TpoAbhishek".</li>
                <li>Offer letter remains the property of "TpoAbhishek" until receiving the full payment. In such circumstances, candidate shall be liable for any and all additional administrative and/or court costs.</li>
                <li>Any excuses and/or negotiation will not be considered at the time of payment of Recruitment Charges.</li>
                <li>Recruitment Charges are non-refundable if candidate gets offered/joined in the company.</li>
                <li>Candidate should pay recruitment charges to "TpoAbhishek" if he/she leaves the organization within 6 months from the joining date.</li>
              </ul>
            </div>

            <div className="mt-6 flex items-center justify-center">
              <input
                type="checkbox"
                id="terms-checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="w-5 h-5 text-[#4A789C] border-gray-300 rounded focus:ring-[#4A789C]"
              />
              <label htmlFor="terms-checkbox" className="ml-3 text-lg font-medium text-gray-800 cursor-pointer">
                I have read and agree with all the terms and conditions.
              </label>
            </div>
          </div>
          
          {/* Apply Now Button */}
          <div className="mt-10 text-center">
            {item.link ? (
              <button
                onClick={handleApplyNow}
                className={`bg-[#FF6B35] hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg flex items-center justify-center mx-auto transform transition-all duration-300
                  ${!termsAccepted ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                disabled={!termsAccepted} // Button is disabled if terms are not accepted
              >
                <LinkIcon className="w-6 h-6 mr-3" /> Final Apply Now
              </button>
            ) : (
              <p className="text-gray-600 text-lg">Application/Information link not available for this item.</p>
            )}
          </div>
        </div>
      </div>

      {/* Add custom Tailwind CSS animations (copied from ContentListingsPage for consistency) */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }

        @keyframes fadeInTop {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInTop 0.8s ease-out forwards;
        }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-400 { animation-delay: 0.4s; }

        @keyframes pulseSlow {
          0% { transform: scale(1); opacity: 0.1; }
          50% { transform: scale(1.05); opacity: 0.15; }
          100% { transform: scale(1); opacity: 0.1; }
        }
        .animate-pulse-slow {
          animation: pulseSlow 4s infinite ease-in-out;
        }

        /* Basic pattern for hero background */
        .bg-pattern {
          background-image: radial-gradient(#4A789C 1px, transparent 1px), radial-gradient(#4A789C 1px, transparent 1px);
          background-size: 20px 20px;
          background-position: 0 0, 10px 10px;
        }

        /* Custom scrollbar for terms & conditions */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
};

export default ContentDetailPage;