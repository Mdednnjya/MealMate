import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export async function fetchDonations(page: number, itemsPerPage: number) {
    const supabase = createClientComponentClient();

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage - 1;

    const { data, error, count } = await supabase
        .from('Donation')
        .select('*', { count: 'exact' })
        .range(start, end)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching donations:', error);
        return { donations: [], total: 0 };
    }

    return { donations: data || [], total: count || 0 };
}