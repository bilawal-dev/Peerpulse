type GradientIntroSectionProps = {
    title: string;
    subtitle: string;
    fromColor: string;
    viaColor?: string;
    toColor: string;
};

const GradientIntroSection = ({ title, subtitle, fromColor, viaColor, toColor, }: GradientIntroSectionProps) => {

    const gradientStyle = {
        backgroundImage: `linear-gradient(to bottom right, ${fromColor}${viaColor ? `, ${viaColor}` : ""}, ${toColor})`,
        backgroundSize: "120% 120%",
    };

    return (
        <section className="pt-20 sm:pt-28 lg:pt-32 text-white animate-gradient" style={gradientStyle}>
            <div className="px-[20px] lg:px-[100px] py-16">
                <h1 className="text-center text-4xl sm:text-5xl lg:text-[64px] font-semibold lg:leading-[72px]">
                    {title}
                </h1>
                <p className="text-center pt-6 text-[#F4F8FA] text-sm sm:text-base lg:text-[18px] lg:leading-7 max-w-4xl mx-auto">
                    {subtitle}
                </p>
            </div>
        </section>
    );
};

export default GradientIntroSection;