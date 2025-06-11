import { FaFacebookF, FaInstagram, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import logo from "../assets/logo.png"; // Make sure this path is correct

export default function Footer() {
  return (
    <footer className="bg-[#1E3A5F] text-gray-200 pt-10 pb-6 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10">

        {/* Logo & Brand Message */}
        <div className="md:col-span-2">
          <img src={logo} alt="Logo" className="w-36 mb-4" />
          <p className="text-sm text-gray-300">
            Empowering Careers, Guiding Futures. We provide the tools you need to succeed.
          </p>
        </div>

        {/* Services */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-3">Our Services</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            {["Jobs", "Internships", "Career Guidance", "Resume Builder", "Interview Prep"].map((service, i) => (
              <li key={i} className="hover:text-[#FF6B35] cursor-pointer transition duration-200">{service}</li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-3">Contact</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>Email: <a href="mailto:support@company.com" className="hover:text-[#FF6B35]">support@company.com</a></li>
            <li>Phone: +91 98765 43210</li>
            <li>Location: Mumbai, India</li>
          </ul>
        </div>

        {/* Follow Us */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-3">Follow Us</h4>
          <div className="flex items-center space-x-4 text-2xl mt-2">
            <a href="#" className="hover:text-blue-500 hover:scale-110 transform transition duration-200">
              <FaFacebookF />
            </a>
            <a href="#" className="hover:text-pink-500 hover:scale-110 transform transition duration-200">
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-blue-300 hover:scale-110 transform transition duration-200">
              <FaLinkedinIn />
            </a>
            <a href="#" className="hover:text-green-400 hover:scale-110 transform transition duration-200">
              <FaWhatsapp />
            </a>
          </div>
        </div>
      </div>

      {/* Divider and Copyright */}
      <div className="mt-10 border-t border-gray-700 pt-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} TpoAbhishek. All rights reserved.
      </div>
    </footer>
  );
}
