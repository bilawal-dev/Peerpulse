"use client";

import Navbar from "@/components/Common/Navbar";
import Footer from "@/components/Common/Footer";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [showLayout, setShowLayout] = useState(false);

    useEffect(() => {
        if (!loading) {
            if (user) {
                // * REDIRECT BASED ON USER ROLE
                if (user.role === "company") {
                    router.push("/admin/dashboard");
                } else if (user.role === "employee") {
                    router.push("/employee/dashboard");
                }
            } else {
                setShowLayout(true);
            }
        }
    }, [loading, user, router]);

    if (!showLayout) {
        return null;
    }

    return (
        <>
            <Navbar />
            <main className="px-[20px] lg:container lg:px-[20px] lg:mx-auto">
                {children}
            </main>
            <Footer />
        </>
    );
}