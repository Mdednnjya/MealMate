"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import DonationCard from "@/components/donations/donation-card";
import PaginationNav from "@/components/donations/pagination-nav";
import { DonationsListSkeleton} from "@/components/donations/skeletons";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const ITEMS_PER_PAGE = 6;

interface Donation {
    id: string;
    image: string;
    title: string;
    location: string;
    expiry_date: string;
    notes: string;
    status: string;
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
    const supabase = createClientComponentClient();

    useEffect(() => {
        fetchDonations();
    }, [page, query, type]);

    const fetchDonations = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                console.error('User not authenticated');
                return;
            }

            // Fetch user's profile to get location information
            const { data: userProfile, error: profileError } = await supabase
                .from('profiles')
                .select('country, state, city')
                .eq('id', user.id)
                .single();

            if (profileError) {
                console.error('Error fetching user profile:', profileError);
                return;
            }

            let dbQuery = supabase
                .from('donations')
                .select('*, profiles!inner(*)', { count: 'exact' })
                .neq('status', 'COMPLETED')
                .neq('user_id', user.id)
                .range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1);

            // Filter by user's location
            if (userProfile.country && userProfile.state && userProfile.city) {
                dbQuery = dbQuery
                    .eq('profiles.country', userProfile.country)
                    .eq('profiles.state', userProfile.state)
                    .eq('profiles.city', userProfile.city);
            }

            if (query) {
                dbQuery = dbQuery.ilike('title', `%${query}%`);
            }

            if (type) {
                dbQuery = dbQuery.eq('type', type);
            }

            const { data, error, count } = await dbQuery;

            if (error) throw error;

            setDonations(data || []);
            setTotal(count || 0);
        } catch (err) {
            console.error('Error fetching donations:', err);
            setError('Failed to fetch donations. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

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
                <p className="mt-4 text-lg text-gray-600">No donations currently available in your area :(</p>
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