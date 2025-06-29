"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useReviewCycleEmp } from "@/context/EmployeeCycleContext";

export default function ManagerViewLayout({ children }: { children: React.ReactNode }) {

    const { reviewCycleEmp, reviewCycleEmpLoading } = useReviewCycleEmp();

    const { reviewCycleId } = useParams();

    const router = useRouter();

    // * REDIRECT TO EMPLOYEE DASHBOARD IF REVIEW_CYCLE_EMPLOYEE IS NULL OR TO  EMPLOYEE_REVIEW_CYCLE DASHBOARD IF NOT AN MANAGER OR MANAGER VIEW ISN'T ENABLED BY COMPANY
    useEffect(() => {
        if (!reviewCycleEmpLoading) {
            if (!reviewCycleEmp) {
                router.push("/employee/dashboard");
            } else if (reviewCycleEmp.role !== "manager") {
                router.push(`/employee/dashboard/${reviewCycleId}`);
            }
        }
    }, [reviewCycleEmp, reviewCycleEmpLoading, router]);


    // Prevent rendering layout if reviewCycleEmp is not authenticated (Avoids flickering)
    if (!reviewCycleEmp || reviewCycleEmp.role !== "manager") return null;

    return (
        <>
            {children}
        </>
    );
}
