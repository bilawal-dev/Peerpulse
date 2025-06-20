// app/employee/dashboard/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

export default function DashboardRoot() {
    const [cycles, setCycles] = useState<ReviewCycle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    return (
        <div className="p-8 space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Select a Review Cycle</h1>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    <ReviewCycleSkeletons />
                ) : (
                    <>
                        {cycles.map((c) => (
                            <Card key={c.review_cycle_id} className="border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
                                <CardHeader className="flex  justify-between items-start border-b border-gray-100 pb-2">
                                    <h2 className="text-xl font-semibold text-gray-800">{c.name}</h2>
                                    <div className="flex space-x-2">
                                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${c.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}                                >
                                            {c.is_active ? "Active" : "Inactive"}
                                        </span>
                                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${c.is_peer_selection_enabled ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-600"}`}                                >
                                            Peer Selection: {c.is_peer_selection_enabled ? "On" : "Off"}
                                        </span>
                                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${c.is_review_enabled ? "bg-indigo-100 text-indigo-800" : "bg-gray-100 text-gray-600"}`}                                >
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
                                    <Link href={`/employee/dashboard/${c.review_cycle_id}/`} target='_blank'>
                                        <Button>
                                            Enter Review Cycle Cycle
                                        </Button>
                                    </Link>
                                </div>
                            </Card>
                        ))}
                    </>
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
    )
}