"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const items = [
  {
    question: "How does PeerPulse assign which peers review whom?",
    answer:
      "Our algorithm does automatic pairing of peers to be reviewed by an employee based on your peer-selection of the peers they work closely or know best to give review. HR may tweak pairs and do manual pairing adjustments. It Is best to combine both automatic pairing and manual paring adjustments by hr for best results.",
  },
  {
    question: "Can HR customise the review questionnaire?",
    answer:
      "Yes. HR can edit the questionnaire, add or sort questions, insert dynamic fields, and lock the form once the reivew process starts.",
  },
  {
    question: "How does credit-based pricing work?",
    answer:
      "Companies buy credits per employee — say $10 each employee. After payment they can invite-employees to thier review cycle, do peer-selection, send reminders, fill review forms and then access the performance reports without any extra cost.",
  },
  {
    question: "Is company data isolated and secure?",
    answer:
      "Company data sits in its own tenancy so records stay private. At review cycle end the company as well as managers get a compiled report and access alerts by email.",
  },
  {
    question: "How are reminders delivered during a cycle?",
    answer:
      "Emails fire on the schedule HR sets: peer-selection and reivew-form-filling nudges, first and second prompts, and final warnings.",
  },
  {
    question: "Can we run several review cycles at once?",
    answer:
      "Yes. Finish one cycle or leave it archived, then launch another. Past data stays intact and the new round collects feedback.",
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
          Everything you need to know about PeerPulse
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
