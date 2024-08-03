"use client"
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    const supabase = createClientComponentClient();

    useEffect(() => {
        async function getUser() {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        }
        getUser();
    }, [supabase.auth]);

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMenuOpen]);

    const handleProfileClick = () => {
        if (user) {
            router.push('/profile');
        } else {
            router.push('/auth/login');
        }
    };

    return (
        <header className="flex justify-between items-center p-6 px-8">
            <div className="flex items-center">
                <Link href="/" className="flex items-center">
                    <Image src="/logo-no-txt.svg" alt="MealMate Logo" width={49} height={50}/>
                    <span className="ml-2 font-bold hidden sm:inline">MealMate</span>
                </Link>
            </div>
            <div className="flex items-center">
                <nav className={`${isMenuOpen ? 'flex' : 'hidden'} sm:flex fixed sm:relative inset-0 sm:inset-auto flex-col sm:flex-row bg-white sm:bg-transparent p-4 sm:p-0 z-50`}>
                    <ul className="flex flex-col sm:flex-row sm:space-x-6 items-center w-full sm:w-auto h-full sm:h-auto justify-center">
                        <li className="w-full sm:w-auto text-center mb-4 sm:mb-0">
                            <Link href="#how-it-works" onClick={() => setIsMenuOpen(false)}>How it works</Link>
                        </li>
                        <li className="w-full sm:w-auto text-center mb-4 sm:mb-0">
                            <Link href="#donations" onClick={() => setIsMenuOpen(false)}>Donations</Link>
                        </li>
                        <li className="w-full sm:w-auto text-center">
                            {user ? (
                                <button onClick={handleProfileClick} className="flex items-center">
                                    <div className="w-8 h-8 rounded-full border-2 border-black overflow-hidden">
                                        <Image
                                            src={user.user_metadata.avatar_url || '/images/default-profile.png'}
                                            alt="Profile"
                                            width={32}
                                            height={32}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                </button>
                            ) : (
                                <Link href="/auth/sign-up" className="bg-black text-white px-4 py-2 rounded inline-block" onClick={() => setIsMenuOpen(false)}>
                                    Get Started
                                </Link>
                            )}
                        </li>
                    </ul>
                </nav>
                <button
                    className="sm:hidden ml-4 z-50 relative"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? (
                        <XMarkIcon className="h-6 w-6" />
                    ) : (
                        <Bars3Icon className="h-6 w-6" />
                    )}
                </button>
            </div>
        </header>
    );
}