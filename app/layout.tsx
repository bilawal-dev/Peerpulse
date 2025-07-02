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
  icons: {
    icon: "/favicon.ico",                                // default
    shortcut: "/favicon-16x16.png",                      // IE11 + modern
    apple: "/apple-touch-icon.png",                      // iOS home-screen
    other: [
      {
        url: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
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