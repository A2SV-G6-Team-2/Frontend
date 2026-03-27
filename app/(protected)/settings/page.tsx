'use client';

import { useEffect, useState } from 'react';
import { useProfile } from '@/lib/api/hooks/useUser';
import Icon from '@/components/icon';

type AppearanceMode = 'Light' | 'Dark' | 'System';
type ModalType = 'name' | 'email' | 'currency' | 'language' | 'frequency' | 'date' | '';

type ModalState = {
    open: boolean;
    type: ModalType;
    value: string | Date | null;
};

const appearanceOptions: AppearanceMode[] = ['Light', 'Dark', 'System'];
const frequencyOptions = ['Daily', 'Weekly', 'Monthly'] as const;

function IconBase({ children }: { children: React.ReactNode }) {
    return (
        <span className="w-8 h-8 grid place-items-center rounded-lg bg-[#f3f0ff] text-accent">
            {children}
        </span>
    );
}

function EmailIcon() {
    return (
        <IconBase>
            <svg width="36" height="32" viewBox="0 0 36 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="36" height="32" rx="12" fill="#7B5BFF" fillOpacity="0.1" />
                <path
                    d="M10 24C9.45 24 8.97917 23.8042 8.5875 23.4125C8.19583 23.0208 8 22.55 8 22V10C8 9.45 8.19583 8.97917 8.5875 8.5875C8.97917 8.19583 9.45 8 10 8H26C26.55 8 27.0208 8.19583 27.4125 8.5875C27.8042 8.97917 28 9.45 28 10V22C28 22.55 27.8042 23.0208 27.4125 23.4125C27.0208 23.8042 26.55 24 26 24H10ZM18 17L10 12V22H26V12L18 17ZM18 15L26 10H10L18 15ZM10 12V10V12V22V12Z"
                    fill="#7B5BFF"
                />
            </svg>
        </IconBase>
    );
}

function CurrencyIcon() {
    return (
        <IconBase>
            <svg width="38" height="32" viewBox="0 0 38 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="38" height="32" rx="12" fill="#7B5BFF" fillOpacity="0.1" />
                <path
                    d="M21 17C20.1667 17 19.4583 16.7083 18.875 16.125C18.2917 15.5417 18 14.8333 18 14C18 13.1667 18.2917 12.4583 18.875 11.875C19.4583 11.2917 20.1667 11 21 11C21.8333 11 22.5417 11.2917 23.125 11.875C23.7083 12.4583 24 13.1667 24 14C24 14.8333 23.7083 15.5417 23.125 16.125C22.5417 16.7083 21.8333 17 21 17ZM14 20C13.45 20 12.9792 19.8042 12.5875 19.4125C12.1958 19.0208 12 18.55 12 18V10C12 9.45 12.1958 8.97917 12.5875 8.5875C12.9792 8.19583 13.45 8 14 8H28C28.55 8 29.0208 8.19583 29.4125 8.5875C29.8042 8.97917 30 9.45 30 10V18C30 18.55 29.8042 19.0208 29.4125 19.4125C29.0208 19.8042 28.55 20 28 20H14ZM16 18H26C26.1958 17.45 26.1958 16.9792 26.5875 16.5875C26.9792 16.1958 27.45 16 28 16V12C27.45 12 26.9792 11.8042 26.5875 11.4125C26.1958 11.0208 25.7 11 25 11H16C16 10.55 15.8042 11.0208 15.4125 11.4125C15.0208 11.8042 14.55 12 14 12V16C14 16.55 14.55 16.9792 15.4125 16.5875C15.8042 16.1958 15.8042 16.3333 16 17V18ZM27 24H10C9.45 24 8.97917 23.8042 8.5875 23.4125C8.19583 23.0208 8 22.55 8 22V11H10V22H27V24ZM14 18V10V18Z"
                    fill="#7B5BFF"
                />
            </svg>
        </IconBase>
    );
}

