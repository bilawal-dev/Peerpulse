"use client";

import Sidebar from "@/components/Dashboard/Sidebar";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, Users, Mail, Settings, FileText } from "lucide-react";

export const adminNavItems = [
    { href: "/admin/dashboard", label: "Dashboard", target: '_self', Icon: LayoutDashboard },
    { href: "/admin/dashboard/reviews", label: "Compiled Reviews", target: '_blank', Icon: FileText },
    { href: "/admin/dashboard/employees", label: "Employee Management", target: '_self', Icon: Users },
    { href: "/admin/dashboard/notifications", label: "Email Notifications", target: '_self', Icon: Mail },
    { href: "/admin/dashboard/settings", label: "Settings", target: '_self', Icon: Settings },
];

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);

    const pathName = usePathname();

    const reviewsPath = pathName.startsWith('/admin/dashboard/reviews');

    if (reviewsPath) {
        return (
            <main className="p-8 max-sm:px-4 space-y-8 bg-gray-50">
                {children}
            </main>
        )
    }

    return (
        <div className="min-h-screen flex bg-gray-50">
            <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} navItems={adminNavItems} />

            <main className={`flex-1 p-6 px-[20px] transition-[margin] duration-200 ${collapsed ? "ml-20" : "ml-72"}`}>
                {children}
            </main>
        </div>
    );
}
