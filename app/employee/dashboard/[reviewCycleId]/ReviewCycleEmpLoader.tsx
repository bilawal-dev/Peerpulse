"use client";

import PreLoader from "@/components/Common/PreLoader";
import { useReviewCycleEmp } from "@/context/EmployeeCycleContext";

export default function ReviewCycleEmpLoader({ children }: { children: React.ReactNode }) {

    const { reviewCycleEmpLoading } = useReviewCycleEmp()

    if (reviewCycleEmpLoading) return <PreLoader />

    return (
        <>
            {children}
        </>
    );
}