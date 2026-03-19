'use client';

import { useState } from "react";
import Sidebar from "./components/sidebar";

export default function ProtectedLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex relative min-h-screen">
            {/* Sidebar toggle for mobile - Only shows Menu icon, Sidebar handles closing */}
            {!isSidebarOpen && (
                <div className="lg:hidden absolute top-4 left-4 z-20">
                    <button 
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 bg-white rounded-lg shadow-md"
                    >
                        <div className="w-5 h-5 bg-accent" style={{
                            maskImage: 'url(/img/icons/menu.svg)',
                            WebkitMaskImage: 'url(/img/icons/menu.svg)',
                            maskSize: 'contain',
                            WebkitMaskSize: 'contain',
                            maskRepeat: 'no-repeat',
                            WebkitMaskRepeat: 'no-repeat',
                            maskPosition: 'center',
                            WebkitMaskPosition: 'center',
                        }} />
                    </button>
                </div>
            )}

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Main content wrapper */}
            <div className="flex-1 min-h-screen p-6 lg:p-10 bg-graybg shadow-[inset_7px_0px_7px_-3px_rgba(0,0,0,0.05)] overflow-x-hidden">
                {children}
            </div>

            {/* Mobile overlay */}
            <div 
                className={`fixed inset-0 bg-black/50 z-30 lg:hidden transition-opacity duration-300 ease-in-out ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
                onClick={() => setIsSidebarOpen(false)}
            />
        </div>
    );
}
