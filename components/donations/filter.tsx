'use client';

import { MagnifyingGlassIcon} from "@heroicons/react/16/solid";
import { FunnelIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface FilterButtonProps {
    onFilterClick?: () => void;
    className?: string;
}
export default function Filter() {
    interface FilterButtonProps {
        onFilterClick?: () => void;
        className?: string;
    }

    return (
        <button
            className="flex h-10 items-center rounded-lg bg-white px-4 text-sm font-medium text-white transition-colors hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
            <span className="hidden md:block text-black">Filter</span>{' '}
            <FunnelIcon className="h-5 md:ml-3 text-amber text-black" />
        </button>
    );
}
