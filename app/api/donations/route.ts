// app/api/donations/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
    const supabase = createRouteHandlerClient({ cookies });
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page')) || 1;
    const query = searchParams.get('query') || '';
    const type = searchParams.get('type') || '';
    const city = searchParams.get('city') || '';
    const ITEMS_PER_PAGE = 6;

    try {
        let userId = null;

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            userId = user.id;
        }

        let dbQuery = supabase
            .from('donations')
            .select('*, profiles!inner(*)', { count: 'exact' })
            .neq('status', 'COMPLETED')
            .range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1);

        if (userId) {
            dbQuery = dbQuery.neq('user_id', userId);
        }

        if (city) {
            dbQuery = dbQuery.eq('profiles.city', city);
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