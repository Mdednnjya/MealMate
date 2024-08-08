// lib/donations.ts
import supabase from '@/utils/supabase';

export async function getDonation(id: string) {
    const { data: donation, error: donationError } = await supabase
        .from('donations')
        .select('*')
        .neq('id', id)
        .single();

    if (donationError) {
        console.error('Error fetching donation:', donationError);
        return null;
    }

    if (!donation) {
        return null;
    }

    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('name, phone_number')
        .eq('id', donation.user_id)
        .single();

    if (profileError) {
        console.error('Error fetching profile:', profileError);
    }

    return {
        ...donation,
        profile: profile || null
    };
}