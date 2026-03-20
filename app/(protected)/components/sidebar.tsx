'use client';

import Image from 'next/image'
import Link from 'next/link';
import { usePathname } from "next/navigation";
import Icon from './icon'

function NavElement({ title, icon, isActive = false, link, onClick }: { title: string, icon: string, isActive?: boolean, link: string, onClick?: () => void }) {
    if (isActive) {
        return (
            <Link href={link} aria-current="page" className="flex items-center bg-accent rounded-xl mt-3 py-2 px-5 text-white">
                <Icon src={icon} />
                <p className='ml-3 font-medium'>{title}</p>
            </Link>);
    } else {
        if (onClick == undefined) return (
            <Link
                href={link}
                className="flex items-center rounded-xl py-2 mt-3 px-5 text-secondary transition-colors duration-200 hover:bg-graybg hover:text-accent"
            >
                <Icon src={icon} />
                <p className='ml-3 font-medium'>{title}</p>
            </Link>);

        return (
            <Link
                href={link}
                onClick={onClick}
                className="flex items-center rounded-xl py-2 mt-3 px-5 text-secondary transition-colors duration-200 hover:bg-graybg hover:text-accent"
            >
                <Icon src={icon} />
                <p className='ml-3 font-medium'>{title}</p>
            </Link>);
    }
}


export default function Sidebar({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const pathname = usePathname();

    return (
        <div className={`
            fixed inset-y-0 left-0 z-40 w-72 bg-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static flex flex-col
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            pt-10 pb-10 px-5 shadow-[7px_0px_7px_-3px_rgba(0,0,0,0.05)] lg:shadow-none
        `}>
            {/* Close button for mobile */}
            <div className="lg:hidden absolute top-4 right-4">
                <button type="button" aria-label="Close sidebar" onClick={onClose} className="p-2 text-secondary hover:text-accent transition-colors cursor-pointer">
                    <Icon src="/img/icons/x.svg" className="w-5 h-5" />
                </button>
            </div>

            <div className="flex justify-center items-center">
                <div className="bg-accent p-4 rounded-full">
                    <Image src="/img/icons/spendwise.svg" alt="SpendWise icon" width={22} height={22} />
                </div>
                <p className="ml-3 text-xl font-black text-accent">SpendWise</p>
            </div>

            <div className="mt-8 flex flex-col gap-1">
                <NavElement onClick={onClose} link="/dashboard" isActive={pathname === "/dashboard"} title="Home" icon="/img/icons/home.svg" />
                <NavElement onClick={onClose} link="/log" isActive={pathname === "/log"} title="Expense Log" icon="/img/icons/log.svg" />
                <NavElement onClick={onClose} link="/debt" isActive={pathname === "/debt"} title="Debt Tracker" icon="/img/icons/debt.svg" />
                <NavElement onClick={onClose} link="/spending" isActive={pathname === "/spending"} title="Spending" icon="/img/icons/spending.svg" />
                <NavElement onClick={onClose} link="/settings" isActive={pathname === "/settings"} title="Settings" icon="/img/icons/settings.svg" />
            </div>

            {/* Spacer to push profile to bottom */}
            <div className="flex-1" />

            <div className="flex items-center gap-4 bg-white p-2 mt-auto pt-4 lg:pt-0">
                <div className="w-10 h-10 shrink-0 rounded-full overflow-hidden flex items-center justify-center">
                    <Image
                        src="/img/default-avatar.jpg"
                        alt="Username"
                        className="w-full h-full object-cover"
                        width={40}
                        height={40}
                    />
                </div>

                <div className="flex flex-col flex-1 min-w-0">
                    <h2 className="text-sm font-bold text-black truncate leading-tight tracking-tight">Username</h2>
                    <span className="text-xs text-gray-500 truncate leading-snug">Free Plan</span>
                </div>

                <div className="relative group shrink-0">
                    <button aria-label="Log out" className="text-secondary hover:text-accent cursor-pointer transition-colors p-1">
                        <Icon src="/img/icons/logout.svg" className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-black text-white text-[10px] rounded opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">                       
                        Log out
                    </div>
                </div>
            </div>
        </div>
    );
}
