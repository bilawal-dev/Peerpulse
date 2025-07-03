"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { useParams } from "next/navigation";
import { ReviewCycle } from "@/types/ReviewCycle";
import { CreditCard, DollarSign, FileX, Calendar, Hash, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

interface Transaction {
  transaction_id: number;
  amount: number;
  stripe_payment_intent_id: string;
  payment_status: string;
  created_at: string;
  updated_at: string;
}

interface PaymentData {
  review_cycle: ReviewCycle;
  transactions: Transaction[];
  total_transactions: number;
}

enum TransactionPaymentStatus {
  PAID = 'paid',
  REFUNDED = 'refunded',
  DISPUTED = 'disputed',
  FAILED = 'failed'
}


function DashboardPaymentsPage() {
  const reviewCycleId = Number(useParams().reviewCycleId);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!reviewCycleId) return;
    fetchPaymentData();
  }, [reviewCycleId]);

  const fetchPaymentData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("elevu_auth");
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/company/get-review-cycle-transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ review_cycle_id: reviewCycleId }),
      });

      const json = await res.json();

      if (!json.success) {
        throw new Error(json.message || "Failed to fetch payment data");
      }

      setPaymentData(json.data);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to fetch payment records");
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      [TransactionPaymentStatus.PAID]: { className: "bg-green-100 text-green-800", label: "Paid" },
      [TransactionPaymentStatus.REFUNDED]: { className: "bg-yellow-100 text-yellow-800", label: "Refunded" },
      [TransactionPaymentStatus.DISPUTED]: { className: "bg-red-100 text-red-800", label: "Disputed" },
      [TransactionPaymentStatus.FAILED]: { className: "bg-red-100 text-red-800", label: "Failed" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { className: "bg-gray-100 text-gray-800", label: status };

    return (
      <span className={`${config.className} capitalize px-2 py-1 rounded-full text-xs font-medium`}>
        {config.label}
      </span>
    );
  };

  const Skeleton = ({ className = "" }: { className?: string }) => (
    <div className={`${className} bg-gray-200 rounded animate-pulse`} />
  );

  return (
    <div className="space-y-6 pb-8">
      {/* Review Cycle Payment Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-600" />
            Payment Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading || !paymentData ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-64" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {paymentData.review_cycle.name}
                </h3>
                <p className="text-sm text-gray-500">
                  Review Cycle ID: {paymentData.review_cycle.review_cycle_id}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600">Total Cost</p>
                      <p className="text-xl font-semibold text-blue-800">
                        {formatCurrency(paymentData.review_cycle.cost_amount)}
                      </p>
                    </div>
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600">Paid Amount</p>
                      <p className="text-xl font-semibold text-green-800">
                        {formatCurrency(paymentData.review_cycle.paid_amount)}
                      </p>
                    </div>
                    <CreditCard className="h-6 w-6 text-green-600" />
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-orange-600">Remaining</p>
                      <p className="text-xl font-semibold text-orange-800">
                        {formatCurrency(Math.max(0, paymentData.review_cycle.cost_amount - paymentData.review_cycle.paid_amount))}
                      </p>
                    </div>
                    <Calendar className="h-6 w-6 text-orange-600" />
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Payment Status</p>
                      <div className="mt-1">
                        {getStatusBadge(paymentData.review_cycle.payment_status)}
                      </div>
                    </div>
                    <Hash className="h-6 w-6 text-gray-600" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileX className="h-5 w-5 text-purple-600" />
              Transaction History
            </div>
            {paymentData && (
              <span className="text-sm text-gray-500">
                {paymentData.total_transactions} transaction{paymentData.total_transactions !== 1 ? 's' : ''}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : !paymentData?.transactions.length ? (
            <div className="text-center py-12">
              <FileX className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
              <p className="text-gray-500">No payment transactions have been made for this review cycle yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stripe Payment Intent ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paymentData.transactions.map((transaction) => (
                    <tr key={transaction.transaction_id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {transaction.transaction_id}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getStatusBadge(transaction.payment_status)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                            {transaction.stripe_payment_intent_id}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(transaction.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default DashboardPaymentsPage;