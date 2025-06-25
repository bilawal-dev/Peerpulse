"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { AlertCircle } from "lucide-react";
import { set } from "date-fns";

type Employee = {
    code: string;
    firstName: string;
    lastName: string;
    department: string;
    isSelected: boolean;
    managerCode?: string;
};

export default function ReviewCyclePeerSelectionPage() {
    const [employeeName, setEmployeeName] = useState("");
    const [maxSelections, setMaxSelections] = useState(4);
    const [availablePeers, setAvailablePeers] = useState<Employee[]>([]);
    const [selectedPeers, setSelectedPeers] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [submissionMessage, setSubmissionMessage] = useState<string | null>(null);
    const [alreadySelected, setAlreadySelected] = useState(false);
    const [fetchError, setFetchError] = useState<boolean>(false);

    const params = useParams();
    const reviewCycleId = params?.reviewCycleId || "";

    const groupByDepartment = (employees: Employee[]) => employees.reduce<Record<string, Employee[]>>((acc, emp) => {
        const dept = emp.department || "Other";
        acc[dept] = acc[dept] || [];
        acc[dept].push(emp);
        return acc;
    }, {});

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            setFetchError(false);

            try {
                const token = localStorage.getItem("elevu_auth");
                if (!token) throw new Error("No auth token found. Please log in again.");

                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/employee/get-employee-by-department`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        review_cycle_id: reviewCycleId,
                    })
                });
                const json = await res.json();

                if (!json.success) {
                    setFetchError(true);
                    throw new Error(json.message || 'Unable to load peer selection right now.')
                }

                const isAlready = json.data.is_already_selected_peers === true;
                setAlreadySelected(isAlready);

                const { employees_data, review_cycle, employee_name } = json.data;
                setMaxSelections(review_cycle.max_peer_selection);
                setEmployeeName(employee_name);

                const flatPeers: Employee[] = employees_data.flatMap((deptObj: any) =>
                    deptObj.employees.map((emp: any) => {
                        const [first, ...rest] = emp.name.split(" ");
                        return {
                            code: emp.employee_id.toString(),
                            firstName: first,
                            lastName: rest.join(" ") || "",
                            department: deptObj.department,
                            isSelected: emp.is_selected,
                        };
                    })
                );
                setAvailablePeers(flatPeers);

                if (isAlready) {
                    const prev = flatPeers.filter((p) => p.isSelected).map((p) => p.code);
                    setSelectedPeers(prev);
                }
            } catch (err: any) {
                console.error("Error loading data:", err);
                toast.error(err.message || 'Something went wrong while loading peers.')
                setFetchError(true);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [reviewCycleId]);

    async function submitSelections() {
        if (selectedPeers.length === 0) {
            toast.error("Please select at least one peer");
            return;
        }

        try {
            const token = localStorage.getItem("elevu_auth");
            if (!token) throw new Error("No auth token found. Please log in again.");

            const employeeIds = selectedPeers.map((code) => parseInt(code, 10));
            
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/employee/select-peer-list`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    employee_ids: employeeIds,
                    review_cycle_id: reviewCycleId,
                }),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                const msg = errorData?.message || `Failed to submit selections (status ${res.status})`;
                throw new Error(msg);
            }

            setSubmissionMessage(`Thank you! You selected ${selectedPeers.length} peers.`);
        } catch (err: any) {
            console.error("Error submitting selections:", err);
            toast.error(err.message || "Error submitting selections");
        }
    }

    function togglePeerSelection(code: string) {
        if (alreadySelected) return;
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

    const peersByDept = groupByDepartment(availablePeers);

    // Generic error UI
    if (!loading && fetchError) {
        return (
            <Card className="p-8 text-center">
                <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
                <h2 className="text-2xl font-semibold mb-2">Something Went Wrong</h2>
                <p className="text-lg text-gray-600">
                    We couldn't load peer selection right now. Please try again later or contact
                    support if the issue persists.
                </p>
            </Card>
        );
    }

    // Loading skeleton
    if (loading) {
        return <PeerSelectionSkeleton />;
    }

    // After successful submission
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

    // Main peer-selection UI
    return (
        <Card className="bg-white p-6 space-y-6">
            <header className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-semibold">{employeeName}</h1>

                <div className="text-sm bg-blue-100 text-blue-700 rounded-full px-3 py-1">
                    {selectedPeers.length}/{maxSelections} peers selected
                </div>
            </header>

            {alreadySelected ? (
                <p className="text-gray-700">
                    You have already selected your peers for this review cycle.
                </p>
            ) : (
                <p className="text-gray-700">
                    Please select up to {maxSelections} colleagues who you work closely with or
                    know well enough to provide meaningful feedback on your performance.
                </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-4">
                {Object.entries(peersByDept).map(([dept, peers]) => (
                    <section key={dept} className="border border-gray-300 rounded-md overflow-hidden flex flex-col">
                        <h2 className="bg-gray-50 px-4 py-2 font-semibold text-gray-700 border-b border-gray-300">
                            {dept}
                        </h2>
                        <div className="flex-grow overflow-y-auto p-3 grid grid-cols-1 gap-2">
                            {peers.map((peer) => {
                                const isSelected = selectedPeers.includes(peer.code);
                                return (
                                    <label key={peer.code} className={`flex h-fit items-center cursor-pointer rounded-md px-3 py-2 text-gray-800 select-none ${isSelected ? "bg-blue-100 border border-blue-400" : "hover:bg-gray-100 border border-transparent"}`}                                    >
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => togglePeerSelection(peer.code)}
                                            disabled={alreadySelected}
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
                disabled={selectedPeers.length === 0 || alreadySelected}
                className="mt-6"
            >
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
