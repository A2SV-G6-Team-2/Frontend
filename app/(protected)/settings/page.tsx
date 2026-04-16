'use client';

import { useEffect, useState } from 'react';
import { useProfile, useUpdateProfile } from '@/lib/api/hooks/useUser';
import { useCategories, useCreateCategory, useDeleteCategory } from '@/lib/api/hooks/useCategories';
import Icon from '@/components/icon';

type ModalType = 'name' | 'email' | 'currency' | 'frequency' | 'date' | '';
const BUDGET_STORAGE_KEY = 'spendwise_budget_amount';

type ModalState = {
    open: boolean;
    type: ModalType;
    value: string | Date | null;
};

const frequencyOptions = ['Daily', 'Weekly', 'Monthly'] as const;
const currencyOptions = ['USD', 'EUR', 'GBP', 'JPY', 'ETB'] as const;

function IconBase({ children }: { children: React.ReactNode }) {
    return (
        <span className="w-8 h-8 grid place-items-center rounded-lg bg-[#3B82F6]/10 text-[#3B82F6]">
            {children}
        </span>
    );
}

function EmailIcon() {
    return (
        <IconBase>
            <svg width="36" height="32" viewBox="0 0 36 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="36" height="32" rx="12" fill="currentColor" fillOpacity="0.12" />
                <path
                    d="M10 24C9.45 24 8.97917 23.8042 8.5875 23.4125C8.19583 23.0208 8 22.55 8 22V10C8 9.45 8.19583 8.97917 8.5875 8.5875C8.97917 8.19583 9.45 8 10 8H26C26.55 8 27.0208 8.19583 27.4125 8.5875C27.8042 8.97917 28 9.45 28 10V22C28 22.55 27.8042 23.0208 27.4125 23.4125C27.0208 23.8042 26.55 24 26 24H10ZM18 17L10 12V22H26V12L18 17ZM18 15L26 10H10L18 15ZM10 12V10V12V22V12Z"
                    fill="currentColor"
                />
            </svg>
        </IconBase>
    );
}

function CurrencyIcon() {
    return (
        <IconBase>
            <svg width="38" height="32" viewBox="0 0 38 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="38" height="32" rx="12" fill="currentColor" fillOpacity="0.12" />
                <path
                    d="M21 17C20.1667 17 19.4583 16.7083 18.875 16.125C18.2917 15.5417 18 14.8333 18 14C18 13.1667 18.2917 12.4583 18.875 11.875C19.4583 11.2917 20.1667 11 21 11C21.8333 11 22.5417 11.2917 23.125 11.875C23.7083 12.4583 24 13.1667 24 14C24 14.8333 23.7083 15.5417 23.125 16.125C22.5417 16.7083 21.8333 17 21 17ZM14 20C13.45 20 12.9792 19.8042 12.5875 19.4125C12.1958 19.0208 12 18.55 12 18V10C12 9.45 12.1958 8.97917 12.5875 8.5875C12.9792 8.19583 13.45 8 14 8H28C28.55 8 29.0208 8.19583 29.4125 8.5875C29.8042 8.97917 30 9.45 30 10V18C30 18.55 29.8042 19.0208 29.4125 19.4125C29.0208 19.8042 28.55 20 28 20H14ZM16 18H26C26.1958 17.45 26.1958 16.9792 26.5875 16.5875C26.9792 16.1958 27.45 16 28 16V12C27.45 12 26.9792 11.8042 26.5875 11.4125C26.1958 11.0208 25.7 11 25 11H16C16 10.55 15.8042 11.0208 15.4125 11.4125C15.0208 11.8042 14.55 12 14 12V16C14 16.55 14.55 16.9792 15.4125 16.5875C15.8042 16.1958 15.8042 16.3333 16 17V18ZM27 24H10C9.45 24 8.97917 23.8042 8.5875 23.4125C8.19583 23.0208 8 22.55 8 22V11H10V22H27V24ZM14 18V10V18Z"
                    fill="currentColor"
                />
            </svg>
        </IconBase>
    );
}


