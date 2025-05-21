import { ReviewProcessSettings } from "@/components/Dashboard/Settings/ReviewProcessSettings";
import { CompanyInformationSettings } from "@/components/Dashboard/Settings/CompanyInformationSettings";

export default function DashboardSettingsPage() {
    return (
        <div className="space-y-10 pb-8 overflow-hidden">
            {/* Review Process */}
            <ReviewProcessSettings />

            {/* Company Info */}
            <CompanyInformationSettings />
        </div>
    );
};