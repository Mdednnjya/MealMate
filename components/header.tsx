"use client"
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Header({ isLoggedIn = false, profilePicture = '' }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="flex flex-col sm:flex-row justify-between items-center p-6 px-14">
            <div className="flex items-center mb-4 lg:mb-0">
                <Link href="/" className="flex items-center">
                    <Image src="/logo-no-txt.svg" alt="MealMate Logo" width={49} height={50}/>
                    <span className="ml-2 font-bold">MealMate</span>
                </Link>
            </div>
            <button
                className="sm:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
                {isMenuOpen ? (
                    <XMarkIcon className="h-6 w-6" />
                ) : (
                    <Bars3Icon className="h-6 w-6" />
                )}
            </button>
            <nav className={`${isMenuOpen ? 'block' : 'hidden'} sm:block`}>
                <ul className="flex flex-col sm:flex-row sm:space-x-6 items-center">
                    <li className="w-full sm:w-auto text-center mb-2 sm:mb-0"><Link href="#how-it-works">How it works</Link></li>
                    <li className="w-full sm:w-auto text-center mb-2 sm:mb-0"><Link href="#donations">Donations</Link></li>
                    <li className="w-full sm:w-auto text-center">
                        <Link href="/get-started" className="bg-black text-white px-4 py-2 rounded inline-block">
                            Get Started
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
}