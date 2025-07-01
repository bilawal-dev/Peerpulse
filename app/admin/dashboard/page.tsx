// /admin/dashboard/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, Home, User, LogOut, Calendar, Users, BarChart3, Settings } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, } from "@/components/ui/dialog";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import ReviewCycleList from "@/components/Dashboard/Review-Cycle/ReviewCycleList";
import AddReviewCycleSidebar, { NewCycleValues } from "@/components/Dashboard/Review-Cycle/AddReviewCycleSidebar";
import EditReviewCycleSidebar, { EditCycleValues } from "@/components/Dashboard/Review-Cycle/EditReviewCycleSidebar";
import toast from "react-hot-toast";
import ButtonLoader from "@/components/Common/ButtonLoader";
import { ReviewCycle } from "@/types/ReviewCycle";
import { useAuth } from "@/context/AuthContext";


export default function AdminDashboardRootPage() {
    const { user, logout } = useAuth();
    const [cycles, setCycles] = useState<ReviewCycle[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // add slide-over
    const [addOpen, setAddOpen] = useState(false);
    // edit slide-over
    const [editOpen, setEditOpen] = useState(false);
    const [editInitial, setEditInitial] = useState<EditCycleValues | null>(null);
    const [editId, setEditId] = useState<number | null>(null);

    // delete dialog
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [targetDeleteId, setTargetDeleteId] = useState<number | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchAllCycles();
    }, []);

    async function fetchAllCycles() {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("elevu_auth");
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/company/get-all-review-cycle`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });
            const json = await res.json() as { success: boolean, message: string, data: ReviewCycle[] };
            if (!json.success) {
                throw new Error(json.message || "Failed to fetch cycles");
            }
            setCycles(json.data)

        } catch (error: any) {
            console.error("Error fetching cycles:", error);
            toast.error(error.message || "Failed to fetch cycles");
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
            toast.loading("Creating review cycle...", { id: "create-cycle" });

            const token = localStorage.getItem("elevu_auth");
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/company/add-review-cycle`, {
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
            const json = await res.json();
            if (!json.success) {
                throw new Error(json.message || "Failed to create cycle");
            }
            toast.success(json.message || "Review cycle created successfully!", { id: "create-cycle" });
            await fetchAllCycles();
            return true;
        } catch (error: any) {
            console.error("Error creating cycle:", error);
            toast.error(error.message || "Failed to create review cycle", { id: "create-cycle" });
            return false;
        } finally {
            setAddOpen(false);
        }
    }

    // edit
    function openEdit(cycle: ReviewCycle) {
        setEditId(cycle.review_cycle_id);
        setEditInitial({
            label: cycle.name,
            startDate: new Date(cycle.start_date),
            endDate: cycle.end_date ? new Date(cycle.end_date) : undefined,
            maxPeers: cycle.max_peer_selection ?? undefined,
            requiredReviewers: cycle.max_reviews_allowed ?? undefined,
            isPeerSelectionEnabled: cycle.is_peer_selection_enabled,
            isReviewEnabled: cycle.is_review_enabled,
        });
        setEditOpen(true);
    }
    async function handleEdit(vals: EditCycleValues) {
        try {
            toast.loading("Updating review cycle...", { id: "update-cycle" });

            const token = localStorage.getItem("elevu_auth");

            // 1) core update
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/company/update-review-cycle`, {
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
                    is_peer_selection_enabled: vals.isPeerSelectionEnabled,
                    is_review_enabled: vals.isReviewEnabled,
                }),
            });

            const json = await res.json();
            if (!json.success) {
                throw new Error(json.message || "Failed to update cycle");
            }

            toast.success(json.message || "Review cycle updated successfully!", { id: "update-cycle" });
            await fetchAllCycles();
        } catch (error: any) {
            console.error("Error updating cycle:", error);
            toast.error(error.message || "Failed to update review cycle", { id: "update-cycle" });
        } finally {
            setEditOpen(false);
        }
    }

    // delete
    function openDelete(id: number) {
        setTargetDeleteId(id);
        setDeleteOpen(true);
    }

    async function handleDelete() {
        setDeleting(true);
        setDeleteOpen(false);
        try {
            const token = localStorage.getItem("elevu_auth");
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/company/delete-review-cycle`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ review_cycle_id: Number(targetDeleteId) }),
            });
            const json = await res.json();
            if (!json.success) {
                throw new Error(json.message || "Failed to delete cycle");
            }
            setCycles(cycles => cycles.filter(cycle => cycle.review_cycle_id !== targetDeleteId));
            toast.success("Cycle deleted");
        } catch (error: any) {
            console.error("Error deleting cycle:", error);
            toast.error(error.message || "Failed to delete cycle");
        } finally {
            setDeleting(false);
        }
    }

    const activeCycles = cycles.filter(cycle => cycle.is_active).length;
    const inactiveCycles = cycles.length - activeCycles;
    const reviewEnabledCycles = cycles.filter(cycle => cycle.is_review_enabled).length;
    const peerSelectionEnabledCycles = cycles.filter(cycle => cycle.is_peer_selection_enabled).length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Beautiful Header Banner */}
            <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-brand overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative px-8 py-12">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-start md:items-center justify-between">
                            <h1 className="text-4xl md:text-5xl font-poppins text-white font-bold tracking-tight">
                                PeerPulse Company Dashboard
                            </h1>
                            {/* User Menu in Header */}
                            <div className="flex items-center space-x-4">
                                <Link href="/" className="text-white/80 hover:text-white transition-colors">
                                    <Home className="w-6 h-6" />
                                </Link>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center font-medium hover:bg-white/30 transition-all border border-white/20" aria-label="User menu">
                                            <User className="w-5 h-5" />
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent align="end" className="w-56 p-3 bg-white/95 backdrop-blur-sm border-white/20">
                                        <div className="pb-3 border-b mb-3">
                                            <p className="text-sm font-semibold text-gray-900 capitalize">{user?.name}</p>
                                            <p className="text-xs text-gray-600 truncate">{user?.email}</p>
                                            <p className="text-xs text-blue-600 font-medium capitalize mt-1">{user?.role || 'Company Admin'}</p>
                                        </div>
                                        <button onClick={() => logout()} className="flex items-center gap-2 w-full py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                                            <LogOut className="w-4 h-4" />
                                            Sign Out
                                        </button>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <p className="text-xl text-blue-100 font-light max-w-2xl">
                                Manage your organization's performance review cycles and monitor progress across all departments
                            </p>
                            <div className="flex flex-wrap  gap-6 items-center text-blue-100">
                                <div className="flex items-center space-x-2">
                                    <Calendar className="w-5 h-5" />
                                    <span className="text-sm">Review Management</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Users className="w-5 h-5" />
                                    <span className="text-sm">Team Analytics</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <BarChart3 className="w-5 h-5" />
                                    <span className="text-sm">Performance Insights</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="px-8 -mt-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Cycles</p>
                                    <p className="text-3xl font-bold text-gray-900">{cycles.length}</p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                    <Calendar className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Active Cycles</p>
                                    <p className="text-3xl font-bold text-gray-900">{activeCycles}</p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                    <BarChart3 className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Peer Selection Enabled</p>
                                    <p className="text-3xl font-bold text-gray-900">{peerSelectionEnabledCycles}</p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                    <Users className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Review Form Enabled</p>
                                    <p className="text-3xl font-bold text-gray-900">{reviewEnabledCycles}</p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                    <Users className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-8 pb-8">
                <Card className="bg-white/90 backdrop-blur-sm border-white/30 shadow-xl">
                    <CardHeader className="border-b border-gray-200/50 bg-white/50">
                        <div className="flex flex-col 2xl:flex-row items-start justify-between space-y-4 2xl:space-y-0">
                            <div>
                                <h2 className="text-3xl font-poppins text-gray-900 font-semibold">Review Cycles</h2>
                                <p className="text-gray-600 mt-1">Create and manage 360° performance review cycles to handle employee management, design questionnaires, set up email notifications, and access compiled analytics</p>
                                <p className="text-gray-500 text-sm mt-1">Enter into a review cycle to configure review forms, manage manual pairing, view compiled reviews, and monitor employee progress through live dashboards</p>
                            </div>
                            <Button
                                onClick={openAdd}
                                className="flex items-center bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                            >
                                <PlusCircle className="mr-2 h-5 w-5" />
                                Create New Review Cycle
                    </Button>
                        </div>
                </CardHeader>

                    <CardContent className="max-sm:px-6 p-8">
                    {isLoading ? <ReviewCyclesSkeleton /> : (
                        <ReviewCycleList
                            cycles={cycles}
                            onEdit={openEdit}
                            onDelete={openDelete}
                        />
                    )}
                </CardContent>
            </Card>
            </div>

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
                        Are you sure you want to delete review cycle #{targetDeleteId}?
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