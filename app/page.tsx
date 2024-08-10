import Hero from "@/components/hero";
import HowItWorks from "@/components/how-its-work";
import DonationCarousel from "@/components/donations/donation-carousel";


export default function Home() {
    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Hero/>
            <HowItWorks />
            <DonationCarousel />
        </main>
    );
}
