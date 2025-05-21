import Navbar from "@/components/Common/Navbar";
import Footer from "@/components/Common/Footer";

export default function AuthLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <>
            <Navbar />
            <main className="px-[20px] lg:container lg:px-[20px] lg:mx-auto">
                {children}
            </main>
            <Footer />
        </>
    );
}