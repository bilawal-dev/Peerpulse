"use client"

import React, { useState, useMemo, DragEvent, useEffect } from "react"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { User, ArrowLeft, ArrowRight, X as XIcon, Info } from "lucide-react"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import toast from "react-hot-toast"
import { th } from "date-fns/locale"

/** Zone item with assignment ID **/
type ZoneItem = { code: string; assignmentId: number }

/** Employee data model **/
type Employee = {
    code: string
    name: string
    department: string
    reviewers: ZoneItem[]           // willReview zone
    suggestedReviewers: ZoneItem[]  // beingReviewedBy zone
    peerSelections: string[]        // i_selected
    selectedBy: string[]            // i_selected_by_others
    manager?: string
    reviewBy?: number
    willReview?: number
}

/** start empty; we'll fill via API **/
const INITIAL_EMPLOYEES: Employee[] = []

type ReviewCycle = {
    id: string
    label: string
    maxReviewsAllowed: number
}

export default function DashboardPairingPage() {
    const [allEmps, setAllEmps] = useState<Employee[]>(INITIAL_EMPLOYEES)
    const [currentCode, setCurrentCode] = useState<string | null>(null)

    const [cycles, setCycles] = useState<ReviewCycle[]>([])
    const [isLoadingCycles, setIsLoadingCycles] = useState(true)
    const [selectedCycle, setSelectedCycle] = useState<string>("")

    const currentCycle = cycles.find((c) => c.id === selectedCycle)

    // Fetch review cycles once
    useEffect(() => {
        async function fetchCycles() {
            setIsLoadingCycles(true)
            try {
                const token = localStorage.getItem("elevu_auth")
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/company/get-all-review-cycle`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                })
                if (!res.ok) throw new Error("Failed to fetch review cycles")
                const json = await res.json()
                const mapped = (json.data as any[]).map((item) => ({
                    id: String(item.review_cycle_id),
                    label: item.name,
                    maxReviewsAllowed: item.max_reviews_allowed ?? 0,
                }))
                setCycles(mapped)
                if (mapped.length) setSelectedCycle(mapped[0].id)
            } catch (err) {
                console.error(err)
            } finally {
                setIsLoadingCycles(false)
            }
        }
        fetchCycles()
    }, [])

    // Fetch employees whenever selectedCycle changes
    useEffect(() => {
        if (!selectedCycle) return

        async function fetchEmployees() {
            try {
                const token = localStorage.getItem("elevu_auth")
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/company/get-employee-for-review-assignment`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ review_cycle_id: Number(selectedCycle) }),
                })
                if (!res.ok) throw new Error("Failed to fetch employees for review")
                const json = await res.json()
                const mappedEmps: Employee[] = (json.data as any[]).map((item) => {
                    return {
                        code: String(item.employee_id),
                        name: item.name,
                        department: item.department,
                        reviewers: [],
                        suggestedReviewers: [],
                        peerSelections: [],
                        selectedBy: [],
                        manager: undefined,
                        reviewBy: item.reviewBy,
                        willReview: item.willReview,
                    }
                })
                setAllEmps(mappedEmps)
                setCurrentCode(null)
            } catch (err) {
                console.error(err)
            }
        }

        fetchEmployees()
    }, [selectedCycle])

    // Fetch review assignments for zones
    async function fetchReviewAssignments(empCode: string) {
        if (!selectedCycle) return
        try {
            const token = localStorage.getItem("elevu_auth")
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/company/get-review-assignments`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        review_cycle_id: Number(selectedCycle),
                        employee_id: Number(empCode),
                    }),
                }
            )
            if (!res.ok) throw new Error("Failed to fetch review assignments")
            const json = await res.json()
            const { review_by, will_review } = json.data

            const suggested = review_by.map((o: any) => ({
                code: String(o.employee_id),
                assignmentId: o.review_assignment_id,
            }))
            const reviewers = will_review.map((o: any) => ({
                code: String(o.employee_id),
                assignmentId: o.review_assignment_id,
            }))

            setAllEmps((prev) =>
                prev.map((emp) =>
                    emp.code !== empCode
                        ? emp
                        : { ...emp, suggestedReviewers: suggested, reviewers }
                )
            )
        } catch (err) {
            console.error(err)
        }
    }

    // Fetch peer-selections
    async function fetchPeerSelections(empCode: string) {
        if (!selectedCycle) return
        try {
            const token = localStorage.getItem("elevu_auth")
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/company/get-peer-selection-list-by-employee`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        review_cycle_id: Number(selectedCycle),
                        employee_id: Number(empCode),
                    }),
                }
            )
            if (!res.ok) throw new Error("Failed to fetch peer selections")
            const json = await res.json()
            const { i_selected, i_selected_by_others } = json.data

            const selectedCodes = i_selected.map((o: any) => String(o.peer.employee_id))
            const selectedByCodes = i_selected_by_others.map((o: any) => {
                const p = o.peer ?? o.employee
                return String(p.employee_id)
            })

            setAllEmps((prev) =>
                prev.map((emp) =>
                    emp.code !== empCode
                        ? emp
                        : { ...emp, peerSelections: selectedCodes, selectedBy: selectedByCodes }
                )
            )
        } catch (err) {
            console.error(err)
        }
    }

    // Combined click handler
    function handleSelectEmployee(empCode: string) {
        setCurrentCode(empCode)
        fetchPeerSelections(empCode)
        fetchReviewAssignments(empCode)
    }

    // Call remove-assignment then update local state
    async function removeAssignment(zone: "current" | "suggested", code: string, assignmentId: number) {
        if (!selectedCycle || !currentCode) return
        const token = localStorage.getItem("elevu_auth")
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/company/remove-assignment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ review_assignment_id: assignmentId }),
            })

            const json = await res.json()

            if (!json.success) {
                throw new Error(json.message || "Failed to remove assignment")
            }

            // TEST
            // Update both sides in one go:
            setAllEmps((prev) =>
                prev.map((emp) => {
                    // 1) Remove from current employee’s zone
                    if (emp.code === currentCode) {
                        const listKey = zone === "current" ? "reviewers" : "suggestedReviewers";
                        const filtered = (emp as any)[listKey].filter(
                            (z: ZoneItem) => z.code !== code
                        );
                        return {
                            ...emp,
                            [listKey]: filtered,
                            willReview:
                                listKey === "reviewers" ? filtered.length : emp.willReview,
                            reviewBy:
                                listKey === "suggestedReviewers"
                                    ? filtered.length
                                    : emp.reviewBy,
                        };
                    }

                    // 2) Also decrement the OTHER emp’s counter
                    if (emp.code === code) {
                        return {
                            ...emp,
                            willReview:
                                zone === "suggested"
                                    ? emp.reviewers.filter((z) => z.code !== currentCode).length
                                    : emp.willReview,
                            reviewBy:
                                zone === "current"
                                    ? emp.suggestedReviewers.filter(
                                        (z) => z.code !== currentCode
                                    ).length
                                    : emp.reviewBy,
                        };
                    }

                    return emp;
                })
            );
        } catch (err) {
            if (err instanceof Error) {
                toast.error(`Failed to remove assignment: ${err.message}`)
            }
            console.error("remove-assignment failed", err)
        }
    }

    // HR adjust on drop
    async function hrAdjust(zone: "current" | "suggested", draggedCode: string, targetCode: string) {
        if (!selectedCycle) return;
        const token = localStorage.getItem("elevu_auth");
        const employee_id = zone === "current" ? Number(draggedCode) : Number(targetCode);
        const peer_id = zone === "current" ? Number(targetCode) : Number(draggedCode);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/company/hr-adjust-review-assignment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    review_cycle_id: Number(selectedCycle),
                    employee_id,
                    peer_id,
                    isManual: true,
                }),
            });

            const json = await res.json();

            if (!json.success) {
                throw new Error(json.message || "Failed to adjust review assignment");
            }
            const newAssignmentId = json.data.review_assignment_id;

            // TEST
            // Now update state for both people in one go:
            setAllEmps((prev) =>
                prev.map((emp) => {
                    // 1) Update the zone array & assignmentId for the *current* emp
                    if (emp.code === targetCode) {
                        const listKey = zone === "current" ? "reviewers" : "suggestedReviewers";
                        const updatedList = (emp as any)[listKey].map((z: ZoneItem) =>
                            z.code === draggedCode && z.assignmentId === 0
                                ? { ...z, assignmentId: newAssignmentId }
                                : z
                        );
                        return {
                            ...emp,
                            [listKey]: updatedList,
                            // recompute its counter
                            willReview:
                                listKey === "reviewers"
                                    ? (updatedList as ZoneItem[]).length
                                    : emp.willReview,
                            reviewBy:
                                listKey === "suggestedReviewers"
                                    ? (updatedList as ZoneItem[]).length
                                    : emp.reviewBy,
                        };
                    }

                    // 2) Also update the OTHER emp's counter
                    if (emp.code === draggedCode) {
                        // they gain one more review to do / get reviewed by
                        return {
                            ...emp,
                            willReview:
                                zone === "suggested"
                                    ? (emp.reviewers.length + 1)
                                    : emp.willReview,
                            reviewBy:
                                zone === "current"
                                    ? (emp.suggestedReviewers.length + 1)
                                    : emp.reviewBy,
                        };
                    }

                    return emp;
                })
            );
        } catch (error) {
            if (error instanceof Error) {
                toast.error(`Failed to adjust assignment: ${error.message}`);
            }
            console.error("HR adjust failed", error);
        }
    }

    // On drop
    function handleDrop(e: DragEvent<HTMLDivElement>, zone: "current" | "suggested") {
        e.preventDefault()
        const code = e.dataTransfer.getData("text/plain")
        if (!currentCode) return;

        addToZone(zone, code)

        hrAdjust(zone, code, currentCode)
    }

    // Zone mutators
    function addToZone(zone: "current" | "suggested", code: string) {
        if (!currentEmp) return
        setAllEmps((prev) =>
            prev.map((emp) => {
                if (emp.code !== currentEmp.code) return emp
                const reviewers = [...emp.reviewers]
                const suggested = [...emp.suggestedReviewers]
                if (zone === "current" && !reviewers.some((z) => z.code === code)) {
                    reviewers.push({ code, assignmentId: 0 })
                }
                if (zone === "suggested" && !suggested.some((z) => z.code === code)) {
                    suggested.push({ code, assignmentId: 0 })
                }
                return { ...emp, reviewers, suggestedReviewers: suggested }
            })
        )
    }

    function onDragStart(e: DragEvent<HTMLDivElement>, code: string) {
        e.dataTransfer.setData("text/plain", code)
    }

    // Helpers & derived state
    const currentEmp = useMemo(
        () => allEmps.find((e) => e.code === currentCode) || null,
        [allEmps, currentCode]
    )
    const peers = useMemo(
        () => (currentEmp ? allEmps.filter((e) => e.code !== currentEmp.code) : []),
        [allEmps, currentEmp]
    )
    const getEmpByCode = (code: string) => allEmps.find((e) => e.code === code) || null
    const zones = useMemo(
        () =>
            currentEmp
                ? { current: currentEmp.reviewers, suggested: currentEmp.suggestedReviewers }
                : { current: [], suggested: [] },
        [currentEmp]
    )
    const selectedList = currentEmp ? currentEmp.peerSelections : []
    const selectedByList = currentEmp ? currentEmp.selectedBy : []
    const mutualList = currentEmp
        ? selectedList.filter((c) => selectedByList.includes(c))
        : []
    const availableList = currentEmp
        ? peers
            .filter((e) => !selectedList.includes(e.code) && !selectedByList.includes(e.code))
            .map((e) => e.code)
        : []

    // Chip component
    function Chip({ code, zone, assignmentId, draggable = false, }: { code: string, zone?: "current" | "suggested", assignmentId?: number, draggable?: boolean, }) {
        const emp = getEmpByCode(code)!
        return (
            <div
                draggable={draggable}
                onDragStart={draggable ? (e) => onDragStart(e, code) : undefined}
                className={`${draggable ? "cursor-grab" : "cursor-default"} flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 bg-white border border-gray-200 rounded-md px-3 py-2 mb-2`}
            >
                <div className="flex-1 text-gray-800 font-medium">
                    {emp.name}
                </div>
                <div className="flex items-center space-x-2 text-gray-500 text-xs">
                    <div className="flex items-center space-x-0.5">
                        <User className="w-4 h-4 text-gray-500" />
                        <ArrowLeft className="w-4 h-4 text-blue-500" />
                        <span>{emp.selectedBy.length}/{currentCycle?.maxReviewsAllowed ?? 0}</span>
                    </div>
                    <div className="flex items-center space-x-0.5">
                        <User className="w-4 h-4 text-gray-500" />
                        <ArrowRight className="w-4 h-4 text-blue-500" />
                        <span>{emp.reviewers.length}/{currentCycle?.maxReviewsAllowed ?? 0}</span>
                    </div>
                    {zone && assignmentId != null && (
                        <button onClick={() => removeAssignment(zone, code, assignmentId)} className="ml-2 p-1 hover:bg-gray-100 rounded" title="Remove"                        >
                            <XIcon className="w-4 h-4 text-red-500" />
                        </button>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8 pb-8">
            <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
                {/* Header */}
                <CardHeader>
                    <div className="flex items-center justify-between mb-5">
                        <CardTitle>Manual Pairing Adjustments</CardTitle>
                        <TooltipProvider delayDuration={100}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button className="p-1 rounded hover:bg-gray-100">
                                        <Info className="w-5 h-5" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent
                                    side="top"
                                    align="center"
                                    className="bg-black/90 text-white text-sm px-2 py-1 rounded"
                                >
                                    Select an employee and drag employees from the pools below
                                    into “Being Reviewed By” or “Will Review” to assign them.
                                    <br />
                                    <br />
                                    Use the cross on an employee to remove an assignment.
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    {isLoadingCycles ? (
                        <p className="text-sm text-gray-500">Loading cycles…</p>
                    ) : cycles.length === 0 ? (
                        <p className="text-base text-red-500">No review cycles found. Create one first.</p>
                    ) : (
                        <Select value={selectedCycle} onValueChange={setSelectedCycle}>
                            <h1 className="font-medium">Select Review Cycle</h1>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select review cycle" className="font-semibold" />
                            </SelectTrigger>
                            <SelectContent>
                                {cycles.map((c) => (
                                    <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}

                    <div className="px-4 py-2 bg-blue-50 rounded-md text-blue-800">
                        Currently working on:{" "}
                        <span className="font-medium">
                            {currentEmp ? `${currentEmp.name}` : "No employee selected"}
                        </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-6 bg-gray-50 p-3 border border-gray-200 rounded-md">
                        <div className="flex items-center space-x-1 text-gray-600 text-sm">
                            <User className="w-5 h-5" />
                            <ArrowLeft className="w-5 h-5 text-blue-500 -mt-0.5" />
                            <span>Being reviewed by</span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-600 text-sm">
                            <User className="w-5 h-5" />
                            <ArrowRight className="w-5 h-5 text-blue-500 -mt-1" />
                            <span>Reviewing others</span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-600 text-sm">
                            <span className="text-blue-500 font-medium">/ {currentCycle?.maxReviewsAllowed ?? 0}</span>
                            <span>Maximum reviews</span>
                        </div>
                    </div>
                </CardHeader>

                {/* Body */}
                <CardContent className="flex flex-wrap overflow-y-auto gap-6 select-none">
                    {/* Left: Employee List */}
                    <div className="flex flex-col w-full md:w-80">
                        <select
                            className="mb-4 p-2 border border-gray-200 rounded-md bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                            onChange={() => { }}
                        >
                            <option value="mostSelected">Most Selected</option>
                            <option value="leastSelected">Least Selected</option>
                            <option value="name">Name</option>
                        </select>

                        <div className="flex-1 overflow-y-auto border border-gray-200 rounded-md">
                            {allEmps.map((emp) => (
                                <div
                                    key={emp.code}
                                    onClick={() => handleSelectEmployee(emp.code)}
                                    className={`flex flex-col sm:flex-row justify-between sm:items-center gap-2 sm:gap-0 px-4 py-3 cursor-pointer ${currentCode === emp.code ? "bg-blue-50" : "hover:bg-gray-50"}`}
                                >
                                    <div className="font-medium text-gray-800">
                                        {emp.name}
                                    </div>
                                    <div className="flex items-center space-x-2 text-gray-500 text-xs">
                                        <div className="flex items-center space-x-0.5">
                                            <User className="w-4 h-4 text-gray-500" />
                                            <ArrowLeft className="w-4 h-4 text-blue-500" />
                                            <span>
                                                {emp.reviewBy ?? 0}/{currentCycle?.maxReviewsAllowed ?? 0}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-0.5">
                                            <User className="w-4 h-4 text-gray-500" />
                                            <ArrowRight className="w-4 h-4 text-blue-500" />
                                            <span>
                                                {emp.willReview ?? 0}/{currentCycle?.maxReviewsAllowed ?? 0}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Selected Employee Details */}
                    <div className="flex-1 border border-gray-200 rounded-lg bg-white">
                        <div className="p-6">
                            {!currentEmp ? (
                                <p className="text-gray-600">Select an employee to adjust pairings.</p>
                            ) : (
                                <>
                                    <h3 className="text-xl font-semibold flex items-center gap-5 text-gray-900 mb-6">
                                        {currentEmp.name}
                                        <span className="text-base text-blue-500 font-normal"> | {currentEmp.department}</span>
                                    </h3>

                                    {/* Drag-and-drop zones */}
                                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
                                        {/* Being Reviewed By */}
                                        <div
                                            className="flex-1 min-w-[250px]"
                                            onDragOver={(e) => e.preventDefault()}
                                            onDrop={(e) => handleDrop(e, "suggested")}
                                        >
                                            <h4 className="text-lg font-medium text-gray-800 mb-2">Being Reviewed By</h4>
                                            <div className="min-h-[180px] p-3 bg-gray-50 border border-gray-200 rounded-md">
                                                {zones.suggested.map((item) => (
                                                    <Chip
                                                        key={item.code}
                                                        code={item.code}
                                                        assignmentId={item.assignmentId}
                                                        zone="suggested"
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        {/* Will Review */}
                                        <div
                                            className="flex-1 min-w-[250px]"
                                            onDragOver={(e) => e.preventDefault()}
                                            onDrop={(e) => handleDrop(e, "current")}
                                        >
                                            <h4 className="text-lg font-medium text-gray-800 mb-2">Will Review</h4>
                                            <div className="min-h-[180px] p-3 bg-gray-50 border border-gray-200 rounded-md">
                                                {zones.current.map((item) => (
                                                    <Chip
                                                        key={item.code}
                                                        code={item.code}
                                                        assignmentId={item.assignmentId}
                                                        zone="current"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Option Pool */}
                                    <div className="space-y-6">
                                        <h4 className="text-xl font-semibold text-gray-800 mb-4">Option Pool</h4>
                                        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
                                            <div>
                                                <h5 className="text-md font-medium text-gray-700 mb-2">
                                                    {currentEmp.name} Selected ({selectedList.length})
                                                </h5>
                                                <div className="space-y-2">
                                                    {selectedList.map((code) => (
                                                        <Chip key={code} code={code} draggable />
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <h5 className="text-md font-medium text-gray-700 mb-2">
                                                    Selected {currentEmp.name} ({selectedByList.length})
                                                </h5>
                                                <div className="space-y-2">
                                                    {selectedByList.map((code) => (
                                                        <Chip key={code} code={code} draggable />
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <h5 className="text-md font-medium text-gray-700 mb-2">
                                                    Mutual Selections ({mutualList.length})
                                                </h5>
                                                <div className="space-y-2">
                                                    {mutualList.map((code) => (
                                                        <Chip key={code} code={code} draggable />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* All Available Employees */}
                                    <div className="mt-8">
                                        <Accordion type="single" collapsible className="space-y-2">
                                            <AccordionItem value="available" className="border-b-0">
                                                <AccordionTrigger className="text-xl font-semibold text-gray-800">
                                                    All Available Employees ({availableList.length})
                                                </AccordionTrigger>
                                                <AccordionContent className="pt-4">
                                                    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-x-6">
                                                        {availableList.map((code) => (
                                                            <Chip key={code} code={code} draggable />
                                                        ))}
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
