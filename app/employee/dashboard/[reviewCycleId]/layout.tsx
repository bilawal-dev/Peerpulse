"use client";

import Sidebar from "@/components/Dashboard/Sidebar";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getEmployeeNavItems } from "./navItems";
import { useAuth } from "@/context/AuthContext";

export default function EmployeeDashboardLayout({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);

    const { user, loading } = useAuth();

    const { reviewCycleId } = useParams();

    const router = useRouter();

    const pathName = usePathname();

    const reviewPath = pathName.startsWith(`/employee/dashboard/${reviewCycleId}/review-form`) || pathName.startsWith(`/employee/dashboard/${reviewCycleId}/performance-report`);

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


    if (reviewPath) {
        return (
            <main className="p-8 max-sm:px-4 space-y-8 bg-gray-50 min-h-screen">
                {children}
            </main>
        )
    }

    const prefix = `/employee/dashboard/${reviewCycleId}`;
    const employeeNavItems = getEmployeeNavItems(prefix);

    return (
        <div className="min-h-screen flex bg-gray-50">
            <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} navItems={employeeNavItems} />

            <main className={`flex-1 p-6 px-[20px] transition-[margin] duration-200 ${collapsed ? "ml-20" : "ml-72"}`}>
                {children}
            </main>
        </div>
    );
}
