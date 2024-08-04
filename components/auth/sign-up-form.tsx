'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from "@/utils/supabase";
import axios from 'axios';

export default function SignUpForm() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        email: email,
                        phone_number: phone,
                        password: password,

                    },
                },
            });

            if (error) {
                setError(error.message);
                console.error('Error signing up:', error);
                return;
            }
        } catch (error) {
            setError('Error creating account');
            console.error('Error signing up:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-500">{error}</p>}
            <div>
                <label htmlFor="fullName" className="block text-sm font-bold mb-2">
                    Full Name
                </label>
                <input
                    type="text"
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F1F1F1] placeholder-[#8A8A8A]"
                    placeholder="Name"
                    required
                />
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-bold mb-2">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F1F1F1] placeholder-[#8A8A8A]"
                    placeholder="Enter your email"
                    required
                />
            </div>
            <div>
                <label htmlFor="phone" className="block text-sm font-bold mb-2">
                    Phone
                </label>
                <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F1F1F1] placeholder-[#8A8A8A]"
                    placeholder="Enter your phone number"
                    required
                />
            </div>
            <div>
                <label htmlFor="password" className="block text-sm font-bold mb-2">
                    Password
                </label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F1F1F1] placeholder-[#8A8A8A]"
                    placeholder="Enter your password"
                    required
                />
            </div>
            <button
                type="submit"
                className="w-full bg-black text-white font-bold py-2 px-4 rounded-xl"
            >
                Create Account
            </button>
        </form>
    );
}
