"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, FileText, Hourglass, Loader, Users } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import toast from "react-hot-toast";
import Link from "next/link";

type ReviewCycle = {
    id: string;
    label: string;
};

type DashboardData = {
    total_employees: number;
    peer_selection: {
        completed: number;
        pending: number;
    };
    review: {
        completed: number;
        in_progress: number;
        pending: number;
    };
};

export default function AdminDashboardPage() {
    // review cycles
    const [cycles, setCycles] = useState<ReviewCycle[]>([]);
    const [isLoadingCycles, setIsLoadingCycles] = useState(true);
    const [selectedCycle, setSelectedCycle] = useState("");

    // dashboard data
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);

    // fetch review cycles
    useEffect(() => {
        async function fetchCycles() {
            setIsLoadingCycles(true);
            try {
                const token = localStorage.getItem("elevu_auth");
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/company/get-all-review-cycle`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                const json = await res.json();
                if (!json.success) throw new Error(json.message || "Failed to fetch review cycles");
                const mapped = (json.data as any[]).map((item) => ({
                    id: String(item.review_cycle_id),
                    label: item.name,
                }));
                setCycles(mapped);
                if (mapped.length) setSelectedCycle(mapped[0].id);
            } catch (err: any) {
                console.error(err);
                toast.error(err.message || "Failed to fetch review cycles");
            } finally {
                setIsLoadingCycles(false);
            }
        }
        fetchCycles();
    }, []);

    // fetch dashboard for selected cycle
    useEffect(() => {
        if (!selectedCycle) return;
        setIsLoadingDashboard(true);
        async function fetchDashboard() {
            try {
                const token = localStorage.getItem("elevu_auth");
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/company/get-dashboard-data`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ review_cycle_id: Number(selectedCycle) }),
                });
                if (!res.ok) throw new Error("Failed to fetch dashboard data");
                const json = await res.json();
                if (json.success && json.data) {
                    setDashboardData(json.data);
                } else {
                    throw new Error(json.message || "Failed to fetch dashboard data");
                }
            } catch (err: any) {
                console.error(err);
                toast.error(err.message || "Failed To Fetch Review Cycle Data");
            } finally {
                setIsLoadingDashboard(false);
            }
        }
        fetchDashboard();
    }, [selectedCycle]);

    // derive stats (fallback to 0)
    const totalEmployees = dashboardData?.total_employees ?? 0;
    const selectionsCompleted = dashboardData?.peer_selection.completed ?? 0;
    const pendingSelections = dashboardData?.peer_selection.pending ?? 0;
    const completedReviews = dashboardData?.review.completed ?? 0;
    const inProgress = dashboardData?.review.in_progress ?? 0;
    const pendingReviews = dashboardData?.review.pending ?? 0;

    const handleAutoPair = async () => {
        if (!selectedCycle) return;
        try {
            const token = localStorage.getItem("elevu_auth");
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/company/auto-peer-selection`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ review_cycle_id: Number(selectedCycle) }),
            });
            const json = await res.json();
            if (!json.success) throw new Error(json.message || "Failed to start automated pairing");
            toast.success(json.message || "Automated pairing started successfully!");
        } catch (err) {
            console.error("Error during auto-pairing:", err);
            if (err instanceof Error) {
                toast.error(err.message || "An error occurred while starting automated pairing.");
            }
        }
    };

    // simple skeleton block
    const Skeleton = ({ className = "" }: { className?: string }) => (
        <div className={`${className} bg-gray-200 rounded animate-pulse`} />
    );

    return (
        <div className="space-y-8 pb-8">
            {/* ─── Stats Row ─── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Peer Review Dashboard</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoadingCycles ? (
                            <p>Loading Review Cycles…</p>
                        ) : cycles.length === 0 ? (
                            <div className="flex flex-col items-start space-y-4">
                                <p className="text-gray-500">No review cycles available.</p>
                                <Link
                                    href={"/admin/dashboard/review-cycle"}
                                    className="py-2 px-5 w-fit bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                                >
                                    Create Review Cycle
                                </Link>
                            </div>
                        ) : (
                            <Select value={selectedCycle} onValueChange={setSelectedCycle}>
                                <h1 className="pb-2 font-medium">Select Review Cycle</h1>
                                <SelectTrigger className="w-full text-sm sm:text-base 2xl:text-lg font-medium text-left h-fit items-start">
                                    <SelectValue placeholder="Select review cycle" />
                                </SelectTrigger>
                                <SelectContent>
                                    {cycles.map((cycle) => (
                                        <SelectItem
                                            key={cycle.id}
                                            value={cycle.id}
                                            className="text-xs sm:text-sm 2xl:text-base"
                                        >
                                            {cycle.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Total Employees</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center space-x-2">
                        <Users className="h-6 w-6 text-blue-600" />
                        {isLoadingDashboard ? (
                            <Skeleton className="w-16 h-8" />
                        ) : (
                            <span className="text-4xl font-bold">{totalEmployees}</span>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* ─── Peer Selection Progress ─── */}
            <Card className="space-y-6">
                <CardHeader>
                    <CardTitle className="text-xl">Peer Selection Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                            <div>
                                <p className="text-sm text-gray-500">Selections Completed</p>
                                {isLoadingDashboard ? (
                                    <Skeleton className="w-16 h-6 mt-2" />
                                ) : (
                                    <p className="text-2xl font-semibold">{selectionsCompleted}</p>
                                )}
                            </div>
                            <CheckCircle2 className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                            <div>
                                <p className="text-sm text-gray-500">Pending Selections</p>
                                {isLoadingDashboard ? (
                                    <Skeleton className="w-16 h-6 mt-2" />
                                ) : (
                                    <p className="text-2xl font-semibold">{pendingSelections}</p>
                                )}
                            </div>
                            <Clock className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                        {isLoadingDashboard ? (
                            <Skeleton className="w-full h-2" />
                        ) : (
                            <Progress
                                value={(selectionsCompleted / (totalEmployees || 1)) * 100}
                                className="flex h-2 rounded-full"
                            />
                        )}
                        <Button variant="outline" size="sm" onClick={handleAutoPair}>
                            <Users className="mr-2 h-4 w-4" />
                            Start Automated Pairing
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* ─── Survey Progress ─── */}
            <Card className="space-y-6">
                <CardHeader>
                    <CardTitle className="text-xl">Survey Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                            <div>
                                <p className="text-sm text-gray-500">Completed Reviews</p>
                                {isLoadingDashboard ? (
                                    <Skeleton className="w-16 h-6 mt-2" />
                                ) : (
                                    <p className="text-2xl font-semibold">{completedReviews}</p>
                                )}
                            </div>
                            <CheckCircle2 className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                            <div>
                                <p className="text-sm text-gray-500">In Progress</p>
                                {isLoadingDashboard ? (
                                    <Skeleton className="w-16 h-6 mt-2" />
                                ) : (
                                    <p className="text-2xl font-semibold">{inProgress}</p>
                                )}
                            </div>
                            <Loader className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                            <div>
                                <p className="text-sm text-gray-500">Pending Reviews</p>
                                {isLoadingDashboard ? (
                                    <Skeleton className="w-16 h-6 mt-2" />
                                ) : (
                                    <p className="text-2xl font-semibold">{pendingReviews}</p>
                                )}
                            </div>
                            <Hourglass className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                        {isLoadingDashboard ? (
                            <Skeleton className="w-full h-2" />
                        ) : (
                            <Progress
                                value={(completedReviews / ((totalEmployees || 0) * 3)) * 100}
                                className="flex h-2 rounded-full"
                            />
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
