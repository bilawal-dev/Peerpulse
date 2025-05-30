// File: src/components/reviews/ReviewsDashboardClient.tsx
"use client";

import React, { useState, useMemo } from "react";
import ActionsBar from "./ActionsBar";
import DepartmentSection from "./DepartmentSection";
import SearchFilter from "./SearchFilter";
import Image from "next/image";

interface EmployeeReview {
    name: string;
    manager: string;
    status: "Completed" | "Pending";
}

interface DepartmentReviews {
    department: string;
    reviews: EmployeeReview[];
}

const DATA: DepartmentReviews[] = [
    {
        department: "Business Operations",
        reviews: [
            { name: "Andrew Campbell", manager: "Cassidy Judd", status: "Completed" },
            { name: "Brandon Tuttle", manager: "RJ Schultz", status: "Completed" },
            { name: "Courtney Skinner", manager: "Andrew Campbell", status: "Completed" },
            { name: "Joe Wilkinson", manager: "RJ Schultz", status: "Completed" },
            { name: "Neil Johnson", manager: "RJ Schultz", status: "Completed" },
            { name: "Sam Rivard", manager: "RJ Schultz", status: "Completed" },
        ],
    },
    {
        department: "Data and Finance",
        reviews: [
            { name: "Aubrey Bryant", manager: "Josh Manwaring", status: "Completed" },
            { name: "Cassidy Judd", manager: "RJ Schultz", status: "Completed" },
            { name: "Hemang Savla", manager: "Cassidy Judd", status: "Completed" },
            { name: "Josh Manwaring", manager: "RJ Schultz", status: "Completed" },
        ],
    },
    {
        department: "Engineering",
        reviews: [
            { name: "Atul Tamgwe", manager: "Spencer Cook", status: "Completed" },
            { name: "Jared Leishman", manager: "Spencer Cook", status: "Completed" },
            { name: "Liang Zhou", manager: "Spencer Cook", status: "Completed" },
            { name: "Maggie Cong", manager: "Spencer Cook", status: "Completed" },
            { name: "Patrick Leishman", manager: "Spencer Cook", status: "Completed" },
            { name: "Prem Kumar", manager: "Spencer Cook", status: "Completed" },
            { name: "Spencer Cook", manager: "Cedric Bernard", status: "Completed" },
            { name: "Taras Hrinycnych", manager: "Spencer Cook", status: "Completed" },
        ],
    },
    {
        department: "Executive",
        reviews: [
            { name: "Cedric Bernard", manager: "Unknown Manager", status: "Completed" },
            { name: "RJ Schultz", manager: "Cedric Bernard", status: "Completed" },
        ],
    },
    {
        department: "Human Resources",
        reviews: [{ name: "Aspen Egan", manager: "RJ Schultz", status: "Completed" }],
    },
    {
        department: "Sales",
        reviews: [
            { name: "Aaron Kim", manager: "Christopher Farnkopf", status: "Completed" },
            { name: "Bill Monan", manager: "Christopher Farnkopf", status: "Completed" },
            { name: "Christopher Farnkopf", manager: "Cedric Bernard", status: "Completed" },
            { name: "Christopher Trumble", manager: "Andrew Campbell", status: "Completed" },
            { name: "Edward Andrews", manager: "Christopher Farnkopf", status: "Completed" },
            { name: "John Pettit", manager: "Christopher Farnkopf", status: "Completed" },
            { name: "Lex Faitanow", manager: "Christopher Farnkopf", status: "Completed" },
            { name: "Mark Watson", manager: "Christopher Farnkopf", status: "Completed" },
            { name: "Michael Eppich", manager: "RJ Schultz", status: "Completed" },
            { name: "Taylor Lytle", manager: "Christopher Farnkopf", status: "Completed" },
            { name: "Varsha Saravana", manager: "Christopher Farnkopf", status: "Completed" },
        ],
    },
    {
        department: "Supply",
        reviews: [
            { name: "Arnaud Becquart", manager: "Chad Smith", status: "Completed" },
            { name: "Chad Smith", manager: "Cedric Bernard", status: "Completed" },
            { name: "Chayla Leishman", manager: "Chad Smith", status: "Completed" },
            { name: "Jacob Bradley", manager: "Chad Smith", status: "Completed" },
            { name: "Rachel Breton", manager: "Chad Smith", status: "Completed" },
        ],
    },
];

export default function ReviewsDashboardClient() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<"All" | "Completed" | "Pending">("All");

    const filtered = useMemo(() => {
        const term = search.toLowerCase();
        return DATA.map((dept) => {
            const deptMatches = dept.department.toLowerCase().includes(term);
            const reviews = dept.reviews.filter((r) => {
                const nameMatches = r.name.toLowerCase().includes(term);
                const statusMatches = statusFilter === "All" || r.status === statusFilter;
                return (deptMatches || nameMatches) && statusMatches;
            });
            return { ...dept, reviews };
        }).filter((d) => d.reviews.length > 0);
    }, [search, statusFilter]);

    return (
        <div className="bg-gray-50 min-h-screen p-8 max-sm:px-0">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <Image
                        src="/assets/blip-logo.webp"
                        alt="Blip Logo"
                        className="mx-auto mb-8"
                        width={192}
                        height={48}
                    />
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                        Performance Reviews Dashboard
                    </h1>
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
                {filtered.map((dept) => (
                    <DepartmentSection key={dept.department} {...dept} />
                ))}
            </div>
        </div>
    );
}
