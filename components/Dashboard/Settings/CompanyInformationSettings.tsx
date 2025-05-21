"use client";

import { useState, useEffect, useRef } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UploadCloud, ImageIcon } from "lucide-react";

export function CompanyInformationSettings() {
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
    const [logoUrl, setLogoUrl] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Generate object URL for the uploaded file
    useEffect(() => {
        if (!logoFile) {
            setFilePreviewUrl(null);
            return;
        }
        const objectUrl = URL.createObjectURL(logoFile);
        setFilePreviewUrl(objectUrl);
        return () => {
            URL.revokeObjectURL(objectUrl);
        };
    }, [logoFile]);

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setLogoFile(e.target.files[0]);
        }
    };

    // Choose which preview to show: local file first, then URL if set
    const previewSrc = filePreviewUrl ?? (logoUrl.trim() !== "" ? logoUrl : null);

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center space-x-2">
                    <ImageIcon className="h-5 w-5 text-gray-600" />
                    <CardTitle>Company Information</CardTitle>
                </div>
                <CardDescription>
                    Update your company's name and logo.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Company Name */}
                    <div className="space-y-6">
                        <div>
                            <Label htmlFor="company-name">Company Name</Label>
                            <Input
                                id="company-name"
                                placeholder="Your Company Name"
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <Label htmlFor="company-name">Company Description</Label>
                            <Input
                                id="company-name"
                                placeholder="Your Company Desription (optional)"
                                className="mt-1"
                            />
                        </div>

                        {/* Company Logo */}
                        <div>
                            <Label>Company Logo</Label>
                            <div className="mt-1">
                                {/* clickable box + hidden input */}
                                <label
                                    htmlFor="company-logo-file"
                                    className="relative inline-block cursor-pointer"
                                >
                                    <input
                                        ref={fileInputRef}
                                        id="company-logo-file"
                                        type="file"
                                        accept="image/*"
                                        onChange={onFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />

                                    {previewSrc ? (
                                        <img
                                            src={previewSrc}
                                            alt="Logo preview"
                                            className="w-32 h-32 object-cover rounded-md border border-gray-200"
                                        />
                                    ) : (
                                        <div className="w-32 h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md">
                                            <UploadCloud className="h-6 w-6 text-gray-400" />
                                            <span className="text-xs text-gray-500 mt-1">
                                                Upload Logo
                                            </span>
                                        </div>
                                    )}
                                </label>
                            </div>

                            {/* URL Input (unaffected by file uploads) */}
                            <div className="mt-4">
                                <Label htmlFor="logo-url">Or enter logo URL</Label>
                                <Input
                                    id="logo-url"
                                    type="url"
                                    placeholder="https://example.com/logo.png"
                                    className="mt-1"
                                    value={logoUrl}
                                    onChange={(e) => setLogoUrl(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
