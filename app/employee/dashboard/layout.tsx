"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function EmployeeDashboardRootLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();

    const router = useRouter();

    // * REDIRECT TO LOGIN IF USER IS NOT AUTHENTICATED OR TO ADMIN DASHBOARD IF NOT AN EMPLOYEE
    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push("/login");
            } else if (user.role !== "employee") {
                router.push("/admin/dashboard");
            }
        }
    }, [user, loading, router]);


    // Prevent rendering layout if user is not authenticated (Avoids flickering)
    if (!user || user.role !== "employee") return null;


    return (
        <>
            {children}
        </>
    );
}
