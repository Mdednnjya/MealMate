import Link from 'next/link';

export default function Hero() {
    return (
        <section className="text-center py-12 sm:py-16 lg:py-20 h-screen flex flex-col items-center justify-center">
            <h1 className="uberMoveFont text-3xl sm:text-4xl font-bold mb-4">
                Sharing Meals, Nourishing Communities
            </h1>
            <p className="uberMoveFont text-xl sm:text-2xl mb-8">
                Connect, Share, and Make a Difference
            </p>
            <Link href="/donate" className="bg-black text-white px-6 py-3 rounded inline-block">
                Donate Food
            </Link>
        </section>
    );
}
