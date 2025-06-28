import { LayoutDashboard, Users, FileText, TrendingUp, List, Calendar, } from "lucide-react";

export function getEmployeeNavItems(prefix: string, role: 'employee' | 'manager' = 'employee') {
    const navItems = [
        { href: `${prefix}`, label: "Overview", target: "_self", Icon: LayoutDashboard, },
        { href: "/employee/dashboard", label: "All Review Cycles", target: "_self", Icon: Calendar },
        { href: `${prefix}/peer-selection`, label: "Peer Selection", target: "_self", Icon: Users, },
        { href: `${prefix}/review-form`, label: "Review Form", target: "_self", Icon: FileText, },
        { href: `${prefix}/performance-report`, label: "Performance Report", target: "_self", Icon: TrendingUp, },
    ];

    if (role === 'manager') {
        navItems.push(
            { href: `${prefix}/team-performance-report`, label: "Team Reviews", target: "_self", Icon: List, },
        );
    }

    return navItems;
}