"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { formatImageUrl } from '@/utils/format-image-url';

interface Donation {
    id: string;
    title: string;
    type: string;
    image: string;
    requestCount: number;
    created_at: string;
}

interface Request {
    id: string;
    status: string;
    created_at: string;
    quantity: number;
    donations: {
        title: string;
        type: string;
        image: string;
    };
}

export default function ManagePage() {
    const [activeTab, setActiveTab] = useState<'donations' | 'requests'>('requests');
    const [donations, setDonations] = useState<Donation[]>([]);
    const [requests, setRequests] = useState<Request[]>([]);
    const supabase = createClientComponentClient();

    useEffect(() => {
        if (activeTab === 'donations') {
            fetchDonationsWithCount();
        } else if (activeTab === 'requests') {
            fetchRequests();
        }
    }, [activeTab]);

    const fetchDonationsWithCount = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                console.error('User not authenticated');
                return;
            }
            const { data: donationsData, error: donationsError } = await supabase
                .from('donations')
                .select('*, requests(count)')
                .eq('user_id', user.id);

            if (donationsError) {
                console.error('Error fetching donations:', donationsError);
                return;
            }

            const donationsWithCount = donationsData.map(donation => ({
                ...donation,
                requestCount: donation.requests[0].count
            }));
            setDonations(donationsWithCount);
        } catch (error) {
            console.error('Error in fetchDonationsWithCount:', error);
        }
    };

    const fetchRequests = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                console.error('User not authenticated');
                return;
            }
            const { data: requestsData, error: requestsError } = await supabase
                .from('requests')
                .select(`
                    *,
                    donations (title, type, image)
                `)
                .eq('user_id', user.id);

            if (requestsError) {
                console.error('Error fetching requests:', requestsError);
                return;
            }

            setRequests(requestsData);
        } catch (error) {
            console.error('Error in fetchRequests:', error);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex mb-6 justify-center">
                <button
                    className={`mr-4 ${activeTab === 'requests' ? 'font-bold' : ''}`}
                    onClick={() => setActiveTab('requests')}
                >
                    Manage your Requests
                </button>
                <button
                    className={activeTab === 'donations' ? 'font-bold' : ''}
                    onClick={() => setActiveTab('donations')}
                >
                    Manage your Donations
                </button>
            </div>
            <div className="bg-white rounded-lg shadow-lg">
                {activeTab === 'requests' && (
                    <>
                        <h2 className="text-xl font-bold p-4">Your Requests</h2>
                        {requests.map((request) => (
                            <div key={request.id} className="flex items-center justify-between p-4 border-b">
                                <div className="flex items-center">
                                    <Image
                                        src={formatImageUrl(request.donations.image)}
                                        alt={request.donations.title}
                                        width={68}
                                        height={68}
                                        className="rounded-lg mr-4"
                                    />
                                    <div>
                                        <h3 className="font-bold">{request.donations.title}</h3>
                                        <div className="flex text-sm text-gray-500">
                                            <span>{new Date(request.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <Link href={`/manage/your-requests/${request.id}`}>
                                    <button className="bg-black text-white px-4 py-2 rounded-lg">Details</button>
                                </Link>
                            </div>
                        ))}
                    </>
                )}
                {activeTab === 'donations' && (
                    <>
                        <h2 className="text-xl font-bold p-4">Your Donations</h2>
                        {donations.map((donation) => (
                            <div key={donation.id} className="flex items-center justify-between p-4 border-b">
                                <div className="flex items-center">
                                    <Image
                                        src={formatImageUrl(donation.image)}
                                        alt={donation.title}
                                        width={68}
                                        height={68}
                                        className="rounded-lg mr-4"
                                    />
                                    <div>
                                        <h3 className="font-bold">{donation.title}</h3>
                                        <div className="flex text-sm text-gray-500">
                                            <span>{new Date(donation.created_at).toLocaleDateString()}</span>
                                            <span className="ml-4 flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                                                </svg>
                                                {donation.requestCount} requests
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <Link href={`/manage/your-donations/${donation.id}`}>
                                    <button className="bg-black text-white px-4 py-2 rounded-lg">Details</button>
                                </Link>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
}
