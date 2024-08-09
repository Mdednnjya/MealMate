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
        let userLocation = { country: null, state: null, city: null };
        let userId = null;

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            userId = user.id;
            const { data: userProfile, error: profileError } = await supabase
                .from('profiles')
                .select('country, state, city')
                .eq('id', user.id)
                .single();

            if (profileError) {
                console.error('Failed to fetch user profile:', profileError);
            } else {
                userLocation = userProfile;
            }
        }

        let dbQuery = supabase
            .from('donations')
            .select('*, profiles!inner(*)', { count: 'exact' })
            .range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1);

        // Exclude user's own donations if logged in
        if (userId) {
            dbQuery = dbQuery.neq('user_id', userId);
        }

        // Apply location filter only if user is logged in and has location data
        if (user && userLocation.country && userLocation.state && userLocation.city) {
            dbQuery = dbQuery
                .eq('profiles.country', userLocation.country)
                .eq('profiles.state', userLocation.state)
                .eq('profiles.city', userLocation.city);
        }

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
        console.error('Error in GET /api/donations:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}