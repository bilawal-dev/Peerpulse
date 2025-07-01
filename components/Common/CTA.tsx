import Image from "next/image";
import Arrow from "@/public/assets/arrow.png";
import Link from "next/link";

const CTA = () => {
  return (
    <section className="w-full rounded-[16px] bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 py-[56px] px-[20px] sm:px-[30px] text-center lg:my-[60px] lg:py-[50px] ">
      <h1 className="text-white font-medium text-3xl md:text-5xl lg:text-[56px] lg:leading-[64px] ">
        Elevate your team&apos;s growth with data-driven 360 feedback
      </h1>
      <p className="text-white pt-6 lg:pt-[48px] text-lg">
        Join leading teams already powering reviews and growth with PeerPulse.
      </p>

      <div className="mt-[40px] flex flex-col w-full items-center lg:mt-[56px] lg:flex-row lg:justify-center gap-x-[40px]">
        <Link
          href={"/login"}
          className="py-[12px] px-[32px] bg-white rounded-[4px] text-pink-500 w-fit font-medium"
        >
          Get Started Now
        </Link>

        <Link
          href={"/contact"}
          className="group inline-flex w-full items-center justify-center font-medium gap-x-3 mt-[32px] text-white lg:w-fit lg:mt-0"
        >
          Contact sales{" "}
          <Image
            src={Arrow}
            alt="Contact sales"
            className="group-hover:-rotate-[30deg] duration-200"
          />
        </Link>
      </div>
    </section>
  );
};

export default CTA;