function CategoryIcon() {
    return (
        <IconBase>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" rx="12" fill="currentColor" fillOpacity="0.12" />
                <path
                    d="M14 19L19.5 10L25 19H14ZM25 30C23.75 30 22.6875 29.5625 21.8125 28.6875C20.9375 27.8125 20.5 26.75 20.5 25.5C20.5 24.25 20.9375 23.1875 21.8125 22.3125C22.6875 21.4375 23.75 21 25 21C26.25 21 27.3125 21.4375 28.1875 22.3125C29.0625 23.1875 29.5 24.25 29.5 25.5C29.5 26.75 29.0625 27.8125 28.1875 28.6875C27.3125 29.5625 26.25 30 25 30ZM10.5 29.5V21.5H18.5V29.5H10.5ZM25 28C25.7 28 26.2917 27.7583 26.775 27.275C27.2583 26.7917 27.5 26.2 27.5 25.5C27.5 24.8 27.2583 24.2083 26.775 23.725C26.2917 23.2417 25.7 23 25 23C24.3 23 23.7083 23.2417 23.225 23.725C22.7417 24.2083 22.5 24.8 22.5 25.5C22.5 26.2 22.7417 26.7917 23.225 27.275C23.7083 27.7583 24.3 28 25 28ZM12.5 27.5H16.5V23.5H12.5V27.5ZM17.55 17H21.45L19.5 13.85L17.55 17Z"
                    fill="currentColor"
                />
            </svg>
        </IconBase>
    );
}


function CalendarIcon() {
    return (
        <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M2 20C1.45 20 0.979167 19.8042 0.5875 19.4125C0.195833 19.0208 0 18.55 0 18V4C0 3.45 0.195833 2.97917 0.5875 2.5875C0.979167 2.19583 1.45 2 2 2H3V0H5V2H13V0H15V2H16C16.55 2 17.0208 2.19583 17.4125 2.5875C17.8042 2.97917 18 3.45 18 4V18C18 18.55 17.8042 19.0208 17.4125 19.4125C17.0208 19.8042 16.55 20 16 20H2ZM2 18H16V8H2V18ZM2 6H16V4H2V6ZM2 6V4V6ZM9 12C8.71667 12 8.47917 11.9042 8.2875 11.7125C8.09583 11.5208 8 11.2833 8 11C8 10.7167 8.09583 10.4792 8.2875 10.2875C8.47917 10.0958 8.71667 10 9 10C9.28333 10 9.52083 10.0958 9.7125 10.2875C9.90417 10.4792 10 10.7167 10 11C10 11.2833 9.90417 11.5208 9.7125 11.7125C9.52083 11.9042 9.28333 12 9 12ZM5 12C4.71667 12 4.47917 11.9042 4.2875 11.7125C4.09583 11.5208 4 11.2833 4 11C4 10.7167 4.09583 10.4792 4.2875 10.2875C4.47917 10.0958 4.71667 10 5 10C5.28333 10 5.52083 10.0958 5.7125 10.2875C5.90417 10.4792 6 10.7167 6 11C6 11.2833 5.90417 11.5208 5.7125 11.7125C5.52083 11.9042 5.28333 12 5 12ZM13 12C12.7167 12 12.4792 11.9042 12.2875 11.7125C12.0958 11.5208 12 11.2833 12 11C12 10.7167 12.0958 10.4792 12.2875 10.2875C12.4792 10.0958 12.7167 10 13 10C13.2833 10 13.5208 10.0958 13.7125 10.2875C13.9042 10.4792 14 10.7167 14 11C14 11.2833 13.9042 11.5208 13.7125 11.7125C13.5208 11.9042 13.2833 12 13 12ZM9 16C8.71667 16 8.47917 15.9042 8.2875 15.7125C8.09583 15.5208 8 15.2833 8 15C8 14.7167 8.09583 14.4792 8.2875 14.2875C8.47917 14.0958 8.71667 14 9 14C9.28333 14 9.52083 14.0958 9.7125 14.2875C9.90417 14.4792 10 14.7167 10 15C10 15.2833 9.90417 15.5208 9.7125 15.7125C9.52083 15.9042 9.28333 16 9 16ZM5 16C4.71667 16 4.47917 15.9042 4.2875 15.7125C4.09583 15.5208 4 15.2833 4 15C4 14.7167 4.09583 14.4792 4.2875 14.2875C4.47917 14.0958 4.71667 14 5 14C5.28333 14 5.52083 14.0958 5.7125 14.2875C5.90417 14.4792 6 14.7167 6 15C6 15.2833 5.90417 15.5208 5.7125 15.7125C5.52083 15.9042 5.28333 16 5 16ZM13 16C12.7167 16 12.4792 15.9042 12.2875 15.7125C12.0958 15.5208 12 15.2833 12 15C12 14.7167 12.0958 14.4792 12.2875 14.2875C12.4792 14.0958 12.7167 14 13 14C13.2833 14 13.5208 14.0958 13.7125 14.2875C13.9042 14.4792 14 14.7167 14 15C14 15.2833 13.9042 15.5208 13.7125 15.7125C13.5208 15.9042 13.2833 16 13 16Z"
                fill="currentColor"
            />
        </svg>
    );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-4">
            <div className="text-xs text-accent font-semibold">{title}</div>
            {children}
        </div>
    );
}

