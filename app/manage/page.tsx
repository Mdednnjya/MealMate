// app/manage/page.tsx

"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { formatImageUrl } from '@/utils/format-image-url';
import RequestButton from '@/components/donations/popup/request-button';

interface Donation {
    id: string;
    title: string;
    image: string;
    created_at: string;
}

interface Request {
    id: string;
    status: string;
    created_at: string;
    donations: Donation;
}

export default function ManagePage() {
    const [activeTab, setActiveTab] = useState<'requests' | 'donations'>('requests');
    const [requests, setRequests] = useState<Request[]>([]);
    const [donations, setDonations] = useState<Donation[]>([]);
    const supabase = createClientComponentClient();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            const { data: requestsData, error: requestsError } = await supabase
                .from('requests')
                .select(`
                    *,
                    donations (
                        id,
                        title,
                        image
                    )
                `)
                .eq('user_id', user.id);

            if (requestsError) {
                console.error('Error fetching requests:', requestsError);
            } else {
                setRequests(requestsData || []);
            }

            const { data: donationsData, error: donationsError } = await supabase
                .from('donations')
                .select('*')
                .eq('user_id', user.id);

            if (donationsError) {
                console.error('Error fetching donations:', donationsError);
            } else {
                setDonations(donationsData || []);
            }
        }
    };

    const renderItem = (item: Request | Donation, type: 'request' | 'donation') => (
        <div key={item.id} className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center">
                <Image
                    src={formatImageUrl(type === 'request' ? (item as Request).donations.image : (item as Donation).image)}
                    alt={type === 'request' ? (item as Request).donations.title : (item as Donation).title}
                    width={68}
                    height={68}
                    className="rounded-lg mr-4"
                />
                <div>
                    <h3 className="font-bold">{type === 'request' ? (item as Request).donations.title : (item as Donation).title}</h3>
                    <div className="flex text-sm text-gray-500">
                        <span>{new Date(item.created_at).toLocaleDateString()}</span>
                        {type === 'request' && (
                            <span className="ml-4">{(item as Request).status}</span>
                        )}
                    </div>
                </div>
            </div>
            {type === 'donation' ? (
                <RequestButton donation={item as Donation} />
            ) : (
                <button className="bg-black text-white px-4 py-2 rounded-lg">Details</button>
            )}
        </div>
    );

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
                        {requests.map(request => renderItem(request, 'request'))}
                    </>
                )}
                {activeTab === 'donations' && (
                    <>
                        <h2 className="text-xl font-bold p-4">Your Donations</h2>
                        {donations.map(donation => renderItem(donation, 'donation'))}
                    </>
                )}
            </div>
        </div>
    );
}