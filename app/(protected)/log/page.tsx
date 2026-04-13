'use client';

import { useEffect, useMemo, useState } from 'react';
import Icon from '@/components/icon';
import { useCategories } from '@/lib/api/hooks/useCategories';
import { useCreateExpense, useDeleteExpense, useExpenses, useUpdateExpense } from '@/lib/api/hooks/useExpenses';
import { useProfile } from '@/lib/api/hooks/useUser';
import { getCategoryColor } from '@/lib/utils/colors';
import AddExpenseModal from './components/add-expense-modal';
import type { SaveExpensePayload } from './components/add-expense-modal';
import type { ExpenseLogRow } from './types';

const PAGE_SIZE = 7;
const BUDGET_STORAGE_KEY = 'spendwise_budget_amount';

const DESIGN_CATEGORY_PILL: Record<string, string> = {
    Subscription: 'bg-amber-100 text-amber-800',
    Drink: 'bg-sky-100 text-sky-700',
    Rent: 'bg-pink-100 text-pink-700',
    Food: 'bg-rose-100 text-rose-700',
    Transport: 'bg-emerald-100 text-emerald-700',
    Utilities: 'bg-cyan-100 text-cyan-700',
};

function categoryPillClass(name: string) {
    const fromDesign = DESIGN_CATEGORY_PILL[name];
    if (fromDesign !== undefined) return fromDesign;
    const meta = getCategoryColor(name);
    return meta?.classes ?? 'bg-gray-100 text-gray-700';
}

function toLocalISODate(d: Date) {
    const offset = d.getTimezoneOffset();
    const local = new Date(d.getTime() - offset * 60 * 1000);
    return local.toISOString().split('T')[0] ?? '';
}

