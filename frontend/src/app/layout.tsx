'use client';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from '@/components/providers/ToastProvider';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

const geistSans = Geist({
 variable: "--font-geist-sans",
 subsets: ["latin"],
});

const geistMono = Geist_Mono({
 variable: "--font-geist-mono",
 subsets: ["latin"],
});

export default function RootLayout({
 children,
}: Readonly<{
 children: React.ReactNode;
}>) {
 const { initialize, loading } = useAuthStore();

 useEffect(() => {
   initialize();
 }, [initialize]);

 if (loading) {
   return (
     <html lang="en">
       <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
         <div className="min-h-screen bg-slate-950 flex items-center justify-center">
           <div className="text-white">Loading...</div>
         </div>
       </body>
     </html>
   );
 }

 return (
   <html lang="en">
     <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
       <ToastProvider />
       <ProtectedRoute>{children}</ProtectedRoute>
     </body>
   </html>
 );
}