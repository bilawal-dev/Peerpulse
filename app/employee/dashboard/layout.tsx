"use client";

import Sidebar from "@/components/Dashboard/Sidebar";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { employeeNavItems } from "./navItems";

export default function EmployeeDashboardLayout({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);

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
