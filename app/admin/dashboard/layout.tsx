"use client";

import Sidebar from "@/components/Dashboard/Sidebar";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { adminNavItems } from "./navItems";
import { useAuth } from "@/context/AuthContext";


export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);

    const { user, loading } = useAuth();

    const router = useRouter();

    const pathName = usePathname();

    const reviewsPath = pathName.startsWith('/admin/dashboard/reviews');
    
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
