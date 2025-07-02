// /employee/dashboard/page.tsx
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
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, } from "@/components/ui/dialog";
import { Home, LogOut, User, Calendar, Users, BarChart3, Search, Key, Eye, EyeOff } from "lucide-react";
import ButtonLoader from "@/components/Common/ButtonLoader";
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
    companyName: string;
    companyEmail: string;
    companyMobile?: string;
    companyDescription?: string;
    companyLogo?: string;
}

export default function EmployeeDashboardRootPage() {
    const { user, logout, changePassword } = useAuth();
    const [cycles, setCycles] = useState<ReviewCycle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // New: search & filter state
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<string>("all");

    // change password dialog
    const [changePasswordOpen, setChangePasswordOpen] = useState(false);
    const [passwordFormData, setPasswordFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: ""
    });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [changingPassword, setChangingPassword] = useState(false);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("elevu_auth");
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/employee/get-review-cycle-for-employee`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const json = await res.json();
                if (!json.success) throw new Error(json.message);

                // map out the inner review_cycle object
                const cyclesData: ReviewCycle[] = json.data.map((item: any) => ({
                    review_cycle_id: item.review_cycle.review_cycle_id,
                    name: item.review_cycle.name,
                    start_date: item.review_cycle.start_date,
                    end_date: item.review_cycle.end_date,
                    is_active: item.review_cycle.is_active,
                    max_peer_selection: item.review_cycle.max_peer_selection,
                    max_reviews_allowed: item.review_cycle.max_reviews_allowed,
                    is_peer_selection_enabled: item.review_cycle.is_peer_selection_enabled,
                    is_review_enabled: item.review_cycle.is_review_enabled,
                    created_at: item.review_cycle.created_at,
                    updated_at: item.review_cycle.updated_at,
                    companyName: item.review_cycle.company.name,
                    companyEmail: item.review_cycle.company.email,
                    companyMobile: item.review_cycle.company.mobile_number || "",
                    companyDescription: item.review_cycle.company.description || "",
                    companyLogo: item.review_cycle.company.company_logo || "",
                }))

                setCycles(cyclesData)
            } catch (err: any) {
                console.error(err);
                setError(err.message || "Failed to load review cycles");
                toast.error(err.message || "Failed to load review cycles");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // change password
    function openChangePassword() {
        setChangePasswordOpen(true);
        setPasswordFormData({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
        setPasswordError("");
    }

    const handlePasswordFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordFormData(prev => ({ ...prev, [name]: value }));
        
        // Clear error when user starts typing
        if (passwordError) {
            setPasswordError("");
        }
    };

    async function handleChangePassword() {
        // Validate passwords match
        if (passwordFormData.newPassword !== passwordFormData.confirmNewPassword) {
            setPasswordError("New passwords do not match");
            return;
        }

        // Validate password length
        if (passwordFormData.newPassword.length < 8) {
            setPasswordError("New password must be at least 8 characters long");
            return;
        }

        setChangingPassword(true);
        try {
            await changePassword(passwordFormData.currentPassword, passwordFormData.newPassword, "employee");
            setChangePasswordOpen(false);
            setPasswordFormData({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
        } catch (error) {
            // Error is already handled in AuthContext
        } finally {
            setChangingPassword(false);
        }
    }

    const companies = useMemo(() => {
        const names = cycles.map(c => c.companyName);
        const unique = Array.from(new Set(names));
        return ["all", ...unique];
    }, [cycles]);

    // Stats
    const total = cycles.length;
    const activeCount = cycles.filter((c) => c.is_active).length;
    const peerSelectionEnabledCount = cycles.filter((c) => c.is_peer_selection_enabled).length;
    const reviewEnabledCount = cycles.filter((c) => c.is_review_enabled).length;

    // apply search + filter to cycles
    const visibleCycles = useMemo(
        () =>
            cycles.filter(c => {
                if (filter !== "all" && c.companyName !== filter) return false;
                return c.name.toLowerCase().includes(search.toLowerCase());
            }),
        [cycles, filter, search]
    );

    if (error) {
        return (
            <div className="p-8">
                <p className="text-red-600 font-medium">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Beautiful Header Banner */}
            <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-brand overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative px-8 py-12">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-start md:items-center justify-between">
                            <h1 className="text-4xl md:text-5xl font-poppins text-white font-bold tracking-tight">
                                PeerPulse Employee Dashboard
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
                                            <p className="text-xs text-blue-600 font-medium capitalize mt-1">{user?.role}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <button onClick={openChangePassword} className="flex items-center gap-2 w-full py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                                                <Key className="w-4 h-4" />
                                                Reset Password
                                            </button>
                                            <button onClick={() => logout()} className="flex items-center gap-2 w-full py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                                                <LogOut className="w-4 h-4" />
                                                Sign Out
                                            </button>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <p className="text-xl text-blue-100 font-light max-w-2xl">
                                Access your assigned review cycles and participate in performance evaluations across different organizations
                            </p>
                            <div className="flex flex-wrap gap-6 items-center text-blue-100">
                                <div className="flex items-center space-x-2">
                                    <Calendar className="w-5 h-5" />
                                    <span className="text-sm">Review Participation</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Users className="w-5 h-5" />
                                    <span className="text-sm">Peer Evaluation</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <BarChart3 className="w-5 h-5" />
                                    <span className="text-sm">Performance Reports</span>
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
                                    <p className="text-3xl font-bold text-gray-900">{total}</p>
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
                                    <p className="text-3xl font-bold text-gray-900">{activeCount}</p>
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
                                    <p className="text-3xl font-bold text-gray-900">{peerSelectionEnabledCount}</p>
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
                                    <p className="text-3xl font-bold text-gray-900">{reviewEnabledCount}</p>
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
                        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                            <div>
                                <h2 className="text-3xl font-poppins text-gray-900 font-semibold">Available Review Cycles</h2>
                                <p className="text-gray-600 mt-1">Enter review cycles to participate in peer-selection, fill review forms, and access performance reports</p>
                            </div>
                        </div>
                    </CardHeader>

                    {/* Filter & Search */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 lg:gap-4 mb-8 p-6 bg-gray-50/50 border border-gray-200/50">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-x-3 gap-y-1.5">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Users className="h-4 w-4 text-blue-600" />
                                </div>
                                <Label htmlFor="filter" className="whitespace-nowrap font-medium text-gray-700">Filter By Company:</Label>
                            </div>
                            <Select value={filter} onValueChange={setFilter}>
                                <SelectTrigger className="min-w-[150px]"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {companies.map(name => (
                                        <SelectItem key={name} value={name}>
                                            {name === "all" ? "All Companies" : name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-x-3 gap-y-1.5">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <Search className="w-4 h-4 text-green-600" />
                                </div>
                                <Label htmlFor="search" className="font-medium text-gray-700">Search:</Label>
                            </div>
                            <Input
                                id="search"
                                placeholder="Search cycle name..."
                                className="w-full lg:w-64"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>


                    <CardContent className="max-sm:px-6 p-8">

                        {/* Cycle Cards Grid */}
                        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 2xl:grid-cols-3">
                            {loading ? (
                                <ReviewCycleSkeletons />
                            ) : visibleCycles.length > 0 ? (
                                visibleCycles.map((c) => (
                                    <Card key={c.review_cycle_id} className="border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">

                                        <CardContent className="flex items-start space-x-3 py-4">
                                            {c.companyLogo && (
                                                <img
                                                    src={c.companyLogo}
                                                    alt={c.companyName}
                                                    className="w-12 h-12 rounded-full object-cover"
                                                />
                                            )}
                                            <div>
                                                <div className="text-sm font-medium">{c.companyName}</div>
                                                <div className="text-xs text-gray-500">{c.companyEmail}</div>
                                                <div className="text-xs text-gray-500">{c.companyMobile}</div>
                                                <div className="text-xs text-gray-500">{c.companyDescription}</div>
                                            </div>
                                        </CardContent>

                                        <CardHeader className="flex justify-between items-start border-b border-gray-100 py-0 pb-3">
                                            <h2 className="text-xl font-semibold text-gray-800">
                                                {c.name}
                                            </h2>
                                            <div className="flex flex-wrap gap-2">
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


                                        <CardContent className="grid grid-cols-2 gap-4 text-sm text-gray-700 pt-2">
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
                    </CardContent>
                </Card>
            </div>

            {/* Change Password */}
            <Dialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen}>
                <DialogTrigger asChild><div hidden /></DialogTrigger>
                <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Key className="w-5 h-5" />
                            Change Password
                        </DialogTitle>
                    </DialogHeader>

                    {/* Info Notice */}
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start gap-2">
                            <LogOut className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <p className="text-blue-800 text-sm">
                                <strong>Note:</strong> Changing your password will automatically log you out for security purposes. You'll need to sign in again with your new password.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={(e) => { e.preventDefault(); handleChangePassword(); }} className="space-y-4 mt-4">
                        {/* Current Password */}
                        <div className="relative">
                            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                Current Password
                            </label>
                            <input
                                id="currentPassword"
                                name="currentPassword"
                                type={showCurrentPassword ? "text" : "password"}
                                value={passwordFormData.currentPassword}
                                onChange={handlePasswordFormChange}
                                required
                                className="w-full pr-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(v => !v)}
                                className="absolute right-3 top-1/2 translate-y-1 text-gray-400 hover:text-gray-600"
                            >
                                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {/* New Password */}
                        <div className="relative">
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                New Password
                            </label>
                            <input
                                id="newPassword"
                                name="newPassword"
                                type={showNewPassword ? "text" : "password"}
                                value={passwordFormData.newPassword}
                                onChange={handlePasswordFormChange}
                                required
                                className="w-full pr-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(v => !v)}
                                className="absolute right-3 top-1/2 translate-y-1 text-gray-400 hover:text-gray-600"
                            >
                                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {/* Confirm New Password */}
                        <div className="relative">
                            <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm New Password
                            </label>
                            <input
                                id="confirmNewPassword"
                                name="confirmNewPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                value={passwordFormData.confirmNewPassword}
                                onChange={handlePasswordFormChange}
                                required
                                className="w-full pr-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(v => !v)}
                                className="absolute right-3 top-1/2 translate-y-1 text-gray-400 hover:text-gray-600"
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {/* Error Message */}
                        {passwordError && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-600 text-sm">{passwordError}</p>
                            </div>
                        )}

                        <DialogFooter className="mt-6 flex justify-end space-x-2">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setChangePasswordOpen(false)}
                                disabled={changingPassword}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={changingPassword}
                                className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50"
                            >
                                {changingPassword ? <ButtonLoader /> : "Change Password"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
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
