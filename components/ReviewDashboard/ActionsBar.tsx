"use client";

import React from "react";
import { Mail, Send } from "lucide-react";

export default function ActionsBar() {
  return (
    <div className="flex flex-col sm:flex-row justify-center gap-6 mb-12">
      <button onClick={() => alert("BACKEND INTEGRATION NEEDED HERE")} className="flex items-center gap-2 bg-brand hover:bg-brand/90 text-white px-2 sm:px-4 md:px-6 py-3 rounded-lg text-sm md:text-base font-semibold">
        <Mail className="w-5 h-5" />
        Send Emails to Managers
      </button>
      <button onClick={() => alert("BACKEND INTEGRATION NEEDED HERE")} className="flex items-center gap-2 bg-brand hover:bg-brand/90 text-white px-2 sm:px-4 md:px-6 py-3 rounded-lg text-sm md:text-base font-semibold">
        <Send className="w-5 h-5" />
        Send Remaining Emails
      </button>
    </div>
  );
}