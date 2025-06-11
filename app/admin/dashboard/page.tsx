"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, FileText, Hourglass, Loader, Users } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import toast from "react-hot-toast";
import { th } from "date-fns/locale";
import Link from "next/link";

type ReviewCycle = {
    id: string;
    label: string
};

export default function AdminDashboardPage() {
    // static stats for now
    const totalEmployees = 37;
    const selectionsCompleted = 32;
    const pendingSelections = totalEmployees - selectionsCompleted;
    const completedReviews = 28;
    const inProgress = 0;
    const pendingReviews = totalEmployees - completedReviews;

    // new state for cycles + selection
    const [cycles, setCycles] = useState<ReviewCycle[]>([]);
    const [isLoadingCycles, setIsLoadingCycles] = useState(true);
    const [selectedCycle, setSelectedCycle] = useState("");

    useEffect(() => {
        async function fetchCycles() {
            setIsLoadingCycles(true);
            try {
                const token = localStorage.getItem("elevu_auth");
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/company/get-all-review-cycle`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                });
                if (!res.ok) throw new Error("Failed to fetch review cycles");
                const json = await res.json();
                const mapped = (json.data as any[]).map(item => ({
                    id: String(item.review_cycle_id),
                    label: item.name,
                }));
                setCycles(mapped);
                if (mapped.length) setSelectedCycle(mapped[0].id);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoadingCycles(false);
            }
        }
        fetchCycles();
    }, []);

    const handleAutoPair = async () => {
        if (!selectedCycle) return;
        try {
            const token = localStorage.getItem("elevu_auth");
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/company/auto-peer-selection`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ review_cycle_id: Number(selectedCycle) }),
            });

            const json = await res.json();

            if (!json.success) throw new Error(json.message || "Failed to start automated pairing");

            console.log("Auto-pairing response:", json);
            console.log("Auto-pairing started for cycle", selectedCycle);

            toast.success(json.message || "Automated pairing started successfully!");
        } catch (err) {
            console.error("Error during auto-pairing:", err);
            if (err instanceof Error) {
                toast.error(err.message || "An error occurred while starting automated pairing.");
            }
        }
    };

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
                                <Link href={"/admin/dashboard/review-cycle"} className="py-2 px-5 w-fit bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition" >
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
                                    {cycles.map(cycle => (
                                        <SelectItem key={cycle.id} value={cycle.id} className="text-xs sm:text-sm 2xl:text-base">
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
                        <span className="text-4xl font-bold">{totalEmployees}</span>
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
                                <p className="text-2xl font-semibold">{selectionsCompleted}</p>
                            </div>
                            <CheckCircle2 className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                            <div>
                                <p className="text-sm text-gray-500">Pending Selections</p>
                                <p className="text-2xl font-semibold">{pendingSelections}</p>
                            </div>
                            <Clock className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                        <Progress value={(selectionsCompleted / totalEmployees) * 100} className="flex h-2 rounded-full" />
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
                                <p className="text-2xl font-semibold">{completedReviews}</p>
                            </div>
                            <CheckCircle2 className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                            <div>
                                <p className="text-sm text-gray-500">In Progress</p>
                                <p className="text-2xl font-semibold">{inProgress}</p>
                            </div>
                            <Loader className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                            <div>
                                <p className="text-sm text-gray-500">Pending Reviews</p>
                                <p className="text-2xl font-semibold">{pendingReviews}</p>
                            </div>
                            <Hourglass className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                        <Progress value={(completedReviews / (totalEmployees * 3)) * 100} className="flex h-2 rounded-full" />
                        <Button variant="outline" size="sm">
                            <FileText className="mr-2 h-4 w-4" />
                            Compile Reviews
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
