"use client";

import React, { useState, useEffect } from "react";
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export type EditQuestionValues = {
    question_id: number;
    name: string;
    label: string;
    question: string;
    character_limit: number;
};

export type EditQuestionInitial = {
    review_cycle_id: number;
    question_id: number;
    type: "self" | "peer" | "manager";
    name: string;
    label: string;
    question: string;
    character_limit: number;
};

type Props = {
    initial: EditQuestionInitial;
    onCancel: () => void;
    onSubmit: (vals: EditQuestionValues) => Promise<boolean>;
};

const typeLabels = {
    self: "Self Assessment",
    peer: "Peer Review", 
    manager: "Manager Review"
};

export default function EditQuestionSidebar({ initial, onCancel, onSubmit }: Props) {
    const [name, setName] = useState(initial.name);
    const [label, setLabel] = useState(initial.label);
    const [question, setQuestion] = useState(initial.question);
    const [characterLimit, setCharacterLimit] = useState(initial.character_limit);

    const disabledSave = !name.trim() || !label.trim() || !question.trim() || question.trim().length < 10;

    useEffect(() => {
        setName(initial.name);
        setLabel(initial.label);
        setQuestion(initial.question);
        setCharacterLimit(initial.character_limit);
    }, [initial]);

    const handleSubmit = async () => {
        const isSuccess = await onSubmit({
            question_id: initial.question_id,
            name: name.trim(),
            label: label.trim(),
            question: question.trim(),
            character_limit: characterLimit
        });

        if (isSuccess) {
            // Form stays populated since it's an edit
        }
    };

    return (
        <DialogContent className="fixed right-0 top-0 h-full w-full max-w-md p-6 bg-white shadow-lg overflow-auto animate-in duration-300 slide-in-from-right-1/2">
            <DialogHeader>
                <DialogTitle>Edit {typeLabels[initial.type]} Question</DialogTitle>
            </DialogHeader>

            <div className="space-y-6 mt-4">
                <div className="space-y-1">
                    <Label>Question Type</Label>
                    <div className="p-2 bg-gray-100 rounded border text-gray-600">
                        {typeLabels[initial.type]}
                    </div>
                </div>

                <div className="space-y-1">
                    <Label htmlFor="edit-question-name">Question Name *</Label>
                    <Input
                        id="edit-question-name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g. Impact, Development, Growth"
                        maxLength={100}
                    />
                    <div className="text-xs text-gray-500">{name.length}/100 characters</div>
                </div>

                <div className="space-y-1">
                    <Label htmlFor="edit-question-label">Question Label *
                        <span className="text-xs text-gray-500">(Displays As Heading)</span>
                    </Label>
                    <Input
                        id="edit-question-label"
                        value={label}
                        onChange={e => setLabel(e.target.value)}
                        placeholder="e.g. Impact Assessment, Peer Strengths"
                        maxLength={100}
                    />
                    <div className="text-xs text-gray-500">{label.length}/100 characters</div>
                </div>

                <div className="space-y-1">
                    <Label htmlFor="edit-question-content">Question Content *</Label>
                    <Textarea
                        id="edit-question-content"
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
                    <Label htmlFor="edit-character-limit">Character Limit</Label>
                    <Input
                        id="edit-character-limit"
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
                    Save Changes
                </Button>
            </DialogFooter>
        </DialogContent>
    );
} 