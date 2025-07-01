import Link from "next/link";

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
        <p className="font-brand text-brand text-2xl">PeerPulse</p>
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
        © Copyright 2025 - PeerPulse | All rights reserved by - PeerPulse Inc.
      </p>
    </footer>
  );
};

export default Footer;
