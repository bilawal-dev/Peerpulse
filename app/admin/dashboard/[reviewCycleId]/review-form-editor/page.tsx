"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Loader2, AlertCircle, Edit } from "lucide-react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import AddQuestionSidebar, { NewQuestionValues } from "@/components/Dashboard/Review-Form-Editor/AddQuestionSidebar";
import EditQuestionSidebar, { EditQuestionInitial, EditQuestionValues } from "@/components/Dashboard/Review-Form-Editor/EditQuestionSidebar";

// Variable tags for insertion
const variableTags = [
    { label: "EMPLOYEE_NAME", value: "[employee_name]" },
    { label: "MANAGER_NAME", value: "[manager_name]" },
    { label: "REVIEWER_NAME", value: "[reviewer_name]" },
    { label: "REVIEWEE_NAME", value: "[reviewee_name]" },
    { label: "REVIEW_CYCLE_NAME", value: "[review_cycle_name]" },
    { label: "COMPANY_NAME", value: "[company_name]" },
    { label: "DEPARTMENT", value: "[department]" },
    { label: "START_DATE", value: "[start_date]" },
    { label: "END_DATE", value: "[end_date]" },
];

type Question = {
    question_id: number;
    type: "self" | "peer" | "manager";
    name: string;
    label: string;
    question: string;
    order: number;
    character_limit: number;
    is_default: boolean;
    created_at: string;
    updated_at: string;
};

type ReviewCycleData = {
    review_cycle: {
        review_cycle_id: number;
        name: string;
        is_active: boolean;
        is_review_enabled: boolean;
    };
    questions: {
        self: Question[];
        peer: Question[];
        manager: Question[];
    };
    summary: {
        total_questions: number;
        self_questions: number;
        peer_questions: number;
        manager_questions: number;
    };
};

