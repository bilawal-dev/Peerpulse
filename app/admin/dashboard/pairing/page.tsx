"use client"

import React, { useState, useMemo, DragEvent } from "react"
import { User, ArrowLeft, ArrowRight, UserCheck, X as XIcon, Info } from "lucide-react"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

/** Employee data model **/
type Employee = {
    code: string
    firstName: string
    lastName: string
    reviewers: string[]           // codes of employees currently reviewing this one
    suggestedReviewers: string[]  // codes of employees suggested to review this one
    peerSelections: string[]      // codes this employee wants to review
    selectedBy: string[]          // codes of employees who want to review this one
    manager?: string
}

/** Static mock data. Replace/fetch from an API later **/
const INITIAL_EMPLOYEES: Employee[] = [
    {
        code: "E001", firstName: "Alice", lastName: "Johnson",
        reviewers: ["E002", "E005"], suggestedReviewers: ["E003", "E006"],
        peerSelections: ["E002", "E003"], selectedBy: ["E002", "E005"], manager: "M001"
    },
    {
        code: "E002", firstName: "Bob", lastName: "Smith",
        reviewers: ["E003"], suggestedReviewers: ["E001"],
        peerSelections: ["E001", "E004"], selectedBy: ["E001"], manager: "M001"
    },
    {
        code: "E003", firstName: "Carol", lastName: "Lee",
        reviewers: ["E001", "E004"], suggestedReviewers: ["E002"],
        peerSelections: ["E001", "E002", "E006"], selectedBy: ["E001", "E004"], manager: "M002"
    },
    {
        code: "E004", firstName: "David", lastName: "Wang",
        reviewers: [], suggestedReviewers: ["E003", "E007"],
        peerSelections: ["E003"], selectedBy: ["E002", "E006"], manager: "M002"
    },
    {
        code: "E005", firstName: "Emily", lastName: "Davis",
        reviewers: ["E001"], suggestedReviewers: [],
        peerSelections: ["E001", "E007"], selectedBy: ["E001", "E006"], manager: "M001"
    },
    {
        code: "E006", firstName: "Frank", lastName: "Martinez",
        reviewers: ["E003", "E005"], suggestedReviewers: ["E001"],
        peerSelections: ["E003", "E004"], selectedBy: ["E003"], manager: "M003"
    },
    {
        code: "E007", firstName: "Grace", lastName: "Nguyen",
        reviewers: ["E004"], suggestedReviewers: ["E006"],
        peerSelections: ["E005"], selectedBy: ["E004", "E006"], manager: "M003"
    },
    {
        code: "E008", firstName: "Henry", lastName: "Patel",
        reviewers: [], suggestedReviewers: [],
        peerSelections: [], selectedBy: [], manager: "M002"
    },
]

