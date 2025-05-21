export default function DashboardLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <main className="px-[20px] lg:container lg:px-[20px] lg:mx-auto">
            {children}
        </main>
    );
}