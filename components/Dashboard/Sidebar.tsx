"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, ChevronLeft, ChevronRight, LogOut, User as UserIcon, } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useReviewCycleEmp } from "@/context/EmployeeCycleContext";

interface SidebarProps {
    collapsed: boolean;
    onToggle: () => void;
    navItems: Array<{
        href: string;
        label: string;
        target?: string;
        Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    }>;
}

export default function Sidebar({ collapsed, onToggle, navItems, }: SidebarProps) {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const { reviewCycleEmp } = useReviewCycleEmp();

    let name = '';
    let role = '';
    let email = '';

    if(pathname.startsWith("/employee/dashboard")) {
        name = reviewCycleEmp?.name || '';
        role = reviewCycleEmp?.role || '';
        email = reviewCycleEmp?.email || '';
    } else if (pathname.startsWith("/admin/dashboard")) {
        name = user?.name || '';
        role = user?.role || '';
        email = user?.email || '';
    }

    return (
        <aside className={`fixed inset-y-0 left-0 max-h-screen bg-white border-r flex flex-col transition-[width] duration-200 ${collapsed ? "w-20" : "w-72"}`}>
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
                {navItems.map(({ href, label, target, Icon }) => {
                    const active = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            target={target}
                            className={`flex items-center p-2 rounded-md text-sm transition ${active ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"}`}>
                            <Icon
                                className={`mr-3 h-5 w-5 transition ${active ? "text-blue-600" : "text-gray-500"}`}
                            />
                            {!collapsed && label}
                        </Link>
                    );
                })}
            </nav>

            {/* User actions + Home */}
            <div className="mt-auto px-2 py-3 border-t flex flex-col gap-2">
                {!collapsed && (
                    <div className="flex items-start gap-2 px-2.5 mb-2">
                        <UserIcon className="h-5 w-5 text-gray-500" />
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-700 truncate">
                                {name}
                            </span>
                            <span className="text-xs text-gray-500 truncate">
                                {email}
                            </span>
                            <span className="text-xs text-gray-500 capitalize">
                                {role}
                            </span>
                        </div>
                    </div>
                )}

                {/* Home button / icon */}
                {!collapsed ? (
                    <Link href="/" className="flex items-center text-sm px-2 py-2 mx-1 rounded hover:bg-gray-100 transition text-gray-700">
                        <Home className="h-5 w-5 mr-3" />
                        Home
                    </Link>
                ) : (
                    <Link href="/" className="p-2 mx-1 rounded hover:bg-gray-100 transition text-gray-700" aria-label="Home">
                        <Home className="h-5 w-5" />
                    </Link>
                )}

                <button onClick={logout} className="flex items-center text-sm px-2 py-2 mx-1 rounded hover:bg-gray-100 transition text-gray-700" aria-label="Logout">
                    <LogOut className="h-5 w-5 mr-3" />
                    {!collapsed && "Logout"}
                </button>
            </div>
        </aside>
    );
}
