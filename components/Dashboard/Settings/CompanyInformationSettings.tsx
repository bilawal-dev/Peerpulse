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
import { Button } from "@/components/ui/button";
import { UploadCloud, ImageIcon, X } from "lucide-react";

export function CompanyInformationSettings() {
    // ─── Current “editable” states ────────────────────────────────────────────
    const [companyName, setCompanyName] = useState<string>("");
    const [companyDescription, setCompanyDescription] = useState<string>(""); // still here, although profile endpoint doesn't provide it
    const [mobileNumber, setMobileNumber] = useState<string>(""); // new field for mobile_number
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoUrl, setLogoUrl] = useState<string>(""); // will hold existing logo URL from profile
    const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);

    // ─── “Original” values for change detection ─────────────────────────────────
    const [originalName, setOriginalName] = useState<string>("");
    const [originalDescription, setOriginalDescription] = useState<string>("");
    const [originalMobile, setOriginalMobile] = useState<string>("");
    const [originalLogoUrl, setOriginalLogoUrl] = useState<string>("");

    const fileInputRef = useRef<HTMLInputElement>(null);

    // ─── 1️⃣ FETCH existing “profile” when component mounts ────────────────────────
    useEffect(() => {
        async function fetchProfile() {
            try {
                const token = localStorage.getItem("elevu_auth") || "";
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_SERVER_URL}/company/profile`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (!res.ok) throw new Error("Failed to fetch company profile");

                const json = await res.json();
                // json.data is the company object returned by getProfile
                const company = json.data;

                console.log(json);

                // Populate “current” fields
                setCompanyName(company.name || "");
                setCompanyDescription(company.description || ""); // backend does not return description
                setMobileNumber(company.mobile_number || "");

                let fetchedLogoUrl = "";
                if (company.company_logo && company.company_logo.startsWith("http")) {
                    fetchedLogoUrl = company.company_logo;
                } else if (company.company_logo) {
                    fetchedLogoUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}${company.company_logo}`;
                }
                setLogoUrl(fetchedLogoUrl);

                // Also set “original” references
                setOriginalName(company.name || "");
                setOriginalDescription("");
                setOriginalMobile(company.mobile_number || "");
                setOriginalLogoUrl(fetchedLogoUrl);

                // Clear any file selection
                setLogoFile(null);
            } catch (err) {
                console.error(err);
            }
        }
        fetchProfile();
    }, []);

    // ─── Generate a local preview URL when a new file is selected ─────────────────
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
            setLogoUrl(""); // clear any existing URL so preview uses new file
        }
    };

    const removeLogo = () => {
        setLogoFile(null);
        setLogoUrl("");
        setFilePreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // ─── 2️⃣ Compute whether anything was changed ────────────────────────────────
    const hasChanges =
        companyName !== originalName ||
        companyDescription !== originalDescription ||
        mobileNumber !== originalMobile ||
        Boolean(logoFile) ||
        logoUrl !== originalLogoUrl;

    // ─── 3️⃣ When user clicks “Save”, call PUT /company/update-profile ───────────
    const handleSaveAll = async () => {
        if (!hasChanges) {
            return;
        }

        try {
            const token = localStorage.getItem("elevu_auth") || "";

            const formData = new FormData();
            formData.append("name", companyName);
            formData.append("description", companyDescription);
            formData.append("mobile_number", mobileNumber);

            if (logoFile) {
                // “file” must match what your uploadFile middleware expects
                formData.append("file", logoFile);
            }

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/company/update-profile`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        // ⚠️ Do NOT set Content-Type manually—browser handles multipart boundary.
                    },
                    body: formData,
                }
            );

            if (!res.ok) {
                const errJson = await res.json();
                throw new Error(errJson.message || "Failed to update company profile");
            }

            alert("Company information saved successfully!");

            // Re‐fetch profile so we pick up any new logo URL or other changes
            const profileRes = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/company/profile`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (!profileRes.ok) throw new Error("Failed to re-fetch profile");
            const profileJson = await profileRes.json();
            const company = profileJson.data;

            // Update “current” & “original” together:
            setCompanyName(company.name || "");
            setOriginalName(company.name || "");

            setCompanyDescription(company.description || "");
            setOriginalDescription(company.description || "");

            setMobileNumber(company.mobile_number || "");
            setOriginalMobile(company.mobile_number || "");

            let newLogo = "";
            if (company.company_logo && company.company_logo.startsWith("http")) {
                newLogo = company.company_logo;
            } else if (company.company_logo) {
                newLogo = `${process.env.NEXT_PUBLIC_SERVER_URL}${company.company_logo}`;
            }
            setLogoUrl(newLogo);
            setOriginalLogoUrl(newLogo);

            setLogoFile(null);
            setFilePreviewUrl(null);
        } catch (err) {
            console.error("Error saving company info:", err);
            alert(`Failed to save. ${err}`);
        }
    };

    // ─── Pick preview source: file preview wins over direct URL ───────────────────
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
                    Update your company's name, description, mobile number, and logo.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                        <div>
                            <Label htmlFor="company-name">Company Name</Label>
                            <Input
                                id="company-name"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
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
                                value={companyDescription}
                                onChange={(e) => setCompanyDescription(e.target.value)}
                                placeholder="Your Company Description (optional)"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="company-mobile">Mobile Number</Label>
                            <Input
                                id="company-mobile"
                                type="tel"
                                value={mobileNumber}
                                onChange={(e) => setMobileNumber(e.target.value)}
                                placeholder="e.g. +92-300-1234567"
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
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end space-x-4">
                    <Button onClick={handleSaveAll} variant="default" disabled={!hasChanges}>
                        Save
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
