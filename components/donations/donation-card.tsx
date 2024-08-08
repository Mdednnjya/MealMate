import Image from 'next/image';
import Link from 'next/link'
import {uberMoveText} from "@/components/fonts";
import { FaHourglassHalf } from 'react-icons/fa';

interface DonationCardProps {
    id: string;
    image: string;
    title: string;
    location: string;
    date: string;
    notes: string;
}

export default function DonationCard({ id, image, title, location, date, notes }: DonationCardProps) {
    const formatImageUrl = (url: string) => {
        if (!url) return '/path/to/fallback/image.jpg';
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        } else if (url.startsWith('/')) {
            return url;
        } else {
            const baseUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/donations/`;
            return baseUrl + encodeURIComponent(url).replace(/%2F/g, '/');
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md w-full sm:w-64 md:w-80 h-[600px] flex flex-col">
            <div className="relative w-full h-64">
                <Image
                    src={formatImageUrl(image)}
                    alt={title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-xl"
                />
            </div>
            <div className="p-7 flex-grow flex flex-col justify-between">
                <div>
                    <h3 className={`font-bold text-xl ${uberMoveText.className} mb-2`}>{title}</h3>
                    <div className="flex items-center mb-2">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                             xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        <span className="line-clamp-1">{location}</span>
                    </div>
                    <div className="flex items-center mb-2">
                        <FaHourglassHalf className="w-4 h-4 mr-2"/>
                        <span>{date}</span>
                    </div>
                    <p className={`mt-4 italic text-gray-500 line-clamp-3`}>
                        Notes: {notes}
                    </p>
                </div>
                <div className="text-center text-black hover:underline cursor-pointer mt-4">
                    <Link href={`/donations/${id}`}>View details &gt;</Link>
                </div>
            </div>
        </div>
    );
}