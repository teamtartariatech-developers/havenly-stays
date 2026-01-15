import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-hero-gradient text-white pt-16 md:pt-24 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                <span className="text-forest-700 font-display text-lg font-bold">H</span>
              </div>
              <span className="font-display text-xl font-semibold">Havenly Stays</span>
            </div>
            <p className="text-white/70 leading-relaxed mb-6">
              Experience the perfect lakeside getaway with our premium cottages, luxury villas and exciting activities at Pawna Lake.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/plumeriaretreatpawnalake?utm_source=qr&igsh=OGgzYWY0b3FzbWUw" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.facebook.com/share/19pYGAqJzH/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="font-display text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-4">
              {["Home", "About Us", "Properties", "Gallery", "Events"].map((link) => (
                <li key={link}>
                  <Link to="/" className="text-white/70 hover:text-white transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Property Types */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-display text-lg font-semibold mb-6">Property Types</h4>
            <ul className="space-y-4">
              {["Villas", "Cottages", "Bungalows", "Camps", "Treehouses"].map((type) => (
                <li key={type}>
                  <Link to="/" className="text-white/70 hover:text-white transition-colors">
                    {type}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="font-display text-lg font-semibold mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li>
                <a href="https://maps.google.com/?q=At-Bramhanoli,+Fangne,+Post-+Pawna+nagar,+Tel-+Maval,+Dist-+Pune,+Maharashtra+410406" target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 text-white/70 hover:text-white transition-colors">
                  <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>At-Bramhanoli, Fangne, Post- Pawna nagar, Tel- Maval, Dist- Pune, Pawna Lake, Maharashtra 410406</span>
                </a>
              </li>
              <li>
                <a href="tel:+919226869678" className="flex items-center gap-3 text-white/70 hover:text-white transition-colors">
                  <Phone className="w-5 h-5" />
                  <span>+91 9226869678</span>
                </a>
              </li>
              <li>
                <a href="mailto:campatpawna@gmail.com" className="flex items-center gap-3 text-white/70 hover:text-white transition-colors">
                  <Mail className="w-5 h-5" />
                  <span>campatpawna@gmail.com</span>
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/50 text-sm text-center md:text-left">
              © {new Date().getFullYear()} Gecestays. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-white/50">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
