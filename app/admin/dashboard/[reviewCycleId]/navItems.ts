import { LayoutDashboard, Users, Mail, Settings, FileText, RefreshCcw, Link2, Calendar, FileEdit } from "lucide-react";


export function getAdminNavItems(prefix: string) {
    return [
        { href: `${prefix}`, label: "Overview", target: "_self", Icon: LayoutDashboard },
        { href: "/admin/dashboard", label: "All Review Cycles", target: "_self", Icon: Calendar },
        { href: `${prefix}/compiled-reviews`, label: "Compiled Reviews", target: "_blank", Icon: FileText },
        { href: `${prefix}/employees`, label: "Employee Management", target: "_self", Icon: Users },
        { href: `${prefix}/review-form-editor`, label: "Review Form Editor", target: "_self", Icon: FileEdit },
        { href: `${prefix}/notifications`, label: "Email Notifications", target: "_self", Icon: Mail },
        { href: `${prefix}/pairing`, label: "Manual Pairing", target: "_self", Icon: Link2 },
        { href: `${prefix}/review-cycle`, label: "Review Cycles Settings", target: "_self", Icon: RefreshCcw },
        { href: `${prefix}/settings`, label: "Settings", target: "_self", Icon: Settings },
    ];
}