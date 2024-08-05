'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Country, State, City } from 'country-state-city';
import { useAuth } from '@/contexts/auth-context';

export default function SignUpForm() {
    const [step, setStep] = useState(1);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [country, setCountry] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const supabase = createClientComponentClient();
    const { signIn } = useAuth();

    const [countries, setCountries] = useState<any[]>([]);
    const [states, setStates] = useState<any[]>([]);
    const [cities, setCities] = useState<any[]>([]);

    useEffect(() => {
        setCountries(Country.getAllCountries());
    }, []);

    useEffect(() => {
        if (country) {
            setStates(State.getStatesOfCountry(country));
        }
    }, [country]);

    useEffect(() => {
        if (state) {
            setCities(City.getCitiesOfState(country, state));
        }
    }, [state]);

    const handleNextStep = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(2);
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        phone,
                        country,
                        state,
                        city
                    }
                }
            });

            if (error) throw error;

            if (data.user) {
                await signIn(email, password);
                router.push('/');
            }
        } catch (error) {
            setError('Error creating account');
            console.error('Error signing up:', error);
        }
    };

    return (
        <form onSubmit={step === 1 ? handleNextStep : handleSignUp} className="space-y-4">
            {error && <p className="text-red-500">{error}</p>}
            {step === 1 && (
                <>
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
                            placeholder="Enter your full name"
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
                            Phone Number
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
                            placeholder="Create a password"
                            required
                        />
                    </div>
                </>
            )}
            {step === 2 && (
                <>
                    <div>
                        <label htmlFor="country" className="block text-sm font-bold mb-2">
                            Country
                        </label>
                        <select
                            id="country"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-[#F1F1F1] placeholder-[#8A8A8A]"
                            required
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
                        <label htmlFor="state" className="block text-sm font-bold mb-2">
                            State
                        </label>
                        <select
                            id="state"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-[#F1F1F1] placeholder-[#8A8A8A]"
                            required
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
                        <label htmlFor="city" className="block text-sm font-bold mb-2">
                            City
                        </label>
                        <select
                            id="city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-[#F1F1F1] placeholder-[#8A8A8A]"
                            required
                        >
                            <option value="">Select City</option>
                            {cities.map((city) => (
                                <option key={city.name} value={city.name}>
                                    {city.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </>
            )}
            <button
                type="submit"
                className="w-full bg-black text-white font-bold py-2 px-4 rounded-xl"
            >
                {step === 1 ? 'Next' : 'Sign Up'}
            </button>
        </form>
    );
}