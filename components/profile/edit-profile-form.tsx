// components/profile/edit-profile-form.tsx

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { PencilIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { Country, State, City } from 'country-state-city';
import { motion, AnimatePresence } from 'framer-motion';

interface ProfileFormProps {
    user: any;
    onSave: (formData: any) => Promise<void>;
    onClose: () => void;
}

export default function EditProfileForm({ user, onSave, onClose }: ProfileFormProps) {
    const [countries, setCountries] = useState<any[]>([]);
    const [states, setStates] = useState<any[]>([]);
    const [cities, setCities] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        name: user.name || '',
        phone_number: user.phone_number || '',
        country: user.country || '',
        state: user.state || '',
        city: user.city || '',
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSave({ ...formData});
    };

    return (
        <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center "
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
                    <button onClick={onClose}>
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
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
                    <button type="submit"
                            className="w-full bg-black text-white font-bold py-2 px-4 rounded-xl">
                        Save Changes
                    </button>
                </form>
            </motion.div>
        </motion.div>
    );
}