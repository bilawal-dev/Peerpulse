import ReviewsDashboardClient from "@/components/ReviewDashboard/ReviewDashboardClient";

interface PageProps {
    params: { reviewCycleId: string };
}

export default function CycleCompiledReviewPage({ params }: PageProps) {
    const reviewCycleId = Number(params.reviewCycleId);

    return <ReviewsDashboardClient reviewCycleId={reviewCycleId} />;
}
