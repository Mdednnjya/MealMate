'use client';

import { useState } from 'react';
import { FunnelIcon } from "@heroicons/react/24/outline";
import { useRouter, useSearchParams } from 'next/navigation';

export default function Filter() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isOpen, setIsOpen] = useState(false);

    const handleFilterChange = (type: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('type', type);
        params.set('page', '1');
        router.push(`/donations?${params.toString()}`);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex h-10 items-center rounded-lg bg-white px-4 text-sm font-medium text-black transition-colors hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
                <span className="hidden md:block">Filter</span>{' '}
                <FunnelIcon className="h-5 md:ml-3 text-black" />
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        {['FOOD', 'DRINK', 'MEAL_PACKAGE'].map((type) => (
                            <button
                                key={type}
                                onClick={() => handleFilterChange(type)}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                                role="menuitem"
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}