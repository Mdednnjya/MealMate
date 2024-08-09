import Image from 'next/image';
import { FaMinus, FaPlus, FaTimes } from 'react-icons/fa';
import { formatImageUrl } from "@/utils/format-image-url";

interface RequestPopupProps {
    donation: any;
    quantity: number;
    handleQuantityChange: (action: 'increment' | 'decrement') => void;
    handleSendRequest: () => Promise<void>;
    onClose: () => void;
}

const RequestPopup: React.FC<RequestPopupProps> = ({
                                                       donation,
                                                       quantity,
                                                       handleQuantityChange,
                                                       handleSendRequest,
                                                       onClose,
                                                   }) => {
    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
            <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                {/* Button Cancel */}
                <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                    onClick={onClose}
                >
                    <FaTimes className="w-5 h-5" />
                </button>

                <div className="flex justify-center my-8">
                    <Image
                        src={formatImageUrl(donation.image)}
                        alt={donation.title}
                        width={200}
                        height={200}
                        className="rounded-lg"
                    />
                </div>
                <div className="flex justify-center gap-4 mb-8">
                    <button
                        className="bg-gray-100 w-8 h-8 flex items-center justify-center"
                        onClick={() => handleQuantityChange('decrement')}
                    >
                        <FaMinus />
                    </button>
                    <span className="font-bold text-2xl">{quantity}</span>
                    <button
                        className="bg-gray-100 w-8 h-8 flex items-center justify-center"
                        onClick={() => handleQuantityChange('increment')}
                    >
                        <FaPlus />
                    </button>
                </div>
                {/* Button Commit Request */}
                <div className="flex justify-center col-span-12">
                    <button
                        className="bg-black text-white px-4 py-2 rounded-lg w-full"
                        onClick={handleSendRequest}
                    >
                        Commit Request
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RequestPopup;
