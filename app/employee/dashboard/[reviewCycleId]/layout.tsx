"use client";

import Sidebar from "@/components/Dashboard/Sidebar";
import { useParams, usePathname } from "next/navigation";
import { useState } from "react";
import { getEmployeeNavItems } from "./navItems";
import { EmployeeCycleProvider, useReviewCycleEmp } from "@/context/EmployeeCycleContext";
import ReviewCycleEmpLoader from "./ReviewCycleEmpLoader";

export default function EmployeeDashboardCycleLayout({ children }: { children: React.ReactNode }) {

    // Wrapping the layout with EmployeeCycleProvider to provide context of Employee (name, role) in particular reviewCycle to child components 
    return (
        <EmployeeCycleProvider>
            <ReviewCycleEmpLoader>
                <InnerLayout>
                    {children}
                </InnerLayout>
            </ReviewCycleEmpLoader>
        </EmployeeCycleProvider>
    );
}

function InnerLayout({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);

    const { reviewCycleId } = useParams();

    const pathName = usePathname();

    const { reviewCycleEmp } = useReviewCycleEmp();

    const reviewPath = pathName.startsWith(`/employee/dashboard/${reviewCycleId}/review-form`) || 
                       pathName.startsWith(`/employee/dashboard/${reviewCycleId}/performance-report`) ||
                       pathName.startsWith(`/employee/dashboard/${reviewCycleId}/team-performance-report`);

    if (reviewPath) {
        return (
            <main className="p-8 max-sm:px-4 space-y-8 bg-gray-50 min-h-screen">
                {children}
            </main>
        )
    }

    const prefix = `/employee/dashboard/${reviewCycleId}`;
    const employeeNavItems = getEmployeeNavItems(prefix, reviewCycleEmp?.role, reviewCycleEmp?.is_compiled_review_access, reviewCycleEmp?.is_manager_team_view_access);

    return (
        <div className="min-h-screen flex bg-gray-50">
            <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} navItems={employeeNavItems} />

            <main className={`flex-1 p-6 px-[20px] transition-[margin] duration-200 ${collapsed ? "ml-20" : "ml-72"}`}>
                {children}
            </main>
        </div>
    );
}