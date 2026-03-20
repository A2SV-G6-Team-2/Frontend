"use client"
import { useState } from 'react'
import WelcomeHeader from './components/welcome-header'
import QuickActions from './components/quick-actions'
import SpendingsTable from './components/spendings-table'
import RecentSpendings from './components/recent-spendings'
import { spendingData } from './constants'
import type { SpendingPeriod } from './types'
import DebtOverview from './components/debt-overview'
import CategoryBreakdown from './components/category-breakdown'

export default function DashboardPage() {
    const [spendingPeriod, setSpendingPeriod] = useState<SpendingPeriod>('Weekly');
    const [categoryPeriod, setCategoryPeriod] = useState<SpendingPeriod>('Weekly');

    const currentSpendingData = spendingData[spendingPeriod];

    return (
        <div className="pt-8">
            <WelcomeHeader username="Username" />

            <div className="xl:grid grid-cols-2 gap-5 items-stretch">
                <div className="flex flex-col">
                    <QuickActions />
                    <SpendingsTable
                        activePeriod={spendingPeriod}
                        setActivePeriod={setSpendingPeriod}
                        currentData={currentSpendingData}
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
        </div>
    );
}
