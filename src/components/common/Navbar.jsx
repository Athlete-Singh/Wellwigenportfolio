// Navbar.jsx
import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  CreditCard,
  Sparkles,
  Calendar,
  Info,
  MessageCircle,
  Menu,
  X,
} from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import NotificationBell from "./NotificationBell";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e, path) => {
    if (path.startsWith("/#")) {
      const targetId = path.substring(2);
      if (location.pathname === "/") {
        e.preventDefault();
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
    setIsOpen(false);
  };

  const providerToken = localStorage.getItem("providerToken") || localStorage.getItem("vendorToken");
  const providerInfoRaw = localStorage.getItem("providerInfo") || localStorage.getItem("vendorInfo");
  const userToken = localStorage.getItem("user") || localStorage.getItem("userInfo");
  const adminToken = localStorage.getItem("adminToken");

  const getCtaButton = () => {
    if (adminToken) {
      return {
        label: "Admin Panel",
        onClick: () => navigate("/admin/dashboard")
      };
    }
    if (providerToken && providerInfoRaw) {
      try {
        const info = JSON.parse(providerInfoRaw);
        const type = (info.type || info.role || info.category || "").toLowerCase();
        return {
          label: "Dashboard",
          onClick: () => navigate(type ? `/${type}/dashboard` : "/provider/dashboard")
        };
      } catch (e) {
        console.error(e);
      }
    }
    if (userToken) {
      return {
        label: "Dashboard",
        onClick: () => navigate("/dashboard")
      };
    }
    return {
      label: "Login",
      onClick: () => navigate("/login")
    };
  };

  const cta = getCtaButton();

  const navLinks = [
    { name: "How it Works", path: "/#howitworks", icon: <Calendar size={18} strokeWidth={1.25} /> },
    { name: "Pricing", path: "/#pricing", icon: <CreditCard size={18} strokeWidth={1.25} /> },
    { name: "Services", path: "/#services", icon: <Sparkles size={18} strokeWidth={1.25} /> },
    { name: "About Us", path: "/#about", icon: <Info size={18} strokeWidth={1.25} /> },
    { name: "Contact Us", path: "/contactus", icon: <MessageCircle size={18} strokeWidth={1.25} /> },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200"
          : "bg-white"
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-3">
        <div className="flex justify-between items-center">

          {/* LOGO */}
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center cursor-pointer py-1"
          >
            <img
              src="/images/wellwigen-logo.webp"
              alt="Wellwigen"
              className="h-11 sm:h-12 md:h-14 w-auto object-contain select-none"
            />
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path || (link.path.startsWith("/#") && location.pathname === "/" && window.location.hash === link.path.substring(1));
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={(e) => handleNavClick(e, link.path)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-light tracking-wide rounded-lg transition ${
                    isActive
                      ? "bg-teal-500 text-white shadow"
                      : "text-gray-700 hover:text-teal-500 hover:bg-gray-100"
                  }`}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* DESKTOP BUTTON */}
          <div className="hidden md:flex items-center gap-4">
            <NotificationBell />
            <button
              onClick={cta.onClick}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-teal-500 text-white hover:bg-teal-600 transition"
            >
              {cta.label}
            </button>
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="md:hidden flex items-center gap-4">
            <NotificationBell />
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-800">
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            isOpen ? "max-h-[500px] mt-4" : "max-h-0"
          }`}
        >
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-md space-y-3">

            {navLinks.map((link) => {
              const isActive = location.pathname === link.path || (link.path.startsWith("/#") && location.pathname === "/" && window.location.hash === link.path.substring(1));
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={(e) => handleNavClick(e, link.path)}
                  className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg text-sm font-light tracking-wide ${
                    isActive
                      ? "bg-teal-100 text-teal-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              );
            })}

            {/* MOBILE LOGIN */}
            <button
              onClick={() => {
                cta.onClick();
                setIsOpen(false);
              }}
              className="w-full py-2 rounded-lg text-sm bg-teal-500 text-white hover:bg-teal-600 transition"
            >
              {cta.label}
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Navbar;