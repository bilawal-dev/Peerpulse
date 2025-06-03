"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import ButtonLoader from "@/components/Common/ButtonLoader";
import { useAuth } from "@/context/AuthContext";

export default function LoginForm() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [userType, setUserType] = useState<"COMPANY" | "EMPLOYEE">("EMPLOYEE");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        await login(formData.email, formData.password, userType);
        setFormData({ email: "", password: "" });
        setIsLoading(false);
    };


    return (
        <section className="pt-32 pb-16 flex items-center justify-center px-[20px] py-16">
            <div className="w-full max-w-md bg-white rounded-2xl border shadow-sm p-8">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
                    Login To Account
                </h2>

                <form onSubmit={handleSubmit}>
                    {/* Email */}
                    <div className="mb-5">
                        <label htmlFor="email" className="block text-gray-700 mb-1">
                            Email
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
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full pr-10 px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none  focus:border-brand transition"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute right-3 top-1/2 translate-y-1 text-gray-400"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    <div className="mb-8">
                        <label className="block text-gray-700 mb-2">Login As:</label>
                        <div className="grid grid-cols-2 bg-red-50 rounded-full overflow-hidden">
                            <button
                                type="button"
                                onClick={() => setUserType("EMPLOYEE")}
                                className={`py-2 text-center font-medium ${userType === "EMPLOYEE"
                                    ? "bg-brand text-white"
                                    : "text-brand hover:bg-red-100"
                                    }`}
                            >
                                Employee
                            </button>
                            <button
                                type="button"
                                onClick={() => setUserType("COMPANY")}
                                className={`py-2 text-center font-medium ${userType === "COMPANY"
                                    ? "bg-brand text-white"
                                    : "text-brand hover:bg-red-100"
                                    }`}
                            >
                                Company
                            </button>
                        </div>
                    </div>

                    {/* Forgot Password Link */}
                    <div className="mb-2 text-right">
                        <Link
                            href="/forgot-password"
                            className="text-brand text-sm hover:underline"
                        >
                            Forgot Password?
                        </Link>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 rounded-full font-semibold text-white shadow-md transition ${isLoading
                            ? "bg-brand/60 cursor-not-allowed"
                            : "bg-brand hover:bg-brand/90"
                            }`}
                    >
                        {isLoading ? <ButtonLoader /> : "Login"}
                    </button>
                </form>

                <p className="mt-6 text-center text-gray-600">
                    Don't have an account?{" "}
                    <Link href="/register" className="text-brand hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </section>
    );
}
