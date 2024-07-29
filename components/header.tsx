"use client"
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Header({ isLoggedIn = false, profilePicture = '' }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMenuOpen]);

    return (
        <header className="flex justify-between items-center p-6 px-14">
            <div className="flex items-center">
                <Link href="/" className="flex items-center">
                    <Image src="/logo-no-txt.svg" alt="MealMate Logo" width={49} height={50}/>
                    <span className="ml-2 font-bold hidden sm:inline">MealMate</span>
                </Link>
            </div>
            <div className="flex items-center">
                <nav className={`${isMenuOpen ? 'flex' : 'hidden'} sm:flex fixed sm:relative inset-0 sm:inset-auto flex-col sm:flex-row bg-white sm:bg-transparent p-4 sm:p-0 z-50`}>
                    <ul className="flex flex-col sm:flex-row sm:space-x-6 items-center w-full sm:w-auto h-full sm:h-auto justify-center">
                        <li className="w-full sm:w-auto text-center mb-4 sm:mb-0"><Link href="#how-it-works" onClick={() => setIsMenuOpen(false)}>How it works</Link></li>
                        <li className="w-full sm:w-auto text-center mb-4 sm:mb-0"><Link href="#donations" onClick={() => setIsMenuOpen(false)}>Donations</Link></li>
                        <li className="w-full sm:w-auto text-center">
                            <Link href="/get-started" className="bg-black text-white px-4 py-2 rounded inline-block" onClick={() => setIsMenuOpen(false)}>
                                Get Started
                            </Link>
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