// File: components/reviews/ReviewsDashboardClient.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import ActionsBar from "./ActionsBar";
import DepartmentSection from "./DepartmentSection";
import SearchFilter from "./SearchFilter";
import Image from "next/image";
import toast from "react-hot-toast";

interface Employee {
    employee_id: number;
    name: string;
    manager: string | undefined;
    is_review_completed: boolean;
}
interface RawDept {
    department: string;
    employees: Employee[];
}
interface ApiResponse {
    success: boolean;
    data: {
        employees_data: RawDept[];
        company: {
            company_logo: string;
            name: string;
        }
    };
    message: string;
}

interface Props {
    reviewCycleId: number;
}

// reuse the same Review type as DepartmentSection
type Review = {
    name: string;
    manager: string;
    status: "Completed" | "Pending";
};

export default function ReviewsDashboardClient({ reviewCycleId }: Props) {
    const [departments, setDepartments] = useState<RawDept[]>([]);
    const [companyLogo, setCompanyLogo] = useState<string | null>(null);
    const [companyName, setCompanyName] = useState<string>("");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<"All" | "Completed" | "Pending">("All");
    const [loading, setLoading] = useState(true);

    // fetch compiled data
    useEffect(() => {
        async function load() {
            setLoading(true);
            try {
                const token = localStorage.getItem("elevu_auth");
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/company/get-compile-review-data`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ review_cycle_id: reviewCycleId }),
                });
                const json: ApiResponse = await res.json();
                if (!json.success) throw new Error(json.message || "Failed to load compiled reviews");
                setDepartments(json.data.employees_data);
                setCompanyLogo(json.data.company.company_logo);
                setCompanyName(json.data.company.name);
            } catch (err: any) {
                console.error(err);
                toast.error(err.message || "Error fetching compiled reviews");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [reviewCycleId]);

    // transform & filter
    const filtered = useMemo(() => {
        const term = search.toLowerCase().trim();

        return departments.map((d) => {
            // first, map raw employees into the Review shape
            const mapped: Review[] = d.employees.map((e) => ({
                name: e.name,
                manager: e.manager || '',
                status: e.is_review_completed ? "Completed" : "Pending",
            }));

            // then filter by search & status
            const reviews = mapped.filter((r) => {
                const matchesSearch =
                    term === "" ||
                    r.name.toLowerCase().includes(term) ||
                    d.department.toLowerCase().includes(term);
                const matchesStatus = statusFilter === "All" || r.status === statusFilter;
                return matchesSearch && matchesStatus;
            });

            return { department: d.department, reviews };
        }).filter((d) => d.reviews.length > 0);
    }, [departments, search, statusFilter]);

    return (
        <div className="bg-gray-50 min-h-screen p-8 pt-0 max-sm:px-0">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    {companyLogo ? (
                        <Image
                            src={companyLogo}
                            alt="Company Logo"
                            className="mx-auto mb-2 mix-blend-multiply"
                            width={192}
                            height={48}
                        />
                    ) : null}
                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2">
                        {companyName}
                    </h1>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                        Performance Reviews Dashboard
                    </h2>
                </div>

                {/* Search + Filter */}
                <SearchFilter
                    search={search}
                    setSearch={setSearch}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                />

                {/* Actions */}
                <ActionsBar />

                {/* Departments */}
                {loading ? null : filtered.map((dept) => (
                    <DepartmentSection
                        key={dept.department}
                        department={dept.department}
                        reviews={dept.reviews}
                        reviewCycleId={reviewCycleId}
                    />
                ))}
            </div>
        </div>
    );
}
