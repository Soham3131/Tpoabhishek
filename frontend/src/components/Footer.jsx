

import { FaFacebookF, FaInstagram, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";
// import logo from "../assets/logo.png";
import logo from "../assets/logo1.png";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
      className="bg-gradient-to-r from-[#1E3A5F] via-[#4A789C] to-[#1E3A5F] text-gray-200 pt-10 pb-6 px-6"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10">

        {/* Logo & Brand Message */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="md:col-span-2"
        >
          <img src={logo} alt="Logo" className="w-auto h-[12rem] drop-shadow-lg" />
          <p className="text-sm text-gray-300 leading-relaxed">
            Empowering Careers, Guiding Futures. We provide the tools you need to succeed.
          </p>
        </motion.div>

        {/* Services */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-3 underline decoration-[#FF6B35] decoration-2 underline-offset-4">Our Services</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            {["Jobs", "Internships", "Career Guidance", "Resume Builder", "Interview Prep"].map((service, i) => (
              <motion.li
                whileHover={{ scale: 1.05, color: "#FF6B35" }}
                key={i}
                className="cursor-pointer transition duration-200"
              >
                {service}
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-3 underline decoration-[#FF6B35] decoration-2 underline-offset-4">Contact</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>Email: <a href="mailto:trainingandplacementcelll@gmail.com" className="hover:text-[#FF6B35] transition">trainingandplacementcelll@gmail.com</a></li>
            <li>Phone: <a href="tel:+918816026108" className="hover:text-[#FF6B35] transition">+91 88160 26108</a></li>
            <li>WhatsApp: <a href="https://wa.me/918816026108" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF6B35] transition">+91 88160 26108</a></li>
            <li>Location: Rohtak, Haryana, India – 124001</li>
          </ul>
        </div>

        {/* Follow Us */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-3 underline decoration-[#FF6B35] decoration-2 underline-offset-4">Follow Us</h4>
          <div className="flex items-center space-x-4 text-2xl mt-2">
            <motion.a whileHover={{ scale: 1.3, color: "#1877F2" }} href="https://www.facebook.com/profile.php?id=61579307909311&mibextid=ZbWKwL" target="_blank" rel="noopener noreferrer" className="transition"><FaFacebookF /></motion.a>
            <motion.a whileHover={{ scale: 1.3, color: "#E1306C" }} href="https://www.instagram.com/tpo_abhishek/profilecard/?igsh=MWRmcTM0Z2R0OWJhNw==" target="_blank" rel="noopener noreferrer" className="transition"><FaInstagram /></motion.a>
            <motion.a whileHover={{ scale: 1.3, color: "#0077B5" }} href="https://www.linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer" className="transition"><FaLinkedinIn /></motion.a>
            <motion.a whileHover={{ scale: 1.3, color: "#25D366" }} href="https://www.whatsapp.com/channel/0029VbAnx634tRrrGdYf822d" target="_blank" rel="noopener noreferrer" className="transition"><FaWhatsapp /></motion.a>
          </div>
        </div>
      </div>

      {/* Divider and Copyright */}
      <div className="mt-10 border-t border-gray-600 pt-4 text-center text-sm text-gray-400">
        Made with <motion.span whileHover={{ scale: 2 }} className="text-red-500 mx-1">♥</motion.span> by Soham • © {new Date().getFullYear()} All Rights Reserved
      </div>
    </motion.footer>
  );
}
