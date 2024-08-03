'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { PencilIcon } from '@heroicons/react/24/solid';
import { User } from '@supabase/supabase-js';

interface Profile {
    id: string;
    name: string;
    email: string;
    phone_number: string;
    profile_photo: string | null;
    role: string;
}

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
    const router = useRouter();
    const supabase = createClientComponentClient();

    useEffect(() => {
        async function getProfile() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                const { data: profile } = await supabase
                    .from('User')
                    .select('*')
                    .eq('id', user.id)
                    .single();
                if (profile) {
                    setProfile(profile);
                    setName(profile.name);
                    setPhone(profile.phone_number);
                }
            } else {
                router.push('/auth/login');
            }
        }
        getProfile();
    }, [supabase, router]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        if (!user) return;

        try {
            const updates = {
                name,
                phone_number: phone,
            };

            const { error } = await supabase
                .from('User')
                .update(updates)
                .eq('id', user.id);

            if (error) throw error;

            if (newPassword) {
                const { error: passwordError } = await supabase.auth.updateUser({
                    password: newPassword,
                });
                if (passwordError) throw passwordError;
            }

            if (profilePhoto) {
                const { data, error: uploadError } = await supabase.storage
                    .from('profile-photos')
                    .upload(`${user.id}.jpg`, profilePhoto);

                if (uploadError) throw uploadError;

                const { error: updateError } = await supabase
                    .from('User')
                    .update({ profile_photo: data?.path })
                    .eq('id', user.id);

                if (updateError) throw updateError;
            }

            setIsEditing(false);
            setNewPassword('');
            setProfilePhoto(null);
            // Refresh profile data
            const { data: updatedProfile } = await supabase
                .from('User')
                .select('*')
                .eq('id', user.id)
                .single();
            setProfile(updatedProfile);
        } catch (error) {
            console.error('Error updating profile:', error);
            // Handle error (e.g., show error message to user)
        }
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setProfilePhoto(e.target.files[0]);
        }
    };

    if (!profile) return <div>Loading...</div>;

    const profilePhotoUrl = profile.profile_photo
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile-photos/${profile.profile_photo}`
        : '/images/default-profile.png';

    return (
        <div className="container mx-auto mt-10 p-6">
            <h1 className="text-3xl font-bold mb-6">Profile</h1>
            <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <div className="relative">
                            <Image
                                src={profilePhotoUrl}
                                alt="Profile"
                                width={100}
                                height={100}
                                className="rounded-full"
                            />
                            {isEditing && (
                                <label htmlFor="photo-upload" className="absolute bottom-0 right-0 bg-black text-white p-2 rounded-full cursor-pointer">
                                    <PencilIcon className="h-4 w-4" />
                                    <input
                                        id="photo-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>
                        <div className="ml-4">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="text-2xl font-bold border-b-2 border-gray-300 focus:outline-none focus:border-black"
                                />
                            ) : (
                                <h2 className="text-2xl font-bold">{profile.name}</h2>
                            )}
                            <p className="text-gray-600">{profile.email}</p>
                        </div>
                    </div>
                    {!isEditing && (
                        <button
                            onClick={handleEdit}
                            className="bg-black text-white px-4 py-2 rounded-lg flex items-center"
                        >
                            <PencilIcon className="h-5 w-5 mr-2" />
                            Edit Profile
                        </button>
                    )}
                </div>
                <div className="mb-4">
                    <strong>Phone:</strong>{' '}
                    {isEditing ? (
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="border-b-2 border-gray-300 focus:outline-none focus:border-black"
                        />
                    ) : (
                        profile.phone_number
                    )}
                </div>
                {isEditing && (
                    <div className="mb-4">
                        <strong>New Password:</strong>{' '}
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="border-b-2 border-gray-300 focus:outline-none focus:border-black"
                            placeholder="Leave blank to keep current password"
                        />
                    </div>
                )}
                <div className="mb-4">
                    <strong>Role:</strong> {profile.role}
                </div>
                {isEditing && (
                    <button
                        onClick={handleSave}
                        className="bg-black text-white px-4 py-2 rounded-lg"
                    >
                        Save Changes
                    </button>
                )}
            </div>
        </div>
    );
}