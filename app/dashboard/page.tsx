import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, FileText, Hourglass, Loader, Users } from "lucide-react";

export default function DashboardPage() {
    const totalEmployees = 37;
    const selectionsCompleted = 32;
    const pendingSelections = totalEmployees - selectionsCompleted;
    const completedReviews = 28;
    const inProgress = 0;
    const pendingReviews = totalEmployees - completedReviews; // or your logic

    return (
        <div className="space-y-8">
            {/* ─── Stats Row ─── */}
            <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl" >Peer Review Dashboard</CardTitle>
                    </CardHeader>
                    <CardContent>H2 2024 (Q3-Q4)</CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Total Employees</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center space-x-2">
                        <Users className="h-6 w-6 text-blue-600" />
                        <span className="text-4xl font-bold">{totalEmployees}</span>
                    </CardContent>
                </Card>
            </div>

            {/* ─── Peer Selection Progress ─── */}
            <Card className="space-y-6">
                <CardHeader>
                    <CardTitle>Peer Selection Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                            <div>
                                <p className="text-sm text-gray-500">Selections Completed</p>
                                <p className="text-2xl font-semibold">{selectionsCompleted}</p>
                            </div>
                            <CheckCircle2 className="h-6 w-6 text-blue-600" />
                        </div>

                        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                            <div>
                                <p className="text-sm text-gray-500">Pending Selections</p>
                                <p className="text-2xl font-semibold">{pendingSelections}</p>
                            </div>
                            <Clock className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Progress
                            value={(selectionsCompleted / totalEmployees) * 100}
                            className="flex-1 h-2 rounded-full"

                        />
                        <Button variant="outline" size="sm">
                            <Users className="mr-2 h-4 w-4" />
                            Start Automated Pairing
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* ─── Survey Progress ─── */}
            <Card className="space-y-6">
                <CardHeader>
                    <CardTitle>Survey Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                            <div>
                                <p className="text-sm text-gray-500">Completed Reviews</p>
                                <p className="text-2xl font-semibold">{completedReviews}</p>
                            </div>
                            <CheckCircle2 className="h-6 w-6 text-blue-600" />
                        </div>

                        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                            <div>
                                <p className="text-sm text-gray-500">In Progress</p>
                                <p className="text-2xl font-semibold">{inProgress}</p>
                            </div>
                            <Loader className="h-6 w-6 text-blue-600" />
                        </div>

                        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                            <div>
                                <p className="text-sm text-gray-500">Pending Reviews</p>
                                <p className="text-2xl font-semibold">{pendingReviews}</p>
                            </div>
                            <Hourglass className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Progress
                            value={(completedReviews / (totalEmployees * 3)) * 100}
                            className="flex-1 h-2 rounded-full"
                        />
                        <Button variant="outline" size="sm">
                            <FileText className="mr-2 h-4 w-4" />
                            Compile Reviews
                        </Button>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Missing Reviews From:</p>
                        <p className="mt-1 text-gray-700">—</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
