"use client";

import React, { useState } from "react";
import { Mail, Download, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function EmployeeReviewsDashboardPage() {
    const reviewData = {
        id: "btutt277",
        email: "",
        status: "Completed" as const,
        employee: "Brandon Tuttle",
        manager: "RJ Schultz",
        department: "Business Operations",
        selfAssessment: {
            Impact:
                "Its been a good few quarters. I've been able to save a lot of moeny from automating processes and being able to cancel the tool subscription we were using. I've also been able to have some big improvements in the Adkom processes to help increase proposals.",
            Development:
                "I love getting feedback from pepole. I feel like I cant improve unless I know the issues. So its been hlepful to get reviews and learn what I can do better. I got a lot of feedback from people to expand who I hlep, and that has helped me grow and meet more people in the company, especially in places I havent got into that much.",
            Growth:
                "Akdom Proposal improvements is my main goal. by end of q2 (hopefully earllier), our current process will be mnuch different. We are going to make p[roposals so easy that we never skip an rfp becuse its not worth the time.",
        },
        peerFeedback: {
            Strengths: [
                `Brandon's superpower is his exceptional ability to build solutions from scratch! He’s the go-to guy for automating tasks, streamlining processes, and boosting productivity across the company. His creativity and problem-solving skills are truly unmatched. Every time I’ve brought him a challenge, he’s returned the very next day with a fully functioning, well-thought-out solution ready to use. I can’t express enough appreciation for how much Brandon has helped me and improved my work processes—he’s made them 100x better!`,
                `Brandon is constantly finding ways to make things at the company more efficient, and I appreciate that I can rely on him to follow up after a project or to help solve issues that arise very quickly. I think he does an amazing job here and is a very valuable asset to Blip and Adkom.`,
                `He is a scrappy startup wizard when it comes to biz ops. I have had the opportunity to double or triple my efficiency through learning from Brandon. It feels really good to get a chance to learn new things every time I speak with him.`,
            ],
            "Development Areas": [
                `His work is consistently exceptional, and he continually goes above and beyond to support the team. If anything, I would just encourage him to keep sharing his knowledge and creative approach with others because it’s clear that his skills and insights are invaluable to everyone around him!`,
                `N/a`,
                `Get some chances to learn more about the OOH ecosystem. This could result in some special ideas. If he could get a better sense of how the billboard companies run their business, I think Brandon would be able to orchestrate some open-minded plans that could propel novel demand.`,
            ],
        },
    };

    const [exportOpen, setExportOpen] = useState(false);

    const exportPDF = () => {
        alert(`IMPLEMENTATION NEEDED HERE`);
        setExportOpen(false);
    };

    const sendReviewEmail = () => {
        alert(`IMPLEMENTATION NEEDED HERE`);
        setExportOpen(false);
    };

    return (
        <div className="bg-gray-50 min-h-screen p-8 max-sm:px-0">
            <div className="review-container max-w-4xl mx-auto">

                {/* Back to Dashboard */}
                <Link href="/reviews" className="absolute top-3 sm:top-8 left-3 sm:left-8 flex items-center gap-2 rounded-full bg-white border border-gray-300 p-2 sm:p-3  shadow hover:bg-gray-100 transition">
                    <ArrowLeft className="w-6 h-6 text-gray-700" />
                </Link>

                {/* Logo */}
                <div className="text-center mb-4">
                    <Image
                        src="/assets/blip-logo.webp"
                        alt="Blip Logo"
                        className="mx-auto w-52 lg:w-72 mb-8"
                        width={300}
                        height={48}
                    />
                </div>

                {/* Header */}
                <div className="header text-center mb-16">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-snug">
                        Biannual Performance Review
                        <span className="status-badge status-completed ml-4 inline-block w-fit px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                            {reviewData.status}
                        </span>
                    </h1>
                </div>

                {/* Meta Info */}
                <div className="meta-info grid grid-cols-1 md:grid-cols-3 gap-8 bg-white p-8 rounded-2xl shadow mb-16">
                    <div className="meta-item text-center">
                        <span className="meta-label text-sm text-gray-500 block mb-2">
                            EMPLOYEE
                        </span>
                        <span className="meta-value text-lg font-semibold text-gray-900 block">
                            {reviewData.employee}
                        </span>
                    </div>
                    <div className="meta-item text-center">
                        <span className="meta-label text-sm text-gray-500 block mb-2">
                            MANAGER
                        </span>
                        <span className="meta-value text-lg font-semibold text-gray-900 block">
                            {reviewData.manager}
                        </span>
                    </div>
                    <div className="meta-item text-center">
                        <span className="meta-label text-sm text-gray-500 block mb-2">
                            DEPARTMENT
                        </span>
                        <span className="meta-value text-lg font-semibold text-gray-900 block">
                            {reviewData.department}
                        </span>
                    </div>
                </div>

                {/* Self Assessment Section */}
                <div className="review-section mb-12 bg-white p-8 rounded-2xl shadow">
                    <div className="section-header flex items-center gap-4 mb-8">
                        <h2 className="section-title text-2xl font-bold text-gray-900">
                            Self Assessment
                        </h2>
                    </div>
                    {Object.entries(reviewData.selfAssessment).map(
                        ([question, response]) => (
                            <div className="feedback-item mb-8" key={question}>
                                <div className="question text-lg font-semibold text-gray-900 mb-4">
                                    {question}
                                </div>
                                <div className="responses space-y-4 pl-4">
                                    <div className="response flex flex-col md:flex-row gap-6 relative items-start">
                                        <QuoteIcon />
                                        <div className="response-text text-gray-700 leading-relaxed">
                                            {response}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                </div>

                {/* Peer Feedback Section */}
                <div className="review-section mb-12 bg-white p-8 rounded-2xl shadow">
                    <div className="section-header flex items-center gap-4 mb-8">
                        <h2 className="section-title text-2xl font-bold text-gray-900">
                            Peer Feedback
                        </h2>
                    </div>
                    {Object.entries(reviewData.peerFeedback).map(
                        ([question, responses]) => (
                            <div className="feedback-item mb-8" key={question}>
                                <div className="question text-lg font-semibold text-gray-900 mb-4">
                                    {question}
                                </div>
                                <div className="responses space-y-4 pl-4">
                                    {responses.map((text, idx) => (
                                        <div
                                            className="response flex flex-col md:flex-row gap-6 relative items-start"
                                            key={idx}
                                        >
                                            <QuoteIcon />
                                            <div className="response-text text-gray-700 leading-relaxed">
                                                {text}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>

            {/* Export Controls */}
            <>
                <button
                    className="export-button fixed bottom-8 right-8 bg-brand text-white w-10 sm:w-16 h-10 sm:h-16 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition"
                    onClick={() => setExportOpen(true)}
                >
                    <Download size={24} />
                </button>

                {exportOpen && (
                    <div
                        className="export-modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                        onClick={() => setExportOpen(false)}
                    >
                        <div
                            className="modal-content bg-white p-8 rounded-2xl w-11/12 max-w-md"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-header flex justify-between items-center mb-6">
                                <h3 className="modal-title text-xl font-semibold text-gray-900">
                                    Export Review
                                </h3>
                                <button
                                    className="close-button text-gray-500 hover:text-gray-900"
                                    onClick={() => setExportOpen(false)}
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="export-options flex flex-col gap-4">
                                <button
                                    className="export-option flex items-center gap-4 p-4 bg-gray-100 rounded-lg hover:bg-gray-200"
                                    onClick={sendReviewEmail}
                                >
                                    <Mail size={24} />
                                    <div className="export-option-text text-left">
                                        <h4 className="export-option-title font-semibold text-gray-900">
                                            Email Review
                                        </h4>
                                        <p className="export-option-description text-sm text-gray-500">
                                            Send this review to employee
                                        </p>
                                    </div>
                                </button>
                                <button
                                    className="export-option flex items-center gap-4 p-4 bg-gray-100 rounded-lg hover:bg-gray-200"
                                    onClick={exportPDF}
                                >
                                    <Download size={24} />
                                    <div className="export-option-text text-left">
                                        <h4 className="export-option-title font-semibold text-gray-900">
                                            Download PDF
                                        </h4>
                                        <p className="export-option-description text-sm text-gray-500">
                                            Save review as PDF file
                                        </p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </>
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
                <path d="M198.779,322.441v-58.245c0-7.903,6.406-14.304,14.304-14.304c28.183,0,43.515-28.904,45.643-85.961h-45.643 c-7.897,0-14.304-6.41-14.304-14.304V26.64c0-7.9,6.406-14.301,14.304-14.301h121.69c7.896,0,14.305,6.408,14.305,14.301v122.988 c0,27.349-2.761,52.446-8.181,74.611c-5.568,22.722-14.115,42.587-25.398,59.049c-11.604,16.917-26.132,30.192-43.155,39.437 c-17.152,9.304-37.09,14.026-59.267,14.026C205.186,336.745,198.779,330.338,198.779,322.441z M14.301,249.887 C6.404,249.887,0,256.293,0,264.185v58.257c0,7.896,6.404,14.298,14.301,14.298c22.166,0,42.114-4.723,59.255-14.026 c17.032-9.244,31.558-22.508,43.161-39.437c11.29-16.462,19.836-36.328,25.404-59.061c5.423-22.165,8.178-47.263,8.178-74.6V26.628 c0-7.9-6.41-14.301-14.304-14.301H14.301C6.404,12.327,0,18.734,0,26.628v122.988c0,7.899,6.404,14.304,14.301,14.304h45.002 C57.201,220.982,42.09,249.887,14.301,249.887z"></path>
            </svg>
        </div>
    )
}
