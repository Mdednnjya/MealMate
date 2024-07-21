import Image from "next/image";
import Link from 'next/link';
import Header from "@/components/header";
import Footer from "@/components/footer";
import HowItWorks from "@/components/how-its-work";
import DonationCarousel from "@/components/donation-carousel";
import Hero from "@/components/hero";

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
