import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";


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
        <body className={`bg-white ${inter.className} justify-center`}>
            <Header/>
                <main>{children}</main>
            <Footer/>
        </body>
    </html>
  );
}
