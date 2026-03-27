import Link from 'next/link';
import Icon from '@/components/icon';

export default function QuickActions({ onAddExpense }: { onAddExpense?: () => void }) {
    return (
        <div className="bg-white w-full rounded-xl shadow mt-5 p-4">
            <h2 className="text-2xl font-bold">Quick Actions</h2>
            <div className='m-2 flex justify-center gap-6'>
                <button
                    type="button"
                    onClick={onAddExpense}
                    className="flex h-30 w-30 flex-col items-center justify-center rounded-full bg-accent text-white shadow-lg shadow-accent/30 transition-all hover:scale-105 hover:bg-accent/95 hover:shadow-accent/40 cursor-pointer"
                >
                    <div className="mb-2 mt-2 flex items-center justify-center">
                        <Icon src="/img/icons/plus.svg" className="h-10 w-10" />
                    </div>
                    <div className="flex h-10 w-24 items-start justify-center text-center">
                        <span className="text-sm font-semibold leading-tight tracking-wide">
                            Add Expense
                        </span>
                    </div>
                </button>
                <Link
                    href='/settings'
                    className="flex h-30 w-30 flex-col items-center justify-center rounded-full bg-accent text-white shadow-lg shadow-accent/30 transition-all hover:scale-105 hover:bg-accent/95 hover:shadow-accent/40 cursor-pointer"
                >
                    <div className="mb-2 mt-2 flex items-center justify-center">
                        <Icon src="/img/icons/user.svg" className="h-10 w-10" />
                    </div>
                    <div className="flex h-10 w-24 items-start justify-center text-center">
                        <span className="text-sm font-semibold leading-tight tracking-wide">
                            My Profile
                        </span>
                    </div>
                </Link>
                <Link
                    href='/log#download-reports'
                    className="flex h-30 w-30 flex-col items-center justify-center rounded-full bg-accent text-white shadow-lg shadow-accent/30 transition-all hover:scale-105 hover:bg-accent/95 hover:shadow-accent/40 cursor-pointer"
                >
                    <div className="mb-2 mt-2 flex items-center justify-center">
                        <Icon src="/img/icons/report.svg" className="h-10 w-10" />
                    </div>
                    <div className="flex h-10 w-24 items-start justify-center text-center">
                        <span className="text-sm font-semibold leading-tight tracking-wide">
                            Download Reports
                        </span>
                    </div>
                </Link>
            </div>
        </div>
    );
}
