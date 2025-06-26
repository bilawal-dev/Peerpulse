// /admin/dashboard/layout.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";


export default function AdminDashboardRootLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();

    const router = useRouter();

    // * REDIRECT TO LOGIN IF USER IS NOT AUTHENTICATED OR TO EMPLOYEE DASHBOARD IF NOT AN ADMIN
    useEffect(() => {
        if (!loading) {
            if (!user) {
                // Not logged in → send to /login
                router.push("/login");
            } else if (user.role !== "company") {
                // Logged in but not a company admin → send them to employee dashboard
                router.push("/employee/dashboard");
            }
        }
    }, [user, loading, router]);


    // Prevent rendering layout if user is not authenticated (Avoids flickering)
    if (!user || user.role !== "company") return null;


    return (
        <>
            {children}
        </>
    );
}
