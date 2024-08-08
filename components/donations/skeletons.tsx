import { shimmer} from "@/utils/shimmer";

export function DonationCardSkeleton() {
    return (
        <div className={`${shimmer} bg-white rounded-xl shadow-md w-full sm:w-64 md:w-80 h-[600px] flex flex-col`}>
            <div className="relative w-full h-64 bg-gray-200 rounded-t-xl" />
            <div className="p-7 flex-grow flex flex-col justify-between">
                <div>
                    <div className="h-6 w-3/4 bg-gray-200 rounded mb-2" />
                    <div className="h-4 w-1/2 bg-gray-200 rounded mb-2" />
                    <div className="h-4 w-1/3 bg-gray-200 rounded mb-2" />
                    <div className="h-20 w-full bg-gray-200 rounded mt-4" />
                </div>
                <div className="h-6 w-1/3 bg-gray-200 rounded mt-4 mx-auto" />
            </div>
        </div>
    );
}

export function DonationsListSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center mt-14">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="w-full max-w-sm">
                    <DonationCardSkeleton />
                </div>
            ))}
        </div>
    );
}

export function DonationDetailSkeleton() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="md:flex">
                    <div className="md:flex-shrink-0">
                        <div className={`h-96 w-full md:w-96 bg-gray-200 ${shimmer}`} />
                    </div>
                    <div className="p-8 w-full">
                        <div className={`h-10 w-3/4 bg-gray-200 rounded mb-4 ${shimmer}`} />
                        <hr className="mb-4" />
                        <div className="space-y-4">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="flex items-center">
                                    <div className={`w-6 h-6 bg-gray-200 rounded-full mr-2 ${shimmer}`} />
                                    <div className={`h-4 w-1/2 bg-gray-200 rounded ${shimmer}`} />
                                </div>
                            ))}
                        </div>
                        <div className={`h-20 w-full bg-gray-200 rounded mt-4 ${shimmer}`} />
                        <div className="mt-8 flex space-x-4">
                            <div className={`h-10 w-32 bg-gray-200 rounded ${shimmer}`} />
                            <div className={`h-10 w-40 bg-gray-200 rounded ${shimmer}`} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}