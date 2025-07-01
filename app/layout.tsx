import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";
import type { Metadata } from "next";
import { Poppins } from 'next/font/google'
import localFont from 'next/font/local'
import { Toaster } from "react-hot-toast";
import ClientLoader from "./ClientLoader";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
})

const mooxy = localFont({
  src: '../public/fonts/mooxy.ttf',
  variable: '--font-mooxy',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "PeerPulse - Peer-Powered Performance Reviews",
  description: "PeerPulse helps teams streamline 360° peer reviews, employee feedback, and performance reporting—all in one smart, automated platform.",
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body className={`antialiased ${poppins.className} ${mooxy.variable}`} >
        <Toaster />
        <AuthProvider>
          <ClientLoader>
            {children}
          </ClientLoader>
        </AuthProvider>
      </body>
    </html>
  );
}