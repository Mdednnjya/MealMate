import Image from 'next/image';
import Link from 'next/link';

interface CancelPopupProps {
    onClose: () => void;
}

export default function CancelPopup({ onClose }: CancelPopupProps) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg w-96 flex flex-col items-center">
                <Image
                    src="/donations/cancel-donation.svg"
                    alt="Cancel Donation"
                    width={100}
                    height={100}
                    className="mb-4"
                />
                <h2 className="text-xl font-bold text-center mb-4">
                    Your request has been Cancelled!
                </h2>
                <Link href="/donations">
                    <button
                        className="w-full bg-black text-white px-4 py-2 rounded-lg"
                        onClick={onClose}
                    >
                        Return to list
                    </button>
                </Link>
            </div>
        </div>
    );
}