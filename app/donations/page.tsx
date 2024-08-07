import { Suspense } from 'react';
import { fetchDonations } from "@/utils/api/donations/get-donations";
import DonationCard from "@/components/donations/donation-card";
import Search from "@/components/donations/search";
import { CreateDonations } from "@/components/donations/buttons";
import Filter from "@/components/donations/filter";
import PaginationNav from "@/components/donations/pagination-nav";

const ITEMS_PER_PAGE = 6;

interface Donation {
    id: string;
    image: string;
    title: string;
    location: string;
    expiry_date: string;
    notes: string;
}

async function DonationsList({page, query, type}: {
    page: number;
    query?: string;
    type?: string
}) {
    const { donations, total } = await fetchDonations(page, ITEMS_PER_PAGE, query, type);
    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-center">
                {donations.map((donation: Donation) => (
                    <div key={donation.id} className="flex-shrink-0 mb-6">
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
            <PaginationNav currentPage={page} totalPages={totalPages} />
        </>
    );
}

export default function DonationsPage({searchParams}: {
    searchParams: { page?: string; query?: string; type?: string }
}) {
    const page = Number(searchParams.page) || 1;
    const query = searchParams.query;
    const type = searchParams.type;

    return (
        <main className="bg-white px-6 sm:px-12 md:px-20 lg:px-24">
            <div className="flex justify-between items-center mb-4">
                <Search placeholder="Search Donations..."/>
                <Filter/>
                <CreateDonations/>
            </div>
            <Suspense fallback={<div>Loading...</div>}>
                <DonationsList page={page} query={query} type={type}/>
            </Suspense>
        </main>
    );
}