'use client';

import { PlusIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export function CreateDonations() {
    const router = useRouter();

    const handleClick = () => {
        router.push('/donations/create');
    };

    return (
        <button
            onClick={handleClick}
            className="flex h-10 items-center rounded-lg bg-black px-4 text-sm font-medium text-white transition-colors hover:bg-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
            <span className="hidden md:block">Add Donation</span>{' '}
            <PlusIcon className="h-5 md:ml-3" />
        </button>
    );
}