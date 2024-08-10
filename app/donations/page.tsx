import { Suspense } from 'react';
import DonationsList from "@/components/donations/donations-list";
import Search from "@/components/donations/search";
import { CreateDonations } from "@/components/donations/buttons";
import Filter from "@/components/donations/filter";
import { DonationsListSkeleton } from "@/components/donations/skeletons";
import Breadcrumbs from "@/components/breadcrumbs";

export default function DonationsPage({ searchParams }: {
    searchParams: { page?: string; query?: string; type?: string }
}) {
    const page = Number(searchParams.page) || 1;
    const query = searchParams.query;
    const type = searchParams.type;

    const breadcrumbs = [
        { label: 'Home', href: '/' },
        { label: 'Donations', href: '/donations', active: true },
    ];

    return (
        <main className=" px-6 sm:px-12 md:px-20 lg:scroll-px-32">
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <div className="flex justify-between items-center mb-4 gap-1">
                <Search placeholder="Search Donations..."/>
                <Filter/>
                <CreateDonations/>
            </div>
            <Suspense fallback={<DonationsListSkeleton/>}>
                <DonationsList page={page} query={query} type={type}/>
            </Suspense>
        </main>
    );
}