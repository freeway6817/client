import { MapPin, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer({ compact = false }) {
  return (
    <footer className="bg-white mt-auto w-full">
      {/* Only show the large footer content if compact is FALSE */}
      {!compact && (
        <div className="border-t border-theme-border pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 pb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Column 1: About */}
              <div>
                <div className="mb-6">
                  <span className="font-heading text-2xl font-bold text-theme-dark tracking-wide">
                    UNIMAS <span className="text-theme-blue">MHW</span>
                  </span>
                </div>
                <p className="text-[15px] text-theme-body mb-6 leading-relaxed">
                  Empowering students through accessible mental health
                  resources, goal tracking, and daily journaling to ensure a
                  balanced university life.
                </p>
                <div className="flex gap-3">
                  <a
                    href="#"
                    className="w-9 h-9 rounded-full bg-theme-light flex items-center justify-center text-theme-dark hover:bg-theme-blue hover:text-white transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="w-9 h-9 rounded-full bg-theme-light flex items-center justify-center text-theme-dark hover:bg-theme-blue hover:text-white transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="w-9 h-9 rounded-full bg-theme-light flex items-center justify-center text-theme-dark hover:bg-theme-blue hover:text-white transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect
                        x="2"
                        y="2"
                        width="20"
                        height="20"
                        rx="5"
                        ry="5"
                      ></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="w-9 h-9 rounded-full bg-theme-light flex items-center justify-center text-theme-dark hover:bg-theme-blue hover:text-white transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Column 2: Quick Links */}
              <div>
                <h4 className="font-heading text-[20px] font-semibold text-theme-dark mb-6">
                  Quick Links
                </h4>
                <ul className="flex flex-col gap-3 list-none p-0">
                  <li>
                    <Link
                      to="/about"
                      className="text-[15px] text-theme-body hover:text-theme-blue transition-colors no-underline"
                    >
                      About Platform
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/login"
                      className="text-[15px] text-theme-body hover:text-theme-blue transition-colors no-underline"
                    >
                      Student Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/resources"
                      className="text-[15px] text-theme-body hover:text-theme-blue transition-colors no-underline"
                    >
                      Mental Health Resources
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/faq"
                      className="text-[15px] text-theme-body hover:text-theme-blue transition-colors no-underline"
                    >
                      FAQ & Support
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 3: Contact Info */}
              <div>
                <h4 className="font-heading text-[20px] font-semibold text-theme-dark mb-6">
                  Contact Info
                </h4>
                <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-3">
                    <MapPin
                      size={20}
                      className="text-theme-blue flex-shrink-0 mt-1"
                    />
                    <p className="text-[15px] text-theme-body">
                      Universiti Malaysia Sarawak, <br /> 94300 Kota Samarahan,
                      Sarawak
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone
                      size={20}
                      className="text-theme-blue flex-shrink-0"
                    />
                    <p className="text-[15px] text-theme-body">+60 82-581000</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail size={20} className="text-theme-blue flex-shrink-0" />
                    <p className="text-[15px] text-theme-body">
                      support@siswa.unimas.my
                    </p>
                  </div>
                </div>
              </div>

              {/* Column 4: Emergency Contacts */}
              <div>
                <h4 className="font-heading text-[20px] font-semibold text-theme-dark mb-6">
                  Emergency Help
                </h4>
                <p className="text-[15px] text-theme-body mb-4">
                  If you are in immediate distress, please reach out to our 24/7
                  partners.
                </p>
                <div className="bg-[#FFEFEE] border border-theme-red rounded-lg p-4">
                  <h5 className="text-[14px] font-bold text-theme-red mb-1">
                    Befrienders Kuching
                  </h5>
                  <p className="text-[14px] font-semibold text-theme-dark">
                    082-242800
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Copyright Bar (ALWAYS VISIBLE) */}
      <div className="bg-theme-light py-6 border-t border-theme-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-[14px] text-theme-body">
            © 2026. All Rights Reserved by UNIMAS Mental Health & Well-being.
          </p>
          <div className="flex gap-4 mt-2 md:mt-0">
            <a
              href="#"
              className="text-[14px] text-theme-body hover:text-theme-blue transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-[14px] text-theme-body hover:text-theme-blue transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
