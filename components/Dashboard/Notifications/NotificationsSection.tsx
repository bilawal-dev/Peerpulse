"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CalendarClock } from "lucide-react";
import toast from "react-hot-toast";
import ButtonLoader from "@/components/Common/ButtonLoader";
import { useParams } from "next/navigation";
import { ReviewCycle } from "@/types/ReviewCycle";

const notifSections = [
    {
        key: "peer_selection" as const,
        title: "Peer Selection Notifications",
        reminders: [
            { key: "initial" as const, label: "Initial Reminder" },
            { key: "first" as const, label: "First Reminder" },
            { key: "second" as const, label: "Second Reminder" },
            { key: "final" as const, label: "Final Reminder" },
        ],
    },
    {
        key: "review" as const,
        title: "Review Submission Notifications",
        reminders: [
            { key: "initial" as const, label: "Initial Reminder" },
            { key: "first" as const, label: "First Reminder" },
            { key: "second" as const, label: "Second Reminder" },
            { key: "final" as const, label: "Final Reminder" },
        ],
    },
];

type SectionKey = typeof notifSections[number]["key"];
type DateField = "initial" | "first" | "second" | "final";

type ReminderData = {
    email_reminder_id: number;
    scheduled_date: string;
    reminder_type: SectionKey;
};

