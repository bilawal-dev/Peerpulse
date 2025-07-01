import React from "react";
import Link from "next/link";
import { MailCheck } from "lucide-react";

export default function VerifyEmailSent({ email }: { email: string }) {

    return (
        <section className="pt-32 min-h-[80vh] pb-16 flex items-center justify-center px-[20px] py-16">
            <div className="w-full max-w-md bg-white rounded-2xl border shadow-sm p-8 max-sm:px-3 text-center">
                <div className="flex justify-center mb-6">
                    <MailCheck size={48} className="text-brand" />
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Verification Email Sent
                </h2>

                <p className="text-gray-700 mb-6">
                    We&apos;ve sent a verification link to your inbox. Please check your email and click the link to activate your account.
                </p>

                <p className="text-gray-900 font-medium mb-8">
                    Sent to: <span className="text-brand">{email}</span>
                </p>

                <Link href="/login" className="inline-block bg-brand text-white py-3 px-6 rounded-full font-semibold shadow hover:bg-brand/90 transition">
                    Back to Login
                </Link>
            </div>
        </section>
    );
}