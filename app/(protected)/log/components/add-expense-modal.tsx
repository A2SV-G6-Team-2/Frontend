'use client';

import { useEffect, useState } from 'react';
import Icon from '@/components/icon';
import type { ExpenseLogRow, NewExpenseInput } from '../types';

type CategoryOption = { id: string; name: string };

export type SaveExpensePayload = NewExpenseInput & { id?: string };

type AddExpenseModalProps = {
    isOpen: boolean;
    onClose: () => void;
    categories: CategoryOption[];
    onSave: (payload: SaveExpensePayload) => void | Promise<void>;
    editing?: ExpenseLogRow | null;
    isSaving?: boolean;
};

function DocIcon({ className }: { className?: string }) {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <path d="M14 2v6h6" />
        </svg>
    );
}

function MoneyIcon({ className }: { className?: string }) {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <rect width="20" height="12" x="2" y="6" rx="2" />
            <circle cx="12" cy="12" r="2" />
            <path d="M6 12h.01M18 12h.01" />
        </svg>
    );
}

function CalendarIcon({ className }: { className?: string }) {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M8 2v4" />
            <path d="M16 2v4" />
            <rect width="18" height="18" x="3" y="4" rx="2" />
            <path d="M3 10h18" />
        </svg>
    );
}

function CategoryIcon({ className }: { className?: string }) {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="m9 9 3 3 3-3" />
            <path d="M12 12v9" />
            <path d="M4 9h16" />
            <circle cx="6" cy="5" r="1.5" />
            <rect x="15" y="3" width="4" height="4" rx="0.5" />
        </svg>
    );
}

export default function AddExpenseModal({ isOpen, onClose, categories, onSave, editing = null, isSaving = false }: AddExpenseModalProps) {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [expenseDate, setExpenseDate] = useState('');
    const [categoryId, setCategoryId] = useState('');

    useEffect(() => {
        if (!isOpen) return;
        if (editing) {
            setDescription(editing.description);
            setAmount(String(editing.amount));
            setExpenseDate(editing.expenseDate);
            setCategoryId(editing.categoryId);
        } else {
            setDescription('');
            setAmount('');
            setExpenseDate(new Date().toISOString().split('T')[0] ?? '');
            setCategoryId('');
        }
    }, [isOpen, editing]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSaving) return;
        const cat = categories.find((c) => c.id === categoryId);
        const categoryName = cat?.name ?? '';
        const base = {
            description: description.trim(),
            amount: parseFloat(amount) || 0,
            expenseDate,
            categoryId,
            categoryName,
        };
        try {
            if (editing?.id) {
                await onSave({ ...base, id: editing.id });
            } else {
                await onSave(base);
            }
            onClose();
        } catch {
            /* parent / API errors surface via console or toast */
        }
    };

    const title = editing ? 'Edit Expense' : 'Add New Expense';
    const subtitle = editing ? 'Update this expense.' : 'Enter the details of your latest spending.';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="presentation" onClick={() => !isSaving && onClose()}>
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="expense-modal-title"
                className="relative w-full max-w-lg rounded-[1.75rem] bg-white p-8 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-6 top-6 rounded-lg p-1 text-secondary hover:bg-gray-100 hover:text-gray-700 transition-colors"
                    aria-label="Close"
                >
                    <Icon src="/img/icons/x.svg" className="h-5 w-5" />
                </button>

                <h2 id="expense-modal-title" className="text-2xl font-bold text-gray-900 tracking-tight pr-10">
                    {title}
                </h2>
                <p className="mt-1 text-sm text-secondary">{subtitle}</p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5" aria-busy={isSaving}>
                    <div>
                        <label htmlFor="exp-desc" className="mb-2 block text-sm font-semibold text-slate-600">
                            Description
                        </label>
                        <div className="relative">
                            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-secondary">
                                <DocIcon className="h-5 w-5" />
                            </span>
                            <input
                                id="exp-desc"
                                required
                                type="text"
                                placeholder="e.g. Rent, Netflix subscription"
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-accent/40 focus:ring-2 focus:ring-accent/15"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label htmlFor="exp-amt" className="mb-2 block text-sm font-semibold text-slate-600">
                                Amount
                            </label>
                            <div className="relative">
                                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-secondary">
                                    <MoneyIcon className="h-5 w-5" />
                                </span>
                                <input
                                    id="exp-amt"
                                    required
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-accent/40 focus:ring-2 focus:ring-accent/15"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="exp-date" className="mb-2 block text-sm font-semibold text-slate-600">
                                Date
                            </label>
                            <div className="relative">
                                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-secondary">
                                    <CalendarIcon className="h-5 w-5" />
                                </span>
                                <input
                                    id="exp-date"
                                    required
                                    type="date"
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-4 text-gray-900 outline-none focus:border-accent/40 focus:ring-2 focus:ring-accent/15"
                                    value={expenseDate}
                                    onChange={(e) => setExpenseDate(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="exp-cat" className="mb-2 block text-sm font-semibold text-slate-600">
                            Category
                        </label>
                        <div className="relative">
                            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-secondary">
                                <CategoryIcon className="h-5 w-5" />
                            </span>
                            <select
                                id="exp-cat"
                                className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-10 text-gray-900 outline-none focus:border-accent/40 focus:ring-2 focus:ring-accent/15"
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                            >
                                <option value="">Uncategorized</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-secondary">
                                <Icon src="/img/icons/chevron-right.svg" className="h-4 w-4 rotate-90" />
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSaving}
                            className="flex-1 rounded-xl border border-gray-200 bg-white py-3.5 text-center text-sm font-semibold text-gray-800 shadow-sm transition-colors hover:bg-gray-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex-1 rounded-xl bg-accent py-3.5 text-center text-sm font-semibold text-white shadow-lg shadow-accent/25 transition-colors hover:bg-accent/95 disabled:opacity-60"
                        >
                            {isSaving ? 'Saving…' : editing ? 'Save changes' : 'Save Expense'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
