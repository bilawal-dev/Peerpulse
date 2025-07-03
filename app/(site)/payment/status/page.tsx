"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Clock, AlertTriangle, RefreshCw, ArrowLeft, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";

type SearchParams = {
    session_id: string | undefined;
    review_cycle_id: string | undefined;
};

interface PaymentStatusData {
    status: 'success' | 'invalid' | 'processing' | 'failed' | 'expired' | 'pending' | 'error';
    message: string;
    transaction?: {
        transaction_id: number;
        amount: number;
        payment_status: string;
        created_at: string;
    };
    session_details?: {
        session_id: string;
        payment_status: string;
        amount_total: number;
    };
    review_cycle?: {
        review_cycle_id: number;
        name: string;
        payment_status: string;
        paid_amount: number;
        cost_amount: number;
    };
}

export default function StripePaymentStatusPage({ searchParams }: { searchParams: SearchParams }) {
    const router = useRouter();
    const { session_id, review_cycle_id } = searchParams;
    
    const [paymentData, setPaymentData] = useState<PaymentStatusData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        if (!session_id || !review_cycle_id) {
            setPaymentData({
                status: 'invalid',
                message: 'Missing payment session information'
            });
            setIsLoading(false);
            return;
        }
        
        verifyPaymentStatus();
    }, [session_id, review_cycle_id]);

    const verifyPaymentStatus = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/company/verify-payment-status-public`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    session_id, 
                    review_cycle_id: parseInt(review_cycle_id!) 
                }),
            });
            
            const json = await res.json();
            
            if (json.success && json.data) {
                setPaymentData(json.data);
            } else {
                setPaymentData({
                    status: 'error',
                    message: json.message || 'Unable to verify payment status'
                });
            }
        } catch (err: any) {
            console.error('Payment verification error:', err);
            setPaymentData({
                status: 'error',
                message: 'Network error while verifying payment'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleRetry = () => {
        setRetryCount(prev => prev + 1);
        verifyPaymentStatus();
    };

    const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
    
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusConfig = (status: string) => {
        const configs = {
            success: {
                icon: CheckCircle2,
                color: 'text-green-600',
                bgColor: 'bg-green-50',
                borderColor: 'border-green-200',
                title: 'Payment Successful!',
                titleColor: 'text-green-800'
            },
            processing: {
                icon: Clock,
                color: 'text-blue-600',
                bgColor: 'bg-blue-50',
                borderColor: 'border-blue-200',
                title: 'Processing Payment',
                titleColor: 'text-blue-800'
            },
            pending: {
                icon: Clock,
                color: 'text-orange-600',
                bgColor: 'bg-orange-50',
                borderColor: 'border-orange-200',
                title: 'Payment Pending',
                titleColor: 'text-orange-800'
            },
            failed: {
                icon: XCircle,
                color: 'text-red-600',
                bgColor: 'bg-red-50',
                borderColor: 'border-red-200',
                title: 'Payment Failed',
                titleColor: 'text-red-800'
            },
            expired: {
                icon: AlertTriangle,
                color: 'text-yellow-600',
                bgColor: 'bg-yellow-50',
                borderColor: 'border-yellow-200',
                title: 'Session Expired',
                titleColor: 'text-yellow-800'
            },
            invalid: {
                icon: XCircle,
                color: 'text-gray-600',
                bgColor: 'bg-gray-50',
                borderColor: 'border-gray-200',
                title: 'Invalid Session',
                titleColor: 'text-gray-800'
            },
            error: {
                icon: AlertTriangle,
                color: 'text-red-600',
                bgColor: 'bg-red-50',
                borderColor: 'border-red-200',
                title: 'Verification Error',
                titleColor: 'text-red-800'
            }
        };
        
        return configs[status as keyof typeof configs] || configs.error;
    };

    const LoadingSpinner = () => (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <Card className="w-full max-w-md mx-4">
                <CardContent className="flex flex-col items-center justify-center py-12">
                    <RefreshCw className="h-12 w-12 text-blue-600 animate-spin mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Verifying Payment</h2>
                    <p className="text-gray-600 text-center">Please wait while we verify your payment status...</p>
                </CardContent>
            </Card>
        </div>
    );

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (!paymentData) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <Card className="w-full max-w-md mx-4">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <XCircle className="h-12 w-12 text-red-600 mb-4" />
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load</h2>
                        <p className="text-gray-600 text-center mb-4">Failed to load payment status</p>
                        <Button onClick={handleRetry} variant="outline">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Try Again
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const statusConfig = getStatusConfig(paymentData.status);
    const StatusIcon = statusConfig.icon;

    return (
        <div className="min-h-screen py-12 pt-20 sm:pt-28 lg:pt-32">
            <div className="max-w-2xl mx-auto">
                {/* Main Status Card */}
                <Card className={`${statusConfig.bgColor} ${statusConfig.borderColor} border-2 mb-6`}>
                    <CardContent className="text-center py-12">
                        <StatusIcon className={`h-16 w-16 ${statusConfig.color} mx-auto mb-6`} />
                        <h1 className={`text-3xl font-bold ${statusConfig.titleColor} mb-4`}>
                            {statusConfig.title}
                        </h1>
                        <p className="text-lg text-gray-700 mb-6 max-w-md mx-auto">
                            {paymentData.message}
                        </p>
                        
                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            {paymentData.status === 'success' && paymentData.review_cycle && (
                                <Button 
                                    onClick={() => router.push(`/admin/dashboard/${paymentData.review_cycle!.review_cycle_id}`)}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    Go to Dashboard
                                </Button>
                            )}
                            
                            {(paymentData.status === 'processing' || paymentData.status === 'pending') && (
                                <Button onClick={handleRetry} variant="outline">
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Check Again
                                </Button>
                            )}
                            
                            {(paymentData.status === 'failed' || paymentData.status === 'expired') && paymentData.review_cycle && (
                                <Button 
                                    onClick={() => router.push(`/admin/dashboard/${paymentData.review_cycle!.review_cycle_id}`)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    Try Payment Again
                                </Button>
                            )}
                            
                            <Button 
                                onClick={() => router.push('/')}
                                variant="outline"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Homepage
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Transaction Details */}
                {paymentData.transaction && (
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Transaction Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Transaction ID</p>
                                    <p className="font-semibold">{paymentData.transaction.transaction_id}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Amount</p>
                                    <p className="font-semibold">{formatCurrency(paymentData.transaction.amount)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Status</p>
                                    <p className="font-semibold capitalize">{paymentData.transaction.payment_status}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Date</p>
                                    <p className="font-semibold">{formatDate(paymentData.transaction.created_at)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Review Cycle Info */}
                {paymentData.review_cycle && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Review Cycle Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-600">Review Cycle</p>
                                    <p className="font-semibold">{paymentData.review_cycle.name}</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Total Cost</p>
                                        <p className="font-semibold">{formatCurrency(paymentData.review_cycle.cost_amount)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Paid Amount</p>
                                        <p className="font-semibold">{formatCurrency(paymentData.review_cycle.paid_amount)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Payment Status</p>
                                        <p className="font-semibold capitalize">{paymentData.review_cycle.payment_status}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}