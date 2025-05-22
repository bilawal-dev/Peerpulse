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
import { UploadCloud, ImageIcon, X } from "lucide-react";

export function CompanyInformationSettings() {
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
    const [logoUrl, setLogoUrl] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    // generate & revoke object URL
    useEffect(() => {
        if (!logoFile) {
            setFilePreviewUrl(null);
            return;
        }
        const obj = URL.createObjectURL(logoFile);
        setFilePreviewUrl(obj);
        return () => URL.revokeObjectURL(obj);
    }, [logoFile]);

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setLogoFile(e.target.files[0]);
            setLogoUrl("");
        }
    };

    const removeLogo = () => {
        setLogoFile(null);
        setLogoUrl("");
        setFilePreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // pick file preview first, then URL preview
    const previewSrc =
        filePreviewUrl || (logoUrl.trim() !== "" ? logoUrl : null);

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center space-x-2">
                    <ImageIcon className="h-5 w-5 text-gray-600" />
                    <CardTitle>Company Information</CardTitle>
                </div>
                <CardDescription>
                    Update your company&apos;s name and logo.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Inputs */}
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
                            <Label htmlFor="company-description">
                                Company Description
                            </Label>
                            <Input
                                id="company-description"
                                placeholder="Your Company Description (optional)"
                                className="mt-1"
                            />
                        </div>

                        {/* Logo field */}
                        <div>
                            <Label>Company Logo</Label>
                            <div className="mt-1">
                                {previewSrc ? (
                                    <div className="relative inline-block">
                                        <img
                                            src={previewSrc}
                                            alt="Logo preview"
                                            className="w-32 h-32 object-cover rounded-md border border-gray-200"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeLogo}
                                            className="absolute -top-2 -right-2 bg-white rounded-full p-0.5 shadow hover:bg-gray-100"
                                            aria-label="Remove logo"
                                        >
                                            <X className="h-4 w-4 text-gray-600" />
                                        </button>
                                    </div>
                                ) : (
                                    // only render file input when no preview
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
                                            className="absolute inset-0 w-full h-full hidden cursor-pointer"
                                        />
                                        <div className="w-32 h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md">
                                            <UploadCloud className="h-6 w-6 text-gray-400" />
                                            <span className="text-xs text-gray-500 mt-1">
                                                Upload Logo
                                            </span>
                                        </div>
                                    </label>
                                )}
                            </div>

                            {/* URL fallback */}
                            <div className="mt-4">
                                <Label htmlFor="logo-url">Or enter logo URL</Label>
                                <Input
                                    id="logo-url"
                                    type="url"
                                    placeholder="https://example.com/logo.png"
                                    className="mt-1"
                                    value={logoUrl}
                                    onChange={(e) => {
                                        setLogoUrl(e.target.value);
                                        setLogoFile(null);
                                        if (fileInputRef.current)
                                            fileInputRef.current.value = "";
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
