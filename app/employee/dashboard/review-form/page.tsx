"use client";

import React, { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";

type ReviewResponse = {
    [questionName: string]: string;
};

type Peer = {
    id: string;
    fullName: string;
};

const QUESTIONS = {
    self: [
        {
            name: "Impact",
            label: "Impact",
            description:
                "What were your top successes in this review period? How did these contribute to key business focuses?",
            charLimit: 100,
        },
        {
            name: "Development",
            label: "Development",
            description:
                "How have you used feedback to improve your work? Provide specific examples.",
            charLimit: 100,
        },
        {
            name: "Growth",
            label: "Growth",
            description:
                "What are your specific goals for next period? Include measurable outcomes and timelines.",
            charLimit: 100,
        },
    ],
    peer: [
        {
            name: "PeerStrengths",
            label: "Identifying Strengths",
            description:
                "What is this peer's greatest strength or “superpower” in their role? Provide examples.",
            charLimit: 250,
        },
        {
            name: "PeerDevelopment",
            label: "Identifying Areas for Development",
            description:
                "Where can this peer develop a new strength? How can they build this skill?",
            charLimit: 250,
        },
    ],
    manager: [
        {
            name: "ManagerStrengths",
            label: "Manager Strengths",
            description:
                "What leadership qualities do you appreciate in your manager? Share examples.",
            charLimit: 100,
        },
        {
            name: "ManagerImprovements",
            label: "Manager Improvements",
            description:
                "Where could your manager improve their leadership approach? Provide examples.",
            charLimit: 100,
        },
    ],
};

export default function DashboardReviewFormPage() {
    const pathname = usePathname();
    const employeeCode = pathname.split("/").pop() || "";

    const [loading, setLoading] = useState(true);
    const [employeeName, setEmployeeName] = useState("Loading...");
    const [peers, setPeers] = useState<Peer[]>([]);
    const [managerName, setManagerName] = useState("Manager");
    const [reviewPeriod, setReviewPeriod] = useState("Q3 & Q4 - 2024");

    const [currentStep, setCurrentStep] = useState(0);
    const [responses, setResponses] = useState<ReviewResponse>({});

    const [isSubmitting, setIsSubmitting] = useState(false);

    const router = useRouter();

    // Fetch employee, peers, manager, and period info from API or simulate here
    useEffect(() => {
        async function fetchData() {
            try {
                // Simulate fetch delay
                await new Promise((r) => setTimeout(r, 1000));

                // Simulated API response (replace with actual fetch)
                const employeeData = {
                    employeeName: "Brandon Tuttle",
                    peers: [
                        { id: "p1", fullName: "Aaron Kim" },
                        { id: "p2", fullName: "Edward Andrews" },
                        { id: "p3", fullName: "Lex Fatianow" },
                    ],
                    managerName: "Cedric Bernard",
                    reviewPeriod: "Q3 & Q4 - 2024",
                };

                setEmployeeName(employeeData.employeeName);
                setPeers(employeeData.peers);
                setManagerName(employeeData.managerName);
                setReviewPeriod(employeeData.reviewPeriod);
            } catch (error) {
                console.error("Failed to fetch review form data", error);
                setEmployeeName("Unknown Employee");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [employeeCode]);

    const totalSteps = peers.length + 2;

    const getStepTitle = () => {
        if (currentStep === 0) return `Self Assessment: ${employeeName}`;
        if (currentStep > 0 && currentStep <= peers.length)
            return `Peer Review for ${peers[currentStep - 1].fullName}`;
        return `Manager Review for ${managerName}`;
    };

    const getStepDescription = () => {
        if (currentStep === 0)
            return "Your self-assessment responses will be viewed by your manager.";
        if (currentStep > 0 && currentStep <= peers.length)
            return "Please provide constructive feedback for your peer.";
        return "Employee feedback for your manager.";
    };

    const getCurrentQuestions = () => {
        if (currentStep === 0) return QUESTIONS.self;
        if (currentStep > 0 && currentStep <= peers.length) return QUESTIONS.peer;
        return QUESTIONS.manager;
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setResponses((prev) => ({
            ...prev,
            [name]: value.slice(0, getCharLimitForQuestion(name)),
        }));
    };

    const getCharLimitForQuestion = (name: string): number => {
        const baseName = name.split('_')[0];

        const allQuestions = [...QUESTIONS.self, ...QUESTIONS.peer, ...QUESTIONS.manager];
        const q = allQuestions.find((q) => q.name === baseName);
        return q?.charLimit || 250
    };

    const nextStep = () => {
        if (currentStep < totalSteps - 1) setCurrentStep((s) => s + 1);
    };
    const prevStep = () => {
        if (currentStep > 0) setCurrentStep((s) => s - 1);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        try {
            const payload = {
                employeeCode,
                responses,
            };
            console.log("Submitting:", payload);
            toast.success("Feedback submitted successfully! Thank you.");
            setTimeout(() => {
                router.push("/employee/dashboard"),
                    setIsSubmitting(false);
            }, 1000);
        } catch {
            toast.error("Error submitting feedback. Please try again.");
            setIsSubmitting(false);
        }
    };

    const renderCharCountAndProgress = (name: string) => {
        const val = responses[name] || "";
        const limit = getCharLimitForQuestion(name);
        const percentage = Math.min((val.length / limit) * 100, 100);

        let color = "bg-red-600";
        if (percentage >= 80) color = "bg-green-600";
        else if (percentage >= 40) color = "bg-yellow-400";

        return (
            <>
                <div className="text-sm text-gray-600 mt-1">
                    {val.length} / {limit} characters
                </div>
                <Progress
                    value={percentage}
                    className={`${color}`}
                    style={{ backgroundColor: "#e5e7eb" }}
                />
            </>
        );
    };

    const getQuestionName = (baseName: string, step: number) =>
        step === 0 ? baseName : `${baseName}_${step}`;

    if (loading) {
        return <ReviewFormSkeleton />;
    };

    return (
        <Card className="max-w-4xl mx-auto p-8 pt-0">
            <CardHeader>
                <div className="flex flex-col items-center mb-16">
                    <h1 className="text-4xl font-bold">Blips Employee Review</h1>
                    <h2 className="text-3xl font-bold">Q3 & Q4 - 2024</h2>
                </div>
                <CardTitle className="text-2xl font-semibold">{getStepTitle()}</CardTitle>
                <p className="text-gray-600 mt-1">{getStepDescription()}</p>
            </CardHeader>
            <CardContent>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (currentStep === totalSteps - 1) handleSubmit();
                        else nextStep();
                    }}
                    className="space-y-8"
                >
                    {getCurrentQuestions().map((q, i) => {
                        const questionName = getQuestionName(q.name, currentStep);
                        return (
                            <div key={i} className="space-y-2">
                                <label
                                    htmlFor={questionName}
                                    className="block font-semibold text-lg text-gray-800"
                                >
                                    {q.label}
                                </label>
                                <p className="text-gray-700">{q.description}</p>
                                <Textarea
                                    id={questionName}
                                    name={questionName}
                                    value={responses[questionName] || ""}
                                    onChange={handleChange}
                                    maxLength={q.charLimit}
                                    rows={5}
                                    className="mt-1"
                                    placeholder={`Enter up to ${q.charLimit} characters...`}
                                />
                                {renderCharCountAndProgress(questionName)}
                            </div>
                        );
                    })}

                    <div className="flex justify-between">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={prevStep}
                            disabled={currentStep === 0}
                        >
                            Previous
                        </Button>
                        <Button type="submit" className="ml-auto" disabled={isSubmitting}>
                            {currentStep === totalSteps - 1 ? "Submit" : "Next"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

function ReviewFormSkeleton() {
    return (
        <Card className="max-w-4xl mx-auto p-8 pt-0 animate-pulse">
            <CardHeader>
                <div className="flex flex-col items-center mb-16 space-y-4">
                    <div className="h-12 w-64 bg-gray-300 rounded"></div>
                    <div className="h-10 w-48 bg-gray-300 rounded"></div>
                </div>
                <CardTitle>
                    <div className="h-8 w-64 bg-gray-300 rounded mb-2"></div>
                </CardTitle>
                <p className="h-4 w-96 bg-gray-300 rounded"></p>
            </CardHeader>
            <CardContent>
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="space-y-2 mb-10">
                        <div className="h-6 w-48 bg-gray-300 rounded"></div>
                        <div className="h-4 w-80 bg-gray-300 rounded"></div>
                        <div className="h-24 bg-gray-300 rounded"></div>
                        <div className="h-4 w-64 bg-gray-300 rounded mt-2"></div>
                        <div className="h-2 w-full bg-gray-300 rounded mt-1"></div>
                    </div>
                ))}
                <div className="flex justify-between">
                    <div className="h-10 w-24 bg-gray-300 rounded"></div>
                    <div className="h-10 w-24 bg-gray-300 rounded"></div>
                </div>
            </CardContent>
        </Card>
    );
}
