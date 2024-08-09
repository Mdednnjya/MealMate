'use client'

import { useState } from 'react';
import RequestPopup from './request-popup';
import SuccessPopup from "@/components/donations/popup/sucess-popup";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface RequestButtonProps {
    donation: any;
}

export default function RequestButton({ donation }: RequestButtonProps) {
    const [showRequestPopup, setShowRequestPopup] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const supabase = createClientComponentClient();

    const handleQuantityChange = (action: 'increment' | 'decrement') => {
        if (action === 'increment' && quantity < donation.quantity) {
            setQuantity(quantity + 1);
        } else if (action === 'decrement' && quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleSendRequest = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                console.error('User not authenticated');
                return;
            }

            const { error } = await supabase
                .from('requests')
                .insert({
                    donation_id: donation.id,
                    user_id: user.id,
                    quantity,
                    status: 'PENDING',
                });

            if (error) {
                console.error('Error sending request:', error.message);
                return;
            }

            setShowRequestPopup(false);
            setShowSuccessPopup(true);
        } catch (error) {
            console.error('Error sending request:', error);
        }
    };

    return (
        <>
            <button
                className="bg-black text-white px-4 py-2 rounded-lg"
                onClick={() => setShowRequestPopup(true)}
            >
                Send Request
            </button>
            {showRequestPopup && (
                <RequestPopup
                    donation={donation}
                    quantity={quantity}
                    handleQuantityChange={handleQuantityChange}
                    handleSendRequest={handleSendRequest}
                    onClose={() => setShowRequestPopup(false)}
                />
            )}
            {showSuccessPopup && (
                <SuccessPopup onClose={() => setShowSuccessPopup(false)} />
            )}
        </>
    );
}