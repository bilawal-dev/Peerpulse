// File: app/employee/dashboard/[reviewCycleId]/EmployeeCycleContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export interface ReviewCycleEmp {
    employee_id: number;
    name: string;
    email: string;
    department: string;
    manager: string;
    role: 'employee' | 'manager';
    isManager: boolean;
    status: string;
    is_compiled_review_access: boolean,
    is_manager_team_view_access: boolean,
    review_cycle_id: number;
    review_cycle_name: string;
    review_cycle_start_date: string;
    review_cycle_end_date: string;
    company_id: number;
    company_name: string;
}

interface ReviewCycleEmpContextType {
    reviewCycleEmp: ReviewCycleEmp | null;
    reviewCycleEmpLoading: boolean;
}

const EmployeeCycleContext = createContext<ReviewCycleEmpContextType>({
    reviewCycleEmp: null,
    reviewCycleEmpLoading: true,
});

export function useReviewCycleEmp() {
    return useContext(EmployeeCycleContext);
}

export function EmployeeCycleProvider({ children }: { children: ReactNode }) {
    const { reviewCycleId } = useParams();
    const router = useRouter();
    const [reviewCycleEmp, setReviewCycleEmp] = useState<ReviewCycleEmp | null>(null);
    const [reviewCycleEmpLoading, setReviewCycleEmpLoading] = useState(true);

    useEffect(() => {
        async function fetchStatus() {
            try {
                const token = localStorage.getItem("elevu_auth");
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/employee/get-employee-status-in-review-cycle`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ review_cycle_id: Number(reviewCycleId) }),
                });
                const json = await res.json();
                console.log("Employee Cycle Status:", json);
                if (!json.success) {
                    throw new Error(json.message || "Could not fetch status");
                }
                setReviewCycleEmp(json.data);
            } catch (err: any) {
                console.error(err);
                toast.error(err.message || "Error loading cycle status");
                router.push("/employee/dashboard");
            } finally {
                setReviewCycleEmpLoading(false);
            }
        }
        fetchStatus();
    }, [reviewCycleId, router]);

    return (
        <EmployeeCycleContext.Provider value={{ reviewCycleEmp, reviewCycleEmpLoading }}>
            {children}
        </EmployeeCycleContext.Provider>
    );
}
