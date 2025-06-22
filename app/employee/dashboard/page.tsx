// app/employee/dashboard/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue, } from "@/components/ui/select";
import { Home, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface ReviewCycle {
    review_cycle_id: number;
    name: string;
    start_date: string;
    end_date: string;
    is_active: boolean;
    max_peer_selection: number;
    max_reviews_allowed: number;
    is_peer_selection_enabled: boolean;
    is_review_enabled: boolean;
    created_at: string;
    updated_at: string;
}

function getInitials(name = "") {
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
        parts[0].charAt(0).toUpperCase() +
        parts[1].charAt(0).toUpperCase()
    );
}

export default function DashboardRoot() {
    const { user, logout } = useAuth();
    const [cycles, setCycles] = useState<ReviewCycle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // New: search & filter state
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("elevu_auth");
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/employee/get-company-review-cycle`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const json = await res.json();
                if (!json.success) throw new Error(json.message);
                setCycles(json.data);
            } catch (err: any) {
                console.error(err);
                setError(err.message || "Failed to load review cycles");
                toast.error(err.message || "Failed to load review cycles");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (error) {
        return (
            <div className="p-8">
                <p className="text-red-600 font-medium">{error}</p>
            </div>
        );
    }

    // Stats
    const total = cycles.length;
    const activeCount = cycles.filter((c) => c.is_active).length;
    const inactiveCount = total - activeCount;

    // apply search + filter to cycles
    const visibleCycles = useMemo(() => {
        return cycles.filter((c) => {
            if (filter === "active" && !c.is_active) return false;
            if (filter === "inactive" && c.is_active) return false;
            return c.name.toLowerCase().includes(search.toLowerCase());
        });
    }, [cycles, filter, search]);

    return (
        <div className="p-8 space-y-6">
            {/* — Top Bar — */}
            <header className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">
                    Select a Review Cycle
                </h1>
                <div className="flex items-center space-x-4">
                    <Link href="/" className="text-gray-600 hover:text-gray-900">
                        <Home className="w-6 h-6" />
                    </Link>

                    <Popover>
                        <PopoverTrigger asChild>
                            <button className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center font-medium hover:bg-gray-300 transition" aria-label="User menu" >
                                {getInitials(user?.name)}
                            </button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-48 p-2">
                            <div className="pb-2 border-b mb-2">
                                <p className="text-sm capitalize font-medium">{user?.name}</p>
                                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                <p className="text-xs capitalize text-gray-500 truncate">{user?.role}</p>
                            </div>
                            <button onClick={() => logout()} className="flex items-center gap-2 w-full px-2 py-1 text-sm hover:bg-gray-100 rounded">
                                <LogOut className="w-4 h-4" /> Logout
                            </button>
                        </PopoverContent>
                    </Popover>
                </div>
            </header>

            {/* — Quick Summary Cards — */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="text-center">
                    <CardContent>
                        <h3 className="text-lg font-medium">Total Cycles</h3>
                        <p className="mt-2 text-2xl font-bold">{total}</p>
                    </CardContent>
                </Card>
                <Card className="text-center">
                    <CardContent>
                        <h3 className="text-lg font-medium">Active</h3>
                        <p className="mt-2 text-2xl font-bold text-green-600">
                            {activeCount}
                        </p>
                    </CardContent>
                </Card>
                <Card className="text-center">
                    <CardContent>
                        <h3 className="text-lg font-medium">Inactive</h3>
                        <p className="mt-2 text-2xl font-bold text-red-600">
                            {inactiveCount}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* — Filter & Search — */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-2">
                    <Label htmlFor="filter">Filter:</Label>
                    <Select value={filter} onValueChange={(v) => setFilter(v as any)}>
                        <SelectTrigger>
                            <SelectValue placeholder="All" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center space-x-2">
                    <Label htmlFor="search">Search:</Label>
                    <Input
                        id="search"
                        placeholder="Cycle name…"
                        className="w-full sm:w-64"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* — Cycle Cards Grid (unchanged!) — */}
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    <ReviewCycleSkeletons />
                ) : visibleCycles.length > 0 ? (
                    visibleCycles.map((c) => (
                        <Card key={c.review_cycle_id} className="border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
                            <CardHeader className="flex justify-between items-start border-b border-gray-100 pb-2">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    {c.name}
                                </h2>
                                <div className="flex space-x-2">
                                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${c.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                        {c.is_active ? "Active" : "Inactive"}
                                    </span>
                                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${c.is_peer_selection_enabled ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-600"}`}>
                                        Peer Selection: {c.is_peer_selection_enabled ? "On" : "Off"}
                                    </span>
                                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${c.is_review_enabled ? "bg-indigo-100 text-indigo-800" : "bg-gray-100 text-gray-600"}`}>
                                        Review Forms: {c.is_review_enabled ? "On" : "Off"}
                                    </span>
                                </div>
                            </CardHeader>

                            <CardContent className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                                <div>
                                    <strong>Start:</strong>
                                    <div>{new Date(c.start_date).toLocaleString()}</div>
                                </div>
                                <div>
                                    <strong>End:</strong>
                                    <div>{new Date(c.end_date).toLocaleString()}</div>
                                </div>
                                <div>
                                    <strong>Max Peers:</strong>
                                    <div>{c.max_peer_selection}</div>
                                </div>
                                <div>
                                    <strong>Max Reviews:</strong>
                                    <div>{c.max_reviews_allowed}</div>
                                </div>
                                <div>
                                    <strong>Created at:</strong>
                                    <div>{new Date(c.created_at).toLocaleString()}</div>
                                </div>
                                <div>
                                    <strong>Updated at:</strong>
                                    <div>{new Date(c.updated_at).toLocaleString()}</div>
                                </div>
                            </CardContent>

                            <div className="p-4 pt-0 flex">
                                <Link href={`/employee/dashboard/${c.review_cycle_id}/`}>
                                    <Button>Enter Review Cycle</Button>
                                </Link>
                            </div>
                        </Card>
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-500">
                        No Review Cycles Found
                    </p>
                )}
            </div>
        </div>
    );
}

function ReviewCycleSkeletons() {
    return (
        <>
            {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse border border-gray-200">
                    <CardHeader className="h-12 bg-gray-100 rounded-t" />
                    <CardContent className="space-y-2 pt-5">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                        <div className="h-4 bg-gray-200 rounded w-2/3" />
                        <div className="h-6 bg-gray-200 rounded" />
                        <div className="h-4 bg-gray-200 rounded w-2/3" />
                        <div className="h-4 bg-gray-200 rounded w-1/6" />
                    </CardContent>
                </Card>
            ))}
        </>
    );
}
