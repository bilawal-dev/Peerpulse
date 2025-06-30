"use client";

import React, { useState } from "react";
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export type NewQuestionValues = {
    review_cycle_id: number;
    type: "self" | "peer" | "manager";
    name: string;
    label: string;
    question: string;
    character_limit: number;
};

type Props = {
    type: "self" | "peer" | "manager";
    reviewCycleId: number;
    onCancel: () => void;
    onSubmit: (vals: NewQuestionValues) => Promise<boolean>;
};

const typeLabels = {
    self: "Self Assessment",
    peer: "Peer Review", 
    manager: "Manager Review"
};

export default function AddQuestionSidebar({ type, reviewCycleId, onCancel, onSubmit }: Props) {
    const [name, setName] = useState("");
    const [label, setLabel] = useState("");
    const [question, setQuestion] = useState("");
    const [characterLimit, setCharacterLimit] = useState(500);

    const disabledSave = !name.trim() || !label.trim() || !question.trim() || question.trim().length < 10;

    const handleSubmit = async () => {
        const isSuccess = await onSubmit({
            review_cycle_id: reviewCycleId,
            type,
            name: name.trim(),
            label: label.trim(),
            question: question.trim(),
            character_limit: characterLimit
        });

        if (isSuccess) {
            setName('');
            setLabel('');
            setQuestion('');
            setCharacterLimit(500);
        }
    };

    return (
        <DialogContent className="fixed right-0 top-0 h-full w-full max-w-md p-6 bg-white shadow-lg overflow-auto animate-in duration-300 slide-in-from-right-1/2">
            <DialogHeader>
                <DialogTitle>Add {typeLabels[type]} Question</DialogTitle>
            </DialogHeader>

            <div className="space-y-6 mt-4">
                <div className="space-y-1">
                    <Label>Question Type</Label>
                    <div className="p-2 bg-gray-100 rounded border text-gray-600">
                        {typeLabels[type]}
                    </div>
                </div>

                <div className="space-y-1">
                    <Label htmlFor="question-name">Question Name *</Label>
                    <Input
                        id="question-name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g. Impact, Development, Growth"
                        maxLength={100}
                    />
                    <div className="text-xs text-gray-500">{name.length}/100 characters</div>
                </div>

                <div className="space-y-1">
                    <Label htmlFor="question-label">Question Label *</Label>
                    <Input
                        id="question-label"
                        value={label}
                        onChange={e => setLabel(e.target.value)}
                        placeholder="e.g. Impact Assessment, Peer Strengths"
                        maxLength={100}
                    />
                    <div className="text-xs text-gray-500">{label.length}/100 characters</div>
                </div>

                <div className="space-y-1">
                    <Label htmlFor="question-content">Question Content *</Label>
                    <Textarea
                        id="question-content"
                        value={question}
                        onChange={e => setQuestion(e.target.value)}
                        placeholder="Enter your question here. Use variables like [employee_name], [company_name], etc."
                        rows={6}
                        maxLength={2000}
                    />
                    <div className="text-xs text-gray-500">
                        {question.length}/2000 characters (minimum 10 required)
                    </div>
                </div>

                <div className="space-y-1">
                    <Label htmlFor="character-limit">Character Limit</Label>
                    <Input
                        id="character-limit"
                        type="number"
                        value={characterLimit}
                        onChange={e => setCharacterLimit(parseInt(e.target.value) || 500)}
                        min={1}
                        max={10000}
                    />
                    <div className="text-xs text-gray-500">Maximum characters allowed for answers</div>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">Available Variables:</h4>
                    <div className="flex flex-wrap gap-1 text-xs">
                        {['[employee_name]', '[manager_name]', '[reviewer_name]', '[reviewee_name]', '[review_cycle_name]', '[company_name]', '[department]', '[start_date]', '[end_date]'].map(variable => (
                            <span key={variable} className="bg-blue-200 text-blue-800 px-2 py-1 rounded">
                                {variable}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <DialogFooter className="mt-6 flex justify-end space-x-2">
                <Button variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button disabled={disabledSave} onClick={handleSubmit}>
                    Add Question
                </Button>
            </DialogFooter>
        </DialogContent>
    );
} 