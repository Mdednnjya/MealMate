export interface Donation {
    id: string;
    user_id: string | null;
    title: string;
    notes: string | null;
    location: string;
    quantity: number;
    expiry_date: Date;
    status: DonationStatus;
    image: string | null;
    type: DonationType;
    created_at: Date | null;
    updated_at: Date | null;
    profiles: {
        id: string;
        name: string;
        phone_number: string;
    } | null;
}

export type DonationStatus = 'AVAILABLE' | 'PENDING' | 'ACCEPTED' | 'REJECTED';
export type DonationType = 'FOOD' | 'CLOTHING' | 'ELECTRONICS' | 'OTHER';