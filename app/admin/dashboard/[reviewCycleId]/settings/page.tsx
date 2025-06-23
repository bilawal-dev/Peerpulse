import { CompanyInformationSettings } from "@/components/Dashboard/Settings/CompanyInformationSettings";

export default function DashboardSettingsPage() {
    return (
        <div className="space-y-8 pb-8">
            {/* Company Info */}
            <CompanyInformationSettings />
        </div>
    );
};