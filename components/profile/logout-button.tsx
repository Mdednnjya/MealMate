'use client';

import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function LogoutButton() {
    const router = useRouter();
    const supabase = createClientComponentClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/auth/login');
    };

    return (
        <button
            onClick={handleLogout}
            className="w-full bg-red-100 text-red-600 font-bold py-2 px-4 rounded-xl mt-4"
        >
            Logout
        </button>
    );
}