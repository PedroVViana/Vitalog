import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "VitaLog | Food Logging App",
    description: "Quickly log your meals with text, photos, or audio. Track your food diary privately.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="light">
            <body className={`${inter.variable} font-sans antialiased bg-vitalog-bgLight dark:bg-vitalog-bgDark text-vitalog-textMain transition-colors duration-300`}>
                <ClientLayout>
                    {children}
                </ClientLayout>
            </body>
        </html>
    );
}
