'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/icon';
import { useCreateExpense } from '@/lib/api/hooks/useExpenses';
import { useCreateDebt } from '@/lib/api/hooks/useDebts';
import { useCategories } from '@/lib/api/hooks/useCategories';
import { useProfile } from '@/lib/api/hooks/useUser';

interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialStep?: ModalStep;
}

type ModalStep = 'choice' | 'spending' | 'debt';

export default function TransactionModal({ isOpen, onClose, initialStep = 'choice' }: TransactionModalProps) {
    const [step, setStep] = useState<ModalStep>(initialStep);
    const { data: categories } = useCategories();
    
    // Reset step when modal opens
    useEffect(() => {
        if (isOpen) {
            setStep(initialStep);
        }
    }, [isOpen, initialStep]);

    const { data: profile } = useProfile();
    const createExpense = useCreateExpense();
    const createDebt = useCreateDebt();

    const [expenseForm, setExpenseForm] = useState({
        amount: '',
        note: '',
        category_id: '',
        expense_date: new Date().toISOString().split('T')[0],
    });

    const [debtForm, setDebtForm] = useState({
        type: 'lent' as 'lent' | 'borrowed',
        peer_name: '',
        amount: '',
        due_date: new Date().toISOString().split('T')[0],
        note: '',
    });

    if (!isOpen) return null;

    const handleBack = () => setStep('choice');

    const handleExpenseSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createExpense.mutateAsync({
                id: crypto.randomUUID(),
                amount: parseFloat(expenseForm.amount),
                note: expenseForm.note,
                category_id: expenseForm.category_id || undefined,
                expense_date: expenseForm.expense_date,
                is_recurring: false,
            });
            onClose();
            setStep('choice');
            setExpenseForm({
                amount: '',
                note: '',
                category_id: '',
                expense_date: new Date().toISOString().split('T')[0],
            });
        } catch (error) {
            console.error('Failed to create expense', error);
        }
    };

    const handleDebtSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createDebt.mutateAsync({
                id: crypto.randomUUID(),
                type: debtForm.type,
                peer_name: debtForm.peer_name,
                amount: parseFloat(debtForm.amount),
                due_date: debtForm.due_date,
                note: debtForm.note,
            });
            onClose();
            setStep('choice');
            setDebtForm({
                type: 'lent',
                peer_name: '',
                amount: '',
                due_date: new Date().toISOString().split('T')[0],
                note: '',
            });
        } catch (error) {
            console.error('Failed to create debt', error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6 relative overflow-hidden">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <Icon src="/img/icons/x.svg" className="h-6 w-6" />
                </button>

                {step === 'choice' && (
                    <div className="flex flex-col items-center">
                        <h2 className="text-2xl font-bold mb-8">Add Transaction</h2>
                        <div className="flex gap-8">
                            <button
                                onClick={() => setStep('spending')}
                                className="flex h-32 w-32 flex-col items-center justify-center rounded-2xl bg-accent text-white shadow-lg shadow-accent/20 transition-all hover:scale-105 hover:bg-accent/95 cursor-pointer"
                            >
                                <div className="mb-2 flex items-center justify-center">
                                    <Icon src="/img/icons/spending.svg" className="h-10 w-10" />
                                </div>
                                <span className="text-sm font-semibold tracking-wide">Spending</span>
                            </button>
                            <button
                                onClick={() => setStep('debt')}
                                className="flex h-32 w-32 flex-col items-center justify-center rounded-2xl bg-accent text-white shadow-lg shadow-accent/20 transition-all hover:scale-105 hover:bg-accent/95 cursor-pointer"
                            >
                                <div className="mb-2 flex items-center justify-center">
                                    <Icon src="/img/icons/debt.svg" className="h-10 w-10" />
                                </div>
                                <span className="text-sm font-semibold tracking-wide">Debt</span>
                            </button>
                        </div>
                    </div>
                )}

                {step === 'spending' && (
                    <div>
                        <button onClick={handleBack} className="flex items-center text-sm text-accent mb-4 p-2 font-semibold hover:bg-gray-100 rounded-lg">
                            <Icon src="/img/icons/chevron-right.svg" className="h-4 w-4 rotate-180 mr-1" />
                            Back
                        </button>
                        <h2 className="text-2xl font-bold mb-6">New Spending</h2>
                        <form onSubmit={handleExpenseSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Amount ({profile?.default_currency || 'ETB'})</label>
                                <input
                                    required
                                    type="number"
                                    step="0.01"
                                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20"
                                    value={expenseForm.amount}
                                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20"
                                    value={expenseForm.category_id}
                                    onChange={(e) => setExpenseForm({ ...expenseForm, category_id: e.target.value })}
                                >
                                    <option value="">Uncategorized</option>
                                    {Array.isArray(categories) && categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20"
                                    value={expenseForm.note}
                                    onChange={(e) => setExpenseForm({ ...expenseForm, note: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                <input
                                    required
                                    type="date"
                                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20"
                                    value={expenseForm.expense_date}
                                    onChange={(e) => setExpenseForm({ ...expenseForm, expense_date: e.target.value })}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={createExpense.isPending}
                                className="w-full py-3 bg-accent text-white rounded-xl font-bold shadow-lg shadow-accent/20 hover:bg-accent/95 transition-all mt-4 disabled:bg-gray-300"
                            >
                                {createExpense.isPending ? 'Saving...' : 'Add Spending'}
                            </button>
                        </form>
                    </div>
                )}

                {step === 'debt' && (
                    <div>
                        <button onClick={handleBack} className="flex items-center text-sm text-accent mb-4 p-2 font-semibold hover:bg-gray-100 rounded-lg">
                            <Icon src="/img/icons/chevron-right.svg" className="h-4 w-4 rotate-180 mr-1" />
                            Back
                        </button>
                        <h2 className="text-2xl font-bold mb-6">New Debt</h2>
                        <form onSubmit={handleDebtSubmit} className="space-y-4">
                            <div className="flex gap-4 mb-4">
                                <button
                                    type="button"
                                    onClick={() => setDebtForm({ ...debtForm, type: 'lent' })}
                                    className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                                        debtForm.type === 'lent' ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                    }`}
                                >
                                    Lent
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setDebtForm({ ...debtForm, type: 'borrowed' })}
                                    className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                                        debtForm.type === 'borrowed' ? 'bg-pink-500 text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                    }`}
                                >
                                    Borrowed
                                </button>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Person Name</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20"
                                    value={debtForm.peer_name}
                                    onChange={(e) => setDebtForm({ ...debtForm, peer_name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Amount ({profile?.default_currency || 'ETB'})</label>
                                <input
                                    required
                                    type="number"
                                    step="0.01"
                                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20"
                                    value={debtForm.amount}
                                    onChange={(e) => setDebtForm({ ...debtForm, amount: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                                <input
                                    required
                                    type="date"
                                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20"
                                    value={debtForm.due_date}
                                    onChange={(e) => setDebtForm({ ...debtForm, due_date: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20"
                                    value={debtForm.note}
                                    onChange={(e) => setDebtForm({ ...debtForm, note: e.target.value })}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={createDebt.isPending}
                                className={`w-full py-3 text-white rounded-xl font-bold shadow-lg transition-all mt-4 disabled:bg-gray-300 ${
                                    debtForm.type === 'lent' ? 'bg-blue-500 shadow-blue-500/20' : 'bg-pink-500 shadow-pink-500/20'
                                }`}
                            >
                                {createDebt.isPending ? 'Saving...' : 'Add Debt'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
