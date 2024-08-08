"use client"
import { useState, useEffect } from 'react';
import Image from 'next/image';
import DonationCard from "@/components/donations/donation-card";
import PaginationNav from "@/components/donations/pagination-nav";
import { DonationsListSkeleton} from "@/components/donations/skeletons";

const ITEMS_PER_PAGE = 6;

interface Donation {
    id: string;
    image: string;
    title: string;
    location: string;
    expiry_date: string;
    notes: string;
}

export default function DonationsList({ page, query, type }: {
    page: number;
    query?: string;
    type?: string;
}) {
    const [donations, setDonations] = useState<Donation[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchDonations() {
            setIsLoading(true);
            setError(null);
            try {
                const params = new URLSearchParams({
                    page: page.toString(),
                    ...(query && { query }),
                    ...(type && { type })
                });

                const response = await fetch(`/api/donations?${params}`);
                const data = await response.json();

                if (response.ok) {
                    setDonations(data.donations);
                    setTotal(data.total);
                } else {
                    throw new Error(data.error || 'Failed to fetch donations');
                }
            } catch (err) {
                console.error('Error fetching donations:', err);
                setError('Failed to fetch donations. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        }

        fetchDonations();
    }, [page, query, type]);

    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

    if (isLoading) {
        return <DonationsListSkeleton />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (donations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh]">
                <Image
                    src="/donations/eat-humburger.svg"
                    alt="No donations available"
                    width={200}
                    height={200}
                />
                <p className="mt-4 text-lg text-gray-600">No donations currently available yet :(</p>
            </div>
        );
    }



    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center mt-14">
                {donations.map((donation: Donation) => (
                    <div key={donation.id} className="flex-shrink-0 mb-6 justify-center">
                        <DonationCard
                            id={donation.id}
                            image={donation.image || "/images/donations/default.jpg"}
                            title={donation.title}
                            location={donation.location}
                            date={new Date(donation.expiry_date).toLocaleDateString()}
                            notes={donation.notes || ""}
                        />
                    </div>
                ))}
            </div>
            {totalPages > 1 && <PaginationNav currentPage={page} totalPages={totalPages} />}
        </>
    );
}