import Link from 'next/link';
import Image from 'next/image';

export default function Header({ isLoggedIn = false, profilePicture = '' }) {
    return (
        <header className="flex flex-col sm:flex-row justify-between items-center p-6 px-14">
            <div className="flex items-center mb-4 lg:mb-0">
                <Link href="/">
                    <Image src="/logo-no-txt.svg" alt="MealMate Logo" width={49} height={50}/>
                    <span className="ml-2 font-bold">MealMate</span>
                </Link>
            </div>
            <nav>
                <ul className="flex flex-wrap justify-center sm:space-x-6 items-center">
                    <li className="w-full sm:w-auto text-center mb-2 sm:mb-0"><Link href="#how-it-works">How it
                        works</Link></li>
                    <li className="w-full sm:w-auto text-center mb-2 sm:mb-0"><Link href="#donations">Donations</Link>
                    </li>
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