export default function AdminDashboardReviewFormEditor() {
    const reviewCycleId = Number(useParams().reviewCycleId);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<ReviewCycleData | null>(null);
    const [deletingQuestionId, setDeletingQuestionId] = useState<number | null>(null);
    
    // Add question sidebar state
    const [addQuestionOpen, setAddQuestionOpen] = useState(false);
    const [addQuestionType, setAddQuestionType] = useState<"self" | "peer" | "manager">("self");
    
    // Edit question sidebar state
    const [editQuestionOpen, setEditQuestionOpen] = useState(false);
    const [editQuestionData, setEditQuestionData] = useState<EditQuestionInitial | null>(null);

    useEffect(() => {
        fetchReviewCycleQuestions();
    }, [reviewCycleId]);

    // Delete question function
    const handleDeleteQuestion = async (questionId: number) => {
        try {
            setDeletingQuestionId(questionId);
            toast.loading("Removing question...", { id: "delete-question" });
            
            const token = localStorage.getItem('elevu_auth');
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/company/remove-question`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ question_id: questionId })
            });
            
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.message || 'Failed to remove question');
            }
            
            // Update local state with reordering logic (same as backend)
            if (data) {
                const updatedData = { ...data };
                
                // Find the question to delete to get its order and type
                let deletedQuestion: Question | null = null;
                let questionArray: Question[] = [];
                let questionType: 'self' | 'peer' | 'manager' = 'self';
                
                // Find which array contains the question and get the question details
                if (updatedData.questions.self.find(q => q.question_id === questionId)) {
                    deletedQuestion = updatedData.questions.self.find(q => q.question_id === questionId)!;
                    questionArray = updatedData.questions.self;
                    questionType = 'self';
                } else if (updatedData.questions.peer.find(q => q.question_id === questionId)) {
                    deletedQuestion = updatedData.questions.peer.find(q => q.question_id === questionId)!;
                    questionArray = updatedData.questions.peer;
                    questionType = 'peer';
                } else if (updatedData.questions.manager.find(q => q.question_id === questionId)) {
                    deletedQuestion = updatedData.questions.manager.find(q => q.question_id === questionId)!;
                    questionArray = updatedData.questions.manager;
                    questionType = 'manager';
                }
                
                if (deletedQuestion) {
                    const deletedOrder = deletedQuestion.order;
                    
                    // Remove the question from the array
                    const filteredQuestions = questionArray.filter(q => q.question_id !== questionId);
                    
                    // Reorder remaining questions: decrement order for all questions with higher order
                    const reorderedQuestions = filteredQuestions.map(question => {
                        if (question.order > deletedOrder) {
                            return {
                                ...question,
                                order: question.order - 1
                            };
                        }
                        return question;
                    });
                    
                    // Update the appropriate question array
                    if (questionType === 'self') {
                        updatedData.questions.self = reorderedQuestions;
                    } else if (questionType === 'peer') {
                        updatedData.questions.peer = reorderedQuestions;
                    } else if (questionType === 'manager') {
                        updatedData.questions.manager = reorderedQuestions;
                    }
                    
                    // Update summary counts
                    updatedData.summary.total_questions = updatedData.summary.total_questions - 1;
                    updatedData.summary.self_questions = updatedData.questions.self.length;
                    updatedData.summary.peer_questions = updatedData.questions.peer.length;
                    updatedData.summary.manager_questions = updatedData.questions.manager.length;
                    
                    setData(updatedData);
                }
            }
            
            toast.success(result.message || "Question removed successfully!", { id: "delete-question" });
        } catch (err: any) {
            console.error('Error deleting question:', err);
            toast.error(err.message || 'Failed to remove question', { id: "delete-question" });
        } finally {
            setDeletingQuestionId(null);
        }
    };

    // Add question function
    const handleAddQuestion = async (vals: NewQuestionValues): Promise<boolean> => {
        try {
            toast.loading("Creating question...", { id: "create-question" });
            
            const token = localStorage.getItem('elevu_auth');
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/company/create-custom-question`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(vals)
            });
            
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.message || 'Failed to create question');
            }
            
            toast.success(result.message || "Question created successfully!", { id: "create-question" });
            
            // Refresh the data to show the new question
            await fetchReviewCycleQuestions();
            setAddQuestionOpen(false);
            
            return true;
        } catch (err: any) {
            console.error('Error creating question:', err);
            toast.error(err.message || 'Failed to create question', { id: "create-question" });
            return false;
        }
    };

    // Edit question function  
    const handleEditQuestion = async (vals: EditQuestionValues): Promise<boolean> => {
        try {
            toast.loading("Updating question...", { id: "update-question" });
            
            const token = localStorage.getItem('elevu_auth');
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/company/update-question`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(vals)
            });
            
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.message || 'Failed to update question');
            }
            
            toast.success(result.message || "Question updated successfully!", { id: "update-question" });
            
            // Refresh the data to show the updated question
            await fetchReviewCycleQuestions();
            setEditQuestionOpen(false);
            
            return true;
        } catch (err: any) {
            console.error('Error updating question:', err);
            toast.error(err.message || 'Failed to update question', { id: "update-question" });
            return false;
        }
    };

    // Open add question sidebar
    const openAddQuestion = (type: "self" | "peer" | "manager") => {
        setAddQuestionType(type);
        setAddQuestionOpen(true);
    };

    // Open edit question sidebar
    const openEditQuestion = (question: Question) => {
        setEditQuestionData({
            review_cycle_id: reviewCycleId,
            question_id: question.question_id,
            name: question.name,
            label: question.label,
            type: question.type,
            question: question.question,
            character_limit: question.character_limit
        });
        setEditQuestionOpen(true);
    };

    // Refresh data function (extracted from useEffect)
    const fetchReviewCycleQuestions = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const token = localStorage.getItem('elevu_auth');
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/company/get-review-cycle-questions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ review_cycle_id: reviewCycleId })
            });
            
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.message || 'Failed to fetch questions');
            }
            
            setData(result.data);
        } catch (err: any) {
            console.error('Error fetching questions:', err);
            setError(err.message || 'Failed to load questions');
            toast.error('Failed to load review questions');
        } finally {
            setLoading(false);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="space-y-8 pb-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold text-gray-800 border-b-2 border-brand pb-4">
                            Review Form Editor
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardContent className="flex items-center justify-center py-16">
                        <div className="flex items-center gap-3">
                            <Loader2 className="w-6 h-6 animate-spin text-brand" />
                            <span className="text-gray-600">Loading review questions...</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="space-y-8 pb-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold text-gray-800 border-b-2 border-brand pb-4">
                            Review Form Editor
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardContent className="flex items-center justify-center py-16">
                        <div className="flex items-center gap-3 text-red-600">
                            <AlertCircle className="w-6 h-6" />
                            <span>{error}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Function to render question text with bold variables
    const renderQuestionWithVariables = (text: string) => {
        // Split text on square brackets to find variables
        const parts = text.split(/(\[[^\]]+\])/g);
        
        return parts.map((part, index) => {
            // Check if this part is a variable (starts and ends with square brackets)
            if (part.startsWith('[') && part.endsWith(']')) {
                return (
                    <span key={index} className="font-bold text-brand">
                        {part}
                    </span>
                );
            }
            return part;
        });
    };

    // Check if review is enabled (should disable editing)
    const isReviewEnabled = data?.review_cycle.is_review_enabled || false;

    // Render individual question component
    const renderQuestion = (question: Question) => (
        <div key={question.question_id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-3">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-800">{question.label}</h4>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {question.name}
                        </span>
                        {question.is_default && (
                            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                                Default
                            </span>
                        )}
                        {isReviewEnabled && (
                            <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                                Review Active
                            </span>
                        )}
                    </div>
                    <p className="text-gray-700 text-sm mb-3">
                        {renderQuestionWithVariables(question.question)}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Order: {question.order}</span>
                        <span>Character Limit: {question.character_limit}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-blue-600 border-blue-200 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => openEditQuestion(question)}
                        disabled={deletingQuestionId === question.question_id || isReviewEnabled}
                        title={isReviewEnabled ? "Cannot edit questions while review cycle is active" : "Edit question"}
                    >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                    </Button>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 border-red-200 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => handleDeleteQuestion(question.question_id)}
                        disabled={deletingQuestionId === question.question_id || isReviewEnabled}
                        title={isReviewEnabled ? "Cannot remove questions while review cycle is active" : "Remove question"}
                    >
                        {deletingQuestionId === question.question_id ? (
                            <>
                                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                Removing...
                            </>
                        ) : (
                            'Remove'
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 pb-8">
            {/* Main Title */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-gray-800 border-b-2 border-brand pb-4">
                        Review Form Editor
                        {data && (
                            <div className="text-sm font-normal text-gray-600 mt-2">
                                {data.review_cycle.name} • {data.summary.total_questions} Total Questions
                                {isReviewEnabled && (
                                    <span className="ml-2 inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                                        Review Cycle Active
                                    </span>
                                )}
                            </div>
                        )}
                    </CardTitle>
                </CardHeader>
            </Card>

            {/* Available Variables Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold text-gray-800 border-b-2 border-brand pb-2">
                        Available Variables
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {isReviewEnabled && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-amber-600" />
                                <span className="text-sm text-amber-700 font-medium">
                                    Peer review is currently active. Question editing is disabled.
                                </span>
                            </div>
                        </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                        {variableTags.map((variable) => (
                            <span key={variable.label} className="inline-block bg-brand text-white px-3 py-1 rounded cursor-pointer hover:bg-brand/90 transition-colors text-sm">
                                {variable.value}
                            </span>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Self Assessment Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold text-gray-800 border-b-2 border-brand pb-2">
                        Self Assessment Questions ({data?.summary.self_questions || 0})
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button 
                        className="bg-brand hover:bg-brand/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => openAddQuestion('self')}
                        disabled={isReviewEnabled}
                        title={isReviewEnabled ? "Cannot add questions while review cycle is active" : "Add new self assessment question"}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Question
                    </Button>
                    <div className="space-y-4">
                        {data?.questions.self.length ? (
                            data.questions.self
                                .sort((a, b) => a.order - b.order)
                                .map(renderQuestion)
                        ) : (
                            <div className="text-gray-500 text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                                No self assessment questions found. Click "Add Question" to get started.
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Peer Review Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold text-gray-800 border-b-2 border-brand pb-2">
                        Peer Review Questions ({data?.summary.peer_questions || 0})
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button 
                        className="bg-brand hover:bg-brand/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => openAddQuestion('peer')}
                        disabled={isReviewEnabled}
                        title={isReviewEnabled ? "Cannot add questions while review cycle is active" : "Add new peer review question"}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Question
                    </Button>
                    <div className="space-y-4">
                        {data?.questions.peer.length ? (
                            data.questions.peer
                                .sort((a, b) => a.order - b.order)
                                .map(renderQuestion)
                        ) : (
                            <div className="text-gray-500 text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                                No peer review questions found. Click "Add Question" to get started.
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Manager Review Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold text-gray-800 border-b-2 border-brand pb-2">
                        Manager Review Questions ({data?.summary.manager_questions || 0})
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button 
                        className="bg-brand hover:bg-brand/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => openAddQuestion('manager')}
                        disabled={isReviewEnabled}
                        title={isReviewEnabled ? "Cannot add questions while review cycle is active" : "Add new manager review question"}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Question
                    </Button>
                    <div className="space-y-4">
                        {data?.questions.manager.length ? (
                            data.questions.manager
                                .sort((a, b) => a.order - b.order)
                                .map(renderQuestion)
                        ) : (
                            <div className="text-gray-500 text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                                No manager review questions found. Click "Add Question" to get started.
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Add Question Dialog */}
            <Dialog open={addQuestionOpen} onOpenChange={setAddQuestionOpen}>
                <DialogTrigger asChild><div hidden /></DialogTrigger>
                <AddQuestionSidebar
                    type={addQuestionType}
                    reviewCycleId={reviewCycleId}
                    onCancel={() => setAddQuestionOpen(false)}
                    onSubmit={handleAddQuestion}
                />
            </Dialog>

            {/* Edit Question Dialog */}
            <Dialog open={editQuestionOpen} onOpenChange={setEditQuestionOpen}>
                <DialogTrigger asChild><div hidden /></DialogTrigger>
                {editQuestionData && (
                    <EditQuestionSidebar
                        initial={editQuestionData}
                        onCancel={() => setEditQuestionOpen(false)}
                        onSubmit={handleEditQuestion}
                    />
                )}
            </Dialog>
        </div>
    );
}