function Row({
    icon,
    label,
    sub,
    onClick,
}: {
    icon?: React.ReactNode;
    label: string;
    sub?: string;
    onClick?: () => void;
}) {
    const clickable = typeof onClick === 'function';

    return (
        <div
            className={`flex justify-between items-center p-3 rounded-lg transition-all duration-200 bg-white border border-gray-200 ${
                clickable ? 'cursor-pointer hover:bg-gray-50 hover:border-gray-300' : 'cursor-default'
            }`}
            onClick={onClick}
            role={clickable ? 'button' : undefined}
            tabIndex={clickable ? 0 : undefined}
            onKeyDown={
                clickable
                    ? (e) => {
                          if (e.key === 'Enter' || e.key === ' ') onClick();
                      }
                    : undefined
            }
        >
            <div className="flex items-center gap-3">
                {icon && <div>{icon}</div>}
                <div>
                    <div className="text-sm font-semibold">{label}</div>
                    {sub !== undefined && <div className="text-xs text-secondary">{sub}</div>}
                </div>
            </div>
            <div className="text-gray-400">{'>'}</div>
        </div>
    );
}

function Modal({
    isOpen,
    onClose,
    title,
    children,
}: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            role="presentation"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-label={title}
                className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-[#3B82F6]">{title}</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Close"
                    >
                        <Icon src="/img/icons/x.svg" className="h-5 w-5" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

export default function SettingsPage() {
    const { data: profile } = useProfile();
    const updateProfile = useUpdateProfile();
    const { data: categories = [] } = useCategories();
    const createCategory = useCreateCategory();
    const deleteCategory = useDeleteCategory();
    const [name, setName] = useState(profile?.name ?? 'Alex Chen');
    const [email, setEmail] = useState(profile?.email ?? 'alex.j@university.edu');
    const [currency, setCurrency] = useState(profile?.default_currency ?? 'ETB');
    const [frequency, setFrequency] = useState<(typeof frequencyOptions)[number]>('Monthly');
    const [budgetAmount, setBudgetAmount] = useState('1250.00');
    const [startDate, setStartDate] = useState(new Date());
    const [calendarMonth, setCalendarMonth] = useState(new Date(startDate.getFullYear(), startDate.getMonth(), 1));
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    const [showYearMonthPicker, setShowYearMonthPicker] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

    const [modal, setModal] = useState<ModalState>({ open: false, type: '', value: null });

    // Keep display state in sync once the profile loads.
    useEffect(() => {
        if (!profile) return;
        const extendedProfile = profile as typeof profile & {
            budget_frequency?: (typeof frequencyOptions)[number];
            budget_amount?: number;
            budget_start_date?: string;
        };
        setName(profile.name ?? 'Alex Chen');
        setEmail(profile.email ?? 'alex.j@university.edu');
        setCurrency(profile.default_currency ?? 'ETB');
        setFrequency(extendedProfile.budget_frequency ?? 'Monthly');
        if (typeof extendedProfile.budget_amount === 'number') {
            setBudgetAmount(extendedProfile.budget_amount.toFixed(2));
            localStorage.setItem(BUDGET_STORAGE_KEY, extendedProfile.budget_amount.toFixed(2));
        } else {
            const storedBudget = localStorage.getItem(BUDGET_STORAGE_KEY);
            if (storedBudget !== null) {
                setBudgetAmount(storedBudget);
            }
        }
        if (extendedProfile.budget_start_date) {
            const date = new Date(extendedProfile.budget_start_date);
            if (!Number.isNaN(date.getTime())) {
                setStartDate(date);
                setCalendarMonth(new Date(date.getFullYear(), date.getMonth(), 1));
            }
        }
    }, [profile]);

    useEffect(() => {
        if (!saveSuccess) return;
        const timeout = setTimeout(() => setSaveSuccess(null), 2500);
        return () => clearTimeout(timeout);
    }, [saveSuccess]);

    const saveProfileChanges = async (payload: Record<string, unknown>, successMessage: string) => {
        try {
            setSaveError(null);
            setSaveSuccess(null);
            await updateProfile.mutateAsync(payload as Parameters<typeof updateProfile.mutateAsync>[0]);
            setSaveSuccess(successMessage);
            return true;
        } catch {
            setSaveError('Could not save this setting. Please try again.');
            return false;
        }
    };

    const openModal = (type: ModalType) => {
        if (type === 'date') {
            setCalendarMonth(new Date(startDate.getFullYear(), startDate.getMonth(), 1));
            setModal({ open: true, type, value: startDate });
            return;
        }

        const currentValue =
            type === 'email'
                ? email
                : type === 'currency'
                  ? currency
                  : type === 'name'
                      ? name
                      : type === 'frequency'
                        ? frequency
                        : '';

        setModal({ open: true, type, value: currentValue });
    };

    const closeModal = () => {
        setModal({ open: false, type: '', value: null });
        setShowYearMonthPicker(false);
    };

    const saveModal = async () => {
        setSaveError(null);
        setSaveSuccess(null);

        if (modal.value === null) {
            closeModal();
            return;
        }

        if (modal.type === 'name' && typeof modal.value === 'string') {
            const trimmedName = modal.value.trim();
            const ok = await saveProfileChanges({ name: trimmedName }, 'Name updated.');
            if (!ok) return;
            setName(trimmedName);
        } else if (modal.type === 'email' && typeof modal.value === 'string') {
            const ok = await saveProfileChanges({ email: modal.value }, 'Email updated.');
            if (!ok) return;
            setEmail(modal.value);
        } else if (modal.type === 'currency' && typeof modal.value === 'string') {
            const normalizedCurrency = modal.value.trim().toUpperCase();
            const ok = await saveProfileChanges({ default_currency: normalizedCurrency }, 'Default currency updated.');
            if (!ok) return;
            setCurrency(normalizedCurrency);
        } else if (modal.type === 'frequency' && typeof modal.value === 'string') {
            if (modal.value === 'Daily' || modal.value === 'Weekly' || modal.value === 'Monthly') {
                const ok = await saveProfileChanges({ budget_frequency: modal.value }, 'Tracking period updated.');
                if (!ok) return;
                setFrequency(modal.value);
            }
        } else if (modal.type === 'date' && modal.value instanceof Date) {
            const ok = await saveProfileChanges({ budget_start_date: modal.value.toISOString() }, 'Start date updated.');
            if (!ok) return;
            setStartDate(modal.value);
        }

        closeModal();
    };

    const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const;
    const curMonth = calendarMonth.getMonth();
    const curYear = calendarMonth.getFullYear();
    const firstDayOfMonth = new Date(curYear, curMonth, 1).getDay();
    const daysInMonth = new Date(curYear, curMonth + 1, 0).getDate();
    const totalCells = firstDayOfMonth + daysInMonth;
    const numRows = Math.ceil(totalCells / 7);

    const selectedDate = modal.open && modal.type === 'date' && modal.value instanceof Date ? modal.value : null;

    const modalTitle =
        modal.type === 'name'
            ? 'Edit Name'
            : modal.type === 'email'
              ? 'Edit Email Address'
              : modal.type === 'currency'
                ? 'Edit Default Currency'
                : modal.type === 'frequency'
                    ? 'Select Tracking Period'
                    : 'Select Start Date';

    return (
        <div className="pt-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Settings</h1>
                <p className="mt-1 text-secondary">Tailor SpendWise to work exactly for you!</p>
            </header>
            {saveError && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{saveError}</div>}
            {saveSuccess && (
                <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{saveSuccess}</div>
            )}

            {/* Profile */}
            <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2 font-semibold text-gray-900">
                            {name}
                            <button
                                type="button"
                                onClick={() => openModal('name')}
                                className="text-gray-400 hover:text-[#3B82F6] transition p-1 rounded-full hover:bg-gray-100"
                                aria-label="Edit name"
                            >
                                ✎
                            </button>
                        </div>
                        <div className="text-secondary text-sm">{email}</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <Card title="ACCOUNT">
                        <Row icon={<EmailIcon />} label="Email Address" sub={email} onClick={() => openModal('email')} />
                        <Row
                            icon={<CurrencyIcon />}
                            label="Default Currency"
                            sub={currency}
                            onClick={() => openModal('currency')}
                        />
                    </Card>

                    <Card title="BUDGET">
                        <div className="flex gap-3 items-center flex-wrap">
                            <div className="flex items-center bg-graybg px-3 py-2 rounded-lg border border-gray-200">
                                <span className="text-gray-500">{currency.includes('ETB') ? 'ETB' : '$'}</span>
                                <input
                                    className="bg-transparent outline-none ml-2 w-28 text-sm"
                                    value={budgetAmount}
                                    inputMode="decimal"
                                    pattern="[0-9]*"
                                    onKeyDown={(e) => {
                                        const allowed = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab', '.'];
                                        if (/^[0-9]$/.test(e.key) || allowed.includes(e.key)) return;
                                        e.preventDefault();
                                    }}
                                    onChange={(e) => {
                                        let value = e.target.value;
                                        value = value.replace(/[^0-9.]/g, '');
                                        const parts = value.split('.');
                                        if (parts.length > 2) value = parts[0] + '.' + parts.slice(1).join('');
                                        setBudgetAmount(value);
                                    }}
                                    onBlur={async () => {
                                        const parsed = Number.parseFloat(budgetAmount);
                                        if (!Number.isFinite(parsed)) return;
                                        const ok = await saveProfileChanges({ budget_amount: parsed }, 'Budget amount updated.');
                                        if (!ok) return;
                                        const normalized = parsed.toFixed(2);
                                        setBudgetAmount(normalized);
                                        localStorage.setItem(BUDGET_STORAGE_KEY, normalized);
                                    }}
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card title="PREFERENCES">
                        <div className="space-y-4">
                            <Row
                                icon={<CategoryIcon />}
                                label="Category Editor"
                                sub="Manage your custom labels and icons"
                                onClick={() => setIsCategoryModalOpen(true)}
                            />
                        </div>
                    </Card>

                </div>
            </div>

            <Modal
                isOpen={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
                title="Category Editor"
            >
                <div className="space-y-4">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="New category name"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-transparent"
                        />
                        <button
                            type="button"
                            onClick={async () => {
                                const nameToAdd = newCategoryName.trim();
                                if (!nameToAdd) return;
                                try {
                                    await createCategory.mutateAsync({ name: nameToAdd });
                                    setNewCategoryName('');
                                    setSaveSuccess('Category created.');
                                } catch {
                                    setSaveError('Could not create category.');
                                }
                            }}
                            className="px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors"
                        >
                            Add
                        </button>
                    </div>
                    <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-xl">
                        {categories.length === 0 ? (
                            <div className="p-4 text-sm text-secondary">No categories yet.</div>
                        ) : (
                            categories.map((cat) => (
                                <div key={cat.id} className="flex items-center justify-between px-4 py-3 border-b border-gray-100 last:border-b-0">
                                    <span className="text-sm font-medium">{cat.name}</span>
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            if (!cat.id) return;
                                            try {
                                                await deleteCategory.mutateAsync(cat.id);
                                                setSaveSuccess('Category deleted.');
                                            } catch {
                                                setSaveError('Could not delete category.');
                                            }
                                        }}
                                        className="text-red-500 hover:text-red-600 text-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={modal.open}
                onClose={closeModal}
                title={modalTitle}
            >
                <div className="space-y-4">
                    {modal.type === 'email' && typeof modal.value === 'string' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                value={modal.value}
                                onChange={(e) => setModal({ ...modal, value: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-transparent"
                                placeholder="Enter your email"
                            />
                        </div>
                    )}

                    {modal.type === 'currency' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Default Currency</label>
                            <div className="grid grid-cols-2 gap-2">
                                {currencyOptions.map((curr) => {
                                    const picked = modal.value === curr;
                                    return (
                                        <button
                                            key={curr}
                                            type="button"
                                            onClick={() => setModal({ ...modal, value: curr })}
                                            className={`px-3 py-2 border rounded-lg transition-colors ${
                                                picked ? 'border-[#3B82F6] bg-[#3B82F6] text-white' : 'border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            {curr}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {modal.type === 'frequency' && (
                        <div className="space-y-3">
                            <p className="text-sm text-gray-600">Choose your tracking cadence for budget & reminders.</p>
                            {frequencyOptions.map((option) => (
                                <button
                                    key={option}
                                    type="button"
                                    onClick={() => setModal({ ...modal, value: option })}
                                    className={`w-full text-left border rounded-xl p-3 flex items-center justify-between transition-colors ${
                                        modal.value === option
                                            ? 'bg-[#3B82F6] text-white border-[#3B82F6]'
                                            : 'border-gray-200 bg-white hover:bg-gray-100'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl" aria-hidden>
                                            <CalendarIcon />
                                        </span>
                                        <div>
                                            <div className="font-semibold">{option}</div>
                                            <div className="text-xs text-gray-500">
                                                {option === 'Daily'
                                                    ? 'Track day by day'
                                                    : option === 'Weekly'
                                                      ? 'Every 7-day cycle'
                                                      : 'Default tracking'}
                                            </div>
                                        </div>
                                    </div>
                                    {modal.value === option && <span className="text-lg">✓</span>}
                                </button>
                            ))}
                        </div>
                    )}

                    {modal.type === 'name' && typeof modal.value === 'string' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                value={modal.value}
                                onChange={(e) => setModal({ ...modal, value: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-transparent"
                                placeholder="Enter your full name"
                            />
                        </div>
                    )}

                    {modal.type === 'date' && (
                        <div className="space-y-4 min-h-[420px]">
                            <div className="flex items-center justify-between">
                                <button
                                    type="button"
                                    onClick={() => setCalendarMonth(new Date(curYear, curMonth - 1, 1))}
                                    className="text-gray-500 hover:text-[#3B82F6]"
                                >
                                    ←
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowYearMonthPicker(true)}
                                    className="font-semibold text-lg text-[#3B82F6] hover:text-[#2563EB]"
                                >
                                    {calendarMonth.toLocaleString(undefined, { month: 'long' })} {curYear}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setCalendarMonth(new Date(curYear, curMonth + 1, 1))}
                                    className="text-gray-500 hover:text-[#3B82F6]"
                                >
                                    →
                                </button>
                            </div>

                            {showYearMonthPicker ? (
                                <div className="rounded-xl border border-gray-200 p-3">
                                    <div className="grid grid-cols-3 gap-2 mb-3">
                                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(
                                            (m, i) => {
                                                const picked = curMonth === i;
                                                return (
                                                    <button
                                                        key={m}
                                                        type="button"
                                                        onClick={() => setCalendarMonth(new Date(curYear, i, 1))}
                                                        className={`px-2 py-1 rounded-lg text-sm font-medium ${
                                                            picked ? 'bg-[#3B82F6] text-white' : 'border border-gray-300 hover:bg-gray-100'
                                                        }`}
                                                    >
                                                        {m}
                                                    </button>
                                                );
                                            }
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <button
                                            type="button"
                                            onClick={() => setCalendarMonth(new Date(curYear - 1, curMonth, 1))}
                                            className="px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-100"
                                        >
                                            Prev Year
                                        </button>
                                        <span className="text-sm font-semibold">{curYear}</span>
                                        <button
                                            type="button"
                                            onClick={() => setCalendarMonth(new Date(curYear + 1, curMonth, 1))}
                                            className="px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-100"
                                        >
                                            Next Year
                                        </button>
                                    </div>
                                    <div className="mt-3 text-right">
                                        <button
                                            type="button"
                                            onClick={() => setShowYearMonthPicker(false)}
                                            className="px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-100"
                                        >
                                            Done
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-7 text-center text-xs text-gray-500">
                                        {daysOfWeek.map((day) => (
                                            <div key={day} className="py-1">
                                                {day}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-7 gap-1 text-center h-60">
                                        {Array.from({ length: numRows * 7 }, (_, idx) => {
                                            const day = idx - firstDayOfMonth + 1;
                                            const isValid = day >= 1 && day <= daysInMonth;
                                            const isSelected =
                                                !!selectedDate &&
                                                isValid &&
                                                selectedDate.getDate() === day &&
                                                selectedDate.getMonth() === curMonth &&
                                                selectedDate.getFullYear() === curYear;

                                            return (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    disabled={!isValid}
                                                    onClick={() => {
                                                        if (!isValid) return;
                                                        setModal({ ...modal, value: new Date(curYear, curMonth, day) });
                                                    }}
                                                    className={`h-9 rounded-lg ${
                                                        isValid ? 'hover:bg-gray-100' : ''
                                                    } ${isSelected ? 'bg-[#3B82F6] text-white' : ''}`}
                                                >
                                                    {isValid ? day : ''}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                                        <button
                                            type="button"
                                            onClick={() => setModal({ ...modal, value: new Date() })}
                                            className="text-[#3B82F6] font-semibold"
                                        >
                                            Today
                                        </button>
                                        <div className="text-sm text-gray-500">
                                            Selected:{' '}
                                            {selectedDate
                                                ? selectedDate.toLocaleDateString('en-US', {
                                                      month: 'short',
                                                      day: 'numeric',
                                                      year: 'numeric',
                                                  })
                                                : 'None'}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    <div className="flex gap-3 justify-end">
                        <button
                            type="button"
                            onClick={() => {
                                setShowYearMonthPicker(false);
                                closeModal();
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setShowYearMonthPicker(false);
                                void saveModal();
                            }}
                            disabled={updateProfile.isPending}
                            className="px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {updateProfile.isPending ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>
            </Modal>

        </div>
    );
}
