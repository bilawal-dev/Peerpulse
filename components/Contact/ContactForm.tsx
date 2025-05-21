"use client"

import { useState } from "react"
import toast from "react-hot-toast"
import Image from "next/image"
import ContactIllustration from "@/public/assets/contact-graphic.svg"

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // reset
        setFormData({ name: "", email: "", subject: "", message: "" })
        toast.success("Your message has been sent!")
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
                        We usually respond within 24 hours. Whether you're a potential
                        client or curious about a feature, we're here to chat.
                    </p>
                    <p className="text-sm font-medium text-[#0C0C0F]">support@elevu.com</p>
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
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="subject" className="block text-sm font-medium">
                            Subject
                        </label>
                        <input
                            id="subject"
                            name="subject"
                            type="text"
                            placeholder="What’s this about?"
                            className={fieldClasses}
                            value={formData.subject}
                            onChange={handleChange}
                            required
                        />
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
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 text-center font-medium transition"
                    >
                        Submit Now
                    </button>
                </form>
            </div>
        </section>
    )
}
