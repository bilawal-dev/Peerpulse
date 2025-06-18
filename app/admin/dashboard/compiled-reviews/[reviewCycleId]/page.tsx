import ReviewsDashboardClient from "@/components/ReviewDashboard/ReviewDashboardClient";

interface PageProps {
    params: { reviewCycleId: string };
}

export default function CycleCompiledReviewPage({ params }: PageProps) {
    const cycleId = Number(params.reviewCycleId);

    return <ReviewsDashboardClient reviewCycleId={cycleId} />;
}
