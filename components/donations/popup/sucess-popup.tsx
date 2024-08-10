import Image from 'next/image';
import Link from 'next/link';

interface SuccessPopupProps {
    onClose: () => void;
}

export default function SuccessPopup({ onClose }: SuccessPopupProps) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg w-96">
                <Image
                    src="/donations/meal-package.svg"
                    alt="Meal Package"
                    width={100}
                    height={100}
                    className="mx-auto mb-4"
                />
                <h2 className="text-xl font-bold text-center mb-4">
                    Your request has been successfully sent!
                </h2>
                <Link href="/manage">
                    <button
                        className="w-full bg-black text-white px-4 py-2 rounded-lg"
                        onClick={onClose}
                    >
                        See Details
                    </button>
                </Link>
            </div>
        </div>
    );
}