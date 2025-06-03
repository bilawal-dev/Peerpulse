"use client";

import { useState } from "react";
import Link from "next/link";
import ButtonLoader from "@/components/Common/ButtonLoader";
import { useAuth } from "@/context/AuthContext";

export default function ForgotPasswordForm() {
    const [email, setEmail] = useState("");
    const [isSending, setIsSending] = useState(false);


    const { forgotPassword } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSending(true);
        await forgotPassword(email);
        setEmail("");
        setIsSending(false);
    };


    return (
        <section className="pt-32 pb-16 flex items-center justify-center px-[20px] py-16">
            <div className="w-full max-w-md bg-white rounded-2xl border shadow-sm p-8">
                <h2 className="text-3xl whitespace-nowrap font-bold text-center text-gray-900 mb-8">
                    Forgot Password
                </h2>

                <form onSubmit={handleSubmit}>
                    {/* Email */}
                    <div className="mb-5">
                        <label htmlFor="email" className="block text-gray-700 mb-1">
                            Enter your email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-brand transition"
                        />
                    </div>

                    {/* Send Reset Link */}
                    <button
                        type="submit"
                        disabled={isSending}
                        className={`w-full py-3 rounded-full font-semibold text-white shadow-md transition ${isSending ? "bg-brand/60 cursor-not-allowed" : "bg-brand hover:bg-brand/90"}`}
                    >
                        {isSending ? <ButtonLoader /> : "Send Reset Link"}
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