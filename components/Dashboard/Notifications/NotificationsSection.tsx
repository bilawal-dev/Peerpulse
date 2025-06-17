"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CalendarClock } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import toast from "react-hot-toast";
import ButtonLoader from "@/components/Common/ButtonLoader";

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
    const [cycles, setCycles] = useState<{ id: string; label: string; startDate: string; endDate: string | null }[]>([]);
    const [selectedCycle, setSelectedCycle] = useState<string>("");
    const [selectedCycleDetails, setSelectedCycleDetails] = useState<{ startDate: string; endDate: string | null } | null>(null);

    const [isAdding, setIsAdding] = useState(false);

    const [dates, setDates] = useState<Record<SectionKey, Record<DateField, string>>>({
        peer_selection: { initial: "", first: "", second: "", final: "" },
        review: { initial: "", first: "", second: "", final: "" },
    });

    const [reminderIds, setReminderIds] = useState<Record<SectionKey, Record<DateField, number | null>>>({
        peer_selection: { initial: null, first: null, second: null, final: null },
        review: { initial: null, first: null, second: null, final: null },
    });

    const hasReminders = Object.values(reminderIds)
        .some(section => Object.values(section).some(id => id !== null));

    const formatForInput = (iso: string) =>
        new Date(iso).toISOString().slice(0, 16);

    // Fetch all review cycles
    useEffect(() => {
        (async () => {
            try {
                const token = localStorage.getItem("elevu_auth");
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/company/get-all-review-cycle`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!res.ok) throw new Error("Failed to fetch review cycles");
                const json = await res.json();
                const mapped = (json.data as any[]).map(item => ({
                    id: String(item.review_cycle_id),
                    label: item.name,
                    startDate: item.start_date,
                    endDate: item.end_date || null,
                }));
                setCycles(mapped);
                if (mapped.length) {
                    setSelectedCycle(mapped[0].id);
                    setSelectedCycleDetails({ startDate: mapped[0].startDate, endDate: mapped[0].endDate });
                }
            } catch (err) {
                console.error(err);
            }
        })();
    }, []);

    // Extracted: load reminders for a given cycle
    const loadReminders = async (cycleId: string) => {
        try {
            const token = localStorage.getItem("elevu_auth");
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/company/get-all-reminders-by-review-cycle`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ review_cycle_id: cycleId }),
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
        if (selectedCycle) {
            loadReminders(selectedCycle);
        }
    }, [selectedCycle]);

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
                            review_cycle_id: selectedCycle,
                            scheduled_date: dates[section.key][rem.key],
                            reminder_type: section.key,
                        }),
                    });
                }
            }
            toast.success("All reminders created");
            // 3) Refresh the same cycle's data
            await loadReminders(selectedCycle);
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Failed to add reminders");
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <div className="flex flex-col gap-5">
            {/* Cycle selector */}
            <Card>
                <CardHeader>
                    <CardTitle>Select Review Cycle</CardTitle>
                </CardHeader>
                <CardContent>
                    <Select
                        value={selectedCycle}
                        onValueChange={val => {
                            setSelectedCycle(val);
                            const c = cycles.find(x => x.id === val);
                            setSelectedCycleDetails(c ? { startDate: c.startDate, endDate: c.endDate } : null);
                        }}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select review cycle" />
                        </SelectTrigger>
                        <SelectContent>
                            {cycles.map(cycle => (
                                <SelectItem key={cycle.id} value={cycle.id}>
                                    {cycle.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
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
                                    if (selectedCycleDetails?.startDate) {
                                        const cs = new Date(selectedCycleDetails.startDate);
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
                                                max={selectedCycleDetails?.endDate ? formatForInput(selectedCycleDetails.endDate) : undefined}
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
