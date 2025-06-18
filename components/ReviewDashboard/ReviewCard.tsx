import React from "react";
import Link from "next/link";

interface Props {
    review: { name: string; manager: string; status: string; }
    reviewCycleId: number
}

export default function ReviewCard({ review, reviewCycleId }: Props) {
    return (
        <div className="review-card bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6 transform hover:-translate-y-1 hover:shadow-md transition">
            <h3 className="text-lg font-semibold mb-2">{review.name}</h3>
            <p className="text-sm text-gray-500">{review.manager ? `Manager: ${review.manager}` : 'No Manager'}</p>
            <span className={`inline-block px-3 py-1 my-5 rounded-full text-xs font-medium ${review.status === "Completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                {review.status}
            </span>
            <Link href={`/admin/dashboard/compiled-reviews/${reviewCycleId}/${review.name}`} className="view-button block w-fit bg-brand hover:bg-brand/90 text-white px-4 py-2 rounded-md text-sm font-medium">
                View Review
            </Link>
        </div>
    );
}