function LanguageIcon() {
    return (
        <IconBase>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="36" height="36" rx="12" fill="#7B5BFF" fillOpacity="0.1" />
                <path
                    d="M18.0125 28C16.6375 28 15.3417 27.7375 14.125 27.2125C12.9083 26.6875 11.8458 25.9708 10.9375 25.0625C10.0292 24.1542 9.3125 23.0917 8.7875 21.875C8.2625 20.6583 8 19.3625 8 17.9875C8 16.6125 8.2625 15.3208 8.7875 14.1125C9.3125 12.9042 10.0292 11.8458 10.9375 10.9375C11.8458 10.0292 12.9083 9.3125 14.125 8.7875C15.3417 8.2625 16.6375 8 18.0125 8C19.3875 8 20.6792 8.2625 21.8875 8.7875C23.0958 9.3125 24.1542 10.0292 25.0625 10.9375C25.9708 11.8458 26.6875 12.9042 27.2125 14.1125C27.7375 15.3208 28 16.6125 28 17.9875C28 19.3625 27.7375 20.6583 27.2125 21.875C26.6875 23.0917 25.9708 24.1542 25.0625 25.0625C24.1542 25.9708 23.0958 26.6875 21.8875 27.2125C20.6792 27.7375 19.3875 28 18.0125 28ZM18 25.95C18.4333 25.35 18.8083 24.725 19.125 24.075C19.4417 23.425 19.7 22.7333 19.9 22H16.1C16.3 22.7333 16.5583 23.425 16.875 24.075C17.1917 24.725 17.5667 25.35 18 25.95ZM15.4 25.55C15.1 25 14.8375 24.4292 14.6125 23.8375C14.3875 23.2458 14.2 22.6333 14.05 22H11.1C11.5833 22.8333 12.1875 23.5583 12.9125 24.175C13.6375 24.7917 14.4667 25.25 15.4 25.55ZM20.6 25.55C21.5333 25.25 22.3625 24.7917 23.0875 24.175C23.8125 23.5583 24.4167 22.8333 24.9 22H21.95C21.8 22.6333 21.6125 23.2458 21.3875 23.8375C21.1625 24.4292 20.9 25 20.6 25.55ZM10.25 20H13.65C13.6 19.6667 13.5625 19.3375 13.5375 19.0125C13.5125 18.6875 13.5 18.35 13.5 18C13.5 17.65 13.5125 17.3125 13.5375 16.9875C13.5625 16.6625 13.6 16.3333 13.65 16H10.25C10.1667 16.3333 10.1042 16.6625 10.0625 16.9875C10.0208 17.3125 10 17.65 10 18C10 18.35 10.0208 18.6875 10.0625 19.0125C10.1042 19.3375 10.1667 19.6667 10.25 20ZM15.65 20H20.35C20.4 19.6667 20.4375 19.3375 20.4625 19.0125C20.4875 18.6875 20.5 18.35 20.5 18C20.5 17.65 20.4875 17.3125 20.4625 16.9875C20.4375 16.6625 20.4 16.3333 20.35 16H15.65C15.6 16.3333 15.5625 16.6625 15.5375 16.9875C15.5125 17.3125 15.5 17.65 15.5 18C15.5 18.35 15.5125 18.6875 15.5375 19.0125C15.5625 19.3375 15.6 19.6667 15.65 20ZM22.35 20H25.75C25.8333 19.6667 25.8958 19.3375 25.9375 19.0125C25.9792 18.6875 26 18.35 26 18C26 17.65 25.9792 17.3125 25.9375 16.9875C25.8958 16.6625 25.8333 16.3333 25.75 16H22.35C22.4 16.3333 22.4375 16.6625 22.4625 16.9875C22.4875 17.3125 22.5 17.65 22.5 18C22.5 18.35 22.4875 18.6875 22.4625 19.0125C22.4375 19.3375 22.4 19.6667 22.35 20ZM21.95 14H24.9C24.4167 13.1667 23.8125 12.4417 23.0875 11.825C22.3625 11.2083 21.5333 10.75 20.6 10.45C20.9 11 21.1625 11.5708 21.3875 12.1625C21.6125 12.7543 21.8 13.3667 21.95 14ZM16.1 14H19.9C19.7 13.2667 19.4417 12.575 19.125 11.925C18.8083 11.275 18.4333 10.65 18 10.05C17.5667 10.65 17.1917 11.275 16.875 11.925C16.5583 12.575 16.3 13.2667 16.1 14ZM11.1 14H14.05C14.2 13.3667 14.3875 12.7543 14.6125 12.1625C14.8375 11.5708 15.1 11 15.4 10.45C14.4667 10.75 13.6375 11.2083 12.9125 11.825C12.1875 12.4417 11.5833 13.1667 11.1 14Z"
                    fill="#9C7AFF"
                />
            </svg>
        </IconBase>
    );
}

function CategoryIcon() {
    return (
        <IconBase>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" rx="12" fill="#7B5BFF" fillOpacity="0.1" />
                <path
                    d="M14 19L19.5 10L25 19H14ZM25 30C23.75 30 22.6875 29.5625 21.8125 28.6875C20.9375 27.8125 20.5 26.75 20.5 25.5C20.5 24.25 20.9375 23.1875 21.8125 22.3125C22.6875 21.4375 23.75 21 25 21C26.25 21 27.3125 21.4375 28.1875 22.3125C29.0625 23.1875 29.5 24.25 29.5 25.5C29.5 26.75 29.0625 27.8125 28.1875 28.6875C27.3125 29.5625 26.25 30 25 30ZM10.5 29.5V21.5H18.5V29.5H10.5ZM25 28C25.7 28 26.2917 27.7583 26.775 27.275C27.2583 26.7917 27.5 26.2 27.5 25.5C27.5 24.8 27.2583 24.2083 26.775 23.725C26.2917 23.2417 25.7 23 25 23C24.3 23 23.7083 23.2417 23.225 23.725C22.7417 24.2083 22.5 24.8 22.5 25.5C22.5 26.2 22.7417 26.7917 23.225 27.275C23.7083 27.7583 24.3 28 25 28ZM12.5 27.5H16.5V23.5H12.5V27.5ZM17.55 17H21.45L19.5 13.85L17.55 17Z"
                    fill="#3C12E7"
                />
            </svg>
        </IconBase>
    );
}

