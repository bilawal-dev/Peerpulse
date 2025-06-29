"use client";

import React, { useState } from "react";
import { Mail, Send } from "lucide-react";
import toast from "react-hot-toast";

export default function ActionsBar({ reviewCycleId }: { reviewCycleId: number }) {
  const [isLoadingManagers, setIsLoadingManagers] = useState(false);
  const [isLoadingRemaining, setIsLoadingRemaining] = useState(false);

  const sendEmailsToManagers = async () => {
    setIsLoadingManagers(true);
    toast.loading("Sending emails to managers...", { id: "managers-email" });

    try {
      const token = localStorage.getItem("elevu_auth");
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/company/send-review-report-email-to-manager`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          review_cycle_id: reviewCycleId,
        }),
      });

      const json = await res.json();
      
      if (!json.success) {
        throw new Error(json.message || "Failed to send emails to managers");
      }

      toast.success("Emails sent to managers successfully!", { id: "managers-email" });
    } catch (error: any) {
      console.error("Error sending emails to managers:", error);
      toast.error(error.message || "Failed to send emails to managers", { id: "managers-email" });
    } finally {
      setIsLoadingManagers(false);
    }
  };

  const sendRemainingEmails = async () => {
    setIsLoadingRemaining(true);
    toast.loading("Sending emails to remaining employees...", { id: "remaining-email" });

    try {
      const token = localStorage.getItem("elevu_auth");
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/company/send-review-report-email-to-remaining-employees`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          review_cycle_id: reviewCycleId,
        }),
      });

      const json = await res.json();
      
      if (!json.success) {
        throw new Error(json.message || "Failed to send emails to remaining employees");
      }

      toast.success("Emails sent to remaining employees successfully!", { id: "remaining-email" });
    } catch (error: any) {
      console.error("Error sending emails to remaining employees:", error);
      toast.error(error.message || "Failed to send emails to remaining employees", { id: "remaining-email" });
    } finally {
      setIsLoadingRemaining(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-center gap-6 mb-12">
      <button 
        onClick={sendEmailsToManagers} 
        disabled={isLoadingManagers}
        className="flex items-center gap-2 bg-brand hover:bg-brand/90 disabled:bg-brand/60 disabled:cursor-not-allowed text-white px-2 sm:px-4 md:px-6 py-3 rounded-lg text-sm md:text-base font-semibold transition-colors"
      >
        <Mail className="w-5 h-5" />
        {isLoadingManagers ? "Notifying..." : "Notify Managers - Team Reports Ready"}
      </button>
      <button 
        onClick={sendRemainingEmails} 
        disabled={isLoadingRemaining}
        className="flex items-center gap-2 bg-brand hover:bg-brand/90 disabled:bg-brand/60 disabled:cursor-not-allowed text-white px-2 sm:px-4 md:px-6 py-3 rounded-lg text-sm md:text-base font-semibold transition-colors"
      >
        <Send className="w-5 h-5" />
        {isLoadingRemaining ? "Notifying..." : "Notify Employees - Reviews Ready"}
      </button>
    </div>
  );
}