import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import dynamic from 'next/dynamic';
import { DonationDetailSkeleton } from '@/components/donations/skeletons';
import { uberMoveText } from '@/components/fonts';
import { Suspense } from "react";
import { formatImageUrl } from "@/utils/format-image-url";

// const RequestButtonWrapper = dynamic(() => import('@/components/donations/popup/request-button-wrapper'), { ssr: false });

export default async function DonationPage({ params }: { params: { id: string } }) {
    const supabase = createServerComponentClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    const donation = await fetchDonationDetails(params.id);

    return (
        <div className="flex-grow justify-center">
            <Suspense fallback={<DonationDetailSkeleton />}>
                <DonationDetails donation={donation} isLoggedIn={!!session} />
            </Suspense>
        </div>
    );
}

async function fetchDonationDetails(id: string) {
    const supabase = createServerComponentClient({ cookies });
    const { data: donation, error } = await supabase
        .from('donations')
        .select(`
            *,
            profiles:user_id (
                id,
                name,
                phone_number
            )
        `)
        .eq('id', id)
        .single();

    if (error || !donation) {
        notFound();
    }

    return donation;
}

function DonationDetails({ donation, isLoggedIn }: { donation: any; isLoggedIn: boolean }) {
    return (
        <div className="container mx-auto px-4 py-8 flex justify-center">
            <div className="p-2.5 overflow-hidden">
                <div className="md:flex">
                    <div className="md:flex-shrink-0">
                        <Image
                            src={formatImageUrl(donation.image)}
                            alt={donation.title}
                            width={500}
                            height={500}
                            className="h-full w-full rounded-xl object-cover md:w-96"
                        />
                    </div>
                    <div className="p-8 lg:pl-16">
                        <h1 className={`text-4xl ${uberMoveText.className} font-bold mb-4`}>{donation.title}</h1>
                        <hr className="mb-4 custom-hr"/>
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <svg
                                    className="w-6 h-6 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                                <span>{donation.profiles.name || 'Anonymous'}</span>
                            </div>
                            <div className="flex items-center">
                                <svg
                                    className="w-6 h-6 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                                <span>{donation.location}</span>
                            </div>
                            <div className="flex items-center">
                                <svg
                                    className="w-6 h-6 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                    />
                                </svg>
                                <span>{donation.profiles.phone_number || 'Not available'}</span>
                            </div>
                            <div className={`${uberMoveText.className} font-bold`}>Type: {donation.type}</div>
                            <div className={`${uberMoveText.className} font-bold`}>Quantity: {donation.quantity} Pcs
                            </div>
                            <div className={`${uberMoveText.className} font-bold`}>
                                Best Before:{' '}
                                {new Date(donation.expiry_date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </div>
                        </div>
                        <p className="mt-4 italic text-gray-500">Owner Notes: {donation.notes}</p>
                        <div className="mt-8 flex space-x-4">
                            {/*<RequestButtonWrapper donation={donation} isLoggedIn={isLoggedIn}/>*/}
                            <Link href="/donations" className="border border-black text-black px-4 py-2 rounded-lg">
                                More Donations
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}