function DailyAlertsIcon() {
    return (
        <IconBase>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" rx="12" fill="#7B5BFF" fillOpacity="0.1" />
                <path
                    d="M10 18.0251C10 16.3584 10.3708 14.8293 11.1125 13.4376C11.8542 12.0459 12.85 10.8918 14.1 9.9751L15.275 11.5751C14.275 12.3084 13.4792 13.2334 12.8875 14.3501C12.2958 15.4668 12 16.6918 12 18.0251H10ZM28 18.0251C28 16.6918 27.7042 15.4668 27.1125 14.3501C26.5208 13.2334 25.725 12.3084 24.725 11.5751L25.9 9.9751C27.15 10.8918 28.1458 12.0459 28.8875 13.4376C29.6292 14.8293 30 16.3584 30 18.0251H28ZM12 27.0251V25.0251H14V18.0251C14 16.6418 14.4167 15.4126 15.25 14.3376C16.0833 13.2626 17.1667 12.5584 18.5 12.2251V11.5251C18.5 11.1084 18.6458 10.7543 18.9375 10.4626C19.2292 10.1709 19.5833 10.0251 20 10.0251C20.4167 10.0251 20.7708 10.1709 21.0625 10.4626C21.3542 10.7543 21.5 11.1084 21.5 11.5251V12.2251C22.8333 12.5584 23.9167 13.2626 24.75 14.3376C25.5833 15.4126 26 16.6418 26 18.0251V25.0251H28V27.0251H12ZM20 30.0251C19.45 30.0251 18.9792 29.8293 18.5875 29.4376C18.1958 29.0459 18 28.5751 18 28.0251H22C22 28.5751 21.8042 29.0459 21.4125 29.4376C21.0208 29.8293 20.55 30.0251 20 30.0251ZM16 25.0251H24V18.0251C24 16.9251 23.6083 15.9834 22.825 15.2001C22.0417 14.4168 21.1 14.0251 20 14.0251C18.9 14.0251 17.9583 14.4168 17.175 15.2001C16.3917 15.9834 16 16.9251 16 18.0251V25.0251Z"
                    fill="#7B5BFF"
                />
            </svg>
        </IconBase>
    );
}

function DebtRemindersIcon() {
    return (
        <IconBase>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" rx="12" fill="#7B5BFF" fillOpacity="0.1" />
                <path
                    d="M19.9996 29.8248C18.7496 29.8248 17.5788 29.5873 16.4871 29.1123C15.3954 28.6373 14.4454 27.9956 13.6371 27.1873C12.8288 26.379 12.1871 25.429 11.7121 24.3373C11.2371 23.2456 10.9996 22.0748 10.9996 20.8248C10.9996 19.5748 11.2371 18.404 11.7121 17.3123C12.1871 16.2206 12.8288 15.2706 13.6371 14.4623C14.4454 13.654 15.3954 13.0123 16.4871 12.5373C17.5788 12.0623 18.7496 11.8248 19.9996 11.8248C21.2496 11.8248 22.4204 12.0623 23.5121 12.5373C24.6038 13.0123 25.5538 13.654 26.3621 14.4623C27.1704 15.2706 27.8121 16.2206 28.2871 17.3123C28.7621 18.404 28.9996 19.5748 28.9996 20.8248C28.9996 22.0748 28.7621 23.2456 28.2871 24.3373C27.8121 25.429 27.1704 26.379 26.3621 27.1873C25.5538 27.9956 24.6038 28.6373 23.5121 29.1123C22.4204 29.5873 21.2496 29.8248 19.9996 29.8248ZM22.7996 25.0248L24.1996 23.6248L20.9996 20.4248V15.8248H18.9996V21.2248L22.7996 25.0248ZM13.5996 10.1748L14.9996 11.5748L10.7496 15.8248L9.34961 14.4248L13.5996 10.1748ZM26.3996 10.1748L30.6496 14.4248L29.2496 15.8248L24.9996 11.5748L26.3996 10.1748ZM19.9996 27.8248C21.9496 27.8248 23.6038 27.1456 24.9621 25.7873C26.3204 24.429 26.9996 22.7748 26.9996 20.8248C26.9996 18.8748 26.3204 17.2206 24.9621 15.8623C23.6038 14.504 21.9496 13.8248 19.9996 13.8248C18.0496 13.8248 16.3954 14.504 15.0371 15.8623C13.6788 17.2206 12.9996 18.8748 12.9996 20.8248C12.9996 22.7748 13.6788 24.429 15.0371 25.7873C16.3954 27.1456 18.0496 27.8248 19.9996 27.8248Z"
                    fill="#7B5BFF"
                />
            </svg>
        </IconBase>
    );
}

function ReportIcon() {
    return (
        <IconBase>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" rx="12" fill="#7B5BFF" fillOpacity="0.1" />
                <path d="M24 28V21H28V28H24ZM18 28V12H22V28H18ZM12 28V17H16V28H12Z" fill="#7B5BFF" />
            </svg>
        </IconBase>
    );
}

