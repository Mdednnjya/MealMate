'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { uberMoveText } from "@/components/fonts";
import { useAuth } from '@/contexts/auth-context';

interface FormData {
    title: string;
    notes: string;
    location: string;
    quantity: string;
    expiry_date: string;
    type: 'FOOD' | 'DRINK' | 'MEAL_PACKAGE';
    image: File | null;
}

export default function DonationForm() {
    const router = useRouter();
    const { user } = useAuth();
    const [formData, setFormData] = useState<FormData>({
        title: '',
        notes: '',
        location: '',
        quantity: '',
        expiry_date: '',
        type: 'FOOD',
        image: null
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, files } = e.target as HTMLInputElement;
        setFormData(prevState => ({
            ...prevState,
            [name]: files ? files[0] : value
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null) {
                formDataToSend.append(key, value);
            }
        });

        try {
            if (!user) {
                throw new Error('No active session found');
            }

            console.log('Sending donation request...');
            const response = await fetch('/api/donations/add-donation', {
                method: 'POST',
                body: formDataToSend
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Donation uploaded successfully:', result);
            router.push('/donations');
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error uploading donation:', error.message);
            } else {
                console.error('An unknown error occurred');
            }
        }
    };

    return (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title"
                           className={`block ${uberMoveText.className} text-md font-bold text-black`}>Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </div>
                <div>
                    <label htmlFor="location"
                           className={`block ${uberMoveText.className} text-md font-bold text-black`}>Spesific
                        Location</label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </div>
                <div>
                    <label htmlFor="quantity"
                           className={`block ${uberMoveText.className} text-md font-bold text-black`}>Quantity</label>
                    <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </div>
                <div>
                    <label htmlFor="notes" className={`block ${uberMoveText.className} text-md font-bold text-black`}>Extra
                        Notes</label>
                    <textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </div>
                <div>
                    <label htmlFor="expiry_date"
                           className={`block ${uberMoveText.className} text-md font-bold text-black`}>Best
                        Before</label>
                    <input
                        type="datetime-local"
                        id="expiry_date"
                        name="expiry_date"
                        value={formData.expiry_date}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="type"
                           className={`block ${uberMoveText.className} text-md font-bold text-black`}>Type</label>
                    <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                        <option value="FOOD">Food</option>
                        <option value="DRINK">Drink</option>
                        <option value="MEAL_PACKAGE">Meal Package</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="image"
                           className={`block ${uberMoveText.className} text-md font-bold text-black`}>Image</label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        onChange={handleChange}
                        accept="image/*"
                        required
                        className="mt-1 block w-full"
                    />
                </div>
                <button
                    type="submit"
                    className="flex h-10 items-center rounded-lg bg-black px-4 text-sm font-medium text-white transition-colors hover:bg-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                    Create Donation
                </button>
            </form>
        </div>
    );
}
