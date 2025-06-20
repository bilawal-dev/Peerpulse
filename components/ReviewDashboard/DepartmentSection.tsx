import React from "react";
import ReviewCard from "./ReviewCard";

interface Review { id:number, name: string; manager: string; status: "Completed" | "Pending" }
interface Props { department: string; reviews: Review[]; reviewCycleId: number }

export default function DepartmentSection({ department, reviews, reviewCycleId }: Props) {
    const total = reviews.length;
    const completed = reviews.filter((r) => r.status === "Completed").length;

    return (
        <section className="bg-white rounded-2xl p-8 max-sm:px-6 mb-12 shadow">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b-[1px] gap-5 sm:gap-0 border-gray-200 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{department}</h2>
                <div className="flex gap-4 text-gray-600">
                    <span className="bg-gray-100 px-4 py-2 rounded-lg text-sm">{total} Reviews</span>
                    <span className="bg-gray-100 px-4 py-2 rounded-lg text-sm">{completed} Completed</span>
                </div>
            </div>

            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {reviews.map((r) => (
                    <ReviewCard key={r.name} review={r} reviewCycleId={reviewCycleId}/>
                ))}
            </div>
        </section>
    );
}