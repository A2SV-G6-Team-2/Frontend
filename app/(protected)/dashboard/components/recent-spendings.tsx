'use client';

import { useExpenses } from '@/lib/api/hooks/useExpenses';
import { useProfile } from '@/lib/api/hooks/useUser';
import { useMemo } from 'react';

export default function RecentSpendings() {
    const { data: profile } = useProfile();
    const currency = profile?.default_currency || 'ETB';

    const now = new Date();
    
    // Helper to format date to YYYY-MM-DD in local time
    const toLocalISO = (date: Date) => {
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - (offset * 60 * 1000));
        return localDate.toISOString().split('T')[0];
    };

    const todayStr = toLocalISO(now);

    // Today
    const { 
        data: todayExpenses, 
        isLoading: loadingToday
    } = useExpenses({ from_date: todayStr, to_date: todayStr });

    // This Week
    const startOfWeek = new Date(now);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    const startOfWeekStr = toLocalISO(startOfWeek);
    const { data: weekExpenses, isLoading: loadingWeek } = useExpenses({ from_date: startOfWeekStr, to_date: todayStr });

    // This Month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfMonthStr = toLocalISO(startOfMonth);
    const { data: monthExpenses, isLoading: loadingMonth } = useExpenses({ from_date: startOfMonthStr, to_date: todayStr });

    const todayTotal = useMemo(() => 
        todayExpenses?.reduce((acc, exp) => acc + (Number(exp.amount) || 0), 0) || 0
    , [todayExpenses]);

    const weekTotal = useMemo(() => 
        weekExpenses?.reduce((acc, exp) => acc + (Number(exp.amount) || 0), 0) || 0
    , [weekExpenses]);

    const monthTotal = useMemo(() => 
        monthExpenses?.reduce((acc, exp) => acc + (Number(exp.amount) || 0), 0) || 0
    , [monthExpenses]);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(val);
    };

    return (
        <div className="bg-white w-full rounded-xl shadow mt-5 p-4">
            <h2 className="text-2xl font-bold">Recent Spendings</h2>
            <div className='m-2 flex justify-center gap-6'>
                {/* Today */}
                <div className="flex h-40 w-40 flex-col items-center justify-center rounded-full bg-green-100/60 text-center p-2">
                    <span className="text-2xl font-extrabold tracking-tight text-green-500 break-all">
                        {loadingToday ? '...' : formatCurrency(todayTotal)}
                    </span>
                    <span className="mt-1 text-sm font-bold text-green-500">
                        Today
                    </span>
                </div>

                {/* This Week */}
                <div className="flex h-40 w-40 flex-col items-center justify-center rounded-full bg-yellow-100/60 text-center p-2">
                    <span className="text-2xl font-extrabold tracking-tight text-yellow-500 break-all">
                        {loadingWeek ? '...' : formatCurrency(weekTotal)}
                    </span>
                    <span className="mt-1 text-sm font-bold text-yellow-500">
                        This Week
                    </span>
                </div>
            </div>
            <div className='m-2 flex justify-center gap-6'>
                {/* This Month */}
                <div className="flex h-40 w-40 flex-col items-center justify-center rounded-full bg-red-100/60 text-center p-2">
                    <span className="text-2xl font-extrabold tracking-tight text-pink-500 break-all">
                        {loadingMonth ? '...' : formatCurrency(monthTotal)}
                    </span>
                    <span className="mt-1 text-sm font-bold text-pink-500">
                        This month
                    </span>
                </div>
            </div>
        </div>
    );
}
