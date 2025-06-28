// File: app/employee/dashboard/[reviewCycleId]/team-performance-report/[employeeId]page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Mail, Download, AlertCircle } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import Link from "next/link";

import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
    is_compiled_review_access: boolean;
    is_review_completed: boolean;
    self_review: ReviewItem[];
    peer_review: ReviewItem[];
    manager_review: ReviewItem[];
    company: { company_logo: string; name: string };
    review_cycle: { name: string };
}

export default function TeamPerformanceReportEmployeePage() {
    const { reviewCycleId, employeeId } = useParams();
    const [exportOpen, setExportOpen] = useState(false);
    const [data, setData] = useState<DetailResponseData | null>(null);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState<boolean>(false);


    useEffect(() => {
        async function fetchDetails() {
            setLoading(true);
            try {
                const token = localStorage.getItem("elevu_auth");
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/employee/get-compile-review--employee-report-for-manager`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        review_cycle_id: Number(reviewCycleId),
                        employee_id: Number(employeeId)
                    }),
                });
                const json = await res.json();
                setData(json.data);
                if (!json.success) {
                    setFetchError(true);
                    throw new Error(json.message || "Failed to performance-report");
                };
            } catch (err: any) {
                console.error(err);
                toast.error(err.message || "Error loading data");
            } finally {
                setLoading(false);
            }
        }
        fetchDetails();
    }, [reviewCycleId]);


    const exportPDF = () => {
        alert(`IMPLEMENTATION NEEDED HERE`);
        setExportOpen(false);
    };

    const sendReviewEmail = () => {
        alert(`IMPLEMENTATION NEEDED HERE`);
        setExportOpen(false);
    };



    // * TODO: Uncomment this section when you have the access control logic ready
    // if (!loading && !data.is_compiled_review_access) {
    //     return (
    //         <div className="bg-gray-50 min-h-[80vh] flex items-center justify-center p-4">
    //             <Card className="max-w-lg mx-auto text-center p-8 space-y-6">
    //                 <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
    //                 <h2 className="text-2xl font-semibold text-gray-900 mb-2">
    //                     Access Restricted
    //                 </h2>
    //                 <p className="text-gray-600 text-base pb-5">
    //                     You don't have permission to see this report.
    //                     Ask your company admin or manager to grant you access.
    //                 </p>
    //                 <Link href={`/employee/dashboard/${reviewCycleId}`}>
    //                     <Button variant="outline" className="w-full">
    //                         Back to Dashboard
    //                     </Button>
    //                 </Link>
    //             </Card>
    //         </div>
    //     );
    // }


    // Generic error UI
    if ((!loading && fetchError) || (!loading && !data)) {
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

    if(!data) return null;

    const { employee, is_review_completed, self_review, peer_review, manager_review, company, review_cycle, } = data;


    return (
        <div className="bg-gray-50 min-h-screen p-8 pt-0 max-sm:px-0">
            <div className="max-w-6xl mx-auto">

                {company.company_logo && (
                    <Image
                        src={company.company_logo}
                        alt={`${company.name} Logo`}
                        width={250}
                        height={50}
                        className="mx-auto mix-blend-multiply"
                        priority
                    />
                )}

                <div className="text-center mb-16">
                    <h1 className="text-2xl font-semibold text-gray-700">
                        {company.name}
                    </h1>
                    <h2 className="text-5xl font-extrabold text-gray-900 mt-2">
                        {review_cycle.name}
                        <span className={`ml-4 px-3 py-1 rounded-full text-sm font-medium ${is_review_completed ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}                        >
                            {is_review_completed ? "Completed" : "Pending"}
                        </span>
                    </h2>
                </div>

                <section className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-white p-8 rounded-2xl shadow mb-16">
                    <Meta label="Employee" value={employee.name} />
                    <Meta label="Manager" value={employee.manager || "No Manager"} />
                    <Meta label="Department" value={employee.department} />
                </section>

                <ReviewSection title="Self Assessment" items={self_review} />
                <ReviewSection title="Peer Feedback" items={peer_review} />
                {employee.role === 'manager' && (
                    <ReviewSection
                        title="Feedback From Direct Reports"
                        items={manager_review}
                    />
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

function Meta({ label, value }: { label: string; value: string }) {
    return (
        <div className="text-center">
            <span className="text-sm text-gray-500 block mb-2">{label}</span>
            <span className="text-lg font-semibold text-gray-900 block">{value}</span>
        </div>
    );
}

function ReviewSection({ title, items, }: { title: string; items: ReviewItem[]; }) {
    return (
        <section className="mb-12 bg-white p-8 rounded-2xl shadow">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">{title}</h2>
            {items.map((it) => (
                <div key={it.question_id} className="mb-8">
                    <div className="text-lg font-semibold text-gray-900 mb-4">
                        {it.review_type_label}
                    </div>
                    <div className="flex gap-6 pl-4">
                        <QuoteIcon />
                        <p className="text-gray-700">{it.answer}</p>
                    </div>
                </div>
            ))}
        </section>
    );
}

function QuoteIcon() {
    return (
        <div className="w-4 h-4 mt-1">
            <svg
                fill="#FF385C"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 349.078 349.078"
                className="w-full h-full"
            >
                <path d="M198.779,322.441v-58.245c0-7.903,6.406-14.304,14.304-14.304c28.183,0,43.515-28.904,45.643-85.961h-45.643 c-7.897,0-14.304-6.41-14.304-14.304V26.64c0-7.9,6.406-14.301,14.304-14.301h121.69c7.896,0,14.305,6.408,14.305,14.301v122.988 c0,27.349-2.761,52.446-8.181,74.611c-5.568,22.722-14.115,42.587-25.398,59.049c-11.604,16.917-26.132,30.192-43.155,39.437 c17.152,9.304-37.09,14.026-59.267,14.026C205.186,336.745,198.779,330.338,198.779,322.441z M14.301,249.887 C6.404,249.887,0,256.293,0,264.185v58.257c0,7.896,6.404,14.298,14.301,14.298c22.166,0,42.114-4.723,59.255-14.026 c17.032-9.244,31.558-22.508,43.161-39.437c11.29-16.462,19.836-36.328,25.404-59.061c5.423-22.165,8.178-47.263,8.178-74.6V26.628 c0-7.9-6.41-14.301-14.304-14.301H14.301C6.404,12.327,0,18.734,0,26.628v122.988c0,7.899,6.404,14.304,14.301,14.304h45.002 C57.201,220.982,42.09,249.887,14.301,249.887z" />
            </svg>
        </div>
    );
}
