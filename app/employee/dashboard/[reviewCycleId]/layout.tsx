"use client";

import Sidebar from "@/components/Dashboard/Sidebar";
import { useParams, usePathname } from "next/navigation";
import { useState } from "react";
import { getEmployeeNavItems } from "./navItems";

export default function EmployeeDashboardCycleLayout({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);

    const { reviewCycleId } = useParams();

    const pathName = usePathname();

    const reviewPath = pathName.startsWith(`/employee/dashboard/${reviewCycleId}/review-form`) || pathName.startsWith(`/employee/dashboard/${reviewCycleId}/performance-report`);

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
