import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const useLogout = () => {
    const supabase = createClientComponentClient();

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error logging out:', error);
        } else {
            window.location.href = '/';
        }
    };

    return { handleLogout };
};

export default useLogout;
