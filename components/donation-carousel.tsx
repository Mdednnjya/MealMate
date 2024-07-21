import DonationCard from './donation-card';
import Link from "next/link";

export default function DonationCarousel() {
    const donations = [
        {
            image: "/images/donations/burger.jpg",
            title: "Burger Bangor",
            location: "Austin",
            date: "July 25, 2024",
            notes: "Variety of turkey and ham sandwiches"
        },
        {
            image: "/images/donations/veggies.jpg",
            title: "Farm-Fresh Veggie",
            location: "Austin",
            date: "July 25, 2024",
            notes: "Assorted fresh vegetables from local farm"
        },
        {
            image: "/images/donations/sandwich.jpg",
            title: "Deli Sandwich Surplus",
            location: "Riverside District",
            date: "July 29, 2024",
            notes: "Variety of turkey and ham sandwiches"
        }
    ];

    return (
        <section className="py-20">
            <h2 className="text-3xl font-bold text-center mb-10">Recent Contributions</h2>
            <div className="flex overflow-x-auto space-x-6 p-4 justify-center flex-wrap">
                {donations.map((donation, index) => (
                    <div key={index} className="w-full sm:w-64 md:w-80 flex-shrink-0 mb-6">
                        <DonationCard {...donation} />
                    </div>
                ))}
            </div>
            <div className="flex justify-center mt-4">
                <Link href="/donate" className="bg-black text-white px-6 py-3 rounded inline-block">
                    View More
                </Link>
            </div>
        </section>
    );
}
