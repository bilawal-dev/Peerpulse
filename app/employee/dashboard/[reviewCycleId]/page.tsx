// app/employee/dashboard/[cycleId]/page.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Shuffle, FileText, UserCheck, Smile, } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const steps = [
    {
        number: 1,
        title: "Select Your Peers",
        description: "Choose colleagues to review your performance and give feedback.",
        Icon: Users,
        actionLabel: "Start Peer Selection",
        actionHref: "peer-selection",
    },
    {
        number: 2,
        title: "Automatic Pairing",
        description: "The system or admin pairs reviewers and reviewees automatically or manually.",
        Icon: Shuffle,
    },
    {
        number: 3,
        title: "Fill Review Forms",
        description: "Complete your self-review, then review peers and your manager.",
        Icon: FileText,
        actionLabel: "Go to Review Form",
        actionHref: "review-form",
    },
    {
        number: 4,
        title: "Get Feedback & Grow",
        description: "Receive insightful feedback to empower your professional growth.",
        Icon: UserCheck,
    },
];

export default function EmployeesDashboardPage() {
    const { reviewCycleId } = useParams();

    return (
        <div className="space-y-8 pb-8">
            {/* Welcome */}
            <Card>
                <CardContent className="flex flex-col gap-4 pt-5">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <Smile className="text-blue-600 w-8 h-8" />
                        <h1 className="text-2xl sm:text-3xl font-bold">
                            Welcome Back!
                        </h1>
                    </div>
                    <p className="text-gray-700">
                        Empower your growth with PeerPulse&apos;s streamlined peer review
                        process. Follow the steps below to complete your reviews and
                        help your team thrive.
                    </p>
                </CardContent>
            </Card>

            {/* Timeline Steps */}
            <div className="relative border-l-2 border-blue-600 ml-5 pl-6">
                {steps.map(
                    (
                        { number, title, description, Icon, actionLabel, actionHref },
                        i
                    ) => (
                        <div key={i} className="mb-12 last:mb-0 relative">
                            <div className="absolute -left-10 top-0 flex items-center justify-center rounded-full bg-blue-600 text-white w-8 h-8 font-semibold">
                                {number}
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-2">
                                <Icon className="text-blue-600 w-6 h-6 flex-shrink-0" />
                                <h2 className="text-lg sm:text-xl font-semibold">
                                    {title}
                                </h2>
                            </div>
                            <p className="text-sm sm:text-base text-gray-700 mb-3 max-w-xl">
                                {description}
                            </p>
                            {actionLabel && actionHref && (
                                <Link href={`/employee/dashboard/${reviewCycleId}/${actionHref}`}>
                                    <Button variant="outline" size="sm">
                                        {actionLabel}
                                    </Button>
                                </Link>
                            )}
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