function AppearanceIcon() {
    return (
        <IconBase>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" rx="12" fill="#7B5BFF" fillOpacity="0.1" />
                <path
                    d="M20 30C18.6333 30 17.3417 29.7375 16.125 29.2125C14.9083 28.6875 13.8458 27.9708 12.9375 27.0625C12.0292 26.1542 11.3125 25.0917 10.7875 23.875C10.2625 22.6583 10 21.3667 10 20C10 18.6167 10.2708 17.3167 10.8125 16.1C11.3542 14.8833 12.0875 13.825 13.0125 12.925C13.9375 12.025 15.0167 11.3125 16.25 10.7875C17.4833 10.2625 18.8 10 20.2 10C21.5333 10 22.7917 10.2292 23.975 10.6875C25.1583 11.1458 26.1958 11.7792 27.0875 12.5875C27.9792 13.3958 28.6875 14.3542 29.2125 15.4625C29.7375 16.5708 30 17.7667 30 19.05C30 20.9667 29.4167 22.4375 28.25 23.4625C27.0833 24.4875 25.6667 25 24 25H22.15C22.15 25 21.8958 25.0417 21.8375 25.125C21.7792 25.2083 21.75 25.3 21.75 25.4C21.75 25.6 21.875 25.8875 22.125 26.2625C22.375 26.6375 22.5 27.0667 22.5 27.55C22.5 28.3833 22.2708 29 21.8125 29.4C21.3542 29.8 20.75 30 20 30ZM14.5 21C14.9333 21 15.2917 20.8583 15.575 20.575C15.8583 20.2917 16 19.9333 16 19.5C16 19.0667 15.8583 18.7083 15.575 18.425C15.2917 18.1417 14.9333 18 14.5 18C14.0667 18 13.7083 18.1417 13.425 18.425C13.1417 18.7083 13 19.0667 13 19.5C13 19.9333 13.1417 20.2917 13.425 20.575C13.7083 20.8583 14.0667 21 14.5 21ZM17.5 17C17.9333 17 18.2917 16.8583 18.575 16.575C18.8583 16.2917 19 15.9333 19 15.5C19 15.0667 18.8583 14.7083 18.575 14.425C18.2917 14.1417 17.9333 14 17.5 14C17.0667 14 16.7083 14.1417 16.425 14.425C16.1417 14.7083 16 15.0667 16 15.5C16 15.9333 16.1417 16.2917 16.425 16.575C16.7083 16.8583 17.0667 17 17.5 17ZM22.5 17C22.9333 17 23.2917 16.8583 23.575 16.575C23.8583 16.2917 24 15.9333 24 15.5C24 15.0667 23.8583 14.7083 23.575 14.425C23.2917 14.1417 22.9333 14 22.5 14C22.0667 14 21.7083 14.1417 21.425 14.425C21.1417 14.7083 21 15.0667 21 15.5C21 15.9333 21.1417 16.2917 21.425 16.575C21.7083 16.8583 22.0667 17 22.5 17ZM25.5 21C25.9333 21 26.2917 20.8583 26.575 20.575C26.8583 20.2917 27 19.9333 27 19.5C27 19.0667 26.8583 18.7083 26.575 18.425C26.2917 18.1417 25.9333 18 25.5 18C25.0667 18 24.7083 18.1417 24.425 18.425C24.1417 18.7083 24 19.0667 24 19.5C24 19.9333 24.1417 20.2917 24.425 20.575C24.7083 20.8583 25.0667 21 25.5 21ZM20 28C20.15 28 20.2708 27.9583 20.3625 27.875C20.4542 27.7917 20.5 27.6833 20.5 27.55C20.5 27.3167 20.375 27.0417 20.125 26.725C19.875 26.4083 19.75 25.9333 19.75 25.3C19.75 24.6 19.9917 24.0417 20.475 23.625C20.9583 23.2083 21.55 23 22.25 23H24C25.1 23 26.0417 22.6792 26.825 22.0375C27.6083 21.3958 28 20.4 28 19.05C28 17.0333 27.2292 15.3542 25.6875 14.0125C24.1458 12.6708 22.3167 12 20.2 12C17.9333 12 16 12.775 14.4 14.325C12.8 15.875 12 17.7667 12 20C12 22.2167 12.7792 24.1042 14.3375 25.6625C15.8958 27.2208 17.7833 28 20 28Z"
                    fill="#3C12E7"
                />
            </svg>
        </IconBase>
    );
}

