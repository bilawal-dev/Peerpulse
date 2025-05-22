import Image from "next/image";
import Check from "@/public/assets/check.svg";
import Link from "next/link";

const plans = [
  {
    name: "Free Trial",
    description: "Perfect for exploring Elevu's features",
    price: "0$/mo",
    bgColor: "bg-slate-100",
    textColor: "text-black",
    subTextColor: "text-[#36485C]",
    featureTextColor: "text-[#5F7896]",
    features: [
      "Explore basic business insights",
      "Access to core features",
      "Track performance and growth",
    ],
    buttonText: "Start Free Trial",
    buttonLink: "/login",
  },
  {
    name: "Business",
    description: "Ideal for most businesses needing insights",
    price: "500$",
    priceSuffix: "/mo",
    bgColor: "bg-slate-100",
    textColor: "text-black",
    subTextColor: "text-[#36485C]",
    featureTextColor: "text-[#5F7896]",
    features: [
      "In-depth business performance metrics",
      "Customizable reporting features",
      "Priority customer support",
      "Integrations with popular business tools",
      "Advanced data visualization",
    ],
    buttonText: "Get Started",
    buttonLink: "/login",
  },
  {
    name: "Enterprise",
    description: "For large enterprises with complex needs",
    price: "Custom Pricing",
    bgColor: "bg-slate-100",
    textColor: "text-black",
    subTextColor: "text-[#36485C]",
    featureTextColor: "text-[#5F7896]",
    features: [
      "Dedicated support for your team",
      "Advanced data analytics and reporting",
      "Custom integrations with enterprise tools",
      "Scalable solutions for growing teams",
      "Prioritized feature development and feedback",
    ],
    buttonText: "Contact Us",
    buttonLink: "/contact",
  },
];

const Pricing = () => {
  return (
    <section className="py-[48px] lg:py-[60px]">
      <h1 className="text-[#172026] text-center font-medium text-4xl">
        Flexible plans for your business
      </h1>
      <p className="pt-[16px] pb-[40px] text-center text-[#36485C] text-[18px]">
        No hidden fees, just straightforward pricing to help your business grow!
      </p>

      <div className="flex flex-col max-lg:items-center lg:flex-row justify-center gap-16 lg:gap-8 pt-10">
        {plans.map((plan, index) => (
          <div key={index} className={`w-full  max-w-md lg:max-w-[350px] rounded-[8px] ${plan.bgColor} ${plan.name === "Business" ? 'scale-y-110' : ''} px-6 py-12 flex flex-col lg:justify-between`}>
            <div>
              {plan.name === "Business" && (
                <p className="absolute right-[-50px] top-[60px] inline-block -rotate-90 rounded-bl-md rounded-tl-md bg-blue-600 px-5 py-2 text-base font-medium text-white">
                  Recommended
                </p>
              )}
              <h3 className={`font-medium ${plan.textColor} text-[18px] lg:text-xl`}>
                {plan.name}
              </h3>
              <p className={`pt-[12px] ${plan.subTextColor} ${plan.name === 'Business' ? 'max-w-[250px]' : ''} lg:text-[15px]`}>
                {plan.description}
              </p>

              <h2 className={`pt-10 text-2xl lg:text-3xl font-medium ${plan.textColor}`}>
                {plan.price}
                {plan.priceSuffix && (
                  <span className={`${plan.subTextColor}`}>{plan.priceSuffix}</span>
                )}
              </h2>

              <ul className={`flex flex-col gap-y-2 pt-10 ${plan.featureTextColor}`}>
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-x-2 text-sm">
                    <span>
                      <Image src={Check} alt="included" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <Link href={plan.buttonLink} className={`mt-20 rounded-md py-2.5 bg-blue-600 text-white font-medium text-center`}>
              {plan.buttonText}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Pricing;
