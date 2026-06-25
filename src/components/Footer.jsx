import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white w-full flex-shrink-0">
      {/* Copyright Bar — slim compact version */}
      <div className="bg-theme-light py-2 border-t border-theme-border">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 flex flex-col md:flex-row items-center justify-between gap-1">
          <p className="text-xs text-theme-body">
            © 2026. All Rights Reserved by UNIMAS Mental Health & Well-being.
          </p>
          <div className="flex gap-4">
            <a
              href="#"
              className="text-xs text-theme-body hover:text-theme-blue transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-xs text-theme-body hover:text-theme-blue transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
