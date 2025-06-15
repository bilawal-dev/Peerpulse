import React from "react";
import { format } from "date-fns";
import { Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export type ReviewCycle = {
    id: string;
    label: string;
    startDate: string;
    endDate: string | null;
    maxPeersSelect: number | null;
    requiredPeerReviewers: number | null;
    isPeerSelectionEnabled: boolean;
    isReviewEnabled: boolean;
};

interface ReviewCycleListProps {
    cycles: ReviewCycle[];
    onEdit: (cycle: ReviewCycle) => void;
    onDelete: (id: string) => void;
}

export default function ReviewCycleList({ cycles, onEdit, onDelete, }: ReviewCycleListProps) {
    if (cycles.length === 0) {
        return (
            <p className="text-center text-gray-600">
                No review cycles found. Create one to get started.
            </p>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cycles.map((cycle) => (
                <Card key={cycle.id} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="px-4 pt-4 pb-2">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-lg font-semibold">{cycle.label}</CardTitle>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Review Cycle ID: {cycle.id}</p>
                    </CardHeader>

                    <CardContent className="px-4 pt-2 pb-4 flex flex-col flex-1 space-y-4">
                        <div className="text-sm text-gray-500">
                            {format(new Date(cycle.startDate), "yyyy-MM-dd")} →{" "}
                            {cycle.endDate ? format(new Date(cycle.endDate), "yyyy-MM-dd") : "—"}
                        </div>
                        {/* Status Section */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">Status</h3>
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                    <span>Peer Selection</span>
                                    <span className={cycle.isPeerSelectionEnabled ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                                        {cycle.isPeerSelectionEnabled ? "Enabled" : "Disabled"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Peer Review</span>
                                    <span className={cycle.isReviewEnabled ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                                        {cycle.isReviewEnabled ? "Enabled" : "Disabled"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Settings Section */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">Settings</h3>
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                    <span>Max Peers Select</span>
                                    <span>{cycle.maxPeersSelect ?? "—"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Required Reviewers</span>
                                    <span>{cycle.requiredPeerReviewers ?? "—"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-auto flex justify-end space-x-2 pt-4 border-t-2 border-gray-100">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onEdit(cycle)}
                                aria-label="Edit cycle"
                            >
                                <Edit2 className="h-5 w-5 text-blue-500" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onDelete(cycle.id)}
                                aria-label="Delete cycle"
                            >
                                <Trash2 className="h-5 w-5 text-red-500" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
