"use client";

import { useState } from "react";
import Image from "next/image";
import logo from "@/public/assets/Logo.png";
import user from "@/public/assets/User.svg";
import menu from "@/public/assets/Menu.svg";
import Link from "next/link";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for managing menu open/close

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Pricing", href: "/pricing" },
    { name: "Contact", href: "/contact" },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle the menu visibility
  };

  const closeMenu = () => {
    setIsMenuOpen(false); // Close the menu when the close button is clicked
  };

  return (
    <header className="fixed w-full bg-white z-50">
      <nav className="mx-auto max-w-8xl flex items-center justify-between px-[10px] sm:px-[20px] py-[16px]">
        <Link href={"/"} className="flex items-center gap-2">
          <Image src={logo} alt="Logo" />
          <span className="font-medium text-[#36485C] text-lg">Elevu</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex gap-16 pl-32 cursor-pointer">
          {navLinks.map((item, index) => (
            <Link href={item.href} className="font-medium text-[#36485C] hover:border-b border-b-blue-500" key={index}>
              {item.name}
            </Link>
          ))}
        </div>

        {/* Desktop Links (Account and Login) */}
        <div className="flex items-center gap-5 sm:gap-10">
          <Link href={'/register'} className="text-[#36485C] font-medium hidden lg:block cursor-pointer">Open an Account</Link>
          <Link href={'/login'} className="flex items-center gap-x-3">
            <Image alt="user" src={user} />
            <span className="text-[#36485C] font-medium hidden lg:block">Log In</span>
          </Link>

          {/* Mobile Hamburger Menu */}
          <Image
            alt="menu"
            src={menu}
            className="lg:hidden cursor-pointer"
            onClick={toggleMenu} // Add onClick to toggle the menu
          />
        </div>

        {/* Mobile Menu (conditionally rendered based on isMenuOpen state) */}
        <div className={`lg:hidden fixed top-0 left-0 w-full h-full bg-white z-40 transition-all duration-300 ease-in-out transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col items-center py-16 relative">
            {/* Close Button (X) */}
            <span
              className="absolute top-10 right-5 cursor-pointer"
              onClick={closeMenu} // Close the menu when clicked
            >✖</span>

            {navLinks.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="font-medium text-[#36485C] hover:border-b border-b-blue-500 py-4"
                onClick={closeMenu} // Close menu when a link is clicked
              >
                {item.name}
              </Link>
            ))}
            <Link
              href={'/register'}
              className="text-[#36485C] font-medium py-4"
              onClick={closeMenu}
            >
              Open an Account
            </Link>
            <Link
              href={'/login'}
              className="flex items-center gap-x-3 py-4"
              onClick={closeMenu}
            >
              <Image alt="user" src={user} />
              <span className="text-[#36485C] font-medium">Log In</span>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;