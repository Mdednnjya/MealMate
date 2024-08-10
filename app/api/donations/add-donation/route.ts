import { NextRequest, NextResponse } from 'next/server';
import { POST as addDonation } from "@/utils/api/donations/add-donation";

export async function POST(request: NextRequest) {
    try {
        const response = await addDonation(request);
        return response;
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}