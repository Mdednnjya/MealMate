import Link from 'next/link';
import SignUpForm from "@/components/auth/sign-up-form";
export default function SignUpPage() {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="bg-white rounded-lg shadow-md w-[447px] h-[643px] p-8">
                <h1 className="text-2xl font-bold text-center mb-6">Sign up</h1>
                <p className="text-[#6E6E6E] text-center mb-6">
                    Already have an account?{' '}
                    <Link href="/auth/login" className="text-black font-bold">
                        Log in
                    </Link>
                </p>
                <SignUpForm />
                <p className="text-[9px] text-[#6E6E6E] mt-4">
                    By clicking &apos;Continue&apos;, you acknowledge that you have read and accept the{' '}
                    <span className="text-black">Terms of Service</span> and{' '}
                    <span className="text-black">Privacy Policy</span>.
                </p>
            </div>
        </div>
    );
}