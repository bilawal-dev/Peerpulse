"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, Hourglass, Loader, Users, DollarSign, AlertTriangle, CreditCard, Power, PowerOff, UserCheck, UserX, FileText, FileX, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";
import { PaymentStatus, ReviewCycle } from "@/types/ReviewCycle";
import ButtonLoader from "@/components/Common/ButtonLoader";

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
    review_cycle: ReviewCycle;
};

export default function AdminDashboardPage() {

    const reviewCycleId = Number(useParams().reviewCycleId);

    // dashboard data
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [isLoadingDashboardData, setIsLoadingDashboardData] = useState(false);

    // cycle info
    const [reviewCycle, setReviewCycle] = useState<ReviewCycle | null>(null);

    // payment state
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);


    // fetch dashboard for selected cycle
    useEffect(() => {

        if (!reviewCycleId) return;
        const token = localStorage.getItem("elevu_auth");

        fetchDashboard();

        async function fetchDashboard() {
            setIsLoadingDashboardData(true);
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/company/get-dashboard-data`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ review_cycle_id: reviewCycleId }),
                });
                if (!res.ok) throw new Error("Failed to fetch dashboard data");
                const json = await res.json();
                if (json.success && json.data) {
                    setDashboardData(json.data);
                    setReviewCycle(json.data.review_cycle);
                } else {
                    throw new Error(json.message || "Failed to fetch dashboard data");
                }
            } catch (err: any) {
                console.error(err);
                toast.error(err.message || "Failed To Fetch Review Cycle Data");
            } finally {
                setIsLoadingDashboardData(false);
            }
        }
    }, [reviewCycleId]);

    // derive stats (fallback to 0)
    const totalEmployees = dashboardData?.total_employees ?? 0;
    const selectionsCompleted = dashboardData?.peer_selection.completed ?? 0;
    const pendingSelections = dashboardData?.peer_selection.pending ?? 0;
    const completedReviews = dashboardData?.review.completed ?? 0;
    const inProgress = dashboardData?.review.in_progress ?? 0;
    const pendingReviews = dashboardData?.review.pending ?? 0;

    // derive financial stats
    const costAmount = reviewCycle?.cost_amount ?? 0;
    const paidAmount = reviewCycle?.paid_amount ?? 0;
    const remainingCost = Math.max(0, costAmount - paidAmount);
    const paymentStatus = reviewCycle?.payment_status ?? '';
    const accessBlocked = reviewCycle?.access_blocked ?? false;

    const handleAutoPair = async () => {
        if (!reviewCycleId) return;
        try {
            const token = localStorage.getItem("elevu_auth");
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/company/auto-peer-selection`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ review_cycle_id: reviewCycleId }),
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

    const handlePayment = async () => {
        if (!reviewCycleId) return;
        setIsProcessingPayment(true);
        try {
            const token = localStorage.getItem("elevu_auth");
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/company/create-checkout-session`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ review_cycle_id: reviewCycleId }),
            });
            const json = await res.json();
            if (!json.success) throw new Error(json.message || "Failed to create checkout session");

            // Redirect to checkout URL if provided
            toast.success(json.message || "Checkout session created successfully!");
            if (json.data?.checkout_url) {
                window.location.href = json.data.checkout_url;
            }
        } catch (err: any) {
            console.error("Error during payment:", err);
            toast.error(err.message || "An error occurred while processing payment.");
        } finally {
            setIsProcessingPayment(false);
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
                    <CardContent className="space-y-3">
                        {isLoadingDashboardData || !reviewCycle ? (
                            <Skeleton className="w-48 h-6" />
                        ) : (
                            <div className="space-y-3">
                                <div>
                                    <h1 className="text-2xl font-semibold text-gray-800">
                                        {reviewCycle.name}
                                        <p className="text-sm text-gray-500">
                                            Review Cycle ID: {reviewCycle?.review_cycle_id}
                                        </p>
                                    </h1>
                                    <p className="text-sm text-gray-500">
                                        {new Date(reviewCycle.start_date).toLocaleDateString()} - {" "}
                                        {new Date(reviewCycle.end_date).toLocaleDateString()}
                                    </p>
                                </div>

                                {/* Status Badges */}
                                <div className="flex flex-wrap gap-2">
                                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${reviewCycle.is_active
                                        ? 'bg-green-50 text-green-700 border-green-200'
                                        : 'bg-gray-50 text-gray-600 border-gray-200'
                                        }`}>
                                        {reviewCycle.is_active ? (
                                            <Power className="h-3 w-3" />
                                        ) : (
                                            <PowerOff className="h-3 w-3" />
                                        )}
                                        {reviewCycle.is_active ? 'Active' : 'Inactive'}
                                    </div>
                                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${reviewCycle.is_peer_selection_enabled
                                        ? 'bg-green-50 text-green-700 border-green-200'
                                        : 'bg-gray-50 text-gray-600 border-gray-200'
                                        }`}>
                                        {reviewCycle.is_peer_selection_enabled ? (
                                            <UserCheck className="h-3 w-3" />
                                        ) : (
                                            <UserX className="h-3 w-3" />
                                        )}
                                        Peer Selection {reviewCycle.is_peer_selection_enabled ? 'Enabled' : 'Disabled'}
                                    </div>
                                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${reviewCycle.is_review_enabled
                                        ? 'bg-green-50 text-green-700 border-green-200'
                                        : 'bg-gray-50 text-gray-600 border-gray-200'
                                        }`}>
                                        {reviewCycle.is_review_enabled ? (
                                            <FileText className="h-3 w-3" />
                                        ) : (
                                            <FileX className="h-3 w-3" />
                                        )}
                                        Review Forms {reviewCycle.is_review_enabled ? 'Enabled' : 'Disabled'}
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Total Employees</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center space-x-2">
                        <Users className="h-6 w-6 text-blue-600" />
                        {isLoadingDashboardData ? (
                            <Skeleton className="w-16 h-8" />
                        ) : (
                            <span className="text-4xl font-bold">{totalEmployees}</span>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* ─── Finance & Payment Overview ─── */}
            <Card className="space-y-6">
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        Finance & Payment Overview
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {isLoadingDashboardData || !reviewCycle ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Skeleton className="h-20" />
                            <Skeleton className="h-20" />
                            <Skeleton className="h-20" />
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg border border-blue-200">
                                    <div>
                                        <p className="text-sm text-blue-600">Total Cost</p>
                                        <p className="text-2xl font-semibold text-blue-800">${costAmount.toFixed(2)}</p>
                                    </div>
                                    <CreditCard className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="flex items-center justify-between bg-green-50 p-4 rounded-lg border border-green-200">
                                    <div>
                                        <p className="text-sm text-green-600">Paid Amount</p>
                                        <p className="text-2xl font-semibold text-green-800">${paidAmount.toFixed(2)}</p>
                                    </div>
                                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                                </div>
                                <div className="flex items-center justify-between bg-orange-50 p-4 rounded-lg border border-orange-200">
                                    <div>
                                        <p className="text-sm text-orange-600">Remaining Cost</p>
                                        <p className="text-2xl font-semibold text-orange-800">${remainingCost.toFixed(2)}</p>
                                    </div>
                                    <Clock className="h-6 w-6 text-orange-600" />
                                </div>
                            </div>



                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">Payment Status:</span>
                                    <span className={`px-3 py-1 rounded-full capitalize text-sm font-medium ${paymentStatus == PaymentStatus.PAID ? 'bg-green-100 text-green-800' : paymentStatus === PaymentStatus.PARTIAL ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                        {paymentStatus}
                                    </span>
                                </div>
                                {accessBlocked && (
                                    <div className="flex items-center justify-between gap-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mt-3">
                                        <div className="flex items-center gap-2">
                                            <AlertTriangle className="h-4 w-4 text-red-600" />
                                            <span className="text-sm text-red-700">
                                                Access blocked to services due to insufficient payment
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>


                            {/* Payment Button - Show when there's remaining cost */}
                            {remainingCost > 0 && (
                                <Button
                                    onClick={handlePayment}
                                    disabled={isProcessingPayment}
                                    className="bg-gradient-to-r from-blue-500 to-sky-500 text-white font-medium px-10 py-2 text-base rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                                >
                                    {isProcessingPayment ? (
                                        <>
                                            <ButtonLoader className="mr-1" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingCart className="mr-2 h-4 w-4" />
                                            Pay ${remainingCost.toFixed(2)}
                                        </>
                                    )}
                                </Button>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>

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
                                {isLoadingDashboardData ? (
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
                                {isLoadingDashboardData ? (
                                    <Skeleton className="w-16 h-6 mt-2" />
                                ) : (
                                    <p className="text-2xl font-semibold">{pendingSelections}</p>
                                )}
                            </div>
                            <Clock className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                        {isLoadingDashboardData ? (
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
                                {isLoadingDashboardData ? (
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
                                {isLoadingDashboardData ? (
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
                                {isLoadingDashboardData ? (
                                    <Skeleton className="w-16 h-6 mt-2" />
                                ) : (
                                    <p className="text-2xl font-semibold">{pendingReviews}</p>
                                )}
                            </div>
                            <Hourglass className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                        {isLoadingDashboardData ? (
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
