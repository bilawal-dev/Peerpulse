"use client"

import { useState, useMemo } from "react"
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from "@hello-pangea/dnd"
import { User, ArrowLeft, ArrowRight, UserCheck } from "lucide-react"

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
        code: "E001",
        firstName: "Alice",
        lastName: "Johnson",
        reviewers: ["E002"],
        suggestedReviewers: ["E003"],
        peerSelections: ["E002", "E003"],
        selectedBy: ["E002", "E003"],
        manager: "M001",
    },
    {
        code: "E002",
        firstName: "Bob",
        lastName: "Smith",
        reviewers: [],
        suggestedReviewers: [],
        peerSelections: ["E001"],
        selectedBy: ["E001"],
        manager: "M001",
    },
    {
        code: "E003",
        firstName: "Carol",
        lastName: "Lee",
        reviewers: ["E001"],
        suggestedReviewers: [],
        peerSelections: ["E001"],
        selectedBy: ["E001"],
        manager: "M002",
    },
    {
        code: "E004",
        firstName: "David",
        lastName: "Wang",
        reviewers: [],
        suggestedReviewers: [],
        peerSelections: [],
        selectedBy: [],
        manager: "M002",
    },
]

export default function DashboardPairingPage() {
    // All employees in state
    const [allEmps, setAllEmps] = useState<Employee[]>(INITIAL_EMPLOYEES)

    // Code of the currently selected employee
    const [currentCode, setCurrentCode] = useState<string | null>(null)

    // Derive the selected employee object
    const currentEmp = useMemo(
        () => allEmps.find((e) => e.code === currentCode) || null,
        [allEmps, currentCode]
    )

    // All peers (excluding the selected employee)
    const peers = useMemo(() => {
        if (!currentEmp) return []
        return allEmps.filter((e) => e.code !== currentEmp.code)
    }, [allEmps, currentEmp])

    // Helper: get employee by code
    const getEmpByCode = (code: string) =>
        allEmps.find((e) => e.code === code) || null

    // Compute the two draggable zones: "Being Reviewed By" (suggestedReviewers) and "Will Review" (reviewers)
    const zones = useMemo(() => {
        if (!currentEmp) {
            return { current: [] as string[], suggested: [] as string[] }
        }
        return {
            suggested: [...currentEmp.suggestedReviewers],
            current: [...currentEmp.reviewers],
        }
    }, [currentEmp])

    // Drag & drop handler for top two zones
    function onDragEnd(result: DropResult) {
        const { source, destination, draggableId } = result
        if (!destination || !currentEmp) return

        // If dropped back in same place, do nothing
        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return
        }

        setAllEmps((prev) =>
            prev.map((emp) => {
                if (emp.code !== currentEmp.code) return emp

                let newReviewers = [...emp.reviewers]
                let newSuggested = [...emp.suggestedReviewers]

                // Remove from both lists
                newReviewers = newReviewers.filter((c) => c !== draggableId)
                newSuggested = newSuggested.filter((c) => c !== draggableId)

                // If dropped in "current", add to reviewers
                if (destination.droppableId === "current") {
                    newReviewers.splice(destination.index, 0, draggableId)
                }
                // If dropped in "suggested", add to suggestedReviewers
                if (destination.droppableId === "suggested") {
                    newSuggested.splice(destination.index, 0, draggableId)
                }

                return {
                    ...emp,
                    reviewers: newReviewers,
                    suggestedReviewers: newSuggested,
                }
            })
        )
    }

    /** Top draggable chip component **/
    function ReviewerChip({
        code,
        index,
        zone,
    }: {
        code: string
        index: number
        zone: "current" | "suggested"
    }) {
        const emp = getEmpByCode(code)
        if (!emp) return null

        return (
            <Draggable draggableId={code} index={index}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`
              flex items-center justify-between
              bg-white border border-gray-200 rounded-md
              px-3 py-2 mb-2 transition
              ${snapshot.isDragging ? "opacity-50" : ""}
            `}
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
                        </div>
                    </div>
                )}
            </Draggable>
        )
    }

    /** Static chip (non-draggable) for Option Pool **/
    function StaticChip({ code }: { code: string }) {
        const emp = getEmpByCode(code)
        if (!emp) return null

        return (
            <div className="
          flex items-center justify-between
          bg-white border border-gray-200 rounded-md
          px-3 py-2 mb-2
        ">
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
                </div>
            </div>
        )
    }

    /** Static data for Option Pool display **/
    // “Selected” – employees that the selected employee has chosen (peerSelections)
    const selectedList = currentEmp ? currentEmp.peerSelections : []
    // “<Name> Selected” – employees who selected the current employee (selectedBy)
    const selectedByList = currentEmp ? currentEmp.selectedBy : []
    // “Mutual Selections” – intersection of peerSelections and selectedBy
    const mutualList = currentEmp
        ? currentEmp.peerSelections.filter((code) =>
            currentEmp.selectedBy.includes(code)
        )
        : []

    return (
        <div className="space-y-8 pb-8">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-2xl font-semibold text-gray-900">
                        Manual Pairing Adjustments
                    </h2>
                    <div className="mt-3 px-4 py-2 bg-blue-50 rounded-md text-blue-800">
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
                </div>

                {/* Body */}
                <div className="flex gap-6 p-6 min-h-[600px]">
                    {/* Left: Employee List */}
                    <div className="flex flex-col w-80">
                        <select
                            className="mb-4 p-2 border border-gray-200 rounded-md bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                            onChange={() => {
                                /** sorting logic if needed **/
                            }}
                        >
                            <option value="mostSelected">Most Selected</option>
                            <option value="leastSelected">Least Selected</option>
                            <option value="name">Name</option>
                        </select>

                        <div className="flex-1 overflow-y-auto border border-gray-200 rounded-md">
                            {allEmps.map((emp) => (
                                <div
                                    key={emp.code}
                                    className={`flex justify-between items-center px-4 py-3 cursor-pointer ${currentCode === emp.code ? "bg-blue-50" : "hover:bg-gray-50"
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

                                    <DragDropContext onDragEnd={onDragEnd}>
                                        <div className="flex flex-wrap gap-6 mb-8">
                                            {/* Being Reviewed By (draggable) */}
                                            <div className="flex-1 min-w-[250px]">
                                                <h4 className="text-lg font-medium text-gray-800 mb-2">
                                                    Being Reviewed By
                                                </h4>
                                                <Droppable droppableId="suggested">
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.droppableProps}
                                                            className={`
                                min-h-[180px] p-3 bg-gray-50 border border-gray-200 rounded-md
                                ${snapshot.isDraggingOver ? "bg-blue-50 border-blue-300 shadow-inner" : ""}
                              `}
                                                        >
                                                            {zones.suggested.map((code, idx) => (
                                                                <ReviewerChip
                                                                    key={code}
                                                                    code={code}
                                                                    index={idx}
                                                                    zone="suggested"
                                                                />
                                                            ))}
                                                            {provided.placeholder}
                                                        </div>
                                                    )}
                                                </Droppable>
                                            </div>

                                            {/* Will Review (draggable) */}
                                            <div className="flex-1 min-w-[250px]">
                                                <h4 className="text-lg font-medium text-gray-800 mb-2">
                                                    Will Review
                                                </h4>
                                                <Droppable droppableId="current">
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.droppableProps}
                                                            className={`
                                min-h-[180px] p-3 bg-gray-50 border border-gray-200 rounded-md
                                ${snapshot.isDraggingOver ? "bg-blue-50 border-blue-300 shadow-inner" : ""}
                              `}
                                                        >
                                                            {zones.current.map((code, idx) => (
                                                                <ReviewerChip
                                                                    key={code}
                                                                    code={code}
                                                                    index={idx}
                                                                    zone="current"
                                                                />
                                                            ))}
                                                            {provided.placeholder}
                                                        </div>
                                                    )}
                                                </Droppable>
                                            </div>
                                        </div>
                                    </DragDropContext>

                                    {/* Option Pool (static display) */}
                                    <div className="space-y-6">
                                        <h4 className="text-xl font-semibold text-gray-800 mb-4">
                                            Option Pool
                                        </h4>
                                        <div className="grid grid-cols-3 gap-6">
                                            {/* Selected (peerSelections) */}
                                            <div>
                                                <h5 className="text-md font-medium text-gray-700 mb-2">
                                                    Selected ({selectedList.length})
                                                </h5>
                                                <div>
                                                    {selectedList.length > 0 ? (
                                                        selectedList.map((code) => (
                                                            <StaticChip key={code} code={code} />
                                                        ))
                                                    ) : (
                                                        <p className="text-gray-500 italic text-sm">
                                                            No selections
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* {Name} Selected (selectedBy) */}
                                            <div>
                                                <h5 className="text-md font-medium text-gray-700 mb-2">
                                                    {currentEmp.firstName} Selected ({selectedByList.length})
                                                </h5>
                                                <div>
                                                    {selectedByList.length > 0 ? (
                                                        selectedByList.map((code) => (
                                                            <StaticChip key={code} code={code} />
                                                        ))
                                                    ) : (
                                                        <p className="text-gray-500 italic text-sm">
                                                            No one selected
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Mutual Selections */}
                                            <div>
                                                <h5 className="text-md font-medium text-gray-700 mb-2">
                                                    Mutual Selections ({mutualList.length})
                                                </h5>
                                                <div>
                                                    {mutualList.length > 0 ? (
                                                        mutualList.map((code) => (
                                                            <StaticChip key={code} code={code} />
                                                        ))
                                                    ) : (
                                                        <p className="text-gray-500 italic text-sm">
                                                            No mutuals
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
