"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, ChevronLeft, ChevronRight } from "lucide-react";

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

export default function Sidebar({ collapsed, onToggle, navItems }: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside className={`fixed max-h-screen inset-y-0 left-0 bg-white border-r flex flex-col transition-[width] duration-200 ${collapsed ? "w-20" : "w-72"}`}>
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
                    <h3 className="text-sm font-semibold">Empower Your Team</h3>
                    <p className="text-xs text-gray-600 mt-1">
                        Elevu makes 360° performance reviews simple with peer feedback and insights.
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
