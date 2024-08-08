import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
    const supabase = createRouteHandlerClient({ cookies });
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page')) || 1;
    const query = searchParams.get('query') || '';
    const type = searchParams.get('type') || '';
    const ITEMS_PER_PAGE = 6;

    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
        }

        const { data: userProfile, error: profileError } = await supabase
            .from('profiles')
            .select('country, state, city')
            .eq('id', user.id)
            .single();

        if (profileError) {
            return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
        }

        let dbQuery = supabase
            .from('donations')
            .select('*, profiles!inner(*)', { count: 'exact' })
            .neq('profiles.id', user.id)  // Exclude the current user's donations
            .eq('profiles.country', userProfile.country)
            .eq('profiles.state', userProfile.state)
            .eq('profiles.city', userProfile.city)
            .range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1);

        if (type) {
            dbQuery = dbQuery.eq('type', type);
        }

        if (query) {
            dbQuery = dbQuery.ilike('title', `%${query}%`);
        }

        const { data, error, count } = await dbQuery;

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ donations: data, total: count });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}