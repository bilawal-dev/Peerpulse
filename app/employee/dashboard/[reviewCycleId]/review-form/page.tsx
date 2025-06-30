"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

type ReviewResponse = {
    [questionKey: string]: string;
};

type Peer = {
    id: string;
    name: string;
};

type Question = {
    question_id: number;
    type: "self" | "peer" | "manager";
    name: string;
    label: string;
    question: string;
    order: number;
    charLimit: number;
};

export default function ReviewCycleReviewFormPage() {
    const router = useRouter();
    const reviewCycleId = Number(useParams().reviewCycleId);

    const [fetchError, setFetchError] = useState(false);

    const { user } = useAuth();

    const [loading, setLoading] = useState(true);
    const [companyName, setCompanyName] = useState("");
    const [reviewPeriod, setReviewPeriod] = useState("");
    const [employeeName, setEmployeeName] = useState(user.name || "");
    const [peers, setPeers] = useState<Peer[]>([]);
    const [manager, setManager] = useState<Peer>();

    const [questions, setQuestions] = useState<{ self: Question[]; peer: Question[][]; manager: Question[]; }>({ self: [], peer: [], manager: [] });

    const [currentStep, setCurrentStep] = useState(0);
    const [responses, setResponses] = useState<ReviewResponse>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const token = localStorage.getItem("elevu_auth");

                // 1) Fetch all review form data in one call
                const formRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/employee/get-review-form-data`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ review_cycle_id: reviewCycleId }),
                });

                const formJson = await formRes.json();

                if (!formJson.success) {
                    setFetchError(true);
                    throw new Error(formJson.message || "Failed to fetch review form data");
                }

                const data = formJson.data;
                
                // Set basic info
                setCompanyName(data.company.name);
                setReviewPeriod(data.review_cycle.name);
                setEmployeeName(data.employee_name);
                setPeers(data.peer.map((x: any) => ({ id: String(x.employee_id), name: x.name })));
                setManager({ id: String(data.manager.employee_id), name: data.manager.name });

                // Process questions from the new structure
                const selfQuestions = data.questions.self
                    .sort((a: any, b: any) => a.order - b.order)
                    .map((q: any) => ({
                        question_id: q.question_id,
                        type: "self" as const,
                        name: q.name,
                        label: q.label,
                        question: q.question,
                        order: q.order,
                        charLimit: q.character_limit,
                    }));

                const managerQuestions = data.questions.manager
                    .sort((a: any, b: any) => a.order - b.order)
                    .map((q: any) => ({
                        question_id: q.question_id,
                        type: "manager" as const,
                        name: q.name,
                        label: q.label,
                        question: q.question,
                        order: q.order,
                        charLimit: q.character_limit,
                    }));

                // Process peer questions - each peer has their own personalized questions
                const peerQuestions = data.questions.peer.map((peerObj: any) => 
                    peerObj.questions
                        .sort((a: any, b: any) => a.order - b.order)
                        .map((q: any) => ({
                            question_id: q.question_id,
                            type: "peer" as const,
                            name: q.name,
                            label: q.label,
                            question: q.question,
                            order: q.order,
                            charLimit: q.character_limit,
                        }))
                );

                setQuestions({
                    self: selfQuestions,
                    peer: peerQuestions,
                    manager: managerQuestions
                });

                // 2) fetch any previously submitted answers and prefill
                const subRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/employee/get-submitted-review-data`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ review_cycle_id: reviewCycleId }),
                });
                if (!subRes.ok) throw new Error("Failed to fetch previous answers");
                const subJson = await subRes.json();

                // build response map using **label** (which matches e.review_type_label)
                const existing: Record<string, string> = {};

                // self (step = 0)
                subJson.data.self.forEach((e: any) => {
                    existing[e.review_type_label] = e.answer;
                });

                // peers (step = idx+1)
                subJson.data.peer.forEach((e: any) => {
                    const idx = data.peer.findIndex(
                        (p: any) => String(p.employee_id) === String(e.reviewee_id)
                    );
                    if (idx !== -1) {
                        existing[`${e.review_type_label}_${idx + 1}`] = e.answer;
                    }
                });

                // manager (step = peers.length+1)
                subJson.data.manager.forEach((e: any) => {
                    const mgrStep = data.peer.length + 1;
                    existing[`${e.review_type_label}_${mgrStep}`] = e.answer;
                });

                setResponses(existing);
            } catch (err: any) {
                console.error(err);
                toast.error(err.message || "Error loading data");
                setFetchError(true);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [reviewCycleId]);

    const totalSteps = peers.length + 2;

    const getStepTitle = () => {
        if (currentStep === 0) return `Self Assessment: ${employeeName}`;
        if (currentStep <= peers.length) return `Peer Review for ${peers[currentStep - 1].name}`;
        return `Manager Review for ${manager?.name}`;
    };

    const getStepDescription = () => {
        if (currentStep === 0)
            return "Your self-assessment responses will be viewed by your manager and incorporated into the performance review process.";
        if (currentStep <= peers.length) return "Please provide constructive feedback for your peer.";
        return "Employee feedback for your manager.";
    };

    const getCurrentQuestions = () => {
        if (currentStep === 0) return questions.self;
        if (currentStep <= peers.length) {
            const peerIndex = currentStep - 1;
            return questions.peer[peerIndex] || [];
        }
        return questions.manager;
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setResponses((prev) => ({
            ...prev,
            [name]: value.slice(0, getCharLimitForQuestion(name)),
        }));
    };

    const getCharLimitForQuestion = (key: string): number => {
        const base = key.split("_")[0];
        const allPeerQuestions = questions.peer.flat();
        const all = [...questions.self, ...allPeerQuestions, ...questions.manager];
        const q = all.find((x) => x.label === base);
        return q?.charLimit || 250;
    };

    const prevStep = () => {
        if (currentStep > 0) setCurrentStep((s) => s - 1);
    };

    const handleNext = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        
        // Start loading toast
        toast.loading("Saving your feedback...", { id: "give-review" });
        
        try {
            const token = localStorage.getItem("elevu_auth");

            // who we're reviewing
            let review_to_id: string;
            if (currentStep === 0) {
                review_to_id = String(user.employee_id);
            } else if (currentStep <= peers.length) {
                review_to_id = peers[currentStep - 1].id;
            } else {
                review_to_id = manager!.id;
            }

            // build answers using **label** keys
            const answers = getCurrentQuestions().map((q) => ({
                question_id: q.question_id,
                answer: responses[`${q.label}${currentStep > 0 ? `_${currentStep}` : ""}`] || "",
            }));

            // ensure none empty
            answers.forEach(({ answer }) => {
                if (!answer.trim()) {
                    throw new Error("Please answer every question before continuing.");
                }
            });

            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/employee/give-review`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    review_to_id,
                    review_cycle_id: reviewCycleId,
                    answers,
                }),
            });
            const json = await res.json();
            if (!json.success) throw new Error(json.message || "Submit failed");

            if (currentStep === totalSteps - 1) {
                toast.success("All feedback submitted successfully! Thank you.", { id: "give-review" });
                router.push(`/employee/dashboard/${reviewCycleId}`);
            } else {
                toast.success("Feedback saved! Moving to next section.", { id: "give-review" });
                setCurrentStep((s) => s + 1);
            }
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Error submitting feedback", { id: "give-review" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderCharCountAndProgress = (key: string) => {
        const val = responses[key] || "";
        const limit = getCharLimitForQuestion(key);
        const pct = Math.min((val.length / limit) * 100, 100);
        let color = "bg-red-600";
        if (pct >= 40) color = "bg-yellow-400";
        if (pct >= 80) color = "bg-green-600";
        return (
            <>
                <div className="text-sm text-gray-600 mt-1">
                    {val.length} / {limit} characters
                </div>
                <Progress value={pct} className={color} style={{ backgroundColor: "#e5e7eb" }} />
            </>
        );
    };

    const getQuestionKey = (q: Question, step: number) =>
        step === 0 ? q.label : `${q.label}_${step}`;

    if (loading) {
        return <ReviewFormSkeleton />;
    }

    // Generic error UI
    if (!loading && fetchError) {
        return (
            <Card className="p-8 text-center">
                <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
                <h2 className="text-2xl font-semibold mb-2">Something Went Wrong</h2>
                <p className="text-lg text-gray-600 pb-5">
                    We couldn't load your review data right now. Please try again later or contact
                    support if the issue persists.
                </p>
                <Link href={`/employee/dashboard/${reviewCycleId}`}>
                    <Button>
                        Back To Dashboard
                    </Button>
                </Link>
            </Card>
        );
    }

    return (
        <Card className="max-w-4xl mx-auto p-8 pt-0">

            {/* Back to Dashboard */}
            <Link href={`/employee/dashboard/${reviewCycleId}`} className="absolute top-3 sm:top-8 left-3 sm:left-8 flex items-center gap-2 rounded-full bg-white border border-gray-300 p-2 sm:p-3 shadow hover:bg-gray-100 transition">
                <ArrowLeft className="w-6 h-6 text-gray-700" />
            </Link>

            <CardHeader>
                <div className="flex flex-col items-center gap-2 mb-16">
                    <h1 className="text-3xl font-bold text-center">{companyName} Employee Review</h1>
                    <h2 className="text-2xl font-semibold text-center">{reviewPeriod}</h2>
                </div>
                <CardTitle className="text-2xl font-semibold">{getStepTitle()}</CardTitle>
                <p className="text-gray-600 mt-1">{getStepDescription()}</p>
            </CardHeader>
            <CardContent>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleNext();
                    }}
                    className="space-y-8"
                >
                    {getCurrentQuestions().map((q) => {
                        const key = getQuestionKey(q, currentStep);
                        return (
                            <div key={q.question_id} className="space-y-2">
                                <label htmlFor={key} className="block font-semibold text-lg text-gray-800">
                                    {q.label}
                                </label>
                                <p className="text-gray-700">{q.question}</p>
                                <Textarea
                                    id={key}
                                    name={key}
                                    value={responses[key] || ""}
                                    onChange={handleChange}
                                    maxLength={q.charLimit}
                                    rows={5}
                                    className="mt-1"
                                    placeholder={`Enter up to ${q.charLimit} characters...`}
                                />
                                {renderCharCountAndProgress(key)}
                            </div>
                        );
                    })}

                    <div className="flex justify-between">
                        <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 0}>
                            Previous
                        </Button>
                        <Button type="submit" className="ml-auto" disabled={isSubmitting}>
                            {currentStep === totalSteps - 1 ? "Save and Submit" : "Save and Next"}
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
