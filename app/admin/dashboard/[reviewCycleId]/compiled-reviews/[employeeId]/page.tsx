// File: components/reviews/EmployeeCompiledReviewsPage.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Mail, Download, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

interface EmployeeInfo {
    employee_id: number;
    name: string;
    email: string;
    department: string;
    manager: string;
    isHimselfManager: boolean;
    role: 'manager' | 'employee';
}

interface ReviewItem {
    question_id: number;
    question: string;
    answer: string;
    review_type: string;
    review_type_label: string;
}

interface DetailResponseData {
    employee: EmployeeInfo;
    is_review_completed: boolean;
    self_review: ReviewItem[];
    manager_review: ReviewItem[];
    peer_review: ReviewItem[];
    company: {
        company_logo: string;
        name: string;
    };
    review_cycle: {
        name: string;
    }
}

export default function EmployeeCompiledReviewsPage() {
    const { reviewCycleId, employeeId } = useParams();
    const [data, setData] = useState<DetailResponseData | null>(null);
    const [companyLogo, setCompanyLogo] = useState<string | null>(null);
    const [companyName, setCompanyName] = useState<string>("");
    const [reviewCycleName, setReviewCycleName] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [exportOpen, setExportOpen] = useState(false);

    useEffect(() => {
        async function fetchDetails() {
            setLoading(true);
            try {
                const token = localStorage.getItem("elevu_auth");
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/company/get-compile-review-details`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        review_cycle_id: Number(reviewCycleId),
                        employee_id: Number(employeeId),
                    }),
                });
                const json = await res.json();
                if (!json.success) {
                    throw new Error(json.message || "Failed to fetch review details");
                }
                setData(json.data);
                setCompanyLogo(json.data.company.company_logo);
                setCompanyName(json.data.company.name);
                setReviewCycleName(json.data.review_cycle.name);
            } catch (err: any) {
                console.error(err);
                toast.error(err.message || "Error loading review details");
            } finally {
                setLoading(false);
            }
        }
        fetchDetails();
    }, [reviewCycleId, employeeId]);

    const exportPDF = () => {
        alert(`IMPLEMENTATION NEEDED HERE`);
        setExportOpen(false);
    };

    const sendReviewEmail = () => {
        alert(`IMPLEMENTATION NEEDED HERE`);
        setExportOpen(false);
    };

    if (loading || !data) {
        return null; // or a spinner
    }

    const { employee, is_review_completed, self_review, manager_review, peer_review } = data;

    return (
        <div className="bg-gray-50 min-h-screen p-8 pt-0 max-sm:px-0">
            <div className="review-container max-w-6xl mx-auto">
                {/* Back to Dashboard */}
                <Link href={`/admin/dashboard/${reviewCycleId}/compiled-reviews`} className="absolute top-3 sm:top-8 left-3 sm:left-8 flex items-center gap-2 rounded-full bg-white border border-gray-300 p-2 sm:p-3 shadow hover:bg-gray-100 transition">
                    <ArrowLeft className="w-6 h-6 text-gray-700" />
                </Link>

                {/* Logo */}
                {companyLogo ? (
                    <Image
                        src={companyLogo}
                        alt={`${companyName} Logo`}
                        className="mx-auto mix-blend-multiply"
                        width={250}
                        height={50}
                        priority
                    />
                ) : null}


                {/* Header */}
                <div className="header text-center mb-16">
                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2">
                        {companyName}
                    </h1>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-snug">
                        {reviewCycleName}
                        <span className={`status-badge status-completed ml-4 inline-block w-fit px-3 py-1 rounded-full ${is_review_completed  ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"} text-sm font-medium`}>
                            {is_review_completed ? "Completed" : "Pending"}
                        </span>
                    </h2>
                </div>

                {/* Meta Info */}
                <section className="meta-info grid grid-cols-1 md:grid-cols-3 gap-8 bg-white p-8 rounded-2xl shadow mb-16">
                    <div className="meta-item text-center">
                        <span className="meta-label text-sm text-gray-500 block mb-2">
                            EMPLOYEE
                        </span>
                        <span className="meta-value text-lg font-semibold text-gray-900 block">
                            {employee.name || '-'}
                        </span>
                    </div>
                    <div className="meta-item text-center">
                        <span className="meta-label text-sm text-gray-500 block mb-2">
                            MANAGER
                        </span>
                        <span className="meta-value text-lg font-semibold text-gray-900 block">
                            {employee.manager || 'No Manager'}
                        </span>
                    </div>
                    <div className="meta-item text-center">
                        <span className="meta-label text-sm text-gray-500 block mb-2">
                            DEPARTMENT
                        </span>
                        <span className="meta-value text-lg font-semibold text-gray-900 block">
                            {employee.department || '-'}
                        </span>
                    </div>
                </section>

                {/* Self Assessment */}
                <section className="review-section mb-12 bg-white p-8 rounded-2xl shadow">
                    <div className="section-header flex items-center gap-4 mb-8">
                        <h2 className="section-title text-2xl font-bold text-gray-900">
                            Self Assessment
                        </h2>
                    </div>
                    {self_review.map((item) => (
                        <div className="feedback-item mb-8" key={item.question_id}>
                            <div className="question text-lg font-semibold text-gray-900 mb-4">
                                {item.review_type_label}
                            </div>
                            <div className="responses space-y-4 pl-4">
                                <div className="response flex flex-col md:flex-row gap-6 relative items-start">
                                    <QuoteIcon />
                                    <div className="response-text text-gray-700 leading-relaxed">
                                        {item.answer}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </section>

                {/* Peer Feedback */}
                <section className="review-section mb-12 bg-white p-8 rounded-2xl shadow">
                    <div className="section-header flex items-center gap-4 mb-8">
                        <h2 className="section-title text-2xl font-bold text-gray-900">
                            Peer Feedback
                        </h2>
                    </div>
                    {peer_review.map((item) => (
                        <div className="feedback-item mb-8" key={item.question_id}>
                            <div className="question text-lg font-semibold text-gray-900 mb-4">
                                {item.review_type_label}
                            </div>
                            <div className="responses space-y-4 pl-4">
                                <div className="response flex flex-col md:flex-row gap-6 relative items-start">
                                    <QuoteIcon />
                                    <div className="response-text text-gray-700 leading-relaxed">
                                        {item.answer}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </section>

                {/* Manager Feedback */}
                {employee.role === 'manager' && (
                    <section className="review-section mb-12 bg-white p-8 rounded-2xl shadow">
                        <div className="section-header flex items-center gap-4 mb-8">
                            <h2 className="section-title text-2xl font-bold text-gray-900">
                                Feedback From Direct Reports
                            </h2>
                        </div>
                        {manager_review.map((item) => (
                            <div className="feedback-item mb-8" key={item.question_id}>
                                <div className="question text-lg font-semibold text-gray-900 mb-4">
                                    {item.review_type_label}
                                </div>
                                <div className="responses space-y-4 pl-4">
                                    <div className="response flex flex-col md:flex-row gap-6 relative items-start">
                                        <QuoteIcon />
                                        <div className="response-text text-gray-700 leading-relaxed">
                                            {item.answer}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </section>
                )}
            </div>

            {/* Export Controls */}
            <Dialog open={exportOpen} onOpenChange={setExportOpen}>
                <DialogTrigger asChild>
                    <Button
                        className="export-button fixed bottom-8 right-8 bg-brand hover:bg-brand/90 text-white w-10 sm:w-14 h-10 sm:h-14 rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition"
                        onClick={() => setExportOpen(true)}
                    >
                        <Download size={25} />
                    </Button>
                </DialogTrigger>
                <DialogContent className="modal-content fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-2xl w-11/12 max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl">Export Review</DialogTitle>
                    </DialogHeader>
                    <div className="export-options flex flex-col gap-4 mt-4">
                        <Button
                            variant="outline"
                            className="export-option flex justify-start items-center gap-4 px-5 py-10 bg-gray-100 rounded-lg hover:bg-gray-200"
                            onClick={sendReviewEmail}
                        >
                            <Mail size={24} />
                            <div className="export-option-text text-left">
                                <h4 className="export-option-title font-medium text-gray-900">
                                    Email Review
                                </h4>
                                <p className="export-option-description text-sm font-normal text-gray-500">
                                    Send this review to employee
                                </p>
                            </div>
                        </Button>
                        <Button
                            variant="outline"
                            className="export-option flex justify-start items-center gap-4 px-5 py-10 bg-gray-100 rounded-lg hover:bg-gray-200"
                            onClick={exportPDF}
                        >
                            <Download size={24} />
                            <div className="export-option-text text-left">
                                <h4 className="export-option-title font-medium text-gray-900">
                                    Download PDF
                                </h4>
                                <p className="export-option-description text-sm font-normal text-gray-500">
                                    Save review as PDF file
                                </p>
                            </div>
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function QuoteIcon() {
    return (
        <div className="flex-shrink-0 w-4 h-4 mt-1 mr-3">
            <svg
                fill="#FF385C"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 349.078 349.078"
                className="w-full h-full"
            >
                <path d="M198.779,322.441v-58.245c0-7.903,6.406-14.304,14.304-14.304c28.183,0,43.515-28.904,45.643-85.961h-45.643 c-7.897,0-14.304-6.41-14.304-14.304V26.64c0-7.9,6.406-14.301,14.304-14.301h121.69c7.896,0,14.305,6.408,14.305,14.301v122.988 c0,27.349-2.761,52.446-8.181,74.611c-5.568,22.722-14.115,42.587-25.398,59.049c-11.604,16.917-26.132,30.192-43.155,39.437 c-17.152,9.304-37.09,14.026-59.267,14.026C205.186,336.745,198.779,330.338,198.779,322.441z M14.301,249.887 C6.404,249.887,0,256.293,0,264.185v58.257c0,7.896,6.404,14.298,14.301,14.298c22.166,0,42.114-4.723,59.255-14.026 c17.032-9.244,31.558-22.508,43.161-39.437c11.29-16.462,19.836-36.328,25.404-59.061c5.423-22.165,8.178-47.263,8.178-74.6V26.628 c0-7.9-6.41-14.301-14.304-14.301H14.301C6.404,12.327,0,18.734,0,26.628v122.988c0,7.899,6.404,14.304,14.301,14.304h45.002 C57.201,220.982,42.09,249.887,14.301,249.887z" />
            </svg>
        </div>
    );
}
