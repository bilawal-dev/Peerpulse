"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const items = [
  {
    question: "How does Elevu decide who reviews whom?",
    answer:
      "Our algorithm matches reviewers based on reporting lines, past collaboration, and cycle rules you define. You can override pairings any time or let Elevu handle the entire matching process automatically.",
  },
  {
    question: "Are peer reviews anonymous in Elevu?",
    answer:
      "Yes. By default, peer feedback is anonymous to encourage honest, constructive input. Admins can turn anonymity on or off per cycle if your culture prefers transparency.",
  },
  {
    question: "How are reminders sent to employees?",
    answer:
      "Elevu delivers smart reminders via email and Slack. Nudges respect local time zones and stop automatically once reviewers submit, so no one feels spammed.",
  },
  {
    question: "Can managers customize the review templates?",
    answer:
      "Absolutely. You can start with our role-based templates (engineering, sales, design, etc.) and edit questions or rating scales. Save them as presets for future cycles.",
  },
  {
    question: "What integrations does Elevu support?",
    answer:
      "Elevu connects with popular HRIS platforms, Slack, Microsoft Teams, and single-sign-on providers. Our Zapier app lets you automate workflows with 5,000+ additional tools.",
  },
];

export default function Faq() {
  return (
    <section className="flex flex-col w-full py-[48px] lg:py-[60px] lg:flex-row lg:gap-x-6">
      {/* Left Column */}
      <div className="lg:w-1/3 lg:pr-[56px]">
        <h3 className="text-[#EB2891] text-[14px] font-medium lg:text-base">
          Frequently Asked Questions
        </h3>
        <h1 className="py-4 text-2xl font-medium text-[#172026] lg:text-[42px] lg:leading-[58px]">
          Everything you need to know about Elevu
        </h1>
        <p className="text-[#36485C] pb-[24px]">
          From automated matching to insightful analytics, here are the answers
          to the questions we hear most.
        </p>
      </div>

      {/* Right Column (Accordion) */}
      <div className="lg:w-2/3">
        <Accordion type="single" collapsible className="space-y-4">
          {items.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="rounded-md border border-muted bg-[#E3F1FF]/60 px-4 py-1 sm:py-2"
            >
              <AccordionTrigger className="text-left text-[#172026] text-base lg:text-[18px] font-medium">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-[#36485C] pt-2 text-sm lg:text-base">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
