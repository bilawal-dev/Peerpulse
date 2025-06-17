"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface ReviewCycle {
    review_cycle_id: number;
    name: string;
    max_peer_selection: number;
    max_reviews_allowed: number;
    start_date: string;
    end_date: string;
    is_active: boolean;
    is_peer_selection_enabled: boolean;
    is_review_enabled: boolean;
    created_at: string;
    updated_at: string;
}

interface ApiResponse {
    success: boolean;
    status: number;
    message: string;
    data: ReviewCycle[];
}

export default function DashboardPeerSelectionPage() {
    const [cycles, setCycles] = useState<ReviewCycle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchReviewCycles() {
            setLoading(true);
            setError(null);

            try {
                const token = localStorage.getItem("elevu_auth");
                if (!token) throw new Error("No auth token found. Please log in again.");

                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_SERVER_URL}/employee/get-company-review-cycle`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!res.ok) throw new Error(`Failed to fetch review cycles (status ${res.status})`);

                const json: ApiResponse = await res.json();
                setCycles(json.data || []);
            } catch (err: any) {
                console.error("Error fetching review cycles:", err);
                setError(err.message || "Something went wrong.");
            } finally {
                setLoading(false);
            }
        }

        fetchReviewCycles();
    }, []);

    if (loading) {
        return (
            <div className="px-8 py-6">
                <p className="text-gray-600">Loading review cycles…</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="px-8 py-6">
                <p className="text-red-500">Error: {error}</p>
            </div>
        );
    }

    return (
        <Card className="px-8 py-6 space-y-6">
            <h1 className="text-2xl font-semibold">Select a Review Cycle</h1>

            {cycles.length === 0 ? (
                <p className="text-gray-700">No active review cycles found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cycles.map((cycle) => (
                        <Card key={cycle.review_cycle_id} className="bg-white shadow-sm">
                            <CardHeader className="flex flex-row justify-between items-end border-b py-3">
                                <CardTitle className="text-lg font-semibold my-0 py-0">{cycle.name}</CardTitle>
                                <div className={cycle.is_active ? "text-sm bg-green-100 text-green-700 rounded-full px-2 py-1" : "text-sm bg-red-100 text-red-700 rounded-full px-2 py-1"}>
                                    {cycle.is_active ? "Active" : "Inactive"}
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-2 pt-2 text-gray-700">
                                <div>
                                    <span className="font-medium">Cycle ID:</span> {cycle.review_cycle_id}
                                </div>
                                <div>
                                    <span className="font-medium">Max Peer Selection:</span>{" "}
                                    {cycle.max_peer_selection}
                                </div>
                                <div>
                                    <span className="font-medium">Max Reviews Allowed:</span>{" "}
                                    {cycle.max_reviews_allowed}
                                </div>
                                <div>
                                    <span className="font-medium">Start Date:</span>{" "}
                                    {new Date(cycle.start_date).toLocaleDateString()}
                                </div>
                                <div>
                                    <span className="font-medium">End Date:</span>{" "}
                                    {new Date(cycle.end_date).toLocaleDateString()}
                                </div>
                                <div>
                                    <span className="font-medium">Peer Selection:</span>{" "}
                                    {cycle.is_peer_selection_enabled ? "Enabled" : "Disabled"}
                                </div>
                                <div>
                                    <span className="font-medium">Review:</span>{" "}
                                    {cycle.is_review_enabled ? "Enabled" : "Disabled"}
                                </div>
                            </CardContent>

                            <div className="px-6 pb-4">
                                {cycle.is_peer_selection_enabled ? (
                                    <Link href={`/employee/dashboard/peer-selection/${cycle.review_cycle_id}`}>
                                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                            Select
                                        </Button>
                                    </Link>
                                ) : (
                                    <Button
                                        disabled
                                        className="w-full bg-gray-300 text-gray-600 hover:bg-gray-300 cursor-not-allowed"
                                        onClick={() =>
                                            toast.error("Peer selection is not enabled by Company")
                                        }
                                    >
                                        Peer selection Disabled
                                    </Button>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </Card>
    );
}
