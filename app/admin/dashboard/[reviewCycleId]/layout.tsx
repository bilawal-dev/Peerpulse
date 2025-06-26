// /admin/dashboard/[reviewCycleId]/layout.tsx
"use client";

import Sidebar from "@/components/Dashboard/Sidebar";
import { useParams, usePathname } from "next/navigation";
import { useState } from "react";
import { getAdminNavItems } from "./navItems";


export default function AdminDashboardCycleLayout({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);

    const { reviewCycleId } = useParams();

    const pathName = usePathname();

    const reviewsPath = pathName.startsWith(`/admin/dashboard/${reviewCycleId}/compiled-reviews`);

    if (reviewsPath) {
        return (
            <main className="p-8 max-sm:px-4 space-y-8 bg-gray-50">
                {children}
            </main>
        )
    }

    const prefix = `/admin/dashboard/${reviewCycleId}`;
    const adminNavItems = getAdminNavItems(prefix);

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} navItems={adminNavItems} />

            <main className={`flex-1 p-6 px-[20px] transition-[margin] duration-200 ${collapsed ? "ml-20" : "ml-72"}`}>
                {children}
            </main>
        </div>
    );
}
