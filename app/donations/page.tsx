'use client';

import { useState} from "react";
import supabase from "@/utils/supabase";
import { fetchDonations } from "@/utils/api/get-donations";
import DonationCard from "@/components/donation-card";
import Search from "@/components/donations/search";
import { CreateDonations} from "@/components/donations/buttons";
import Filter from "@/components/donations/filter";
import Pagination from "@/components/pagination";

export default function DonationsPage() {
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
        },
        {
            image: "/images/donations/beef-taco.jpeg",
            title: "Beef Taco",
            location: "Austin",
            date: "July 25, 2024",
            notes: "Variety of turkey and ham sandwiches"
        },
        {
            image: "/images/donations/coca-cola.jpeg",
            title: "Coca Cola",
            location: "Austin",
            date: "July 25, 2024",
            notes: "Coca Cola 600ml"
        },
        {
            image: "/images/donations/excess-bread.jpeg",
            title: "Deli Sandwich Surplus",
            location: "Riverside District",
            date: "July 29, 2024",
            notes: "fresh bread"
        },
        {
            image: "/images/donations/ayam-betutu.jpg",
            title: "Deli Sandwich Surplus",
            location: "Riverside District",
            date: "July 29, 2024",
            notes: "2 potong sayap + sayur"
        }
    ];

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const totalPages = Math.ceil(donations.length / itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const currentDonations = donations.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    fetchDonations();

    return (
        <main className="bg-white px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-4">
                <Search placeholder="Search Donations..."/>
                <Filter/>
                <CreateDonations/>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-center">
                {currentDonations.map((donation, index) => (
                    <div key={index} className="flex-shrink-0 mb-6">
                        <DonationCard {...donation} />
                    </div>
                ))}
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </main>
    );
}
