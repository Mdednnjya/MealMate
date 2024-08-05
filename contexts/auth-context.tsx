"use client"

import React, { createContext, useState, useEffect, useContext } from 'react';
import { User, SupabaseClient } from '@supabase/supabase-js';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface AuthContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    updateUser: (updates: { name: string; phone_number: string; country: string; state: string; city: string }) => Promise<{ data: any; error: any }>;
    updateUserPassword: (password: string) => Promise<{ data: any; error: any }>;
    updateProfile: (updates: { name: string; phone_number: string; country: string; state: string; city: string }) => Promise<{ data: any; error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const supabase = createClientComponentClient();

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [supabase.auth]);

    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    };

    const updateUser = async (updates: { name: string; phone_number: string; country: string; state: string; city: string }) => {
        if (!user) return { data: null, error: new Error('No user logged in') };

        console.log('Updating user with:', updates);

        const { data, error } = await supabase.auth.updateUser({
            data: updates
        });

        console.log('Update response:', { data, error });

        if (!error) {
            setUser(prevUser => prevUser ? { ...prevUser, user_metadata: { ...prevUser.user_metadata, ...updates } } : null);
        }

        return { data, error };
    };

    const updateUserPassword = async (password: string) => {
        const { data, error } = await supabase.auth.updateUser({ password });
        return { data, error };
    };

    const updateProfilePhoto = async (photo: File) => {
        if (!user) {
            return { error: new Error('No user logged in') };
        }

        const fileExt = photo.name.split('.').pop();
        const fileName = `${user.id}-${Math.random()}.${fileExt}`;

        const { data, error } = await supabase.storage
            .from('profile-photos')
            .upload(fileName, photo);

        if (error) {
            return { error };
        }

        const { data: urlData } = supabase.storage
            .from('profile-photos')
            .getPublicUrl(fileName);

        if (!urlData) {
            return { error: new Error('Failed to get public URL') };
        }

        const { data: userData, error: userError } = await supabase.auth.updateUser({
            data: { avatar_url: urlData.publicUrl }
        });

        if (!userError) {
            setUser(prevUser => prevUser ? { ...prevUser, user_metadata: { ...prevUser.user_metadata, avatar_url: urlData.publicUrl } } : null);
        }

        return { data: userData, error: userError };
    };

    const updateProfile = async (updates: { name: string; phone_number: string; country: string; state: string; city: string }) => {
        if (!user) return { data: null, error: new Error('No user logged in') };

        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', user.id)
            .single();

        return { data, error };
    };

    return (
        <AuthContext.Provider value={{ user, setUser, signIn, signOut, updateUser, updateUserPassword, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};