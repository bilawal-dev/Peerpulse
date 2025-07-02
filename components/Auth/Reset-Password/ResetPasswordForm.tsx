"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import ButtonLoader from "@/components/Common/ButtonLoader";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    
    const [formData, setFormData] = useState({ 
        newPassword: "", 
        confirmPassword: "" 
    });
    const [userType, setUserType] = useState<"company" | "employee">("employee");
    const [isLoading, setIsLoading] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState("");

    useEffect(() => {
        if(!token) {
            router.push("/login");
        }
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        
        // Clear password error when user starts typing
        if (passwordError) {
            setPasswordError("");
        }
    };

    const { resetPassword } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate passwords match
        if (formData.newPassword !== formData.confirmPassword) {
            setPasswordError("Passwords do not match");
            return;
        }

        // Validate password length
        if (formData.newPassword.length < 8) {
            setPasswordError("Password must be at least 8 characters long");
            return;
        }

        // Validate token exists
        if (!token) {
            setPasswordError("Invalid or missing reset token");
            return;
        }

        setIsLoading(true);
        await resetPassword(token, formData.newPassword, userType);
        setFormData({ newPassword: "", confirmPassword: "" });
        setIsLoading(false);
    };

    return (
        <section className="pt-32 pb-16 flex items-center justify-center px-[20px] py-16">
            <div className="w-full max-w-md bg-white rounded-2xl border shadow-sm p-8">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
                    Reset Password
                </h2>

                <form onSubmit={handleSubmit}>
                    {/* New Password */}
                    <div className="mb-5 relative">
                        <label htmlFor="newPassword" className="block text-gray-700 mb-1">
                            New Password
                        </label>
                        <input
                            id="newPassword"
                            name="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            value={formData.newPassword}
                            onChange={handleChange}
                            required
                            className="w-full pr-10 px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-brand transition"
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword((v) => !v)}
                            className="absolute right-3 top-1/2 translate-y-1 text-gray-400"
                            aria-label={showNewPassword ? "Hide password" : "Show password"}
                        >
                            {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {/* Confirm Password */}
                    <div className="mb-5 relative">
                        <label htmlFor="confirmPassword" className="block text-gray-700 mb-1">
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="w-full pr-10 px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-brand transition"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword((v) => !v)}
                            className="absolute right-3 top-1/2 translate-y-1 text-gray-400"
                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        >
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {/* User Type Selection */}
                    <div className="mb-8">
                        <label className="block text-gray-700 mb-2">Account Type:</label>
                        <div className="grid grid-cols-2 bg-red-50 rounded-full overflow-hidden">
                            <button
                                type="button"
                                onClick={() => setUserType("employee")}
                                className={`py-2 text-center font-medium ${userType === "employee"
                                    ? "bg-brand text-white"
                                    : "text-brand hover:bg-red-100"
                                    }`}
                            >
                                Employee
                            </button>
                            <button
                                type="button"
                                onClick={() => setUserType("company")}
                                className={`py-2 text-center font-medium ${userType === "company"
                                    ? "bg-brand text-white"
                                    : "text-brand hover:bg-red-100"
                                    }`}
                            >
                                Company
                            </button>
                        </div>
                    </div>

                    {/* Error Message */}
                    {passwordError && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-sm">{passwordError}</p>
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 rounded-full font-semibold text-white shadow-md transition ${isLoading
                            ? "bg-brand/60 cursor-not-allowed"
                            : "bg-brand hover:bg-brand/90"
                            }`}
                    >
                        {isLoading ? <ButtonLoader /> : "Reset Password"}
                    </button>
                </form>

                <p className="mt-6 text-center text-gray-600">
                    Remember your password?{" "}
                    <Link href="/login" className="text-brand hover:underline">
                        Log In
                    </Link>
                </p>
            </div>
        </section>
    );
}
