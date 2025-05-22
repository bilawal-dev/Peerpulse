import { ReviewProcessSettings } from "@/components/Dashboard/Settings/ReviewProcessSettings";
import { CompanyInformationSettings } from "@/components/Dashboard/Settings/CompanyInformationSettings";

export default function DashboardSettingsPage() {
    return (
        <div className="space-y-8 pb-8">
            {/* Review Process */}
            <ReviewProcessSettings />

            {/* Company Info */}
            <CompanyInformationSettings />
        </div>
    );
};