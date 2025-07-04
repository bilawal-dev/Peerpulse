"use client";

import Link from "next/link";
import { CheckCircle, Users, Settings, Zap, BarChart3, Bell, FileText, Shield, Lock, Calculator } from "lucide-react";
import { useState } from "react";

const includedFeatures = [
    {
        title: "Employee Management",
        description: "Bulk CSV import & individual management",
        icon: Users
    },
    {
        title: "Review Cycle Builder",
        description: "Create unlimited concurrent or sequential cycles",
        icon: Settings
    },
    {
        title: "Notification Engine",
        description: "Automated reminders & email notifications",
        icon: Bell
    },
    {
        title: "Smart Pairing",
        description: "Automated algorithms + manual fine-tuning by HR",
        icon: Zap
    },
    {
        title: "Custom Forms",
        description: "Questionnaire designer to create your own questions",
        icon: FileText
    },
    {
        title: "Live Analytics",
        description: "Progress monitoring & completion tracking",
        icon: BarChart3
    },
    {
        title: "Compiled Reports",
        description: "360° feedback insights & analytics",
        icon: FileText
    },
    {
        title: "Multi-Role Access",
        description: "Manager, employee & admin dashboards",
        icon: Shield
    }
];

const Pricing = () => {

    const [employees, setEmployees] = useState(50);

    return (
        <section className="relative">

            <div className="relative z-10 px-6 py-20">

                {/* Hero Pricing Section */}
                <div className="text-center mb-20">
                    <div className="inline-flex items-center bg-white/70 backdrop-blur-sm border border-blue-200 text-blue-700 px-6 py-3 rounded-full text-sm font-medium mb-8 shadow-lg">
                        Simple, Transparent Pricing
                    </div>

                    <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6">
                        <span className="">$10</span>
                        <span className="text-2xl lg:text-3xl font-normal text-gray-500 ml-3">per employee</span>
                    </h1>

                    <p className="text-xl text-gray-600 mb-16 max-w-2xl mx-auto">
                        For each review cycle • No recurring fees • No hidden costs
                    </p>

                    {/* Process Flow */}
                    <div className="relative max-w-6xl mx-auto mb-16">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[
                                { step: "01", title: "Upload Employees", desc: "CSV bulk import or manual entry", icon: Users },
                                { step: "02", title: "Configure Cycle", desc: "Set email reminders, questionnaire etc", icon: Settings },
                                { step: "03", title: "Pay Per Employee", desc: "Simple calculation: total employees × $10", icon: Calculator },
                                { step: "04", title: "Launch Reviews", desc: "Launch the 360° feedback process", icon: Zap }
                            ].map((item, idx) => {
                                const IconComponent = item.icon;
                                return (
                                    <div key={idx} className="relative group">
                                        {/* Connection Line */}
                                        {idx < 3 && (
                                            <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-blue-500 z-0"></div>
                                        )}

                                        <div className="relative z-10 bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/50 group-hover:scale-105">
                                            <div className="w-20 h-20 bg-blue-500 rounded-3xl flex items-center justify-center mb-6 mx-auto group-hover:rotate-6 transition-transform duration-300">
                                                <IconComponent className="w-10 h-10 text-white" />
                                            </div>
                                            <div className="text-sm font-bold text-blue-600 mb-2">{item.step}</div>
                                            <h4 className="font-bold text-gray-900 mb-3 text-lg">{item.title}</h4>
                                            <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <Link href="/register" className="inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold px-12 py-4 rounded-2xl text-lg outline-none transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25">
                        Get Started Now
                    </Link>
                </div>

                {/* Features Grid */}
                <div className="grid lg:grid-cols-3 gap-8 lg:items-start">

                    {/* Main Features Panel */}
                    <div className="lg:col-span-2 h-full">
                        <div className="rounded-3xl p-3 sm:p-8 shadow-lg border border-white/50 relative overflow-hidden h-full">
                            {/* Decorative Elements */}
                            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-green-200 to-emerald-200 rounded-full -translate-y-20 translate-x-20 opacity-60"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-green-100 to-emerald-100 rounded-full translate-y-16 -translate-x-16 opacity-40"></div>

                            <div className="relative z-10">
                                <div className="flex items-start mb-10">
                                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
                                        <CheckCircle className="w-8 h-8 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Everything Included</h3>
                                        <p className="text-green-600 text-base sm:text-lg">Access all features immediately, even before payment</p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {includedFeatures.map((feature, idx) => {
                                        const IconComponent = feature.icon;
                                        return (
                                            <div key={idx} className="group p-5 rounded-2xl hover:bg-green-50/80 transition-all duration-300 border border-transparent hover:border-green-200">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-all duration-300 group-hover:scale-110">
                                                        <IconComponent className="w-6 h-6 text-green-600" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-bold text-gray-900 mb-2 text-lg">{feature.title}</h4>
                                                        <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="h-full flex flex-col gap-8">

                        {/* Restricted Features */}
                        <div className="rounded-3xl p-8 shadow-lg border border-amber-200/50 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full -translate-y-14 translate-x-14 opacity-60"></div>

                            <div className="relative z-10">
                                <div className="flex items-center mb-8">
                                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                                        <Lock className="w-6 h-6 text-white" />
                                    </div>
                                    <h4 className="text-xl font-bold text-amber-800">Unlocked After Payment</h4>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 bg-amber-50/80 rounded-xl border border-amber-200/50">
                                        <div className="w-3 h-3 bg-amber-500 rounded-full flex-shrink-0"></div>
                                        <span className="font-semibold text-amber-800">Peer Selection Phase</span>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 bg-amber-50/80 rounded-xl border border-amber-200/50">
                                        <div className="w-3 h-3 bg-amber-500 rounded-full flex-shrink-0"></div>
                                        <span className="font-semibold text-amber-800">Review Form Submissions</span>
                                    </div>
                                </div>

                                <div className="mt-6 p-5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border-l-4 border-amber-400">
                                    <div className="flex items-start gap-3">
                                        <p className="text-sm text-amber-800 leading-relaxed">
                                            <strong>Smart Design:</strong> Set up everything first, pay only when ready to launch the actual review process.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Dynamic Calculator */}
                        <div className="rounded-3xl p-8 shadow-lg border border-blue-200/50 relative overflow-hidden flex-grow">
                            <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full -translate-y-14 translate-x-14 opacity-60"></div>

                            <div className="relative z-10">
                                <div className="flex items-center mb-8">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                                        <Calculator className="w-6 h-6 text-white" />
                                    </div>
                                    <h4 className="text-xl font-bold text-blue-800">Quick Calculator</h4>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200/50">
                                        <div className="mb-6 flex justify-center items-center">
                                            <input
                                                type="number"
                                                placeholder="50"
                                                defaultValue="50"
                                                min="1"
                                                value={employees}
                                                className="text-center w-24 text-3xl font-bold text-blue-600 bg-transparent border-b border-blue-300 focus:border-blue-500 outline-none pb-2 transition-colors"
                                                onChange={(e) => {
                                                    setEmployees(parseInt(e.target.value) || 0);
                                                }}
                                            />
                                        </div>
                                        <div className="text-center">
                                            <div className="text-sm text-gray-500 mb-3 font-medium">employees × $10 =</div>
                                            <div className="text-4xl font-bold text-green-600 cost-per-cycle mb-2">${employees * 10}</div>
                                            <div className="text-sm text-gray-500 font-medium">per cycle</div>
                                        </div>
                                    </div>

                                    <div className="text-sm text-blue-700 bg-blue-50 rounded-xl p-4 yearly-costs border border-blue-200/50">
                                        <div className="font-semibold mb-1">Annual Examples:</div>
                                        Quarterly Reviews: ${employees * 10 * 4}/year<br />
                                        Bi-annual Reviews: ${employees * 10 * 2}/year
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Pricing; 