import type { SpendingPeriod, SpendingItem } from '../types';

interface SpendingsTableProps {
    activePeriod: SpendingPeriod;
    setActivePeriod: (period: SpendingPeriod) => void;
    currentData: SpendingItem[];
    isLoading?: boolean;
}

export default function SpendingsTable({ activePeriod, setActivePeriod, currentData, isLoading }: SpendingsTableProps) {
    return (
        <div className="bg-white w-full rounded-xl shadow mt-5 p-4">
            {/* Header Section */}
            <div className="mb-6 flex w-full items-center flex-col gap-4 justify-center sm:justify-between sm:flex-row sm:items-center">
                <h2 className="text-2xl font-bold text-black">Spendings</h2>

                {/* Segmented Control */}
                <div className="flex rounded-2xl bg-gray-100/80 p-1.5">
                    {(['Daily', 'Weekly', 'Monthly'] as SpendingPeriod[]).map((period) => (
                        <button
                            key={period}
                            onClick={() => setActivePeriod(period)}
                            className={`px-5 py-2 text-sm font-medium transition-all duration-200 rounded-xl focus:outline-none ${
                                activePeriod === period
                                    ? "bg-white text-accent shadow-sm font-semibold"
                                    : "text-gray-400 hover:text-accent hover:bg-gray-200"
                            } ${period === 'Daily' ? 'mr-1' : period === 'Monthly' ? 'ml-1' : ''}`}
                        >
                            {period}
                        </button>
                    ))}
                </div>
            </div>

            {/* Spendings Table */}
            <div className="w-full overflow-x-auto max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 min-h-[150px]">
                <table className="w-full border-separate border-spacing-0 text-left text-sm">
                    <thead className="sticky top-0 z-10">
                        <tr className="bg-gray-50">
                            <th className="rounded-l-xl px-6 py-4 font-medium text-gray-500">Note</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Type</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Date</th>
                            <th className="rounded-r-xl px-6 py-4 font-medium text-gray-500">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="relative">
                        {isLoading ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="h-2 w-2 animate-bounce rounded-full bg-accent [animation-delay:-0.3s]"></div>
                                        <div className="h-2 w-2 animate-bounce rounded-full bg-accent [animation-delay:-0.15s]"></div>
                                        <div className="h-2 w-2 animate-bounce rounded-full bg-accent"></div>
                                    </div>
                                    <span className="mt-2 block text-xs font-medium">Loading spendings...</span>
                                </td>
                            </tr>
                        ) : currentData.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-10 text-center text-gray-400 italic">
                                    No spendings found for this period.
                                </td>
                            </tr>
                        ) : (
                            currentData.map((item, index) => (
                                <tr key={index}>
                                    <td className="border-gray-100 border-b px-6 py-4 font-medium text-gray-900">{item.note}</td>
                                    <td className="border-gray-100 border-b px-6 py-4">
                                        <span className={`inline-flex items-center justify-center rounded-full px-4 py-1.5 text-xs font-medium ${item.typeColor}`}>
                                            {item.type}
                                        </span>
                                    </td>
                                    <td className="border-gray-100 border-b px-6 py-4 text-gray-800">{item.date}</td>
                                    <td className="border-gray-100 border-b px-6 py-4 font-medium text-gray-900">{item.amount}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
