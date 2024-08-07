"use client"

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Bars3Icon, XMarkIcon, BellIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { uberMoveText } from "@/components/fonts";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();
    const { user, signOut } = useAuth();

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
        <header className="flex justify-between items-center p-8 px-8 sm:px-12 md:px-20">
            <div className="flex items-center">
                <Link href="/" className="flex items-center">
                    <Image src="/logo-no-txt.svg" alt="MealMate Logo" width={49} height={50}/>
                    <span className="ml-3 ${poppins.className} font-medium logo-text hidden md:inline">MealMate</span>
                </Link>
            </div>
            <div className="flex items-center">
                <nav
                    className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex fixed md:relative inset-0 md:inset-auto flex-col md:flex-row bg-white md:bg-transparent p-4 md:p-0 z-50`}>
                    <ul className="flex flex-col md:flex-row md:space-x-6 items-center w-full md:w-auto h-full md:h-auto justify-center">
                        <li className={`w-full md:w-auto ${uberMoveText.className} font-medium text-center navbar-text mb-4 md:mb-0`}>
                            <Link href="/donations" onClick={() => setIsMenuOpen(false)}>Donations</Link>
                        </li>
                        {user && (
                            <li className={`w-full md:w-auto ${uberMoveText.className} font-medium text-center navbar-text mb-4 md:mb-0`}>
                                <Link href="/manage" onClick={() => setIsMenuOpen(false)}>Manage</Link>
                            </li>
                        )}
                        {user && (
                            <li className="w-full md:w-auto text-center mb-4 md:mb-0">
                                <button onClick={() => router.push('/notifications')} className="relative">
                                    <BellIcon className="h-6 w-6"/>

                                </button>
                            </li>
                        )}
                        <li className="w-full md:w-auto text-center">
                            {user ? (
                                <div className="flex items-center justify-center space-x-4">
                                    <button onClick={handleProfileClick} className="flex items-center">
                                        <div className="w-8 h-8 rounded-full border-2 border-black overflow-hidden">
                                            <Image
                                                src={user.user_metadata?.avatar_url || '/images/default-profile.png'}
                                                alt="Profile"
                                                width={32}
                                                height={32}
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                    </button>
                                </div>
                            ) : (
                                <Link href="/auth/sign-up"
                                      className="bg-black text-white px-4 py-2  rounded inline-block"
                                      onClick={() => setIsMenuOpen(false)}>
                                    Get Started
                                </Link>
                            )}
                        </li>
                    </ul>
                </nav>
                <button
                    className="md:hidden ml-4 z-50 relative"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? (
                        <XMarkIcon className="h-6 w-6"/>
                    ) : (
                        <Bars3Icon className="h-6 w-6"/>
                    )}
                </button>
            </div>
        </header>
    );
}