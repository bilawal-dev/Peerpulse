import { LayoutDashboard, Users, FileText, TrendingUp } from "lucide-react";

export const employeeNavItems = [
    { href: "/employee/dashboard", label: "Dashboard", target: '_self', Icon: LayoutDashboard },
    { href: "/employee/dashboard/peer-selection", label: "Peer Selection", target: '_self', Icon: Users },
    { href: "/employee/dashboard/review-form", label: "Review Form", target: '_self', Icon: FileText },
    { href: "/employee/dashboard/performance-report", label: "Performance Report", target: '_self', Icon: TrendingUp },
];
