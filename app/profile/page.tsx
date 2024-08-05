'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { PencilIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { useAuth } from '@/contexts/auth-context';
import { Country, State, City } from 'country-state-city';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfilePage() {
    const { user, signOut, updateUser, updateUserPassword, updateProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    const [countries, setCountries] = useState<any[]>([]);
    const [states, setStates] = useState<any[]>([]);
    const [cities, setCities] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        phone_number: '',
        country: '',
        state: '',
        city: '',
    });

    useEffect(() => {
        setCountries(Country.getAllCountries());
    }, []);

    useEffect(() => {
        if (formData.country) {
            setStates(State.getStatesOfCountry(formData.country));
        }
    }, [formData.country]);

    useEffect(() => {
        if (formData.state) {
            setCities(City.getCitiesOfState(formData.country, formData.state));
        }
    }, [formData.state, formData.country]);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.user_metadata?.name || '',
                phone_number: user.user_metadata?.phone_number || '',
                country: user.user_metadata?.country || '',
                state: user.user_metadata?.state || '',
                city: user.user_metadata?.city || '',
            });
            setLoading(false);
        } else {
            router.push('/auth/login');
        }
    }, [user, router]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleClose = () => {
        setIsEditing(false);
    };

    const handleSave = async () => {
        if (!user) return;

        try {
            console.log('Form data before update:', formData);

            // Update user metadata
            const { error: metadataError } = await updateUser(formData);
            if (metadataError) throw metadataError;

            console.log('User metadata update successful');

            // Update profiles table
            const { error: profileError } = await updateProfile(formData);
            if (profileError) throw profileError;

            console.log('Profile update successful');

            if (newPassword) {
                const { error: passwordError } = await updateUserPassword(newPassword);
                if (passwordError) throw passwordError;
                console.log('Password update successful');
            }

            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile: ' + (error as Error).message);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut();
            router.push('/auth/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="container mx-auto p-4 max-w-md">
            <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
                <h1 className="text-2xl font-bold mb-4 text-center">Profile</h1>
                {user ? (
                    <div className="space-y-4">
                        <div className="flex justify-center mb-4">
                            <Image
                                src={user.user_metadata?.avatar_url || '/images/default-profile.png'}
                                alt="Profile Photo"
                                width={100}
                                height={100}
                                className="rounded-full"
                            />
                        </div>
                        <div>
                            <p className="text-sm font-bold">Name</p>
                            <p className="px-3 py-2">{user.user_metadata?.name}</p>
                        </div>
                        <div>
                            <p className="text-sm font-bold">Email</p>
                            <p className="px-3 py-2">{user.email}</p>
                        </div>
                        <div>
                            <p className="text-sm font-bold">Phone Number</p>
                            <p className="px-3 py-2">{user.user_metadata?.phone_number}</p>
                        </div>
                        <div>
                            <p className="text-sm font-bold">Country</p>
                            <p className="px-3 py-2 flex items-center">
                                {user.user_metadata?.country && (
                                    <Image
                                        src={`https://flagcdn.com/w20/${user.user_metadata.country.toLowerCase()}.png`}
                                        width={20}
                                        height={15}
                                        alt={user.user_metadata.country}
                                        className="mr-2"
                                    />
                                )}
                                {Country.getCountryByCode(user.user_metadata?.country)?.name}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-bold">State</p>
                            <p className="px-3 py-2">
                                {State.getStateByCodeAndCountry(user.user_metadata?.state, user.user_metadata?.country)?.name}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-bold">City</p>
                            <p className="px-3 py-2 rounded-xl bg-[#F1F1F1]">{user.user_metadata?.city}</p>
                        </div>
                        <button
                            onClick={handleEdit}
                            className="w-full bg-black text-white font-bold py-2 px-4 rounded-xl flex items-center justify-center"
                        >
                            <PencilIcon className="w-5 h-5 mr-2"/> Edit Profile
                        </button>
                        <button
                            onClick={handleLogout}
                            className="w-full bg-red-100 text-red-600 font-bold py-2 px-4 rounded-xl mt-4"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <p>No profile found</p>
                )}
            </div>
            <AnimatePresence>
                {isEditing && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white rounded-xl p-6 w-full max-w-md"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">Edit Profile</h2>
                                <button onClick={handleClose}>
                                    <XMarkIcon className="w-6 h-6" />
                                </button>
                            </div>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                handleSave();
                            }} className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-bold mb-2">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 rounded-xl bg-[#F1F1F1] placeholder-[#8A8A8A]"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="phone_number" className="block text-sm font-bold mb-2">Phone Number</label>
                                    <input
                                        type="tel"
                                        id="phone_number"
                                        name="phone_number"
                                        value={formData.phone_number}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 rounded-xl bg-[#F1F1F1] placeholder-[#8A8A8A]"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="country" className="block text-sm font-bold mb-2">Country</label>
                                    <select
                                        id="country"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 rounded-xl bg-[#F1F1F1] placeholder-[#8A8A8A]"
                                    >
                                        <option value="">Select Country</option>
                                        {countries.map((country) => (
                                            <option key={country.isoCode} value={country.isoCode}>
                                                {country.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="state" className="block text-sm font-bold mb-2">State</label>
                                    <select
                                        id="state"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 rounded-xl bg-[#F1F1F1] placeholder-[#8A8A8A]"
                                    >
                                        <option value="">Select State</option>
                                        {states.map((state) => (
                                            <option key={state.isoCode} value={state.isoCode}>
                                                {state.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="city" className="block text-sm font-bold mb-2">City</label>
                                    <select
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 rounded-xl bg-[#F1F1F1] placeholder-[#8A8A8A]"
                                    >
                                        <option value="">Select City</option>
                                        {cities.map((city) => (
                                            <option key={city.name} value={city.name}>
                                                {city.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="newPassword" className="block text-sm font-bold mb-2">New Password</label>
                                    <input
                                        type="password"
                                        id="newPassword"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-[#F1F1F1] placeholder-[#8A8A8A]"
                                        placeholder="Leave blank to keep current password"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="profilePhoto" className="block text-sm font-bold mb-2">Profile Photo</label>
                                    <input
                                        type="file"
                                        id="profilePhoto"
                                        onChange={(e) => setProfilePhoto(e.target.files ? e.target.files[0] : null)}
                                        className="w-full px-3 py-2 rounded-xl bg-[#F1F1F1] placeholder-[#8A8A8A]"
                                    />
                                </div>
                                <button type="submit"
                                        className="w-full bg-black text-white font-bold py-2 px-4 rounded-xl">
                                    Save Changes
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}