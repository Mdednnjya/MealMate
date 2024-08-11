"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { formatImageUrl } from '@/utils/format-image-url';
import { DonationDetailSkeleton } from '@/components/donations/skeletons';
import CancelPopup from '@/components/donations/popup/cancel-popup';

interface Request {
    id: string;
    status: string;
    created_at: string;
    quantity: number;
    donations: {
        id: string;
        title: string;
        type: string;
        image: string;
        location: string;
        expiry_date: string;
        notes: string;
        profiles: {
            name: string;
            phone_number: string;
        };
    };
}

export default function RequestDetailPage({ params }: { params: { id: string } }) {
    const [request, setRequest] = useState<Request | null>(null);
    const [showCancelPopup, setShowCancelPopup] = useState(false);
    const supabase = createClientComponentClient();
    const router = useRouter();

    useEffect(() => {
        fetchRequestDetails(params.id);
    }, [params.id]);

    const fetchRequestDetails = async (requestId: string) => {
        const { data, error } = await supabase
            .from('requests')
            .select(`
        *,
        donations (
          *,
          profiles (name, phone_number)
        )
      `)
            .eq('id', requestId)
            .single();

        if (error) {
            console.error('Error fetching request details:', error);
        } else {
            setRequest(data);
        }
    };

    const handleCancelRequest = async () => {
        if (!request) return;

        const { error } = await supabase
            .from('requests')
            .delete()
            .eq('id', request.id);

        if (error) {
            console.error('Error cancelling request:', error);
        } else {
            setShowCancelPopup(true);
        }
    };

    if (!request) return <DonationDetailSkeleton />;

    return (
        <div className="container mx-auto px-4 py-8 flex justify-center">
            <div className="p-2.5 overflow-hidden max-w-4xl w-full">
                <div className="md:flex">
                    <div className="md:flex-shrink-0">
                        <Image
                            src={formatImageUrl(request.donations.image)}
                            alt={request.donations.title}
                            width={500}
                            height={500}
                            className="h-full w-full rounded-xl object-cover md:w-96"
                        />
                    </div>
                    <div className="p-8 lg:pl-16">
                        <h1 className="text-4xl font-bold mb-4">{request.donations.title}</h1>
                        <hr className="mb-4 custom-hr"/>
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                </svg>
                                <span>{request.donations.profiles.name || 'Anonymous'}</span>
                            </div>
                            <div className="flex items-center">
                                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                </svg>
                                <span>{request.donations.location}</span>
                            </div>
                            <div className="flex items-center">
                                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                                </svg>
                                <span>{request.donations.profiles.phone_number || 'Not available'}</span>
                            </div>
                            <div className="font-bold">Type: {request.donations.type}</div>
                            <div className="font-bold">Quantity: {request.quantity} Pcs</div>
                            <div className="font-bold">
                                Best Before:{' '}
                                {new Date(request.donations.expiry_date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </div>
                            <div className="font-bold">Status: {request.status}</div>
                        </div>
                        <p className="mt-4 italic text-gray-500">Owner Notes: {request.donations.notes}</p>
                        <div className="mt-8 flex space-x-4">
                            <button
                                onClick={handleCancelRequest}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg"
                            >
                                Cancel Request
                            </button>
                            <Link href="/donations" className="border border-black text-black px-4 py-2 rounded-lg">
                                More Donations
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            {showCancelPopup && (
                <CancelPopup onClose={() => router.push('/donations')}/>
            )}
        </div>
    );
}