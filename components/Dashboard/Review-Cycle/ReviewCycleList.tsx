// components/Dashboard/Settings/ReviewCycleList.tsx
import React from "react";
import { format } from "date-fns";
import { Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type ReviewCycle = {
    id: string;
    label: string;
    startDate: string;
    endDate: string | null;
    maxPeersSelect: number | null;
    requiredPeerReviewers: number | null;
};

interface ReviewCycleListProps {
    cycles: ReviewCycle[];
    onEdit: (cycle: ReviewCycle) => void;
    onDelete: (id: string) => void;
}

export default function ReviewCycleList({ cycles, onEdit, onDelete, }: ReviewCycleListProps) {
    if (cycles.length === 0) {
        return <p>No review cycles found. Create one to get started.</p>;
    }

    return (
        <table className="min-w-full border-collapse">
            <thead>
                <tr className="bg-gray-10 text-left">
                    <th className="px-4 py-2 border">Label</th>
                    <th className="px-4 py-2 border">Start Date</th>
                    <th className="px-4 py-2 border">End Date</th>
                    <th className="px-4 py-2 border">Max Peers Select</th>
                    <th className="px-4 py-2 border">Required Reviewers</th>
                    <th className="px-4 py-2 border text-right">Actions</th>
                </tr>
            </thead>
            <tbody>
                {cycles.map((cycle) => (
                    <tr key={cycle.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border">{cycle.label}</td>
                        <td className="px-4 py-2 border">
                            {format(new Date(cycle.startDate), "yyyy-MM-dd")}
                        </td>
                        <td className="px-4 py-2 border">
                            {cycle.endDate
                                ? format(new Date(cycle.endDate), "yyyy-MM-dd")
                                : "-"}
                        </td>
                        <td className="px-4 py-2 border">
                            {cycle.maxPeersSelect ?? "-"}
                        </td>
                        <td className="px-4 py-2 border">
                            {cycle.requiredPeerReviewers ?? "-"}
                        </td>
                        <td className="px-4 py-2 border text-right">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onEdit(cycle)}
                            >
                                <Edit2 className="h-4 w-4 text-blue-500" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onDelete(cycle.id)}
                            >
                                <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
