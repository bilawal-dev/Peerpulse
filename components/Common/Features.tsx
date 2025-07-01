import Image from "next/image";
import Feature1 from "@/public/assets/feature-1.svg";
import Feature2 from "@/public/assets/feature-2.svg";
import Feature3 from "@/public/assets/feature-3.svg";
import Check from "@/public/assets/check.svg";

// ADD: feature content array
const featuresData = [
  {
    image: Feature1,
    reverse: true,
    tagText: "Review-Cycle Builder",
    tagColor: "text-[#0085FF]",
    title: "Design and launch review cycles in minutes",
    description:
      "Define cycle names, dates, peer limits, and phase controls. Toggle peer-selection and review phases independently to control timing perfectly.",
    bullets: [
      "Set start/end dates with max peer selection limits",
      "Independent phase toggles for precise timing control",
      "Unlimited concurrent or sequential cycles supported",
    ],
  },
  {
    image: Feature2,
    reverse: false,
    tagText: "Employee Management",
    tagColor: "text-[#00A424]",
    title: "Streamline employee onboarding and tracking",
    description:
      "Bulk import via CSV or manage individuals with full CRUD tools. Track employee status from upload to review completion.",
    bullets: [
      "One-click employee invitations with auto-credentials",
      "Status tracking: Upload → Invited → Peer Selected → Review Given",
      "Bulk CSV import with department and manager relationships",
    ],
  },
  {
    image: Feature3,
    reverse: true,
    tagText: "Compiled Review Reports",
    tagColor: "text-[#EB2891]",
    title: "Turn feedback into actionable insights",
    description:
      "Combine self-assessments with peer and manager feedback into comprehensive reports. Share with managers and employees when ready.",
    bullets: [
      "Live progress widgets for completion tracking",
      "PDF-ready compiled reports for easy sharing",
      "Department-level analytics with filtering options",
    ],
  },
];

const Features = () => {
  return (
    <section className="flex flex-col gap-y-[56px] py-[56px] lg:py-[120px] lg:gap-y-[80px] ">
      {featuresData.map((feat, idx) => (
        <div
          key={idx}
          className={`flex flex-col gap-x-6 ${feat.reverse ? "sm:flex-row-reverse" : "sm:flex-row"}`}
        >
          {/* Feature Image (desktop) */}
          <Image
            src={feat.image}
            alt="Feature image"
            className="hidden w-1/2 sm:block"
          />

          {/* Text Column */}
          <div className={`sm:w-1/2 lg:py-[56px] ${feat.reverse ? "lg:pr-[56px]" : "lg:pl-[56px]"}`}>
            <h3 className={`font-medium ${feat.tagColor} lg:text-[18px] `}>{feat.tagText}</h3>
            <h1 className="pt-[12px] text-2xl font-medium text-[#172026] lg:text-[42px] lg:leading-[58px]">
              {feat.title}
            </h1>
            {/* Mobile image */}
            <Image
              src={feat.image}
              alt="feature image"
              className="pt-[24px] sm:hidden"
            />
            <p className="py-[24px] text-[#36485C] lg:text-[18px]">{feat.description}</p>

            <ul className="flex flex-col gap-y-3 lg:text-[18px]">
              {feat.bullets.map((b, i) => (
                <li key={i} className="flex items-center gap-x-2 text-[#36485C]">
                  <span>
                    <Image src={Check} alt="Checkmark" />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </section>
  );
};

export default Features