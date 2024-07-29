'use client';

import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <div className="flex justify-center space-x-2 my-4">
            <button
                className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded hover:bg-gray-700"
                onClick={handlePrevious}
                disabled={currentPage === 1}
            >
                Previous
            </button>
            <span className="flex items-center px-4 py-2 text-sm font-medium text-gray-700">
                Page {currentPage} of {totalPages}
            </span>
            <button
                className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded hover:bg-gray-700"
                onClick={handleNext}
                disabled={currentPage === totalPages}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
