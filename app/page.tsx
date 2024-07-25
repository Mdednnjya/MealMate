import Header from "@/components/header";
import Hero from "@/components/hero";
import HowItWorks from "@/components/how-its-work";
import DonationCarousel from "@/components/donation-carousel";
import Footer from "@/components/footer";

export default function Home() {
    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Header isLoggedIn={true} profilePicture="/path/to/profile-picture.jpg" />
            <Hero/>
            <HowItWorks />
            <DonationCarousel />
            <Footer />
        </main>
    );
}
