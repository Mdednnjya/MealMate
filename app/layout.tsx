import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { AuthProvider } from "@/contexts/auth-context";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MealMate",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <AuthProvider>
            <body className={`bg-white ${inter.className} justify-center`}>
                <Header/>
                    <main>{children}</main>
                <Footer/>
            </body>
        </AuthProvider>
    </html>
  );
}
