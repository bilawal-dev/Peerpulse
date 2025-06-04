// components/Dashboard/Settings/ReviewProcessSettings.tsx
"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Settings2, Calendar as CalendarIcon } from "lucide-react";

export type ReviewCycleFormValues = {
    label: string;
    startDate: Date;
    endDate: Date | undefined;
    maxPeersSelect: number | undefined;
    requiredPeerReviewers: number | undefined;
};

type Props = {
    initialValues?: ReviewCycleFormValues;
    onCancel: () => void;
    onSubmit: (values: ReviewCycleFormValues) => void;
};

export default function ReviewProcessSettings({ initialValues, onCancel, onSubmit, }: Props) {
    const [label, setLabel] = useState<string>(initialValues?.label || "");
    const [startDate, setStartDate] = useState<Date>(initialValues?.startDate || new Date());
    const [endDate, setEndDate] = useState<Date | undefined>(initialValues?.endDate);
    const [maxPeersSelect, setMaxPeersSelect] = useState<number | undefined>(initialValues?.maxPeersSelect);
    const [requiredPeerReviewers, setRequiredPeerReviewers,] = useState<number | undefined>(initialValues?.requiredPeerReviewers);

    useEffect(() => {
        if (initialValues) {
            setLabel(initialValues.label);
            setStartDate(initialValues.startDate);
            setEndDate(initialValues.endDate);
            setMaxPeersSelect(initialValues.maxPeersSelect);
            setRequiredPeerReviewers(initialValues.requiredPeerReviewers);
        }
    }, [initialValues]);

    const isSaveDisabled = !label.trim() || !startDate;

    const handleSave = () => {
        const payload: ReviewCycleFormValues = {
            label: label.trim(),
            startDate,
            endDate,
            maxPeersSelect,
            requiredPeerReviewers,
        };
        onSubmit(payload);
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center space-x-2">
                    <Settings2 className="h-5 w-5 text-gray-600" />
                    <CardTitle>Review Process Settings</CardTitle>
                </div>
                <CardDescription>
                    Configure your review cycle dates and peer-selection limits.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                        <div>
                            <Label htmlFor="review-period-label">Review Period Label</Label>
                            <Input
                                id="review-period-label"
                                value={label}
                                onChange={(e) => setLabel(e.target.value)}
                                placeholder="e.g., Q3 & Q4 2024"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="max-peers-select">
                                Max # of Peers Each Employee Can Select
                            </Label>
                            <Input
                                id="max-peers-select"
                                type="number"
                                value={maxPeersSelect ?? ""}
                                onChange={(e) =>
                                    setMaxPeersSelect(
                                        e.target.value === "" ? undefined : Number(e.target.value)
                                    )
                                }
                                placeholder="Leave empty for no limit"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="required-peer-reviewers">
                                Required Peer Reviewers
                            </Label>
                            <Input
                                id="required-peer-reviewers"
                                type="number"
                                value={requiredPeerReviewers ?? ""}
                                onChange={(e) =>
                                    setRequiredPeerReviewers(
                                        e.target.value === "" ? undefined : Number(e.target.value)
                                    )
                                }
                                placeholder="e.g., 3"
                                className="mt-1"
                            />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="review-start-date">Start Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            id="review-start-date"
                                            variant="outline"
                                            className="mt-1 w-full justify-start"
                                        >
                                            {format(startDate, "yyyy-MM-dd")}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={startDate}
                                            onSelect={(date) => {
                                                if (date) {
                                                    setStartDate(date);
                                                    if (endDate && date > endDate) {
                                                        setEndDate(undefined);
                                                    }
                                                }
                                            }}
                                            className="text-primary"
                                            disabled={(date) => date < new Date()}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div>
                                <Label htmlFor="review-end-date">End Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            id="review-end-date"
                                            variant="outline"
                                            className="mt-1 w-full justify-start"
                                        >
                                            {endDate
                                                ? format(endDate, "yyyy-MM-dd")
                                                : "Select date"}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={endDate}
                                            onSelect={(date) => setEndDate(date || undefined)}
                                            disabled={(date) =>
                                                startDate ? date < startDate : date < new Date()
                                            }
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end space-x-4">
                    <Button variant="ghost" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSaveDisabled}
                        variant='default'
                    >
                        Save
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
