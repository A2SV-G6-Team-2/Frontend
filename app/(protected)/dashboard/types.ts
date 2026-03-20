export type SpendingPeriod = 'Daily' | 'Weekly' | 'Monthly';

export interface SpendingItem {
    person: string;
    type: string;
    date: string;
    amount: string;
    typeColor: string;
}

export interface DebtItem {
    person: string;
    type: 'Lent' | 'Borrowed';
    date: string;
    amount: string;
}

export interface CategoryItem {
    name: string;
    percentage: number;
    color: string;
}

export interface CategoryBreakdownData {
    total: number;
    items: CategoryItem[];
}