function formatRangeLabel(from: string, to: string) {
    const a = new Date(from + 'T12:00:00');
    const b = new Date(to + 'T12:00:00');
    return `${a.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${b.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
}

function SearchIcon({ className }: { className?: string }) {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    );
}

function CalendarSmallIcon({ className }: { className?: string }) {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M8 2v4" />
            <path d="M16 2v4" />
            <rect width="18" height="18" x="3" y="4" rx="2" />
            <path d="M3 10h18" />
        </svg>
    );
}

function FilterIcon({ className }: { className?: string }) {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
    );
}

function PencilIcon({ className }: { className?: string }) {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            <path d="m15 5 4 4" />
        </svg>
    );
}

function TrashIcon({ className }: { className?: string }) {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
    );
}

function SummaryWalletIcon() {
    return (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <rect x="3" y="6" width="18" height="14" rx="2" stroke="#22c55e" strokeWidth="2" />
            <path d="M3 10h15a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H3" stroke="#22c55e" strokeWidth="2" />
            <circle cx="16" cy="13" r="1" fill="#22c55e" />
        </svg>
    );
}

function SummaryCardIcon() {
    return (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <rect x="2" y="5" width="20" height="14" rx="2" stroke="#ef4444" strokeWidth="2" />
            <path d="M2 10h20" stroke="#ef4444" strokeWidth="2" />
        </svg>
    );
}

function SummaryBillIcon() {
    return (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14 2v6h6" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 13h8M8 17h6" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

export default function LogPage() {
    const { data: profile } = useProfile();
    const currency = profile?.default_currency ?? 'USD';
    const [budgetAmount, setBudgetAmount] = useState<number | null>(null);

    useEffect(() => {
        const profileBudget = (profile as { budget_amount?: number } | undefined)?.budget_amount;
        if (typeof profileBudget === 'number' && Number.isFinite(profileBudget)) {
            setBudgetAmount(profileBudget);
            localStorage.setItem(BUDGET_STORAGE_KEY, profileBudget.toFixed(2));
            return;
        }

        const storedBudget = localStorage.getItem(BUDGET_STORAGE_KEY);
        if (storedBudget === null) {
            setBudgetAmount(null);
            return;
        }

        const parsed = Number.parseFloat(storedBudget);
        setBudgetAmount(Number.isFinite(parsed) ? parsed : null);
    }, [profile]);

    const dateRange = useMemo(() => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return { from_date: toLocalISODate(startOfMonth), to_date: toLocalISODate(endOfMonth) };
    }, []);

    const rangeLabel = useMemo(() => formatRangeLabel(dateRange.from_date, dateRange.to_date), [dateRange]);

    const { data: expenses, isLoading: loadingExpenses, isError: expensesError } = useExpenses(dateRange);
    const { data: categories, isLoading: loadingCategories } = useCategories();

    const createExpense = useCreateExpense();
    const updateExpense = useUpdateExpense();
    const deleteExpense = useDeleteExpense();

    const rows = useMemo((): ExpenseLogRow[] => {
        if (!expenses?.length) return [];
        const catById = new Map((categories ?? []).filter((c) => c.id).map((c) => [c.id as string, c.name ?? '']));

        return expenses
            .filter((e) => e.id)
            .map((e) => {
                const cid = e.category_id ?? '';
                return {
                    id: e.id as string,
                    description: (e.note ?? '').trim() || '—',
                    expenseDate: e.expense_date ?? '',
                    categoryId: cid,
                    categoryName: cid ? (catById.get(cid) ?? 'Uncategorized') : 'Uncategorized',
                    amount: e.amount ?? 0,
                };
            });
    }, [expenses, categories]);

    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [page, setPage] = useState(1);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<ExpenseLogRow | null>(null);

    const formatMoney = (n: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

    const formatDisplayDate = (iso: string) => {
        const d = new Date(iso + 'T12:00:00');
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return rows.filter((r) => {
            const matchesSearch =
                !q ||
                r.description.toLowerCase().includes(q) ||
                r.categoryName.toLowerCase().includes(q);
            const matchesCat = categoryFilter === 'all' || r.categoryId === categoryFilter;
            return matchesSearch && matchesCat;
        });
    }, [rows, search, categoryFilter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

    useEffect(() => {
        setPage((p) => Math.min(p, totalPages));
    }, [totalPages]);

    const totalSpent = useMemo(() => filtered.reduce((s, r) => s + r.amount, 0), [filtered]);
    const remainingBudget = useMemo(() => {
        if (budgetAmount === null) return null;
        return budgetAmount - totalSpent;
    }, [budgetAmount, totalSpent]);

    const safePage = Math.min(page, totalPages);
    const pageSlice = useMemo(() => {
        const start = (safePage - 1) * PAGE_SIZE;
        return filtered.slice(start, start + PAGE_SIZE);
    }, [filtered, safePage]);

    const rangeStart = filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
    const rangeEnd = Math.min(safePage * PAGE_SIZE, filtered.length);

    const toggleRow = (id: string) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const allOnPageSelected = pageSlice.length > 0 && pageSlice.every((r) => selectedIds.has(r.id));
    const togglePage = () => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (allOnPageSelected) {
                for (const r of pageSlice) next.delete(r.id);
            } else {
                for (const r of pageSlice) next.add(r.id);
            }
            return next;
        });
    };

    const openAdd = () => {
        setEditing(null);
        setModalOpen(true);
    };

    const openEdit = (row: ExpenseLogRow) => {
        setEditing(row);
        setModalOpen(true);
    };

    const handleSave = async (payload: SaveExpensePayload) => {
        if (payload.id) {
            await updateExpense.mutateAsync({
                id: payload.id,
                body: {
                    amount: payload.amount,
                    note: payload.description,
                    category_id: payload.categoryId ? payload.categoryId : null,
                    expense_date: payload.expenseDate,
                },
            });
        } else {
            await createExpense.mutateAsync({
                amount: payload.amount,
                note: payload.description,
                category_id: payload.categoryId ? payload.categoryId : null,
                expense_date: payload.expenseDate,
                is_recurring: false,
            });
        }
    };

    const handleDelete = async (id: string) => {
        await deleteExpense.mutateAsync(id);
        setSelectedIds((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
        });
    };

    const categoryOptions = useMemo(() => {
        return (categories ?? []).filter((c): c is { id: string; name?: string } => !!c.id).map((c) => ({ id: c.id, name: c.name ?? 'Category' }));
    }, [categories]);

    const listLoading = loadingExpenses || loadingCategories;
    const mutationBusy = createExpense.isPending || updateExpense.isPending || deleteExpense.isPending;

    return (
        <div className="pt-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Expenses</h1>
                <p className="mt-1 text-secondary">Keep track of your expenses</p>
            </header>

            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="flex flex-col rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="mb-3 flex items-start justify-between">
                        <span className="text-sm font-medium text-secondary">Monthly Budget</span>
                        <SummaryWalletIcon />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{budgetAmount === null ? '—' : formatMoney(budgetAmount)}</p>
                </div>
                <div className="flex flex-col rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="mb-3 flex items-start justify-between">
                        <span className="text-sm font-medium text-secondary">Total Spent</span>
                        <SummaryCardIcon />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{listLoading ? '…' : formatMoney(totalSpent)}</p>
                </div>
                <div className="flex flex-col rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="mb-3 flex items-start justify-between">
                        <span className="text-sm font-medium text-secondary">Remaining</span>
                        <SummaryBillIcon />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{remainingBudget === null ? '—' : formatMoney(remainingBudget)}</p>
                </div>
            </div>

            <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
                <div className="relative min-w-0 flex-1 lg:min-w-[240px]">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-secondary">
                        <SearchIcon className="h-5 w-5" />
                    </span>
                    <input
                        type="search"
                        placeholder="Search by description, category..."
                        className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm outline-none focus:border-accent/40 focus:ring-2 focus:ring-accent/15"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>
                <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-800 shadow-sm transition-colors hover:bg-gray-50"
                >
                    <CalendarSmallIcon className="h-5 w-5 text-secondary" />
                    {rangeLabel}
                </button>
                <div className="relative inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-800 shadow-sm">
                    <FilterIcon className="h-5 w-5 shrink-0 text-secondary" />
                    <select
                        aria-label="Filter by category"
                        className="cursor-pointer appearance-none bg-transparent pr-6 text-sm font-medium text-gray-800 outline-none"
                        value={categoryFilter}
                        onChange={(e) => {
                            setCategoryFilter(e.target.value);
                            setPage(1);
                        }}
                        disabled={listLoading}
                    >
                        <option value="all">Category</option>
                        {categoryOptions.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-secondary">
                        <Icon src="/img/icons/chevron-right.svg" className="h-4 w-4 rotate-90" />
                    </span>
                </div>
                <button
                    type="button"
                    onClick={openAdd}
                    disabled={listLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition-colors hover:bg-accent/95 disabled:opacity-50 lg:ml-auto"
                >
                    <Icon src="/img/icons/plus.svg" className="h-5 w-5 text-white" />
                    Add Expense
                </button>
            </div>

            {expensesError && (
                <p className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                    Could not load expenses. Try again or check that you are signed in.
                </p>
            )}

            <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px] text-left text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/90 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                                <th className="w-12 px-4 py-3">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent/30"
                                        checked={allOnPageSelected}
                                        onChange={togglePage}
                                        disabled={listLoading || pageSlice.length === 0}
                                        aria-label="Select all on this page"
                                    />
                                </th>
                                <th className="px-4 py-3">Description</th>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3">Category</th>
                                <th className="px-4 py-3 text-right">Amount</th>
                                <th className="w-24 px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {listLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-12 text-center text-secondary">
                                        Loading expenses…
                                    </td>
                                </tr>
                            ) : pageSlice.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-12 text-center text-secondary">
                                        No expenses in this period{search || categoryFilter !== 'all' ? ' (try adjusting filters)' : ''}.
                                    </td>
                                </tr>
                            ) : (
                                pageSlice.map((row) => (
                                    <tr key={row.id} className="text-gray-800 transition-colors hover:bg-gray-50/80">
                                        <td className="px-4 py-3">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent/30"
                                                checked={selectedIds.has(row.id)}
                                                onChange={() => toggleRow(row.id)}
                                                aria-label={`Select ${row.description}`}
                                            />
                                        </td>
                                        <td className="px-4 py-3 font-medium">{row.description}</td>
                                        <td className="px-4 py-3 text-secondary">{formatDisplayDate(row.expenseDate)}</td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${categoryPillClass(row.categoryName)}`}>
                                                {row.categoryName}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right font-semibold tabular-nums">{formatMoney(row.amount)}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => openEdit(row)}
                                                    disabled={mutationBusy}
                                                    className="rounded-lg p-2 text-secondary transition-colors hover:bg-gray-100 hover:text-accent disabled:opacity-40"
                                                    aria-label={`Edit ${row.description}`}
                                                >
                                                    <PencilIcon />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => void handleDelete(row.id)}
                                                    disabled={mutationBusy}
                                                    className="rounded-lg p-2 text-secondary transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:opacity-40"
                                                    aria-label={`Delete ${row.description}`}
                                                >
                                                    <TrashIcon />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-secondary">
                        Showing {rangeStart}-{rangeEnd} of {filtered.length}
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                        <button
                            type="button"
                            disabled={safePage <= 1 || listLoading}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            className="rounded-lg px-3 py-1.5 font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Previous
                        </button>
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white">{safePage}</span>
                        <span className="text-secondary">of {totalPages}</span>
                        <button
                            type="button"
                            disabled={safePage >= totalPages || listLoading}
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            className="rounded-lg px-3 py-1.5 font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            <AddExpenseModal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setEditing(null);
                }}
                categories={categoryOptions.map((c) => ({ id: c.id, name: c.name }))}
                onSave={handleSave}
                editing={editing}
                isSaving={createExpense.isPending || updateExpense.isPending}
            />
        </div>
    );
}
