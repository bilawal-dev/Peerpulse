// components/Dashboard/Review-Cycle/AddReviewCycleSidebar.tsx
"use client";

import React, { useState } from "react";
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { CardContent, } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { format } from "date-fns";

export type NewCycleValues = {
    label: string;
    startDate: Date;
    endDate: Date | undefined;
    maxPeers: number | undefined;
    requiredReviewers: number | undefined;
};

type Props = {
    onCancel: () => void;
    onSubmit: (vals: NewCycleValues) => Promise<boolean>;
};

export default function AddReviewCycleSidebar({ onCancel, onSubmit }: Props) {
    const [label, setLabel] = useState("");
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const [maxPeers, setMaxPeers] = useState<number | undefined>(undefined);
    const [requiredReviewers, setRequiredReviewers] = useState<number | undefined>(undefined);

    const disabledSave = !label.trim();

    return (
        <DialogContent className="fixed right-0 top-0 h-full w-full max-w-md p-6 bg-white shadow-lg overflow-auto animate-in duration-300 slide-in-from-right-1/2">
            <DialogHeader>
                <DialogTitle>Create New Review Cycle</DialogTitle>
            </DialogHeader>

            <CardContent className="space-y-6 mt-4 px-0">
                <div className="space-y-1">
                    <Label htmlFor="new-label">Review Cycle Name</Label>
                    <Input
                        id="new-label"
                        value={label}
                        onChange={e => setLabel(e.target.value)}
                        placeholder="e.g. Q3 2025"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <Label>Start Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-start">
                                    {format(startDate, "yyyy-MM-dd")}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-0 w-auto">
                                <Calendar
                                    mode="single"
                                    selected={startDate}
                                    onSelect={d => d && setStartDate(d)}
                                    disabled={date => date < new Date()}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div>
                        <Label>End Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-start">
                                    {endDate ? format(endDate, "yyyy-MM-dd") : "Select date"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-0 w-auto">
                                <Calendar
                                    mode="single"
                                    selected={endDate}
                                    onSelect={d => setEndDate(d || undefined)}
                                    disabled={date => date < startDate}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                <div className="space-y-1">
                    <Label htmlFor="max-peers">Max Peers Select</Label>
                    <Input
                        id="max-peers"
                        type="number"
                        value={maxPeers ?? ""}
                        onChange={e =>
                            setMaxPeers(e.target.value ? Number(e.target.value) : undefined)
                        }
                        placeholder="leave blank for no limit"
                    />
                </div>

                <div className="space-y-1">
                    <Label htmlFor="req-reviewers">Required Reviewers</Label>
                    <Input
                        id="req-reviewers"
                        type="number"
                        value={requiredReviewers ?? ""}
                        onChange={e =>
                            setRequiredReviewers(e.target.value ? Number(e.target.value) : undefined)
                        }
                        placeholder="e.g. 3"
                    />
                </div>
            </CardContent>

            <DialogFooter className="mt-6 flex justify-end space-x-2">
                <Button variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button disabled={disabledSave} onClick={async () => {
                    const isSuccess = await onSubmit({ label: label.trim(), startDate, endDate, maxPeers, requiredReviewers });

                    if (isSuccess) {
                        setLabel('');
                        setStartDate(new Date());
                        setEndDate(undefined);
                        setMaxPeers(undefined);
                        setRequiredReviewers(undefined);
                    }
                }}>
                    Save
                </Button>
            </DialogFooter>
        </DialogContent>
    );
}
