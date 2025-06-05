// app/employee/dashboard/peer-selection/[reviewCycleId]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

type Employee = {
    code: string;
    firstName: string;
    lastName: string;
    department: string;
    managerCode?: string;
};

export default function ReviewCyclePeerSelectionPage() {
    // ─── State ───────────────────────────────────────────────────────────
    const { user } = useAuth();

    const [employeeName, setEmployeeName] = useState(user.name || "");
    const [maxSelections, setMaxSelections] = useState(4);
    const [availablePeers, setAvailablePeers] = useState<Employee[]>([]);
    const [selectedPeers, setSelectedPeers] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [submissionMessage, setSubmissionMessage] = useState<string | null>(null);

    // New state: whether this user has already selected peers for this cycle
    const [alreadySelected, setAlreadySelected] = useState(false);

    // ─── Helper to group by department ───────────────────────────────────
    const groupByDepartment = (employees: Employee[]) => {
        return employees.reduce<Record<string, Employee[]>>((acc, emp) => {
            const dept = emp.department || "Other";
            acc[dept] = acc[dept] || [];
            acc[dept].push(emp);
            return acc;
        }, {});
    };

    // ─── Extract reviewCycleId from URL via useParams() ────────────────
    const params = useParams();
    const reviewCycleId = params?.reviewCycleId || "";

    // ─── Fetch “employees by department” + “review cycle” from backend ──
    useEffect(() => {
        async function fetchData() {
            setLoading(true);

            try {
                // 1️⃣ Grab your JWT from localStorage
                const token = localStorage.getItem("elevu_auth");
                if (!token) {
                    throw new Error("No auth token found. Please log in again.");
                }

                // 2️⃣ Call the get-employee-by-department endpoint
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_SERVER_URL}/employee/get-employee-by-department/${reviewCycleId}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!res.ok) {
                    throw new Error(`Failed to fetch employees (status ${res.status})`);
                }

                const json = await res.json();

                console.log("Fetched data:", json);

                // Check if the backend indicates "already selected peers"
                const isAlready = json.data.is_already_selected_peers === true;
                if (isAlready) {
                    setAlreadySelected(true);
                    return;
                }

                // Otherwise, proceed to process employees_data and review_cycle
                const { employees_data, review_cycle } = json.data;

                // Set maxSelections exactly as returned
                setMaxSelections(review_cycle.max_peer_selection);

                // Flatten “employees_data” into our Employee[] shape
                const flatPeers: Employee[] = employees_data.flatMap((deptObj: any) =>
                    deptObj.employees.map((emp: any) => {
                        const [first, ...rest] = emp.name.split(" ");
                        return {
                            code: emp.employee_id.toString(),
                            firstName: first,
                            lastName: rest.join(" ") || "",
                            department: deptObj.department,
                        };
                    })
                );

                setAvailablePeers(flatPeers);
            } catch (err: any) {
                console.error("Error loading data:", err);
                toast.error(err.message || "Something went wrong.");
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [reviewCycleId, user]);

    // ─── When the user toggles a checkbox ────────────────────────────────
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

    // ─── Handle “Submit” click ───────────────────────────────────────────
    async function submitSelections() {
        if (selectedPeers.length === 0) {
            toast.error("Please select at least one peer");
            return;
        }

        try {
            // 1️⃣ Grab your JWT from localStorage
            const token = localStorage.getItem("elevu_auth");
            if (!token) {
                throw new Error("No auth token found. Please log in again.");
            }

            // 2️⃣ Convert selectedPeers (string[]) to numbers[]
            const employeeIds = selectedPeers.map((code) => parseInt(code, 10));

            // 3️⃣ POST to /employee/select-peer-list/{reviewCycleId}
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/employee/select-peer-list/${reviewCycleId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ employee_ids: employeeIds }),
                }
            );

            if (!res.ok) {
                // If backend returns an error (400/500), show toast
                const errorData = await res.json().catch(() => ({}));
                const msg =
                    errorData?.message ||
                    `Failed to submit selections (status ${res.status})`;
                throw new Error(msg);
            }

            // 4️⃣ On success, show the “Selection Submitted!” UI
            setSubmissionMessage(
                `Thank you! You selected ${selectedPeers.length} peers.`
            );
        } catch (err: any) {
            console.error("Error submitting selections:", err);
            toast.error(err.message || "Error submitting selections");
        }
    }

    // ─── Group the fetched, flattened peers by department ────────────────
    const peersByDept = groupByDepartment(availablePeers);

    // ─── Loading Skeleton ────────────────────────────────────────────────
    if (loading) {
        return <PeerSelectionSkeleton />;
    }

    // ─── If the user has already selected peers, show a special message ──
    if (alreadySelected) {
        return (
            <Card className="p-8">
                <h2 className="text-lg font-semibold mb-2">
                    Hello, {employeeName}.
                </h2>
                <p className="text-gray-700">
                    You have already selected your peers for this review cycle.
                </p>
            </Card>
        );
    }

    // ─── After Submit (Success) ──────────────────────────────────────────
    if (submissionMessage) {
        return (
            <Card className="p-8">
                <h2 className="text-green-600 text-2xl font-semibold mb-4">
                    Selection Submitted!
                </h2>
                <p>{submissionMessage}</p>
                <ul className="mt-6 list-disc list-inside">
                    {selectedPeers.map((code) => {
                        const peer = availablePeers.find((p) => p.code === code);
                        return (
                            <li key={code}>
                                {peer ? `${peer.firstName} ${peer.lastName}` : code}
                            </li>
                        );
                    })}
                </ul>
            </Card>
        );
    }

    // ─── Main Peer‐Selection UI ──────────────────────────────────────────
    return (
        <Card className="bg-white p-6 space-y-6">
            <header className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-semibold">{employeeName}</h1>
                <div className="text-sm bg-blue-100 text-blue-700 rounded-full px-3 py-1">
                    {selectedPeers.length}/{maxSelections} peers selected
                </div>
            </header>

            <p className="mb-6 text-gray-700">
                Please select up to {maxSelections} colleagues you would like to review
                your performance.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-4">
                {Object.entries(peersByDept).map(([dept, peers]) => (
                    <section
                        key={dept}
                        className="border border-gray-300 rounded-md overflow-hidden flex flex-col"
                    >
                        <h2 className="bg-gray-50 px-4 py-2 font-semibold text-gray-700 border-b border-gray-300">
                            {dept}
                        </h2>
                        <div className="flex-grow overflow-y-auto p-3 grid grid-cols-1 gap-2">
                            {peers.map((peer) => {
                                const isSelected = selectedPeers.includes(peer.code);
                                return (
                                    <label
                                        key={peer.code}
                                        className={`flex h-fit items-center cursor-pointer rounded-md px-3 py-2 text-gray-800 select-none ${isSelected
                                                ? "bg-blue-100 border border-blue-400"
                                                : "hover:bg-gray-100 border border-transparent"
                                            }`}
                                    >
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

            <Button
                onClick={submitSelections}
                disabled={selectedPeers.length === 0}
                className="mt-6"
            >
                Submit Selections
            </Button>
        </Card>
    );
}

// ─── Skeleton (Loading State) ─────────────────────────────────────────────
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
                    <section
                        key={colIdx}
                        className="border border-gray-300 rounded-md overflow-hidden flex flex-col"
                    >
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
