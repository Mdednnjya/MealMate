import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export async function fetchDonations(page: number, itemsPerPage: number, query?: string, type?: string) {
    const supabase = createClientComponentClient();

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage - 1;

    let supabaseQuery = supabase
        .from('Donation')
        .select('*', { count: 'exact' })
        .range(start, end)
        .order('created_at', { ascending: false });

    if (query) {
        supabaseQuery = supabaseQuery.ilike('title', `%${query}%`);
    }

    if (type) {
        supabaseQuery = supabaseQuery.eq('type', type);
    }

    const { data, error, count } = await supabaseQuery;

    if (error) {
        console.error('Error fetching donations:', error);
        return { donations: [], total: 0 };
    }

    return { donations: data || [], total: count || 0 };
}