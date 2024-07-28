import Image from 'next/image';

interface DonationCardProps {
    image: string;
    title: string;
    location: string;
    date: string;
    notes: string;
}

export default function DonationCard({ image, title, location, date, notes }: DonationCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-md w-full sm:w-64 md:w-80">
            <div className="relative w-[308px] h-[272px]">
                <Image src={image} alt={title} layout="fill" objectFit="cover" className="w-full h-full"/>
            </div>
            <div className="p-7">
                <h3 className="font-bold text-xl mb-2">{title}</h3>
                <div className="flex items-center mb-2">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                         xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    <span>{location}</span>
                </div>
                <div className="flex items-center mb-2">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                         xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>{date}</span>
                </div>
                <p className="mb-4">Notes: {notes}</p>
                <div className="text-center text-blue-600 hover:underline cursor-pointer">
                    View details &gt;
                </div>
            </div>
        </div>
    );
}