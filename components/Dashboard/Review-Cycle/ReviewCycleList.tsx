import React from "react";
import { format } from "date-fns";
import { Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ReviewCycle } from "@/types/ReviewCycle";
import Link from "next/link";


interface ReviewCycleListProps {
    cycles: ReviewCycle[];
    onEdit: (cycle: ReviewCycle) => void;
    onDelete: (id: number) => void;
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
                <Card key={cycle.review_cycle_id} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="px-4 pt-4 pb-2">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-lg font-semibold">{cycle.name}</CardTitle>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Review Cycle ID: {cycle.review_cycle_id}</p>
                    </CardHeader>

                    <CardContent className="px-4 pt-2 pb-4 flex flex-col flex-1 space-y-4">
                        <div className="text-sm text-gray-500">
                            {format(new Date(cycle.start_date), "yyyy-MM-dd")} →{" "}
                            {cycle.end_date ? format(new Date(cycle.end_date), "yyyy-MM-dd") : "—"}
                        </div>
                        {/* Status Section */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">Status</h3>
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                    <span>Peer Selection</span>
                                    <span className={cycle.is_peer_selection_enabled ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                                        {cycle.is_peer_selection_enabled ? "Enabled" : "Disabled"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Peer Review</span>
                                    <span className={cycle.is_review_enabled ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                                        {cycle.is_review_enabled ? "Enabled" : "Disabled"}
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
                                    <span>{cycle.max_peer_selection ?? "—"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Required Reviewers</span>
                                    <span>{cycle.max_reviews_allowed ?? "—"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Timestamps */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">Timestamps</h3>
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                    <span>Created at</span>
                                    <span>
                                        {format(new Date(cycle.created_at), "yyyy-MM-dd HH:mm")}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Updated at</span>
                                    <span>
                                        {format(new Date(cycle.updated_at), "yyyy-MM-dd HH:mm")}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex pt-4 justify-between items-center">
                            <Link href={`/admin/dashboard/${cycle.review_cycle_id}/`}>
                                <Button>Enter Review Cycle</Button>
                            </Link>

                            <div className="border-t-2 border-gray-100">
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
                                    onClick={() => onDelete(cycle.review_cycle_id)}
                                    aria-label="Delete cycle"
                                >
                                    <Trash2 className="h-5 w-5 text-red-500" />
                                </Button>
                            </div>
                        </div>

                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
