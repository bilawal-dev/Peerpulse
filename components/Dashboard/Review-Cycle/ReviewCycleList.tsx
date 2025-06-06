import React from "react";
import { format } from "date-fns";
import { Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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

export default function ReviewCycleList({ cycles, onEdit, onDelete }: ReviewCycleListProps) {
    if (cycles.length === 0) {
        return <p>No review cycles found. Create one to get started.</p>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cycles.map((cycle) => (
                <Card key={cycle.id} className="flex flex-col justify-between">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">{cycle.label}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            {format(new Date(cycle.startDate), "yyyy-MM-dd")}
                            {" → "}
                            {cycle.endDate ? format(new Date(cycle.endDate), "yyyy-MM-dd") : "-"}
                        </p>
                    </CardHeader>

                    <CardContent className="space-y-2 text-sm">
                        <div>
                            <strong>Max Peers Select:</strong>{" "}
                            {cycle.maxPeersSelect ?? "-"}
                        </div>
                        <div>
                            <strong>Required Reviewers:</strong>{" "}
                            {cycle.requiredPeerReviewers ?? "-"}
                        </div>

                        <div className="mt-4 flex justify-end space-x-2">
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
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