export default function DashboardPairingPage() {
    const [allEmps, setAllEmps] = useState<Employee[]>(INITIAL_EMPLOYEES)
    const [currentCode, setCurrentCode] = useState<string | null>(null)

    const currentEmp = useMemo(
        () => allEmps.find((e) => e.code === currentCode) || null,
        [allEmps, currentCode]
    )

    const peers = useMemo(() => {
        if (!currentEmp) return []
        return allEmps.filter((e) => e.code !== currentEmp.code)
    }, [allEmps, currentEmp])

    const getEmpByCode = (code: string) =>
        allEmps.find((e) => e.code === code) || null

    const zones = useMemo(() => {
        if (!currentEmp) return { current: [], suggested: [] }
        return {
            current: [...currentEmp.reviewers],
            suggested: [...currentEmp.suggestedReviewers],
        }
    }, [currentEmp])

    const selectedList = currentEmp ? currentEmp.peerSelections : []
    const selectedByList = currentEmp ? currentEmp.selectedBy : []
    const mutualList = currentEmp
        ? currentEmp.peerSelections.filter((c) =>
            currentEmp.selectedBy.includes(c)
        )
        : []
    const availableList = currentEmp
        ? peers
            .filter(
                (e) =>
                    !selectedList.includes(e.code) &&
                    !selectedByList.includes(e.code)
            )
            .map((e) => e.code)
        : []

    function removeFromZone(zone: "current" | "suggested", code: string) {
        if (!currentEmp) return
        setAllEmps((prev) =>
            prev.map((emp) => {
                if (emp.code !== currentEmp.code) return emp
                return {
                    ...emp,
                    reviewers:
                        zone === "current"
                            ? emp.reviewers.filter((c) => c !== code)
                            : emp.reviewers,
                    suggestedReviewers:
                        zone === "suggested"
                            ? emp.suggestedReviewers.filter((c) => c !== code)
                            : emp.suggestedReviewers,
                }
            })
        )
    }

    function addToZone(zone: "current" | "suggested", code: string) {
        if (!currentEmp) return
        setAllEmps((prev) =>
            prev.map((emp) => {
                if (emp.code !== currentEmp.code) return emp
                const reviewers = [...emp.reviewers]
                const suggested = [...emp.suggestedReviewers]
                if (zone === "current" && !reviewers.includes(code)) {
                    reviewers.push(code)
                }
                if (zone === "suggested" && !suggested.includes(code)) {
                    suggested.push(code)
                }
                return { ...emp, reviewers, suggestedReviewers: suggested }
            })
        )
    }

    function onDragStart(e: DragEvent<HTMLDivElement>, code: string) {
        e.dataTransfer.setData("text/plain", code)
    }

    // Chip component for both draggable pool items and removable zone items
    function Chip({ code, zone, draggable = false, }: { code: string, zone?: "current" | "suggested", draggable?: boolean }) {
        const emp = getEmpByCode(code)!
        return (
            <div
                draggable={draggable}
                onDragStart={
                    draggable ? (e) => onDragStart(e, code) : undefined
                }
                className={`${draggable ? 'cursor-grab' : 'cursor-default'} flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 bg-white border border-gray-200 rounded-md px-3 py-2 mb-2`}
            >
                <div className="flex-1 text-gray-800 font-medium">
                    {emp.firstName} {emp.lastName}
                </div>
                <div className="flex items-center space-x-2 text-gray-500 text-xs">
                    <div className="flex items-center space-x-0.5">
                        <User className="w-4 h-4 text-gray-500" />
                        <ArrowLeft className="w-4 h-4 text-blue-500" />
                        <span>{emp.reviewers.length}/3</span>
                    </div>
                    <div className="flex items-center space-x-0.5">
                        <User className="w-4 h-4 text-gray-500" />
                        <ArrowRight className="w-4 h-4 text-blue-500" />
                        <span>{emp.selectedBy.length}/3</span>
                    </div>
                    {zone && (
                        <button
                            onClick={() => removeFromZone(zone, code)}
                            className="ml-2 p-1 hover:bg-gray-100 rounded"
                            title="Remove"
                        >
                            <XIcon className="w-4 h-4 text-red-500" />
                        </button>
                    )}
                </div>
            </div>
        )
    }

    // Handles drop on a zone
    function handleDrop(
        e: DragEvent<HTMLDivElement>,
        zone: "current" | "suggested"
    ) {
        e.preventDefault()
        const code = e.dataTransfer.getData("text/plain")
        addToZone(zone, code)
    }

    return (
        <div className="space-y-8 pb-8">
            <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
                {/* Header */}
                <CardHeader className="">
                    <div className="flex items-center justify-between mb-5">
                        <CardTitle>
                            Manual Pairing Adjustments
                        </CardTitle>

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
                                    Select an employee and drag employees from the pools below into “Being Reviewed By” or “Will Review” to assign them.
                                    <br /><br />
                                    Use the cross on an employee to remove an assignment.
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <div className="mt-5 px-4 py-2 bg-blue-50 rounded-md text-blue-800">
                        Currently working on:{" "}
                        <span className="font-medium">
                            {currentEmp
                                ? `${currentEmp.firstName} ${currentEmp.lastName}`
                                : "No employee selected"}
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
                            <span className="text-blue-500 font-medium">/ 3</span>
                            <span>Required reviews</span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-600 text-sm">
                            <div className="flex items-center justify-center bg-blue-50 border border-blue-200 rounded-full w-6 h-6">
                                <UserCheck className="w-4 h-4 text-blue-500" />
                            </div>
                            <span>Selected you as reviewer</span>
                        </div>
                    </div>
                </CardHeader>

                {/* Body */}
                <CardContent className="flex flex-wrap overflow-y-auto gap-6  select-none">
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
                                    className={`flex flex-col sm:flex-row justify-between sm:items-center gap-2 sm:gap-0 px-4 py-3 cursor-pointer ${currentCode === emp.code ? "bg-blue-50" : "hover:bg-gray-50"
                                        }`}
                                    onClick={() => setCurrentCode(emp.code)}
                                >
                                    <div className="font-medium text-gray-800">
                                        {emp.firstName} {emp.lastName}
                                    </div>
                                    <div className="flex items-center space-x-2 text-gray-500 text-xs">
                                        <div className="flex items-center space-x-0.5">
                                            <User className="w-4 h-4 text-gray-500" />
                                            <ArrowLeft className="w-4 h-4 text-blue-500" />
                                            <span>{emp.reviewers.length}/3</span>
                                        </div>
                                        <div className="flex items-center space-x-0.5">
                                            <User className="w-4 h-4 text-gray-500" />
                                            <ArrowRight className="w-4 h-4 text-blue-500" />
                                            <span>{emp.selectedBy.length}/3</span>
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
                                    <h3 className="text-xl font-semibold text-gray-900 mb-6">
                                        {currentEmp.firstName} {currentEmp.lastName}
                                    </h3>

                                    {/* Drag-and-drop via native HTML events */}
                                    <div className="flex flex-wrap gap-6 mb-8">
                                        {/* Being Reviewed By */}
                                        <div
                                            className="flex-1 min-w-[250px]"
                                            onDragOver={(e) => e.preventDefault()}
                                            onDrop={(e) => handleDrop(e, "suggested")}
                                        >
                                            <h4 className="text-lg font-medium text-gray-800 mb-2">
                                                Being Reviewed By
                                            </h4>
                                            <div className="min-h-[180px] p-3 bg-gray-50 border border-gray-200 rounded-md">
                                                {zones.suggested.map((code, i) => (
                                                    <Chip key={code} code={code} zone="suggested" />
                                                ))}
                                            </div>
                                        </div>

                                        {/* Will Review */}
                                        <div
                                            className="flex-1 min-w-[250px]"
                                            onDragOver={(e) => e.preventDefault()}
                                            onDrop={(e) => handleDrop(e, "current")}
                                        >
                                            <h4 className="text-lg font-medium text-gray-800 mb-2">
                                                Will Review
                                            </h4>
                                            <div className="min-h-[180px] p-3 bg-gray-50 border border-gray-200 rounded-md">
                                                {zones.current.map((code, i) => (
                                                    <Chip key={code} code={code} zone="current" />
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Option Pool */}
                                    <div className="space-y-6">
                                        <h4 className="text-xl font-semibold text-gray-800 mb-4">
                                            Option Pool
                                        </h4>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
                                            <div>
                                                <h5 className="text-md font-medium text-gray-700 mb-2">
                                                    Selected ({selectedList.length})
                                                </h5>
                                                <div className="space-y-2">
                                                    {selectedList.map((code, i) => (
                                                        <Chip key={code} code={code} draggable />
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <h5 className="text-md font-medium text-gray-700 mb-2">
                                                    {currentEmp.firstName} Selected ({selectedByList.length})
                                                </h5>
                                                <div className="space-y-2">
                                                    {selectedByList.map((code, i) => (
                                                        <Chip key={code} code={code} draggable />
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <h5 className="text-md font-medium text-gray-700 mb-2">
                                                    Mutual Selections ({mutualList.length})
                                                </h5>
                                                <div className="space-y-2">
                                                    {mutualList.map((code, i) => (
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
                                                        {availableList.map((code, i) => (
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