function CalendarIcon() {
    return (
        <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M2 20C1.45 20 0.979167 19.8042 0.5875 19.4125C0.195833 19.0208 0 18.55 0 18V4C0 3.45 0.195833 2.97917 0.5875 2.5875C0.979167 2.19583 1.45 2 2 2H3V0H5V2H13V0H15V2H16C16.55 2 17.0208 2.19583 17.4125 2.5875C17.8042 2.97917 18 3.45 18 4V18C18 18.55 17.8042 19.0208 17.4125 19.4125C17.0208 19.8042 16.55 20 16 20H2ZM2 18H16V8H2V18ZM2 6H16V4H2V6ZM2 6V4V6ZM9 12C8.71667 12 8.47917 11.9042 8.2875 11.7125C8.09583 11.5208 8 11.2833 8 11C8 10.7167 8.09583 10.4792 8.2875 10.2875C8.47917 10.0958 8.71667 10 9 10C9.28333 10 9.52083 10.0958 9.7125 10.2875C9.90417 10.4792 10 10.7167 10 11C10 11.2833 9.90417 11.5208 9.7125 11.7125C9.52083 11.9042 9.28333 12 9 12ZM5 12C4.71667 12 4.47917 11.9042 4.2875 11.7125C4.09583 11.5208 4 11.2833 4 11C4 10.7167 4.09583 10.4792 4.2875 10.2875C4.47917 10.0958 4.71667 10 5 10C5.28333 10 5.52083 10.0958 5.7125 10.2875C5.90417 10.4792 6 10.7167 6 11C6 11.2833 5.90417 11.5208 5.7125 11.7125C5.52083 11.9042 5.28333 12 5 12ZM13 12C12.7167 12 12.4792 11.9042 12.2875 11.7125C12.0958 11.5208 12 11.2833 12 11C12 10.7167 12.0958 10.4792 12.2875 10.2875C12.4792 10.0958 12.7167 10 13 10C13.2833 10 13.5208 10.0958 13.7125 10.2875C13.9042 10.4792 14 10.7167 14 11C14 11.2833 13.9042 11.5208 13.7125 11.7125C13.5208 11.9042 13.2833 12 13 12ZM9 16C8.71667 16 8.47917 15.9042 8.2875 15.7125C8.09583 15.5208 8 15.2833 8 15C8 14.7167 8.09583 14.4792 8.2875 14.2875C8.47917 14.0958 8.71667 14 9 14C9.28333 14 9.52083 14.0958 9.7125 14.2875C9.90417 14.4792 10 14.7167 10 15C10 15.2833 9.90417 15.5208 9.7125 15.7125C9.52083 15.9042 9.28333 16 9 16ZM5 16C4.71667 16 4.47917 15.9042 4.2875 15.7125C4.09583 15.5208 4 15.2833 4 15C4 14.7167 4.09583 14.4792 4.2875 14.2875C4.47917 14.0958 4.71667 14 5 14C5.28333 14 5.52083 14.0958 5.7125 14.2875C5.90417 14.4792 6 14.7167 6 15C6 15.2833 5.90417 15.5208 5.7125 15.7125C5.52083 15.9042 5.28333 16 5 16ZM13 16C12.7167 16 12.4792 15.9042 12.2875 15.7125C12.0958 15.5208 12 15.2833 12 15C12 14.7167 12.0958 14.4792 12.2875 14.2875C12.4792 14.0958 12.7167 14 13 14C13.2833 14 13.5208 14.0958 13.7125 14.2875C13.9042 14.4792 14 14.7167 14 15C14 15.2833 13.9042 15.5208 13.7125 15.7125C13.5208 15.9042 13.2833 16 13 16Z"
                fill="#561FF9"
            />
        </svg>
    );
}

function DeactivateCard({ onDeleteForever }: { onDeleteForever: () => void }) {
    return (
        <div className="bg-red-50 border border-red-300 p-6 rounded-2xl transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,56,56,0.35)] hover:border-red-500 hover:bg-[rgba(255,56,56,0.12)]">
            <div className="text-red-600 font-semibold mb-1">Deactivate Account</div>
            <div className="text-sm text-gray-500 mb-4">
                This will permanently delete your expense data and linked bank accounts.
            </div>
            <button
                type="button"
                onClick={onDeleteForever}
                className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 hover:shadow-[0_0_20px_rgba(255,56,56,0.5)] transition-all duration-200"
            >
                Delete Forever
            </button>
        </div>
    );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-4">
            <div className="text-xs text-accent font-semibold">{title}</div>
            {children}
        </div>
    );
}

function Row({
    icon,
    label,
    sub,
    onClick,
}: {
    icon?: React.ReactNode;
    label: string;
    sub?: string;
    onClick?: () => void;
}) {
    const clickable = typeof onClick === 'function';

    return (
        <div
            className="flex justify-between items-center p-3 rounded-lg cursor-pointer transition-all duration-200 bg-white border border-gray-200 hover:shadow-[0_0_15px_rgba(87,88,252,0.2)]"
            onClick={onClick}
            role={clickable ? 'button' : undefined}
            tabIndex={clickable ? 0 : undefined}
            onKeyDown={
                clickable
                    ? (e) => {
                          if (e.key === 'Enter' || e.key === ' ') onClick();
                      }
                    : undefined
            }
        >
            <div className="flex items-center gap-3">
                {icon && <div>{icon}</div>}
                <div>
                    <div className="text-sm font-semibold">{label}</div>
                    {sub !== undefined && <div className="text-xs text-secondary">{sub}</div>}
                </div>
            </div>
            <div className="text-gray-400">{'>'}</div>
        </div>
    );
}

