"use client"

import { useState } from "react"
import toast from "react-hot-toast"
import Image from "next/image"
import ContactIllustration from "@/public/assets/contact-graphic.svg"
import ButtonLoader from "../Common/ButtonLoader"

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Subject options for better UX
    const subjectOptions = [
        { value: "", label: "Select a subject" },
        { value: "General Inquiry", label: "General Inquiry" },
        { value: "Product Support", label: "Product Support" },
        { value: "Technical Issue", label: "Technical Issue" },
        { value: "Feature Request", label: "Feature Request" },
        { value: "Billing Question", label: "Billing Question" },
        { value: "Partnership Opportunity", label: "Partnership Opportunity" },
        { value: "Demo Request", label: "Demo Request" },
        { value: "Other", label: "Other" },
    ]

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Show loading toast
        const loadingToast = toast.loading("Sending your message...")

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/contact`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (response.ok) {
                // Success
                toast.success("Your message has been sent successfully! We'll get back to you within 24 hours.", {
                    id: loadingToast,
                    duration: 5000,
                })
                // Reset form
                setFormData({ name: "", email: "", subject: "", message: "" })
            } else {
                // Server error with validation or other issues
                const errorMessage = data.message || "Failed to send message. Please try again."
                toast.error(errorMessage, {
                    id: loadingToast,
                    duration: 6000,
                })
            }
        } catch (error) {
            // Network or other errors
            toast.error("Something went wrong. Please check your connection and try again.", {
                id: loadingToast,
                duration: 6000,
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    // shared classes for inputs
    const fieldClasses = "w-full bg-[#FFF8F5] placeholder:text-slate-400 px-4 py-3 rounded-l-md focus:outline-none focus:ring-0 focus:ring-orange-300 border-0 border-l border-l-orange-500"

    return (
        <section className="w-full bg-white py-20 sm:px-6 text-[#172026]">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 sm:gap-20 items-start">
                {/* Left Side */}
                <div className="space-y-6 text-center lg:text-left">
                    <Image
                        src={ContactIllustration}
                        alt="Contact graphic"
                        className="mx-auto lg:mx-0 sm:max-w-sm"
                    />
                    <h2 className="text-3xl lg:text-4xl font-bold">Send A Message</h2>
                    <p className="text-[#5F7896] text-base">
                        We usually respond within 24 hours. Whether you&apos;re a potential
                        client or curious about a feature, we&apos;re here to chat.
                    </p>
                    <p className="text-sm font-medium text-[#0C0C0F]">support@peerpulse.com</p>
                </div>

                {/* Right Side: Form */}
                <form onSubmit={handleSubmit} className="space-y-6 w-full bg-white md:border rounded-xl p-8 max-sm:px-3">
                    <div className="space-y-1">
                        <label htmlFor="name" className="block text-sm font-medium">
                            Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Full Name"
                            className={fieldClasses}
                            value={formData.name}
                            onChange={handleChange}
                            disabled={isSubmitting}
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="email" className="block text-sm font-medium">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Email Address"
                            className={fieldClasses}
                            value={formData.email}
                            onChange={handleChange}
                            disabled={isSubmitting}
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="subject" className="block text-sm font-medium">
                            Subject
                        </label>
                        <select
                            id="subject"
                            name="subject"
                            className={fieldClasses + " cursor-pointer"}
                            value={formData.subject}
                            onChange={handleChange}
                            disabled={isSubmitting}
                            required
                        >
                            {subjectOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="message" className="block text-sm font-medium">
                            Message
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            rows={5}
                            placeholder="Write your message here..."
                            className={fieldClasses + " resize-none h-32"}
                            value={formData.message}
                            onChange={handleChange}
                            disabled={isSubmitting}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed text-white py-3 text-center font-medium transition"
                    >
                        {isSubmitting ? <ButtonLoader /> : "Submit Now"}
                    </button>
                </form>
            </div>
        </section>
    )
}
