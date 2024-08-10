"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { formatImageUrl } from '@/utils/format-image-url';
import {RequestDonationDetailSkeleton } from "@/components/donations/skeletons";

interface Request {
    id: string;
    user_id: string;
    status: string;
    created_at: string;
    profiles: {
        name: string;
        city: string;
        phone_number: string;
    };
    quantity: number;
}

interface Donation {
    id: string;
    title: string;
    type: string;
    image: string;
    requests: Request[];
}

export default function DonationDetailPage({ params }: { params: { id: string } }) {
    const [donation, setDonation] = useState<Donation | null>(null);
    const supabase = createClientComponentClient();

    useEffect(() => {
        fetchDonationDetails(params.id);
    }, [params.id]);

    const fetchDonationDetails = async (donationId: string) => {
        const { data, error } = await supabase
            .from('donations')
            .select(`
                *,
                requests (
                    *,
                    profiles (name, city, phone_number)
                )
            `)
            .eq('id', donationId)
            .single();

        if (error) {
            console.error('Error fetching donation details:', error);
        } else {
            setDonation(data);
        }
    };

    const handleStatusChange = async (requestId: string, newStatus: string) => {
        const { error } = await supabase
            .from('requests')
            .update({ status: newStatus })
            .eq('id', requestId);

        if (error) {
            console.error('Error updating request status:', error);
        } else {
            fetchDonationDetails(params.id);
        }
    };

    if (!donation) return <RequestDonationDetailSkeleton />;

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {donation.requests.map((request) => (
                <div key={request.id} className="bg-white rounded-lg shadow-lg px-6 py-4 sm:p-10 mb-6">
                    <div
                        className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
                        <Image
                            src="/images/default-profile.png"
                            alt={request.profiles.name}
                            width={64}
                            height={64}
                            className="rounded-full w-16 h-16 hidden sm:block"
                        />
                        <div className="text-center sm:text-left">
                            <h2 className="font-bold text-lg">{request.profiles.name}</h2>
                            <div className="flex items-center justify-center sm:justify-start text-sm text-gray-500">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd"
                                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                          clipRule="evenodd"/>
                                </svg>
                                {request.profiles.city}
                            </div>
                            <div className="flex items-center justify-center sm:justify-start text-sm text-gray-500">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                                </svg>
                                {request.profiles.phone_number}
                            </div>
                        </div>
                    </div>
                    <h3 className="font-bold mb-4">Request details:</h3>
                    <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex flex-col sm:flex-row items-start">
                            <Image
                                src={formatImageUrl(donation.image)}
                                alt={donation.title}
                                width={128}
                                height={128}
                                className="rounded-lg mr-4 w-32 h-32 object-cover mb-4 sm:mb-0"
                            />
                            <div>
                                <h4 className="font-bold text-lg mb-2">{donation.title}</h4>
                                <p className="text-sm text-gray-600">Type: {donation.type}</p>
                                <p className="text-sm text-gray-600">Quantity: {request.quantity} Pcs</p>
                                <p className="text-sm text-gray-600">
                                    Request date: {new Date(request.created_at).toLocaleString('en-GB', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: false
                                }).replace(',', '')}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-2">
                        <button
                            onClick={() => handleStatusChange(request.id, 'ACCEPTED')}
                            className="bg-black text-white px-4 sm:px-14 py-2 rounded-lg w-full sm:w-auto"
                        >
                            Accept
                        </button>
                        <button
                            onClick={() => handleStatusChange(request.id, 'REJECTED')}
                            className="bg-red-100 text-red-800 px-4 sm:px-14 py-2 rounded-lg w-full sm:w-auto"
                        >
                            Reject
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}