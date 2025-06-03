"use client";

import Sidebar from "@/components/Dashboard/Sidebar";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { employeeNavItems } from "./navItems";
import { useAuth } from "@/context/AuthContext";

export default function EmployeeDashboardLayout({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);

    const { user, loading } = useAuth();

    const router = useRouter();

    // * REDIRECT TO LOGIN IF USER IS NOT AUTHENTICATED OR NOT AN EMPLOYEE
    useEffect(() => {
        if (!loading) {
            if (!user) {
                // Not logged in → send to /login
                router.push("/login");
            } else if (user.role !== "employee") {
                // Logged in but not an employee → send them to admin dashboard
                router.push("/admin/dashboard");
            }
        }
    }, [user, loading, router]);


    // Prevent rendering layout if user is not authenticated (Avoids flickering)
    if (!user || user.role !== "employee") return null;

    const pathName = usePathname();

    const reviewPath = pathName.startsWith('/employee/dashboard/review-form');

    if (reviewPath) {
        return (
            <main className="p-8 max-sm:px-4 space-y-8 bg-gray-50">
                {children}
            </main>
        )
    }

    return (
        <div className="min-h-screen flex bg-gray-50">
            <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} navItems={employeeNavItems} />

            <main className={`flex-1 p-6 px-[20px] transition-[margin] duration-200 ${collapsed ? "ml-20" : "ml-72"}`}>
                {children}
            </main>
        </div>
    );
}
