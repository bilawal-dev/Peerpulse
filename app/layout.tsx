import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";
import type { Metadata } from "next";
import { Pacifico, Poppins } from 'next/font/google'
import { Toaster } from "react-hot-toast";
import ClientLoader from "./ClientLoader";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
})

const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  variable: '--font-pacifico',
});

export const metadata: Metadata = {
  title: "PeerPulse - Peer-Powered Performance Reviews",
  description: "PeerPulse helps teams streamline 360° peer reviews, employee feedback, and performance reporting—all in one smart, automated platform.",
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body className={`antialiased ${poppins.className} ${pacifico.variable}`} >
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