import { LayoutDashboard, Users, Mail, Settings, FileText } from "lucide-react";

export const adminNavItems = [
    { href: "/admin/dashboard", label: "Dashboard", target: '_self', Icon: LayoutDashboard },
    { href: "/admin/dashboard/reviews", label: "Compiled Reviews", target: '_blank', Icon: FileText },
    { href: "/admin/dashboard/employees", label: "Employee Management", target: '_self', Icon: Users },
    { href: "/admin/dashboard/notifications", label: "Email Notifications", target: '_self', Icon: Mail },
    { href: "/admin/dashboard/settings", label: "Settings", target: '_self', Icon: Settings },
];