import { LayoutDashboard, Users, FileText } from "lucide-react";

export const employeeNavItems = [
    { href: "/employee/dashboard", label: "Dashboard", target: '_self', Icon: LayoutDashboard },
    { href: "/employee/dashboard/peer-selection", label: "Peer Selection", target: '_self', Icon: Users },
    { href: "/employee/dashboard/review-form", label: "Review Form", target: '_self', Icon: FileText },
];
