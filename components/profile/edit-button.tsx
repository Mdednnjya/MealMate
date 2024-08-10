'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { PencilIcon } from '@heroicons/react/24/solid';
import { AnimatePresence } from 'framer-motion';
import EditForm from "@/components/profile/edit-form";

interface EditProfileButtonProps {
    userId: string;
}

export default function EditButton({ userId }: EditProfileButtonProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleEdit = async () => {
        setIsLoading(true);
        const supabase = createClientComponentClient();
        try {
            const { data: { user } } = await supabase.auth.getUser();
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            setUser({ ...user, ...profile });
            setIsEditing(true);
        } catch (error) {
            console.error('Error fetching user data:', error);
            alert('Failed to fetch user data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setIsEditing(false);
        setUser(null);
    };

    const handleSave = async (formData: any) => {
        const supabase = createClientComponentClient();
        try {
            const { error } = await supabase
                .from('profiles')
                .update(formData)
                .eq('id', userId);

            if (error) throw error;

            setIsEditing(false);
            window.location.reload();
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile: ' + (error as Error).message);
        }
    };

    return (
        <>
            <button
                onClick={handleEdit}
                className="w-full bg-black text-white font-bold py-2 px-4 rounded-xl flex items-center justify-center"
                disabled={isLoading}
            >
                {isLoading ? 'Loading...' : (
                    <>
                        <PencilIcon className="w-5 h-5 mr-2"/> Edit Profile
                    </>
                )}
            </button>
            <AnimatePresence>
                {isEditing && user && (
                    <EditForm user={user} onSave={handleSave} onClose={handleClose} />
                )}
            </AnimatePresence>
        </>
    );
}