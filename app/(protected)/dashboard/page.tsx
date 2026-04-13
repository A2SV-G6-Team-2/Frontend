"use client"
import { useState, useMemo } from 'react'
import WelcomeHeader from './components/welcome-header'
import QuickActions from './components/quick-actions'
import SpendingsTable from './components/spendings-table'
import RecentSpendings from './components/recent-spendings'
import type { SpendingPeriod, SpendingItem } from './types'
import DebtOverview from './components/debt-overview'
import CategoryBreakdown from './components/category-breakdown'
import { useProfile } from '@/lib/api/hooks/useUser'
import { useExpenses } from '@/lib/api/hooks/useExpenses'
import { useCategories } from '@/lib/api/hooks/useCategories'
import TransactionModal from './components/transaction-modal'
import { getCategoryColor } from '@/lib/utils/colors'

type ModalConfig = { isOpen: boolean; step: 'choice' | 'spending' | 'debt' };

export default function DashboardPage() {
    const [spendingPeriod, setSpendingPeriod] = useState<SpendingPeriod>('Weekly');
    const [categoryPeriod, setCategoryPeriod] = useState<SpendingPeriod>('Weekly');
    const [modalConfig, setModalConfig] = useState<ModalConfig>({ isOpen: false, step: 'choice' });

    const { data: profile } = useProfile();
    const { data: categories } = useCategories();

    const now = new Date();
    const toLocalISO = (date: Date): string => {
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - (offset * 60 * 1000));
        return localDate.toISOString().split('T')[0] ?? '';
    };

    const dateRange = useMemo(() => {
        const end = toLocalISO(now);
        let start = end;

        if (spendingPeriod === 'Weekly') {
            const startOfWeek = new Date(now);
            const day = startOfWeek.getDay();
            const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
            startOfWeek.setDate(diff);
            start = toLocalISO(startOfWeek);
        } else if (spendingPeriod === 'Monthly') {
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            start = toLocalISO(startOfMonth);
        }

        return { from_date: start, to_date: end };
    }, [spendingPeriod]);

    const { data: expenses, isLoading: loadingExpenses } = useExpenses(dateRange);

    const currentSpendingData: SpendingItem[] = useMemo(() => {
        if (!expenses || !Array.isArray(expenses)) return [];

        return expenses.map(exp => {
            const category = Array.isArray(categories) ? categories.find(c => c.id === exp.category_id) : undefined;
            const type = category?.name || 'Other';
            const typeColor = getCategoryColor(type || exp.note || '')?.classes ?? 'bg-gray-100 text-gray-700';

            const dateObj = new Date(exp.expense_date || '');
            const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

            const currency = profile?.default_currency || 'ETB';
            const formattedAmount = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currency,
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(exp.amount || 0);

            return {
                note: exp.note || '-',
                type: type,
                date: formattedDate,
                amount: formattedAmount,
                typeColor: typeColor
            };
        });
    }, [expenses, categories, profile]);

    return (
        <div className="pt-8">
            <WelcomeHeader 
                username={profile?.name || "Username"} 
                onAddClick={() => setModalConfig({ isOpen: true, step: 'choice' })}
            />

            <div className="xl:grid grid-cols-2 gap-5 items-stretch">
                <div className="flex flex-col">
                    <QuickActions 
                        onAddExpense={() => setModalConfig({ isOpen: true, step: 'spending' })}
                    />
                    <SpendingsTable
                        activePeriod={spendingPeriod}
                        setActivePeriod={setSpendingPeriod}
                        currentData={currentSpendingData}
                        isLoading={loadingExpenses}
                    />
                    <DebtOverview className="flex-1" />
                </div>
                <div className="flex flex-col">
                    <RecentSpendings />
                    <CategoryBreakdown
                        activePeriod={categoryPeriod}
                        setActivePeriod={setCategoryPeriod}
                        className="flex-1"
                    />
                </div>
            </div>

            <TransactionModal 
                isOpen={modalConfig.isOpen} 
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                initialStep={modalConfig.step}
            />
        </div>
    );
}

