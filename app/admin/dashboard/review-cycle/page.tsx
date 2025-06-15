// app/employee/dashboard/review-cycles/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, } from "@/components/ui/dialog";
import ReviewCycleList from "@/components/Dashboard/Review-Cycle/ReviewCycleList";
import AddReviewCycleSidebar, { NewCycleValues } from "@/components/Dashboard/Review-Cycle/AddReviewCycleSidebar";
import EditReviewCycleSidebar, { EditCycleValues } from "@/components/Dashboard/Review-Cycle/EditReviewCycleSidebar";
import toast from "react-hot-toast";
import ButtonLoader from "@/components/Common/ButtonLoader";

type ReviewCycle = {
    id: string;
    label: string;
    startDate: string;
    endDate: string | null;
    maxPeersSelect: number | null;
    requiredPeerReviewers: number | null;
    isPeerSelectionEnabled: boolean;
    isReviewEnabled: boolean;
};

export default function DashboardReviewCyclePage() {
    const [cycles, setCycles] = useState<ReviewCycle[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // add slide-over
    const [addOpen, setAddOpen] = useState(false);
    // edit slide-over
    const [editOpen, setEditOpen] = useState(false);
    const [editInitial, setEditInitial] = useState<EditCycleValues | null>(null);
    const [editId, setEditId] = useState<string | null>(null);

    // delete dialog
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [targetDeleteId, setTargetDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchAllCycles();
    }, []);

    async function fetchAllCycles() {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("elevu_auth");
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/company/get-all-review-cycle`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if (!res.ok) throw new Error();
            const json = await res.json();
            setCycles(
                (json.data as any[]).map((item) => ({
                    id: String(item.review_cycle_id),
                    label: item.name,
                    startDate: item.start_date,
                    endDate: item.end_date || null,
                    maxPeersSelect: item.max_peer_selection,
                    requiredPeerReviewers: item.max_reviews_allowed,
                    isPeerSelectionEnabled: item.is_peer_selection_enabled,
                    isReviewEnabled: item.is_review_enabled,
                }))
            );
        } catch {
            toast.error("Failed to load cycles");
        } finally {
            setIsLoading(false);
        }
    }

    // create
    function openAdd() {
        setAddOpen(true);
    }
    async function handleAdd(vals: NewCycleValues) {
        try {
            const token = localStorage.getItem("elevu_auth");
            await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/company/add-review-cycle`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    name: vals.label,
                    start_date: vals.startDate.toISOString(),
                    end_date: (vals.endDate || vals.startDate).toISOString(),
                    max_peer_selection: vals.maxPeers || 0,
                    max_reviews_allowed: vals.requiredReviewers || 0,
                }),
            });
            toast.success("Cycle created");
            await fetchAllCycles();
        } catch {
            toast.error("Failed to create cycle");
        } finally {
            setAddOpen(false);
        }
    }

    // edit
    function openEdit(cycle: ReviewCycle) {
        setEditId(cycle.id);
        setEditInitial({
            label: cycle.label,
            startDate: new Date(cycle.startDate),
            endDate: cycle.endDate ? new Date(cycle.endDate) : undefined,
            maxPeers: cycle.maxPeersSelect ?? undefined,
            requiredReviewers: cycle.requiredPeerReviewers ?? undefined,
            isPeerSelectionEnabled: cycle.isPeerSelectionEnabled,
            isReviewEnabled: cycle.isReviewEnabled,
        });
        setEditOpen(true);
    }
    async function handleEdit(vals: EditCycleValues) {
        try {
            const token = localStorage.getItem("elevu_auth");

            // 1) core update
            await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/company/update-review-cycle`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    review_cycle_id: Number(editId),
                    name: vals.label,
                    start_date: vals.startDate.toISOString(),
                    end_date: (vals.endDate || vals.startDate).toISOString(),
                    max_peer_selection: vals.maxPeers || 0,
                    max_reviews_allowed: vals.requiredReviewers || 0,
                }),
            }
            );

            // 2) peer-selection toggle
            await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/company/update-peer-selection-status`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    review_cycle_id: Number(editId),
                    is_peer_selection_enabled: vals.isPeerSelectionEnabled,
                }),
            });

            // 3) review toggle
            await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/company/update-review-status`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    review_cycle_id: Number(editId),
                    is_review_enabled: vals.isReviewEnabled,
                }),
            });

            toast.success("Cycle updated");
            await fetchAllCycles();
        } catch {
            toast.error("Failed to update cycle");
        } finally {
            setEditOpen(false);
        }
    }

    // delete
    function openDelete(id: string) {
        setTargetDeleteId(id);
        setDeleteOpen(true);
    }
    async function handleDelete() {
        setDeleting(true);
        setDeleteOpen(false);
        try {
            const token = localStorage.getItem("elevu_auth");
            await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/company/delete-review-cycle`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ review_cycle_id: Number(targetDeleteId) }),
            });
            setCycles(cycles => cycles.filter(cycle => cycle.id !== targetDeleteId));
            toast.success("Cycle deleted");
        } catch {
            toast.error("Delete failed");
        } finally {
            setDeleting(false);
        }
    }

    return (
        <div className="space-y-8 pb-8">
            <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                    <h2 className="text-2xl font-semibold">Review Cycles</h2>
                    <Button onClick={openAdd} className="flex items-center bg-blue-600 hover:bg-blue-700">
                        <PlusCircle className="mr-2 h-5 w-5" /> Create New
                    </Button>
                </CardHeader>

                <CardContent>
                    {isLoading ? <ReviewCyclesSkeleton /> : (
                        <ReviewCycleList
                            cycles={cycles}
                            onEdit={openEdit}
                            onDelete={openDelete}
                        />
                    )}
                </CardContent>
            </Card>

            {/* Add */}
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
                <DialogTrigger asChild><div hidden /></DialogTrigger>
                <AddReviewCycleSidebar onCancel={() => setAddOpen(false)} onSubmit={handleAdd} />
            </Dialog>

            {/* Edit */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogTrigger asChild><div hidden /></DialogTrigger>
                {editInitial && (
                    <EditReviewCycleSidebar
                        initial={editInitial}
                        onCancel={() => setEditOpen(false)}
                        onSubmit={handleEdit}
                    />
                )}
            </Dialog>

            {/* Delete */}
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogTrigger asChild><div hidden /></DialogTrigger>
                <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 max-w-sm">
                    <DialogHeader><DialogTitle>Confirm Deletion</DialogTitle></DialogHeader>
                    <p className="mt-4 text-gray-700">
                        Are you sure you want to delete cycle #{targetDeleteId}?
                    </p>
                    <DialogFooter className="mt-6 flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setDeleteOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            disabled={deleting}
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700 disabled:opacity-50"
                        >
                            {deleting ? <ButtonLoader /> : <Trash2 className="mr-2 h-5 w-5" />}
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function ReviewCyclesSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {Array.from({ length: 5 }).map((_, idx) => (
                <Card key={idx} className="h-64 border border-gray-200 bg-gray-100">
                    <CardHeader />
                    <CardContent className="space-y-4">
                        <div className="h-4 bg-gray-300 rounded w-3/4" />
                        <div className="h-4 bg-gray-300 rounded w-1/2" />
                        <div className="h-4 bg-gray-300 rounded w-5/6" />
                        <div className="h-4 bg-gray-300 rounded w-3/4" />
                        <div className="h-4 bg-gray-300 rounded w-1/2" />
                        <div className="h-4 bg-gray-300 rounded w-5/6" />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}