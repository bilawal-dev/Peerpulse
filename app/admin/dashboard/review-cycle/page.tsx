// pages/admin/dashboard/review-cycle.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import ReviewCycleList from "@/components/Dashboard/Review-Cycle/ReviewCycleList";
import ReviewProcessSettings, { ReviewCycleFormValues } from "@/components/Dashboard/Review-Cycle/ReviewProcessSettings";

type ReviewCycle = {
    id: string;
    label: string;
    startDate: string;
    endDate: string | null;
    maxPeersSelect: number | null;
    requiredPeerReviewers: number | null;
};

export default function DashboardReviewCyclePage() {
    const [cycles, setCycles] = useState<ReviewCycle[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [showForm, setShowForm] = useState<boolean>(false);
    const [editingCycle, setEditingCycle] = useState<ReviewCycle | null>(null);

    const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

    // 1️⃣ Fetch all cycles on mount
    useEffect(() => {
        fetchAllCycles();
    }, []);

    const fetchAllCycles = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("elevu_auth");
            const res = await fetch(`${BASE_URL}/company/get-all-review-cycle`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) throw new Error("Failed to fetch review cycles");
            const json = await res.json();
            // json.data is an array of objects with fields:
            // review_cycle_id, name, start_date, end_date, reminder_gap_days, max_peer_selection, max_reviews_allowed
            const mapped: ReviewCycle[] = (json.data as any[]).map((item) => ({
                id: String(item.review_cycle_id),
                label: item.name,
                startDate: item.start_date,
                endDate: item.end_date || null,
                maxPeersSelect: item.max_peer_selection ?? null,
                requiredPeerReviewers: item.max_reviews_allowed ?? null,
            }));
            setCycles(mapped);
        } catch (error) {
            console.error("Error fetching cycles:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // 2️⃣ Handle “Create New” click
    const handleCreateNew = () => {
        setEditingCycle(null);
        setShowForm(true);
    };

    // 3️⃣ Handle “Edit” click from list
    const handleEdit = (cycle: ReviewCycle) => {
        setEditingCycle(cycle);
        setShowForm(true);
    };

    // 4️⃣ Handle delete
    const handleDelete = async (cycleId: string) => {
        if (!confirm("Are you sure you want to delete this review cycle?"))
            return;
        try {
            const token = localStorage.getItem("elevu_auth");
            const res = await fetch(`${BASE_URL}/company/delete-review-cycle`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ review_cycle_id: Number(cycleId) }),
            });
            if (!res.ok) throw new Error("Failed to delete");
            // Refresh the list
            await fetchAllCycles();
        } catch (error) {
            console.error("Delete error:", error);
            // Optionally show a toast here
        }
    };

    // 5️⃣ Handle form submission for both create and edit
    const handleFormSubmit = async (values: ReviewCycleFormValues, cycleId?: string) => {
        try {
            const token = localStorage.getItem("elevu_auth");
            if (cycleId) {
                // EDIT existing cycle
                const payload: any = {
                    review_cycle_id: Number(cycleId),
                };
                if (values.label) payload.name = values.label;
                if (values.startDate)
                    payload.start_date = values.startDate.toISOString();
                if (values.endDate) payload.end_date = values.endDate.toISOString();
                if (values.maxPeersSelect !== undefined)
                    payload.max_peer_selection = values.maxPeersSelect;
                if (values.requiredPeerReviewers !== undefined)
                    payload.max_reviews_allowed = values.requiredPeerReviewers;
                // Omitting reminder_gap_days here; backend allows it as optional

                const res = await fetch(`${BASE_URL}/company/update-review-cycle`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                });
                if (!res.ok) throw new Error("Failed to update review cycle");
            } else {
                // CREATE new cycle
                const payload = {
                    name: values.label,
                    start_date: values.startDate.toISOString(),
                    end_date: values.endDate?.toISOString() || values.startDate.toISOString(),
                    max_peer_selection: values.maxPeersSelect ?? 0,
                    max_reviews_allowed: values.requiredPeerReviewers ?? 0,
                };
                const res = await fetch(
                    `${BASE_URL}/company/add-review-cycle`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify(payload),
                    }
                );
                if (!res.ok) throw new Error("Failed to create review cycle");
            }

            // After create or update, re-fetch entire list
            await fetchAllCycles();
            setShowForm(false);
            setEditingCycle(null);
        } catch (error) {
            console.error("Form submit error:", error);
            // Optionally show a toast here
        }
    };

    return (
        <div className="space-y-8 pb-8">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Review Cycles</h2>
                <Button
                    onClick={handleCreateNew}
                    variant="default"
                    className="flex items-center bg-blue-600 hover:bg-blue-700 transition"
                >
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Create New Cycle
                </Button>
            </div>

            {isLoading ? (
                <p>Loading review cycles...</p>
            ) : (
                <ReviewCycleList
                    cycles={cycles}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}

            {showForm && (
                <div className="mt-8">
                    <h3 className="text-xl font-medium mb-4">
                        {editingCycle ? "Edit Review Cycle" : "Create New Review Cycle"}
                    </h3>
                    <ReviewProcessSettings
                        initialValues={
                            editingCycle
                                ? {
                                    label: editingCycle.label,
                                    startDate: new Date(editingCycle.startDate),
                                    endDate: editingCycle.endDate
                                        ? new Date(editingCycle.endDate)
                                        : undefined,
                                    maxPeersSelect: editingCycle.maxPeersSelect ?? undefined,
                                    requiredPeerReviewers:
                                        editingCycle.requiredPeerReviewers ?? undefined,
                                }
                                : undefined
                        }
                        onCancel={() => {
                            setShowForm(false);
                            setEditingCycle(null);
                        }}
                        onSubmit={(vals) =>
                            handleFormSubmit(vals, editingCycle?.id)
                        }
                    />
                </div>
            )}
        </div>
    );
}
