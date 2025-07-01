"use client";

import React, { useState, useEffect } from "react";
import { DialogContent, DialogHeader, DialogTitle, DialogFooter, } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";
import ButtonLoader from "@/components/Common/ButtonLoader";

export type EditCycleValues = {
    label: string;
    startDate: Date;
    endDate: Date | undefined;
    maxPeers: number | undefined;
    requiredReviewers: number | undefined;
    isPeerSelectionEnabled: boolean;
    isReviewEnabled: boolean;
};


type Props = {
    initial: EditCycleValues;
    onCancel: () => void;
    onSubmit: (vals: EditCycleValues) => void;
};

export default function EditReviewCycleSidebar({ initial, onCancel, onSubmit, }: Props) {
    const [label, setLabel] = useState(initial.label);
    const [startDate, setStartDate] = useState(initial.startDate);
    const [endDate, setEndDate] = useState<Date | undefined>(initial.endDate);
    const [maxPeers, setMaxPeers] = useState<number | undefined>(initial.maxPeers);
    const [requiredReviewers, setRequiredReviewers] = useState<number | undefined>(initial.requiredReviewers);
    const [peerEnabled, setPeerEnabled] = useState(initial.isPeerSelectionEnabled);
    const [reviewEnabled, setReviewEnabled] = useState(initial.isReviewEnabled);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const disabledSave = !label.trim();

    useEffect(() => {
        setLabel(initial.label);
        setStartDate(initial.startDate);
        setEndDate(initial.endDate);
        setMaxPeers(initial.maxPeers);
        setRequiredReviewers(initial.requiredReviewers);
        setPeerEnabled(initial.isPeerSelectionEnabled);
        setReviewEnabled(initial.isReviewEnabled);
    }, [initial]);

    function handleSave() {
        setIsSubmitting(true);
        try {
            onSubmit({
                label: label.trim(),
                startDate,
                endDate,
                maxPeers,
                requiredReviewers,
                isPeerSelectionEnabled: peerEnabled,
                isReviewEnabled: reviewEnabled,
            })
        }
        catch {
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <DialogContent className="fixed right-0 top-0 h-full w-full max-w-md p-6 bg-white shadow-lg overflow-auto animate-in duration-300 slide-in-from-right-1/2">
            <DialogHeader>
                <DialogTitle>Edit Review Cycle</DialogTitle>
            </DialogHeader>

            <div className="space-y-6 mt-4">
                <div className="space-y-1">
                    <Label htmlFor="edit-label">Review Cycle Name</Label>
                    <Input
                        id="edit-label"
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
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
                                    onSelect={(d) => d && setStartDate(d)}
                                    disabled={(date) => date < new Date()}
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
                                    onSelect={(d) => setEndDate(d || undefined)}
                                    disabled={(date) => date < startDate}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                <div className="space-y-1">
                    <Label htmlFor="edit-max-peers">Max Peers Select</Label>
                    <Input
                        id="edit-max-peers"
                        type="number"
                        value={maxPeers ?? ""}
                        onChange={(e) =>
                            setMaxPeers(
                                e.target.value ? Number(e.target.value) : undefined
                            )
                        }
                    />
                </div>

                <div className="space-y-1">
                    <Label htmlFor="edit-required-reviewers">Required Reviewers</Label>
                    <Input
                        id="edit-required-reviewers"
                        type="number"
                        value={requiredReviewers ?? ""}
                        onChange={(e) =>
                            setRequiredReviewers(
                                e.target.value ? Number(e.target.value) : undefined
                            )
                        }
                    />
                </div>

                <div className="flex items-center justify-between">
                    <Label>Peer Selection</Label>
                    <Switch
                        checked={peerEnabled}
                        onCheckedChange={(v) => setPeerEnabled(v)}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <Label>Peer Review</Label>
                    <Switch
                        checked={reviewEnabled}
                        onCheckedChange={(v) => setReviewEnabled(v)}
                    />
                </div>
            </div>

            <DialogFooter className="mt-6 flex justify-end space-x-2">
                <Button variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button
                    disabled={disabledSave || isSubmitting}
                    onClick={handleSave}
                    className="px-8"
                >
                    {isSubmitting ? <ButtonLoader /> : "Save"}
                </Button>
            </DialogFooter>
        </DialogContent>
    );
}
