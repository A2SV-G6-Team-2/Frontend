import type { SpendingPeriod, SpendingItem, DebtItem, CategoryBreakdownData } from './types';

export const spendingData: Record<SpendingPeriod, SpendingItem[]> = {
    Daily: [
        { note: 'Dave', type: 'Drink', date: 'Jan 21st, 2026', amount: '$15', typeColor: 'bg-blue-100/50 text-blue-600' },
        { note: 'Dave', type: 'Food', date: 'Jan 21st, 2026', amount: '$37', typeColor: 'bg-pink-100/60 text-pink-600' },
    ],
    Weekly: [
        { note: 'Dave', type: 'Drink', date: 'Jan 21st, 2026', amount: '$15', typeColor: 'bg-blue-100/50 text-blue-600' },
        { note: 'Dave', type: 'Food', date: 'Jan 21st, 2026', amount: '$37', typeColor: 'bg-pink-100/60 text-pink-600' },
        { note: 'Dave', type: 'Drink', date: 'Jan 20th, 2026', amount: '$15', typeColor: 'bg-blue-100/50 text-blue-600' },
        { note: 'Dave', type: 'Drink', date: 'Jan 19th, 2026', amount: '$15', typeColor: 'bg-blue-100/50 text-blue-600' },
    ],
    Monthly: [
        { note: 'Dave', type: 'Drink', date: 'Jan 21st, 2026', amount: '$15', typeColor: 'bg-blue-100/50 text-blue-600' },
        { note: 'Dave', type: 'Food', date: 'Jan 15th, 2026', amount: '$37', typeColor: 'bg-pink-100/60 text-pink-600' },
        { note: 'Dave', type: 'Drink', date: 'Jan 10th, 2026', amount: '$15', typeColor: 'bg-blue-100/50 text-blue-600' },
        { note: 'Dave', type: 'Drink', date: 'Jan 5th, 2026', amount: '$15', typeColor: 'bg-blue-100/50 text-blue-600' },
        { note: 'Dave', type: 'Rent', date: 'Jan 1st, 2026', amount: '$1200', typeColor: 'bg-purple-100/50 text-purple-600' },
    ]
}

export const debtData: DebtItem[] = [
    { person: 'Dave', type: 'Lent', date: 'Jan 21st, 2026', amount: '$15' },
    { person: 'Dave', type: 'Borrowed', date: 'Jan 21st, 2026', amount: '-$15' },
    { person: 'Dave', type: 'Lent', date: 'Jan 21st, 2026', amount: '$15' },
    { person: 'Dave', type: 'Lent', date: 'Jan 21st, 2026', amount: '$15' },
]

export const categoryBreakdownData: Record<SpendingPeriod, CategoryBreakdownData> = {
    Daily: {
        total: 52,
        items: [
            { name: 'Food', percentage: 71.15, color: '#f59e0b' },
            { name: 'Drink', percentage: 28.85, color: '#3b82f6' },
        ]
    },
    Weekly: {
        total: 449,
        items: [
            { name: 'Food', percentage: 42.09, color: '#f59e0b' },
            { name: 'Drink', percentage: 21.16, color: '#3b82f6' },
            { name: 'Transport', percentage: 17.37, color: '#ec4899' },
            { name: 'Entertainment', percentage: 11.58, color: '#10b981' },
            { name: 'Supplies', percentage: 7.80, color: '#94a3b8' },
        ]
    },
    Monthly: {
        total: 2150,
        items: [
            { name: 'Rent', percentage: 55.81, color: '#8b5cf6' },
            { name: 'Food', percentage: 18.60, color: '#f59e0b' },
            { name: 'Drink', percentage: 9.30, color: '#3b82f6' },
            { name: 'Transport', percentage: 9.30, color: '#ec4899' },
            { name: 'Others', percentage: 6.99, color: '#94a3b8' },
        ]
    }
}
