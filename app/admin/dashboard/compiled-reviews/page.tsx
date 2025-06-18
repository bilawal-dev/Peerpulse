"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import toast from "react-hot-toast";
import { format } from "date-fns";
import Link from "next/link";

type ReviewCycle = {
    review_cycle_id: number;
    name: string;
    max_peer_selection: number;
    max_reviews_allowed: number;
    start_date: string;
    end_date: string;
    is_active: boolean;
    is_peer_selection_enabled: boolean;
    is_review_enabled: boolean;
};

export default function CompiledReviewsDashboardPage() {
    const [cycles, setCycles] = useState<ReviewCycle[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchCycles() {
            setIsLoading(true);
            try {
                const token = localStorage.getItem("elevu_auth");
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/company/get-all-review-cycle`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                const json = await res.json();
                if (!json.success) throw new Error(json.message || "Failed to load cycles");
                setCycles(json.data);
            } catch (err: any) {
                console.error(err);
                toast.error(err.message || "Could not fetch review cycles");
            } finally {
                setIsLoading(false);
            }
        }
        fetchCycles();
    }, []);

    const SkeletonCard = () => (
        <div className="border border-gray-300 bg-white rounded-lg p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/3 mt-6" />
        </div>
    );

    return (
        <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-10">Compiled Reviews</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                {isLoading ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />) : (
                    cycles.map((cycle) => (
                        <Card key={cycle.review_cycle_id} className="h-full flex flex-col hover:shadow-md transition-shadow">
                            <CardHeader>
                                <CardTitle className="text-lg">{cycle.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col justify-between h-full gap-4">
                                <p className="text-sm text-gray-600">
                                    <strong>Dates:</strong>{" "}
                                    {format(new Date(cycle.start_date), "MMM d, yyyy")} -{" "}
                                    {format(new Date(cycle.end_date), "MMM d, yyyy")}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <strong>Peer slots:</strong> {cycle.max_peer_selection}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <strong>Review slots:</strong> {cycle.max_reviews_allowed}
                                </p>
                                <div className="flex flex-wrap gap-2 text-sm mt-1">
                                    <span className={`px-2 py-1 rounded-full text-xs ${cycle.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"}`}                                    >
                                        {cycle.is_active ? "Active" : "Inactive"}
                                    </span>{" "}
                                    <span className={`px-2 py-1 rounded-full text-xs ${cycle.is_peer_selection_enabled ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-500"}`}                                    >
                                        Peer Selection {cycle.is_peer_selection_enabled ? "On" : "Off"}
                                    </span>{" "}
                                    <span className={`px-2 py-1 rounded-full text-xs ${cycle.is_review_enabled ? "bg-indigo-100 text-indigo-800" : "bg-gray-100 text-gray-500"}`}                                    >
                                        Review {cycle.is_review_enabled ? "On" : "Off"}
                                    </span>
                                </div>
                                <Link
                                    href={`/admin/dashboard/compiled-reviews/${cycle.review_cycle_id}`}
                                    target="_blank"
                                    className="mt-auto text-sm font-medium  px-4 py-2 rounded bg-blue-600 text-white transition"
                                >
                                    View Compiled
                                </Link>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </Card>
    );
}
