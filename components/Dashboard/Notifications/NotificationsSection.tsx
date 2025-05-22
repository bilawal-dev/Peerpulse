"use client";

import { useState } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { CalendarClock } from "lucide-react";

const notifSections = [
    {
        key: "peer",
        title: "Peer Selection Notifications",
        initialPlaceholder: "2025-05-20T13:00",
        reminders: [
            { key: "first", label: "First Reminder", placeholder: "2025-05-23T15:00" },
            { key: "second", label: "Second Reminder", placeholder: "2025-05-27T15:00" },
            { key: "final", label: "Final Warning", placeholder: "2025-05-31T20:00" },
        ],
    },
    {
        key: "submission",
        title: "Review Submission Notifications",
        initialPlaceholder: "2025-06-01T23:00",
        reminders: [
            { key: "first", label: "First Reminder", placeholder: "2025-06-08T15:00" },
            { key: "second", label: "Second Reminder", placeholder: "2025-06-16T15:00" },
            { key: "final", label: "Final Warning", placeholder: "2025-06-30T20:00" },
        ],
    },
] as const;

type SectionKey = typeof notifSections[number]["key"];
type DateField = "initial" | "first" | "second" | "final";

export default function NotificationSection() {
    // 1️⃣ Build initial date‐state from your placeholders
    const initialDateState: Record<SectionKey, Record<DateField, string>> =
        notifSections.reduce((acc, section) => {
            acc[section.key] = {
                initial: section.initialPlaceholder,
                first: section.reminders[0].placeholder,
                second: section.reminders[1].placeholder,
                final: section.reminders[2].placeholder,
            };
            return acc;
        }, {} as Record<SectionKey, Record<DateField, string>>);

    const [dates, setDates] = useState(initialDateState);
    const [autoDates, setAutoDates] = useState<Record<SectionKey, boolean>>({
        peer: true,
        submission: true,
    });

    const toggleSection = (key: SectionKey, val: boolean): void => {
        setAutoDates((prev) => ({ ...prev, [key]: val }));
    };

    // 2️⃣ When a date changes, also bump any that now fall out of order
    const updateDate = (section: SectionKey, field: DateField, value: string) => {
        setDates((prev) => {
            const sec = { ...prev[section], [field]: value };

            if (field === "initial") {
                if (sec.first < value) sec.first = value;
                if (sec.second < sec.first) sec.second = sec.first;
                if (sec.final < sec.second) sec.final = sec.second;
            }
            if (field === "first") {
                if (sec.second < value) sec.second = value;
                if (sec.final < sec.second) sec.final = sec.second;
            }
            if (field === "second") {
                if (sec.final < value) sec.final = value;
            }

            return { ...prev, [section]: sec };
        });
    };

    const openPicker = (id: string) => {
        const el = document.getElementById(id) as HTMLInputElement | null;
        if (!el) return;
        if (typeof el.showPicker === "function") el.showPicker();
        else el.focus();
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {notifSections.map((section) => (
                <Card key={section.key}>
                    <CardHeader>
                        <CardTitle>{section.title}</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Auto‐select toggle */}
                        <div className="flex items-center space-x-2">
                            <Switch
                                id={`${section.key}-auto`}
                                checked={autoDates[section.key]}
                                onCheckedChange={(v) => toggleSection(section.key, !!v)}
                                className="data-[state=checked]:bg-blue-600"
                            />
                            <span className="text-sm font-medium leading-none">
                                Auto-select dates based on initial send
                            </span>
                        </div>

                        {/* Initial Send */}
                        <div className="space-y-1">
                            <Label htmlFor={`${section.key}-initial`}>Initial Send:</Label>
                            <div
                                className="flex gap-2 items-center w-full cursor-pointer"
                                onClick={() => openPicker(`${section.key}-initial`)}
                            >
                                <CalendarClock className="h-5 w-5 text-gray-500 pointer-events-none" />
                                <Input
                                    id={`${section.key}-initial`}
                                    type="datetime-local"
                                    value={dates[section.key].initial}
                                    onChange={(e) =>
                                        updateDate(section.key, "initial", e.target.value)
                                    }
                                    className="flex-1 !block cursor-pointer"
                                />
                            </div>
                            <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                Edit Template
                            </Button>
                        </div>

                        {/* Reminders */}
                        {section.reminders.map((rem, i) => {
                            // map i=0→first, 1→second, 2→final
                            const field = (["first", "second", "final"] as DateField[])[i];
                            const prevField = (["initial", "first", "second"] as DateField[])[
                                i
                            ];
                            return (
                                <div key={rem.key} className="space-y-1">
                                    <Label htmlFor={`${section.key}-${rem.key}`}>
                                        {rem.label}:
                                    </Label>
                                    <div
                                        className="flex gap-2 items-center w-full cursor-pointer"
                                        onClick={() => openPicker(`${section.key}-${rem.key}`)}
                                    >
                                        <CalendarClock className="h-5 w-5 text-gray-500 pointer-events-none" />
                                        <Input
                                            id={`${section.key}-${rem.key}`}
                                            type="datetime-local"
                                            value={dates[section.key][field]}
                                            onChange={(e) =>
                                                updateDate(section.key, field, e.target.value)
                                            }
                                            // disallow before the previous date
                                            min={dates[section.key][prevField]}
                                            className="flex-1 !block cursor-pointer"
                                        />
                                    </div>
                                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                        Edit Template
                                    </Button>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
