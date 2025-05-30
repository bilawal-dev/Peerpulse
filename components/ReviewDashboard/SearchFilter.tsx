"use client";

import React from "react";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

interface Props {
    search: string;
    setSearch: (val: string) => void;
    statusFilter: "All" | "Completed" | "Pending";
    setStatusFilter: (val: "All" | "Completed" | "Pending") => void;
}

export default function SearchFilter({ search, setSearch, statusFilter, setStatusFilter }: Props) {

    return (
        <div className="flex flex-col md:flex-row gap-4 mb-8">
            <input
                type="text"
                placeholder="Search by name or department..."
                className="flex-1 px-4 py-3 h-12 border border-gray-300 rounded-lg focus:outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <Select
                value={statusFilter}
                onValueChange={(val) => setStatusFilter(val as any)}
            >
                <SelectTrigger className="w-[180px] h-12 px-4 border border-gray-300 rounded-lg focus:outline-none">
                    <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="All">All Status</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}