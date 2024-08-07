"use client"
import { uberMoveText } from "@/components/fonts";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from 'next/navigation';

export default function Hero() {
    const { user } = useAuth();
    const router = useRouter();

    const handleDonateClick = () => {
        if (user) {
            router.push('/donate');
        } else {
            router.push('/auth/login');
        }
    };

    return (
        <section className="text-center py-12 sm:py-16 lg:py-20 h-screen flex flex-col items-center justify-center">
            <h1 className="uberMoveFont text-3xl sm:text-4xl font-bold mb-4">
                Sharing Meals, Nourishing Communities
            </h1>
            <p className={`uberMoveFont ${uberMoveText.className} text-xl sm:text-2xl mb-8`}>
                Connect, Share, and Make a Difference
            </p>
            <button
                onClick={handleDonateClick}
                className="bg-black text-white px-6 py-3 rounded-xl inline-block"
            >
                {user ? "Donate Food" : "Login & Donate"}
            </button>
        </section>
    );
}