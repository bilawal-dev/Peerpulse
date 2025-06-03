"use client";

import PreLoader from "@/components/Common/PreLoader";
import { useAuth } from "@/context/AuthContext";

export default function ClientLoader({ children }: { children: React.ReactNode }) {

    const { loading } = useAuth();

    if (loading) return <PreLoader />;

    return (
        <>
            {children}
        </>
    );
}