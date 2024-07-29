import Image from 'next/image';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

async function getDonation(id: string) {
    const supabase = createClientComponentClient();
    const { data, error } = await supabase
        .from('Donation')
        .select(`
      *,
      user:User(name, phone_number)
    `)
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching donation:', error);
        return null;
    }

    return data;
}

export default async function DonationDetailPage({ params }: { params: { id: string } }) {
    const donation = await getDonation(params.id);

    if (!donation) {
        return <div>Donation not found</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="md:flex">
                    <div className="md:flex-shrink-0">
                        <Image
                            src={donation.image || "/images/donations/default.jpg"}
                            alt={donation.title}
                            width={500}
                            height={500}
                            className="h-full w-full object-cover md:w-96"
                        />
                    </div>
                    <div className="p-8">
                        <h1 className="text-4xl font-bold mb-4">{donation.title}</h1>
                        <hr className="mb-4" />
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span>{donation.user.name}</span>
                            </div>
                            <div className="flex items-center">
                                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>{donation.location}</span>
                            </div>
                            <div className="flex items-center">
                                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span>{donation.user.phone_number}</span>
                            </div>
                            <div>Type: {donation.type}</div>
                            <div>Quantity: {donation.quantity} Pcs</div>
                            <div>Expired: {new Date(donation.expiry_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                        </div>
                        <p className="mt-4 italic text-gray-600">Owner Notes: {donation.notes}</p>
                        <div className="mt-8 flex space-x-4">
                            <button className="bg-black text-white px-4 py-2 rounded">Send Request</button>
                            <Link href="/donations" className="border border-black text-black px-4 py-2 rounded">More Donations</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}