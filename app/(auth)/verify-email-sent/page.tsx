import VerifyEmailSent from "@/components/Auth/VerifyEmailSent/VerifyEmailSent";

interface VerifyEmailSentPageProps {
    searchParams?: Record<string, string | string[]>;
}
function VerifyEmailSentPage({ searchParams }: VerifyEmailSentPageProps) {

    const email = searchParams?.email && decodeURIComponent(String(searchParams.email));

    const emailRegex = /^\S+@\S+\.\S+$/;
    let emailToShow: string;

    if (!email) {
        emailToShow = "No email provided";
    } else if (!emailRegex.test(email)) {
        emailToShow = "Invalid Email";
    } else {
        emailToShow = email;
    }

    return (
        <>
            <VerifyEmailSent email={emailToShow} />
        </>
    );
}

export default VerifyEmailSentPage;