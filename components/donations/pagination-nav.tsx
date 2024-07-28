'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Pagination from '@/components/pagination';

interface PaginationNavProps {
    currentPage: number;
    totalPages: number;
}

export default function PaginationNav({ currentPage, totalPages }: PaginationNavProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const onPageChange = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', page.toString());
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
        />
    );
}