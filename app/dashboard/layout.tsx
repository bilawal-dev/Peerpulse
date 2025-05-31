"use client";

import Sidebar from "@/components/Dashboard/Sidebar";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);

    const pathName = usePathname();

    return (
        <div className="min-h-screen flex bg-gray-50">
            {!pathName.startsWith('/dashboard/reviews') && (
                <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
            )}

            <main className={`flex-1 p-6 px-[20px] transition-[margin] duration-200 ${collapsed ? "ml-20" : "ml-72"}`}>
                {children}
            </main>
        </div>
    );
}
