import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const supabase = createRouteHandlerClient({ cookies })

    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
        }

        console.log('User authenticated:', user.id);

        const formData = await request.formData();
        const title = formData.get('title') as string;
        const notes = formData.get('notes') as string;
        const location = formData.get('location') as string;
        const quantity = formData.get('quantity') as string;
        const expiry_date = formData.get('expiry_date') as string;
        const type = formData.get('type') as string;
        const image = formData.get('image') as File;

        console.log('Form data received:', { title, notes, location, quantity, expiry_date, type });

        if (!image) {
            return NextResponse.json({ error: 'Image is required' }, { status: 400 });
        }

        const { data: imageData, error: imageError } = await supabase.storage
            .from('donations')
            .upload(`${user.id}/${Date.now()}-${image.name}`, image);

        if (imageError) {
            console.error('Image upload error:', imageError);
            return NextResponse.json({ error: 'Failed to upload image', details: imageError.message }, { status: 500 });
        }

        console.log('Image uploaded successfully:', imageData?.path);

        const { data, error } = await supabase
            .from('donations')
            .insert({
                user_id: user.id,
                title,
                notes,
                location,
                quantity: parseInt(quantity),
                expiry_date,
                type,
                image: imageData?.path
            });

        if (error) {
            console.error('Database insertion error:', error);
            return NextResponse.json({ error: 'Failed to save donation', details: error.message }, { status: 500 });
        }

        console.log('Donation saved successfully:', data);
        return NextResponse.json({ success: true, data });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}