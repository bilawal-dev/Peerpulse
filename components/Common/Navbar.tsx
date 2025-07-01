"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import userPlaceholderImg from "@/public/assets/User.svg";
import menu from "@/public/assets/Menu.svg"


export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Pricing", href: "/pricing" },
    { name: "Contact", href: "/contact" },
  ];

  const toggleMenu = () => {
    setIsMenuOpen((open) => !open);
  };
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Determine the correct dashboard path based on user.role
  const dashboardHref = user && user.role === "employee" ? "/employee/dashboard" : "/admin/dashboard";
  const dashboardText = user && user.role === "employee" ? "Employee Dashboard" : "Admin Dashboard";

  return (
    <header className="fixed w-full bg-white z-50">
      <nav className="lg:container lg:px-[20px] lg:mx-auto flex items-center justify-between px-[10px] sm:px-[20px] py-[16px]">
        <Link href="/" className="flex items-center">
          <span className="font-pacifico text-brand text-3xl">PeerPulse</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex gap-16 pl-32 cursor-pointer">
          {navLinks.map((item, index) => (
            <Link
              href={item.href}
              className="font-medium text-[#36485C] hover:border-b border-b-blue-500"
              key={index}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Desktop Links (Account and Login OR Dashboard) */}
        <div className="flex items-center gap-5 sm:gap-10">
          {user ? (
            // If user is logged in, show "Dashboard" link
            <Link href={dashboardHref} className="items-center gap-x-3 text-[#36485C] font-medium hidden lg:flex">
              <Image alt="user" src={userPlaceholderImg} width={20} height={20} />
              <span>
                {dashboardText}
              </span>
            </Link>
          ) : (
            // Otherwise, show "Open an Account" and "Log In"
            <>
              <Link
                href="/register"
                className="text-[#36485C] font-medium hidden lg:block cursor-pointer"
              >
                Open an Account
              </Link>
              <Link href="/login" className="flex items-center gap-x-3">
                <Image alt="user" src={userPlaceholderImg} width={20} height={20} />
                <span className="text-[#36485C] font-medium hidden lg:block">
                  Log In
                </span>
              </Link>
            </>
          )}

          {/* Mobile Hamburger Menu */}
          <Image alt="menu" src={menu} className="lg:hidden cursor-pointer" onClick={toggleMenu} />
        </div>

        {/* Mobile Menu (slides in/out) */}
        <div className={`lg:hidden fixed top-0 left-0 w-full h-full bg-white z-40 transition-transform duration-300 ease-in-out transform ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="flex flex-col items-center py-16 relative">
            <span className="absolute top-10 right-5 cursor-pointer text-xl" onClick={closeMenu}            >
              ✖
            </span>

            {navLinks.map((item, idx) => (
              <Link key={idx} href={item.href} className="font-medium text-[#36485C] hover:border-b border-b-blue-500 py-4" onClick={closeMenu}>
                {item.name}
              </Link>
            ))}

            {user ? (
              // If logged in: show Dashboard link
              <Link href={dashboardHref} className="flex items-center gap-x-3 py-4 text-[#36485C] font-medium" onClick={closeMenu}>
                <Image alt="user" src={userPlaceholderImg} width={20} height={20} />
                <span>
                  {user.role === "employee" ? "Employee Dashboard" : "Admin Dashboard"}
                </span>
              </Link>
            ) : (
              // If not logged in: show "Open an Account" and "Log In"
              <>
                <Link href="/register" className="text-[#36485C] font-medium py-4" onClick={closeMenu}>
                  Open an Account
                </Link>
                <Link href="/login" className="flex items-center gap-x-3 py-4" onClick={closeMenu}>
                  <Image alt="user" src={userPlaceholderImg} width={20} height={20} />
                  <span className="text-[#36485C] font-medium">Log In</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
