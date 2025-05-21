import Image from "next/image";
import Link from "next/link";
import logo from "@/public/assets/Logo.png";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

const Footer = () => {
  return (
    <footer className="pt-[30px] pb-[40px]">
      <div className="flex items-center justify-center gap-x-[12px]">
        <Image src={logo} alt="Logo" />
        <p className="font-bold text-[#36485C] text-[17px]">Elevu</p>
      </div>

      <ul className="flex flex-row justify-center gap-x-5 pt-5 gap-y-[32px] text-[#36485C]  ">
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="hover:border-b-2 border-slate-300"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      <p className="pt-5 text-center text-[14px] font-medium text-[#5F7896] ">
        © Copyright 2025 - Elevu | All rights reserved by - Elevu Inc.
      </p>
    </footer>
  );
};

export default Footer;
