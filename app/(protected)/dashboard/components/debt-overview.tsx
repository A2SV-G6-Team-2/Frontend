'use client';

import { useDebts } from '@/lib/api/hooks/useDebts';
import { useProfile } from '@/lib/api/hooks/useUser';
import { useMemo } from 'react';

export default function DebtOverview({ className = "" }: { className?: string }) {
    const { data: debts, isLoading } = useDebts();
    const { data: profile } = useProfile();
    const currency = profile?.default_currency || 'ETB';

    const netDebt = useMemo(() => {
        if (!debts || !Array.isArray(debts)) return 0;
        return debts.reduce((acc, debt) => {
            if (debt.status === 'paid') return acc;
            const amount = debt.amount || 0;
            return debt.type === 'lent' ? acc + amount : acc - amount;
        }, 0);
    }, [debts]);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(val);
    };

    const formattedNetDebt = formatCurrency(Math.abs(netDebt));
    const netDebtSign = netDebt >= 0 ? '+' : '-';

    return (
        <div className={`bg-white w-full rounded-xl shadow mt-5 p-4 ${className}`}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-black">Debt Overview</h2>
                <span className={`text-sm font-medium ${netDebt >= 0 ? 'text-green-500' : 'text-pink-500'}`}>
                    Net Debt : {netDebtSign}{formattedNetDebt}
                </span>
            </div>
            
            <div className="w-full overflow-x-auto max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 min-h-[150px]">
                <table className="w-full border-separate border-spacing-0 text-left text-sm">
                    <thead className="sticky top-0 z-10">
                        <tr className="bg-gray-50">
                            <th className="rounded-l-xl px-6 py-4 font-medium text-gray-500">Person</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Type</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Date</th>
                            <th className="rounded-r-xl px-6 py-4 font-medium text-gray-500 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-10 text-center text-gray-500 italic">
                                    Loading debts...
                                </td>
                            </tr>
                        ) : !debts || !Array.isArray(debts) || debts.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-10 text-center text-gray-400 italic">
                                    No debts found.
                                </td>
                            </tr>
                        ) : (
                            debts.map((item, index) => (
                                <tr key={index}>
                                    <td className="border-gray-100 border-b px-6 py-4 font-medium text-gray-900">{item.peer_name}</td>
                                    <td className="border-gray-100 border-b px-6 py-4">
                                        <span className={`inline-flex items-center justify-center rounded-full px-8 py-1.5 text-xs font-medium capitalize ${
                                            item.type === 'lent' 
                                            ? 'bg-blue-50 text-blue-500' 
                                            : 'bg-pink-50 text-pink-500'
                                        }`}>
                                            {item.type}
                                        </span>
                                    </td>
                                    <td className="border-gray-100 border-b px-6 py-4 text-gray-800">
                                        {item.due_date ? new Date(item.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                                    </td>
                                    <td className={`border-gray-100 border-b px-6 py-4 font-medium text-right ${
                                        item.type === 'lent' ? 'text-blue-500' : 'text-pink-500'
                                    }`}>
                                        {formatCurrency(item.amount || 0)}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
