"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
    LayoutDashboard,
    Users,
    Mail,
    Settings,
    Home,
    ChevronLeft,
    ChevronRight,
    FileText,
} from "lucide-react";

export const NAV_ITEMS = [
    { href: "/dashboard", label: "Dashboard", target: '_self', Icon: LayoutDashboard },
    { href: "/dashboard/reviews", label: "Compiled Reviews", target: '_blank', Icon: FileText },
    { href: "/dashboard/employees", label: "Employee Management", target: '_self', Icon: Users },
    { href: "/dashboard/notifications", label: "Email Notifications", target: '_self', Icon: Mail },
    { href: "/dashboard/settings", label: "Settings", target: '_self', Icon: Settings },
];

interface SidebarProps {
    collapsed: boolean;
    onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside className={`fixed inset-y-0 left-0 bg-white border-r flex flex-col transition-[width] duration-200 ${collapsed ? "w-20" : "w-72"}`}>
            {/* Logo + toggle */}
            <div className="p-6 flex items-center justify-between text-brand text-3xl font-bold">
                {collapsed ? "E" : "Elevu"}
                <button
                    onClick={onToggle}
                    className={`p-1 rounded ${collapsed ? "" : "hover:bg-gray-100"}`}
                    aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {collapsed ? (
                        <ChevronRight className="h-5 w-5 text-gray-600" />
                    ) : (
                        <ChevronLeft className="h-5 w-5 text-gray-600" />
                    )}
                </button>
            </div>

            {/* Nav */}
            <nav className="p-4 flex-1 flex flex-col gap-5 overflow-y-auto">
                {NAV_ITEMS.map(({ href, label, target, Icon }) => {
                    const active = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            target={target}
                            className={`flex items-center p-2 rounded-md text-sm transition ${active ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"}              `}
                        >
                            <Icon className={`mr-3 h-5 w-5 transition ${active ? "text-blue-600" : "text-gray-500"}`} />
                            {!collapsed && label}
                        </Link>
                    );
                })}
            </nav>

            {/* CTA or Home icon */}
            {!collapsed ? (
                <div className="p-4 mx-3 my-4 bg-slate-50 rounded-lg text-center">
                    <h3 className="text-sm font-semibold">Power Up Your Reviews</h3>
                    <p className="text-xs text-gray-600 mt-1">
                        Upload your employees to kickstart the peer-review process.
                    </p>
                    <Link href="/">
                        <button className="mt-3 py-2 w-full bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
                            Go to Homepage
                        </button>
                    </Link>
                </div>
            ) : (
                <Link href="/" className="p-4 mx-3 my-4 hover:bg-gray-100 rounded-md text-center">
                    <Home className="mr-3 h-5 w-5 text-gray-500" />
                </Link>
            )}
        </aside>
    );
}
