import "./globals.css";
import type { Metadata } from "next";
import { Poppins } from 'next/font/google'
import { Toaster } from "react-hot-toast";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: "Elevu - Peer-Powered Performance Reviews",
  description: "Elevu helps teams streamline 360° peer reviews, employee feedback, and performance reporting—all in one smart, automated platform.",
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body className={`antialiased ${poppins.className}`} >
        <Toaster />
        {children}
      </body>
    </html>
  );
}