import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {DonationStatus} from "@/type/donations";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
    },
});

export const updateDonationStatus = async (donationId: string, newStatus: DonationStatus) => {
    const { error } = await supabase
        .from('donations')
        .update({ status: newStatus })
        .eq('id', donationId);

    if (error) {
        throw error;
    }
};

export default supabase;

