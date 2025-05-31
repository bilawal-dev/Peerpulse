"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

type Employee = {
    code: string;
    firstName: string;
    lastName: string;
    department: string;
    managerCode?: string;
};

export default function PeerSelectionPage() {
    // State
    const [employeeName, setEmployeeName] = useState("Loading...");
    const [maxSelections, setMaxSelections] = useState(4); // default max selections
    const [availablePeers, setAvailablePeers] = useState<Employee[]>([]);
    const [selectedPeers, setSelectedPeers] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [submissionMessage, setSubmissionMessage] = useState<string | null>(null);

    // Extract employee code from URL (simulate)
    const employeeCode = typeof window !== "undefined" ? window.location.pathname.split('/').pop() || "" : "";

    // Group peers by department helper
    const groupByDepartment = (employees: Employee[]) => {
        return employees.reduce<Record<string, Employee[]>>((acc, emp) => {
            const dept = emp.department || "Other";
            acc[dept] = acc[dept] || [];
            acc[dept].push(emp);
            return acc;
        }, {});
    };

    // Load settings & peers
    useEffect(() => {
        async function fetchData() {
            try {
                // Simulate fetching settings
                const settings = { maxPeerSelections: 3 };
                setMaxSelections((settings.maxPeerSelections || 3) + 1);

                // Simulate fetching employee list with expanded data
                const employees: Employee[] = [
                    { code: "b1", firstName: "Brandon", lastName: "Tuttle", department: "Sales", managerCode: "m1" },

                    // Sales
                    { code: "a1", firstName: "Aaron", lastName: "Kim", department: "Sales" },
                    { code: "e1", firstName: "Edward", lastName: "Andrews", department: "Sales" },
                    { code: "l1", firstName: "Lex", lastName: "Fatianow", department: "Sales" },
                    { code: "v1", firstName: "Varsha", lastName: "Saravana", department: "Sales" },
                    { code: "c1", firstName: "Christopher", lastName: "Trumble", department: "Sales" },
                    { code: "c2", firstName: "Christopher", lastName: "Farnkopf", department: "Sales" },

                    // Business Operations
                    { code: "s1", firstName: "Sam", lastName: "Rivard", department: "Business Operations" },
                    { code: "a2", firstName: "Andrew", lastName: "Campbell", department: "Business Operations" },
                    { code: "c3", firstName: "Courtney", lastName: "Skinner", department: "Business Operations" },
                    { code: "n1", firstName: "Neil", lastName: "Johnson", department: "Business Operations" },
                    { code: "j1", firstName: "Joe", lastName: "Wilkinson", department: "Business Operations" },

                    // Executive
                    { code: "c4", firstName: "Cedric", lastName: "Bernard", department: "Executive" },

                    // Supply
                    { code: "r1", firstName: "Rachel", lastName: "Breton", department: "Supply" },
                    { code: "a3", firstName: "Arnaud", lastName: "Becquart", department: "Supply" },
                    { code: "c5", firstName: "Chad", lastName: "Smith", department: "Supply" },
                    { code: "j2", firstName: "Jacob", lastName: "Bradley", department: "Supply" },
                    { code: "c6", firstName: "Chayla", lastName: "Leishman", department: "Supply" },

                    // Human Resources
                    { code: "a4", firstName: "Aspen", lastName: "Egan", department: "Human Resources" },

                    // Engineering
                    { code: "m1", firstName: "Maggie", lastName: "Cong", department: "Engineering" },
                    { code: "l2", firstName: "Liang", lastName: "Zhou", department: "Engineering" },
                    { code: "a5", firstName: "Atul", lastName: "Tamgave", department: "Engineering" },
                    { code: "s2", firstName: "Spencer", lastName: "Cook", department: "Engineering" },
                    { code: "j3", firstName: "Jared", lastName: "Leishman", department: "Engineering" },
                    { code: "t1", firstName: "Taras", lastName: "Hrynevych", department: "Engineering" },

                    // Data and Finance
                    { code: "j4", firstName: "Josh", lastName: "Manwaring", department: "Data and Finance" },
                    { code: "a6", firstName: "Aubrey", lastName: "Bryant", department: "Data and Finance" },
                    { code: "c7", firstName: "Cassidy", lastName: "Judd", department: "Data and Finance" },
                    { code: "h1", firstName: "Hemang", lastName: "Savla", department: "Data and Finance" },
                ];

                const currentEmployee = employees.find((emp) => emp.code === employeeCode) || employees[0];
                setEmployeeName(`${currentEmployee.firstName} ${currentEmployee.lastName}`);

                // Filter out self and manager from available peers
                const filteredPeers = employees.filter(
                    (peer) => peer.code !== currentEmployee.code && peer.code !== currentEmployee.managerCode
                );
                setAvailablePeers(filteredPeers);

            } catch (error) {
                console.error("Error loading data:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [employeeCode]);

    // Handle checkbox toggle
    function togglePeerSelection(code: string) {
        if (selectedPeers.includes(code)) {
            setSelectedPeers(selectedPeers.filter((c) => c !== code));
        } else {
            if (selectedPeers.length < maxSelections) {
                setSelectedPeers([...selectedPeers, code]);
            } else {
                toast.error(`You can only select up to ${maxSelections} peers.`, {
                    id: "max-peers-error",
                    duration: 2000,
                });
            }
        }
    }

    // Handle submit selections
    async function submitSelections() {
        if (selectedPeers.length === 0) {
            toast.error("Please select at least one peer");
            return;
        }

        try {
            // Replace this with your actual submit logic (API call)
            console.log("Submitting selected peers:", selectedPeers);

            setSubmissionMessage(`Thank you! You selected ${selectedPeers.length} peers.`);
            // Optionally disable further selections or redirect
        } catch (error) {
            toast.error("Error submitting selections");
        }
    }

    // Group peers by department
    const peersByDept = groupByDepartment(availablePeers);

    if (loading) {
        return <PeerSelectionSkeleton />;
    }

    if (submissionMessage) {
        return (
            <Card className="p-8">
                <h2 className="text-green-600 text-2xl font-semibold mb-4">Selection Submitted!</h2>
                <p>{submissionMessage}</p>
                <ul className="mt-6 list-disc list-inside">
                    {selectedPeers.map((code) => {
                        const peer = availablePeers.find((p) => p.code === code);
                        return <li key={code}>{peer ? `${peer.firstName} ${peer.lastName}` : code}</li>;
                    })}
                </ul>
            </Card>
        );
    }

    return (
        <Card className="bg-white p-6 space-y-6">
            <header className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-semibold">{employeeName}</h1>
                <div className="text-sm bg-blue-100 text-blue-700 rounded-full px-3 py-1">
                    {selectedPeers.length}/{maxSelections} peers selected
                </div>
            </header>

            <p className="mb-6 text-gray-700">
                Please select up to {maxSelections} colleagues you would like to review your performance.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-4">
                {Object.entries(peersByDept).map(([dept, peers]) => (
                    <section key={dept} className="border border-gray-300 rounded-md overflow-hidden flex flex-col">
                        <h2 className="bg-gray-50 px-4 py-2 font-semibold text-gray-700 border-b border-gray-300">{dept}</h2>
                        <div className="flex-grow overflow-y-auto p-3 grid grid-cols-1 gap-2">
                            {peers.map((peer) => {
                                const isSelected = selectedPeers.includes(peer.code);
                                return (
                                    <label key={peer.code} className={`flex h-fit items-center cursor-pointer rounded-md px-3 py-2 text-gray-800 select-none ${isSelected ? "bg-blue-100 border border-blue-400" : "hover:bg-gray-100 border border-transparent"}`} >
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => togglePeerSelection(peer.code)}
                                            className="mr-3 w-4 h-4 cursor-pointer"
                                        />
                                        {peer.firstName} {peer.lastName}
                                    </label>
                                );
                            })}
                        </div>
                    </section>
                ))}
            </div>

            <Button onClick={submitSelections} disabled={selectedPeers.length === 0} className="mt-6">
                Submit Selections
            </Button>
        </Card>
    );
}

function PeerSelectionSkeleton() {
    return (
        <div className="animate-pulse space-y-2 p-6">
            <div className="flex justify-between items-center mb-4">
                <div className="h-6 bg-gray-300 rounded w-1/6"></div>
                <div className="h-6 bg-gray-300 rounded w-1/12"></div>
            </div>
            <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-5">
                {[...Array(5)].map((_, colIdx) => (
                    <section key={colIdx} className="border border-gray-300 rounded-md overflow-hidden flex flex-col">
                        <div className="bg-gray-200 h-8 w-full"></div>
                        <div className="flex-grow p-3 space-y-2.5">
                            {[...Array(6)].map((__, idx) => (
                                <div key={idx} className="h-8 bg-gray-300 rounded w-full"></div>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
            <Button className="mt-6 w-24 bg-gray-300"></Button>
        </div>
    );
}