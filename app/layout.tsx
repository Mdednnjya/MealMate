import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { AuthProvider } from "@/contexts/auth-context";
import { poppins } from "@/components/fonts";

export const metadata: Metadata = {
    title: "MealMate",
};

export default function RootLayout({ children, }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <AuthProvider>
            <body className={`bg-white ${poppins.className} flex flex-col min-h-screen`}>
            <Header />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
            </body>
        </AuthProvider>
        </html>
    );
}