import { LayoutDashboard, Users, Mail, Settings, FileText, RefreshCcw, Link2 } from "lucide-react";

export const adminNavItems = [
    { href: "/admin/dashboard", label: "Dashboard", target: '_self', Icon: LayoutDashboard },
    { href: "/admin/dashboard/reviews", label: "Compiled Reviews", target: '_blank', Icon: FileText },
    { href: "/admin/dashboard/employees", label: "Employee Management", target: '_self', Icon: Users },    
    { href: "/admin/dashboard/pairing", label: "Manual Pairing", target: '_self', Icon: Link2 },
    { href: "/admin/dashboard/notifications", label: "Email Notifications", target: '_self', Icon: Mail },
    { href: "/admin/dashboard/review-cycle", label: "Review Cycle Settings", target: '_self', Icon: RefreshCcw },
    { href: "/admin/dashboard/settings", label: "Settings", target: '_self', Icon: Settings },
];