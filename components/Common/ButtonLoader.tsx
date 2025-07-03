import React from 'react'

export default function ButtonLoader({ className = "" }: { className?: string }) {
    return (
        <div className={`flex justify-center items-center ${className}`}>
            <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
        </div>
    )
}