function Toggle({
    icon,
    label,
    sub,
    active,
}: {
    icon?: React.ReactNode;
    label: string;
    sub?: string;
    active?: boolean;
}) {
    const [isOn, setIsOn] = useState(Boolean(active));

    return (
        <button
            type="button"
            onClick={() => setIsOn((v) => !v)}
            className="w-full flex justify-between items-center p-3 rounded-lg bg-white border border-gray-200 transition-all duration-200 hover:shadow-[0_0_15px_rgba(87,88,252,0.2)] hover:bg-[rgba(87,88,252,0.08)]"
        >
            <div className="flex items-center gap-3 text-left">
                {icon && <div>{icon}</div>}
                <div>
                    <div className="text-sm font-semibold">{label}</div>
                    {sub !== undefined && <div className="text-xs text-secondary">{sub}</div>}
                </div>
            </div>
            <div className={`w-10 h-5 rounded-full ${isOn ? 'bg-accent' : 'bg-gray-300'} relative transition-all duration-200`}>
                <div
                    className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all duration-200 ${isOn ? 'right-0.5' : 'left-0.5'}`}
                />
            </div>
        </button>
    );
}

function Modal({
    isOpen,
    onClose,
    title,
    children,
}: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            role="presentation"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-label={title}
                className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-accent">{title}</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Close"
                    >
                        <Icon src="/img/icons/x.svg" className="h-5 w-5" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

export default function SettingsPage() {
    const { data: profile } = useProfile();

    const [name, setName] = useState(profile?.name ?? 'Alex Chen');
    const [email, setEmail] = useState(profile?.email ?? 'alex.j@university.edu');
    const [currency, setCurrency] = useState(profile?.default_currency ?? 'ETB');
    const [language, setLanguage] = useState('English (US)');
    const [appearance, setAppearance] = useState<AppearanceMode>('System');
    const [frequency, setFrequency] = useState<(typeof frequencyOptions)[number]>('Monthly');
    const [profileImage, setProfileImage] = useState('/img/default-avatar.jpg');
    const [budgetAmount, setBudgetAmount] = useState('1250.00');
    const [startDate, setStartDate] = useState(new Date());
    const [calendarMonth, setCalendarMonth] = useState(new Date(startDate.getFullYear(), startDate.getMonth(), 1));

    const [showYearMonthPicker, setShowYearMonthPicker] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const [modal, setModal] = useState<ModalState>({ open: false, type: '', value: null });

    // Keep display state in sync once the profile loads.
    useEffect(() => {
        if (!profile) return;
        setName(profile.name ?? 'Alex Chen');
        setEmail(profile.email ?? 'alex.j@university.edu');
        setCurrency(profile.default_currency ?? 'ETB');
    }, [profile]);

    const openModal = (type: ModalType) => {
        if (type === 'date') {
            setCalendarMonth(new Date(startDate.getFullYear(), startDate.getMonth(), 1));
            setModal({ open: true, type, value: startDate });
            return;
        }

        const currentValue =
            type === 'email'
                ? email
                : type === 'currency'
                  ? currency
                  : type === 'language'
                    ? language
                    : type === 'name'
                      ? name
                      : type === 'frequency'
                        ? frequency
                        : '';

        setModal({ open: true, type, value: currentValue });
    };

    const closeModal = () => {
        setModal({ open: false, type: '', value: null });
        setShowYearMonthPicker(false);
    };

    const saveModal = () => {
        if (modal.value === null) {
            closeModal();
            return;
        }

        if (modal.type === 'name' && typeof modal.value === 'string') setName(modal.value);
        else if (modal.type === 'email' && typeof modal.value === 'string') setEmail(modal.value);
        else if (modal.type === 'currency' && typeof modal.value === 'string') setCurrency(modal.value);
        else if (modal.type === 'language' && typeof modal.value === 'string') setLanguage(modal.value);
        else if (modal.type === 'frequency' && typeof modal.value === 'string') setFrequency(modal.value as any);
        else if (modal.type === 'date' && modal.value instanceof Date) setStartDate(modal.value);

        closeModal();
    };

    const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const;
    const curMonth = calendarMonth.getMonth();
    const curYear = calendarMonth.getFullYear();
    const firstDayOfMonth = new Date(curYear, curMonth, 1).getDay();
    const daysInMonth = new Date(curYear, curMonth + 1, 0).getDate();
    const totalCells = firstDayOfMonth + daysInMonth;
    const numRows = Math.ceil(totalCells / 7);

    const selectedDate = modal.open && modal.type === 'date' && modal.value instanceof Date ? modal.value : null;

    const modalTitle =
        modal.type === 'name'
            ? 'Edit Name'
            : modal.type === 'email'
              ? 'Edit Email Address'
              : modal.type === 'currency'
                ? 'Edit Default Currency'
                : modal.type === 'language'
                  ? 'Edit App Language'
                  : modal.type === 'frequency'
                    ? 'Select Tracking Period'
                    : 'Select Start Date';

    return (
        <div className="pt-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Settings</h1>
                <p className="mt-1 text-secondary">Tailor SpendWise to work exactly for you!</p>
            </header>

            {/* Profile */}
            <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <div className="relative group w-14 h-14 rounded-full overflow-hidden">
                        <img src={profileImage} alt={`${name} profile`} className="w-14 h-14 rounded-full object-cover" />
                        <button
                            type="button"
                            onClick={() => document.getElementById('profileImageInput')?.click()}
                            className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 text-white flex items-center justify-center transition"
                            title="Change profile picture"
                        >
                            ✎
                        </button>
                        <input
                            id="profileImageInput"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) setProfileImage(URL.createObjectURL(file));
                            }}
                        />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 font-semibold text-gray-900">
                            {name}
                            <button
                                type="button"
                                onClick={() => openModal('name')}
                                className="text-gray-400 hover:text-accent transition p-1 rounded-full hover:bg-gray-100"
                                aria-label="Edit name"
                            >
                                ✎
                            </button>
                        </div>
                        <div className="text-secondary text-sm">{email}</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <Card title="ACCOUNT">
                        <Row icon={<EmailIcon />} label="Email Address" sub={email} onClick={() => openModal('email')} />
                        <Row
                            icon={<CurrencyIcon />}
                            label="Default Currency"
                            sub={currency}
                            onClick={() => openModal('currency')}
                        />
                        <Row
                            icon={<LanguageIcon />}
                            label="App Language"
                            sub={language}
                            onClick={() => openModal('language')}
                        />
                    </Card>

                    <Card title="NOTIFICATIONS">
                        <Toggle icon={<DailyAlertsIcon />} label="Daily Alerts" sub="Morning summary of yesterday’s spend" active />
                        <Toggle icon={<ReportIcon />} label="Weekly Reports" sub="Detailed analysis of your weekly budget" />
                        <Toggle icon={<ReportIcon />} label="Monthly Reports" sub="Detailed analysis of your monthly budget" />
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card title="PREFERENCES">
                        <div className="space-y-4">
                            <Row
                                icon={<CategoryIcon />}
                                label="Category Editor"
                                sub="Manage your custom labels and icons"
                            />

                            <div className="flex items-center justify-between">
                                <div className="text-sm font-medium flex items-center gap-2">
                                    <AppearanceIcon />
                                    Appearance
                                </div>
                                <div className="flex gap-2">
                                    {appearanceOptions.map((btn) => (
                                        <button
                                            key={btn}
                                            type="button"
                                            onClick={() => setAppearance(btn)}
                                            className={`px-3 py-1 rounded-lg border text-xs transition-colors ${
                                                appearance === btn
                                                    ? 'bg-accent text-white border-accent'
                                                    : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                                            }`}
                                        >
                                            {btn}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card title="BUDGET & REMINDERS">
                        <div className="flex gap-3 items-center flex-wrap">
                            <div className="flex items-center bg-graybg px-3 py-2 rounded-lg border border-gray-200">
                                <span className="text-gray-500">{currency.includes('ETB') ? 'ETB' : '$'}</span>
                                <input
                                    className="bg-transparent outline-none ml-2 w-28 text-sm"
                                    value={budgetAmount}
                                    inputMode="decimal"
                                    pattern="[0-9]*"
                                    onKeyDown={(e) => {
                                        const allowed = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab', '.'];
                                        if (/^[0-9]$/.test(e.key) || allowed.includes(e.key)) return;
                                        e.preventDefault();
                                    }}
                                    onChange={(e) => {
                                        let value = e.target.value;
                                        value = value.replace(/[^0-9.]/g, '');
                                        const parts = value.split('.');
                                        if (parts.length > 2) value = parts[0] + '.' + parts.slice(1).join('');
                                        setBudgetAmount(value);
                                    }}
                                    placeholder="0.00"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={() => openModal('date')}
                                className="border px-4 py-2 rounded-lg hover:bg-gray-100 flex items-center gap-2"
                            >
                                <CalendarIcon />
                                {startDate.toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                })}
                            </button>

                            <button
                                type="button"
                                onClick={() => openModal('frequency')}
                                className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent/95 transition-colors"
                            >
                                {frequency}
                            </button>
                        </div>

                        <Toggle icon={<DebtRemindersIcon />} label="Debt Reminders" sub="Notify me when payments are due" active />
                    </Card>

                    <DeactivateCard onDeleteForever={() => setShowDeleteConfirm(true)} />
                </div>
            </div>

            <Modal
                isOpen={modal.open}
                onClose={closeModal}
                title={modalTitle}
            >
                <div className="space-y-4">
                    {modal.type === 'email' && typeof modal.value === 'string' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                value={modal.value}
                                onChange={(e) => setModal({ ...modal, value: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-transparent"
                                placeholder="Enter your email"
                            />
                        </div>
                    )}

                    {modal.type === 'currency' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Default Currency</label>
                            <div className="grid grid-cols-2 gap-2">
                                {['USD ($)', 'EUR (€)', 'GBP (£)', 'JPY (¥)', 'BIRR', 'ETB'].map((curr) => {
                                    const picked = modal.value === curr;
                                    return (
                                        <button
                                            key={curr}
                                            type="button"
                                            onClick={() => setModal({ ...modal, value: curr })}
                                            className={`px-3 py-2 border rounded-lg transition-colors ${
                                                picked ? 'border-accent bg-accent text-white' : 'border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            {curr}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {modal.type === 'language' && typeof modal.value === 'string' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">App Language</label>
                            <div className="grid grid-cols-2 gap-2">
                                {['English (US)', 'Spanish', 'French', 'German', 'Chinese', 'Arabic'].map((lang) => (
                                    <button
                                        key={lang}
                                        type="button"
                                        onClick={() => setModal({ ...modal, value: lang })}
                                        className={`px-3 py-2 border rounded-lg transition-colors ${
                                            modal.value === lang ? 'border-accent bg-accent text-white' : 'border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        {lang}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {modal.type === 'frequency' && (
                        <div className="space-y-3">
                            <p className="text-sm text-gray-600">Choose your tracking cadence for budget & reminders.</p>
                            {frequencyOptions.map((option) => (
                                <button
                                    key={option}
                                    type="button"
                                    onClick={() => setModal({ ...modal, value: option })}
                                    className={`w-full text-left border rounded-xl p-3 flex items-center justify-between transition-colors ${
                                        modal.value === option
                                            ? 'bg-accent text-white border-accent'
                                            : 'border-gray-200 bg-white hover:bg-gray-100'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl" aria-hidden>
                                            <CalendarIcon />
                                        </span>
                                        <div>
                                            <div className="font-semibold">{option}</div>
                                            <div className="text-xs text-gray-500">
                                                {option === 'Daily'
                                                    ? 'Track day by day'
                                                    : option === 'Weekly'
                                                      ? 'Every 7-day cycle'
                                                      : 'Default tracking'}
                                            </div>
                                        </div>
                                    </div>
                                    {modal.value === option && <span className="text-lg">✓</span>}
                                </button>
                            ))}
                        </div>
                    )}

                    {modal.type === 'name' && typeof modal.value === 'string' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                value={modal.value}
                                onChange={(e) => setModal({ ...modal, value: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-transparent"
                                placeholder="Enter your full name"
                            />
                        </div>
                    )}

                    {modal.type === 'date' && (
                        <div className="space-y-4 min-h-[420px]">
                            <div className="flex items-center justify-between">
                                <button
                                    type="button"
                                    onClick={() => setCalendarMonth(new Date(curYear, curMonth - 1, 1))}
                                    className="text-gray-500 hover:text-accent"
                                >
                                    ←
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowYearMonthPicker(true)}
                                    className="font-semibold text-lg text-accent hover:text-accent/90"
                                >
                                    {calendarMonth.toLocaleString(undefined, { month: 'long' })} {curYear}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setCalendarMonth(new Date(curYear, curMonth + 1, 1))}
                                    className="text-gray-500 hover:text-accent"
                                >
                                    →
                                </button>
                            </div>

                            {showYearMonthPicker ? (
                                <div className="rounded-xl border border-gray-200 p-3">
                                    <div className="grid grid-cols-3 gap-2 mb-3">
                                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(
                                            (m, i) => {
                                                const picked = curMonth === i;
                                                return (
                                                    <button
                                                        key={m}
                                                        type="button"
                                                        onClick={() => setCalendarMonth(new Date(curYear, i, 1))}
                                                        className={`px-2 py-1 rounded-lg text-sm font-medium ${
                                                            picked ? 'bg-accent text-white' : 'border border-gray-300 hover:bg-gray-100'
                                                        }`}
                                                    >
                                                        {m}
                                                    </button>
                                                );
                                            }
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <button
                                            type="button"
                                            onClick={() => setCalendarMonth(new Date(curYear - 1, curMonth, 1))}
                                            className="px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-100"
                                        >
                                            Prev Year
                                        </button>
                                        <span className="text-sm font-semibold">{curYear}</span>
                                        <button
                                            type="button"
                                            onClick={() => setCalendarMonth(new Date(curYear + 1, curMonth, 1))}
                                            className="px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-100"
                                        >
                                            Next Year
                                        </button>
                                    </div>
                                    <div className="mt-3 text-right">
                                        <button
                                            type="button"
                                            onClick={() => setShowYearMonthPicker(false)}
                                            className="px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-100"
                                        >
                                            Done
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-7 text-center text-xs text-gray-500">
                                        {daysOfWeek.map((day) => (
                                            <div key={day} className="py-1">
                                                {day}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-7 gap-1 text-center h-60">
                                        {Array.from({ length: numRows * 7 }, (_, idx) => {
                                            const day = idx - firstDayOfMonth + 1;
                                            const isValid = day >= 1 && day <= daysInMonth;
                                            const isSelected =
                                                !!selectedDate &&
                                                isValid &&
                                                selectedDate.getDate() === day &&
                                                selectedDate.getMonth() === curMonth &&
                                                selectedDate.getFullYear() === curYear;

                                            return (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    disabled={!isValid}
                                                    onClick={() => {
                                                        if (!isValid) return;
                                                        setModal({ ...modal, value: new Date(curYear, curMonth, day) });
                                                    }}
                                                    className={`h-9 rounded-lg ${
                                                        isValid ? 'hover:bg-accent hover:text-white' : ''
                                                    } ${isSelected ? 'bg-accent text-white' : ''}`}
                                                >
                                                    {isValid ? day : ''}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                                        <button
                                            type="button"
                                            onClick={() => setModal({ ...modal, value: new Date() })}
                                            className="text-accent font-semibold"
                                        >
                                            Today
                                        </button>
                                        <div className="text-sm text-gray-500">
                                            Selected:{' '}
                                            {selectedDate
                                                ? selectedDate.toLocaleDateString('en-US', {
                                                      month: 'short',
                                                      day: 'numeric',
                                                      year: 'numeric',
                                                  })
                                                : 'None'}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    <div className="flex gap-3 justify-end">
                        <button
                            type="button"
                            onClick={() => {
                                setShowYearMonthPicker(false);
                                closeModal();
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setShowYearMonthPicker(false);
                                saveModal();
                            }}
                            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/95 transition-colors"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                title="Delete Forever — Confirm"
            >
                <div className="space-y-4">
                    <p className="text-sm font-semibold text-red-700">This action is permanent.</p>
                    <p className="text-sm text-red-500">
                        All of your SpendWise data will be irreversibly deleted, including expenses, budgets, reminders, and linked accounts. This cannot be undone.
                    </p>
                    <p className="text-xs text-red-600">You will lose all historical and future tracking data immediately.</p>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setShowDeleteConfirm(false)}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                // Design-only placeholder. Wire to your backend delete account flow when available.
                                alert('Account deleted permanently. All data is lost.');
                                setShowDeleteConfirm(false);
                            }}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Delete Forever
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