export default function NotificationSection() {
    // grab the ID straight from the URL
    const { reviewCycleId } = useParams();

    const [cycleDetails, setCycleDetails] = useState<{ id: number | null, label: string; startDate: string; endDate: string | null; }>({ id: null, label: "", startDate: "", endDate: null });
    const [isLoadingCycle, setIsLoadingCycle] = useState(true);

    const [isAdding, setIsAdding] = useState(false);

    const [dates, setDates] = useState<Record<SectionKey, Record<DateField, string>>>({
        peer_selection: { initial: "", first: "", second: "", final: "" },
        review: { initial: "", first: "", second: "", final: "" },
    });

    const [reminderIds, setReminderIds] = useState<Record<SectionKey, Record<DateField, number | null>>>({
        peer_selection: { initial: null, first: null, second: null, final: null },
        review: { initial: null, first: null, second: null, final: null },
    });

    const hasReminders = Object.values(reminderIds).some(section => Object.values(section).some(id => id !== null));

    const formatForInput = (iso: string) => new Date(iso).toISOString().slice(0, 16);

    // instead: fetch *one* cycle by ID
    useEffect(() => {
        if (!reviewCycleId) return;
        setIsLoadingCycle(true);
        (async () => {
            try {
                const token = localStorage.getItem("elevu_auth");
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/company/get-review-cycle-by-id`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ review_cycle_id: Number(reviewCycleId) }),
                });
                if (!res.ok) throw new Error("Failed to fetch cycle");
                const json = await res.json() as { success: boolean; data: ReviewCycle; message: string };
                const d = json.data;
                setCycleDetails({
                    id: d.review_cycle_id,
                    label: d.name,
                    startDate: d.start_date,
                    endDate: d.end_date,
                });
            } catch (err: any) {
                console.error(err);
                toast.error(err.message || "Could not load cycle");
            } finally {
                setIsLoadingCycle(false);
            }
        })();
    }, [reviewCycleId]);

    // Extracted: load reminders for a given cycle
    const loadReminders = async (reviewCycleId: number) => {
        try {
            const token = localStorage.getItem("elevu_auth");
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/company/get-all-reminders-by-review-cycle`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ review_cycle_id: reviewCycleId }),
            });
            if (!res.ok) throw new Error("Failed to fetch reminders");
            const json = await res.json();
            const data: ReminderData[] = json.data;

            const newDates: typeof dates = {
                peer_selection: { initial: "", first: "", second: "", final: "" },
                review: { initial: "", first: "", second: "", final: "" },
            };
            const newIds: typeof reminderIds = {
                peer_selection: { initial: null, first: null, second: null, final: null },
                review: { initial: null, first: null, second: null, final: null },
            };

            (["peer_selection", "review"] as SectionKey[]).forEach(sectionKey => {
                const group = data
                    .filter(r => r.reminder_type === sectionKey)
                    .sort((a, b) => new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime());

                group.forEach((rem, idx) => {
                    const field = notifSections.find(s => s.key === sectionKey)!.reminders[idx]?.key;
                    if (field) {
                        newDates[sectionKey][field] = formatForInput(rem.scheduled_date);
                        newIds[sectionKey][field] = rem.email_reminder_id;
                    }
                });
            });

            setDates(newDates);
            setReminderIds(newIds);
        } catch (err) {
            console.error(err);
        }
    };

    // Whenever selectedCycle changes, reload its reminders
    useEffect(() => {
        if (reviewCycleId) {
            loadReminders(Number(reviewCycleId));
        }
    }, [reviewCycleId]);

    const handleDateChange = async (section: SectionKey, field: DateField, value: string) => {
        setDates(prev => ({
            ...prev,
            [section]: { ...prev[section], [field]: value },
        }));

        const rid = reminderIds[section][field];
        if (rid) {
            try {
                const token = localStorage.getItem("elevu_auth");
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/company/update-reminder`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify({
                        reminder_id: rid,
                        scheduled_date: value,
                        reminder_type: section,
                    }),
                });
                if (!res.ok) throw new Error("Failed to update reminder");
                toast.success(`${section} • ${field} updated`);
            } catch (err: any) {
                console.error(err);
                toast.error(err.message || "Update failed");
            }
        }
    };

    const handleAddDates = async () => {
        setIsAdding(true);

        // 1) Validate all 8 are filled
        for (const section of notifSections) {
            for (const rem of section.reminders) {
                if (!dates[section.key][rem.key]) {
                    toast.error(`Please fill "${rem.label}" for "${section.title}"`);
                    setIsAdding(false);
                    return;
                }
            }
        }

        // 2) Create all reminders
        try {
            const token = localStorage.getItem("elevu_auth");
            for (const section of notifSections) {
                for (const rem of section.reminders) {
                    await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/company/add-reminder`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                        body: JSON.stringify({
                            review_cycle_id: reviewCycleId,
                            scheduled_date: dates[section.key][rem.key],
                            reminder_type: section.key,
                        }),
                    });
                }
            }
            toast.success("All reminders created");
            // 3) Refresh the same cycle's data
            await loadReminders(Number(reviewCycleId));
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Failed to add reminders");
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <div className="flex flex-col gap-5">

            {/* ── Review Cycle Info ── */}
            <Card>
                <CardHeader>
                    <CardTitle>Review Cycle</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoadingCycle ? (
                        <p className="text-gray-500">Loading cycle…</p>
                    ) : (
                        <div className="space-y-1">
                            <h2 className="text-lg font-semibold">{cycleDetails.label}</h2>
                            <p className="text-sm text-gray-600">
                                {new Date(cycleDetails.startDate).toLocaleString()} —{" "}
                                {cycleDetails.endDate
                                    ? new Date(cycleDetails.endDate).toLocaleString()
                                    : "No end date"}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Edit mode banner */}
            {hasReminders && (
                <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 rounded">
                    <strong>Edit Mode:</strong> Change any date below to update existing reminders.
                </div>
            )}

            {/* Date pickers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {notifSections.map(section => (
                    <Card key={section.key}>
                        <CardHeader>
                            <CardTitle>{section.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {section.reminders.map(rem => {
                                const idx = section.reminders.findIndex(r => r.key === rem.key);
                                const prevKey = idx > 0 ? section.reminders[idx - 1].key as DateField : null;

                                let minBound: string | undefined;
                                const now = new Date();

                                if (rem.key === "initial") {
                                    if (cycleDetails?.startDate) {
                                        const cs = new Date(cycleDetails.startDate);
                                        minBound = formatForInput((cs > now ? cs : now).toISOString());
                                    } else {
                                        minBound = formatForInput(now.toISOString());
                                    }
                                } else if (prevKey) {
                                    const pd = dates[section.key][prevKey]
                                        ? new Date(dates[section.key][prevKey])
                                        : now;
                                    minBound = formatForInput((pd > now ? pd : now).toISOString());
                                }

                                return (
                                    <div key={rem.key}>
                                        <Label htmlFor={`${section.key}-${rem.key}`}>{rem.label}</Label>
                                        <div className="flex items-center gap-2">
                                            <CalendarClock className="h-5 w-5 text-gray-500" />
                                            <Input
                                                id={`${section.key}-${rem.key}`}
                                                type="datetime-local"
                                                value={dates[section.key][rem.key]}
                                                onChange={e => handleDateChange(section.key, rem.key, e.target.value)}
                                                min={minBound}
                                                max={cycleDetails?.endDate ? formatForInput(cycleDetails.endDate) : undefined}
                                                className="flex-1 !block justify-between"
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Add Dates button */}
            {!hasReminders && (
                <button
                    onClick={handleAddDates}
                    disabled={isAdding}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                    {isAdding ? <ButtonLoader /> : "Add Dates"}
                </button>
            )}
        </div>
    );
}