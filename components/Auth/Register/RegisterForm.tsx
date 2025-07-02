"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Eye, EyeOff, Upload, X } from "lucide-react";
import ButtonLoader from "@/components/Common/ButtonLoader";
import { useAuth } from "@/context/AuthContext";

export default function RegisterForm() {
    const [formData, setFormData] = useState({
        companyName: "",
        email: "",
        password: "",
        description: "",
        mobileNumber: ""
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type === "image/png") {
                console.log("File dropped:", file.name, "Size:", file.size, "bytes");
                setSelectedFile(file);
            } else {
                toast.error("Only PNG files are allowed");
            }
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.type === "image/png") {
                console.log("File selected:", file.name, "Size:", file.size, "bytes");
                setSelectedFile(file);
            } else {
                toast.error("Only PNG files are allowed");
                e.target.value = "";
            }
        }
    };

    const removeFile = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const { registerCompany } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const { companyName, email, password, description, mobileNumber } = formData;

        if (!companyName || !email || !password || !description || !selectedFile) {
            toast.error("Please fill all the required fields");
            setIsLoading(false);
            return;
        }

        // Create FormData for multipart/form-data
        const formDataToSend = new FormData();
        formDataToSend.append('name', companyName);
        formDataToSend.append('email', email);
        formDataToSend.append('password', password);
        formDataToSend.append('description', description);
        if (mobileNumber) {
            formDataToSend.append('mobile_number', mobileNumber);
        }
        if (selectedFile) {
            formDataToSend.append('file', selectedFile);
        }

        await registerCompany(formDataToSend);
        setFormData({ companyName: "", email: "", password: "", description: "", mobileNumber: "" });
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        setIsLoading(false);
    };

    return (
        <section className="pt-32 pb-16 flex items-center justify-center px-[20px] py-16">
            <div className="w-full max-w-md bg-white rounded-2xl border shadow-sm p-8">
                <h2 className="text-3xl whitespace-nowrap font-bold text-center text-gray-900 mb-8">
                    Register Company
                </h2>

                <form onSubmit={handleSubmit}>
                    {/* Company Name */}
                    <div className="mb-5">
                        <label htmlFor="companyName" className="block text-gray-700 mb-1">
                            Company Name *
                        </label>
                        <input
                            id="companyName"
                            name="companyName"
                            type="text"
                            value={formData.companyName}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-brand transition"
                        />
                    </div>

                    {/* Email */}
                    <div className="mb-5">
                        <label htmlFor="email" className="block text-gray-700 mb-1">
                            Email *
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-brand transition"
                        />
                    </div>

                    {/* Password with toggle */}
                    <div className="mb-5 relative">
                        <label htmlFor="password" className="block text-gray-700 mb-1">
                            Password *
                        </label>
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full pr-10 px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-brand transition"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute right-4 top-1/2 translate-y-1 flex items-center text-gray-400"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {/* Description */}
                    <div className="mb-5">
                        <label htmlFor="description" className="block text-gray-700 mb-1">
                            Description *
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={3}
                            placeholder="What does your company do?"
                            className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-brand transition resize-none"
                        />
                    </div>

                    {/* Mobile Number */}
                    <div className="mb-5">
                        <label htmlFor="mobileNumber" className="block text-gray-700 mb-1">
                            Mobile Number (Optional)
                        </label>
                        <input
                            id="mobileNumber"
                            name="mobileNumber"
                            type="tel"
                            value={formData.mobileNumber}
                            onChange={handleChange}
                            placeholder="+1234567890"
                            className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-brand transition"
                        />
                    </div>

                    {/* Image Upload */}
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-1">
                            Company Logo (PNG only)
                        </label>
                        <div
                            className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${dragActive
                                ? "border-brand bg-brand/5"
                                : "border-gray-300 hover:border-gray-400"
                                }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            {!selectedFile && (
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".png,image/png"
                                    onChange={handleFileSelect}
                                    required
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            )}

                            {selectedFile ? (
                                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-brand/10 rounded-lg flex items-center justify-center">
                                            <Upload className="w-5 h-5 text-brand" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-medium text-gray-900 truncate max-w-[180px]">
                                                {selectedFile.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {selectedFile.size > 1024 * 1024
                                                    ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`
                                                    : `${(selectedFile.size / 1024).toFixed(1)} KB`
                                                }
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={removeFile}
                                        className="text-gray-400 hover:text-red-500 transition-colors z-10 relative"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                                    <div className="text-sm text-gray-600">
                                        <span className="font-medium text-brand cursor-pointer hover:underline">
                                            Click to upload
                                        </span>{" "}
                                        or drag and drop
                                    </div>
                                    <p className="text-xs text-gray-500">PNG files only</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 rounded-full font-semibold text-white shadow-md transition ${isLoading ? "bg-brand/60 cursor-not-allowed" : "bg-brand hover:bg-brand/90"}`}
                    >
                        {isLoading ? <ButtonLoader /> : "Register"}
                    </button>
                </form>

                <p className="mt-6 text-center text-gray-600">
                    Already have an account?{" "}
                    <Link href="/login" className="text-brand hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </section>
    );
}
