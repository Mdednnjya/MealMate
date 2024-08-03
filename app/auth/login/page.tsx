import Link from 'next/link';
import LoginForm from "@/components/auth/login-form";

export default function LoginPage() {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="bg-white rounded-lg shadow-md w-[447px] h-[463px] p-8">
                <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
                <LoginForm />
                <p className="text-[#6E6E6E] text-center mt-6">
                    Don&apos;t have an account?{' '}
                    <Link href="/auth/sign-up" className="text-black font-bold">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}