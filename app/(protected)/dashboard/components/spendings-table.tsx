import type { SpendingPeriod, SpendingItem } from '../types';

interface SpendingsTableProps {
    activePeriod: SpendingPeriod;
    setActivePeriod: (period: SpendingPeriod) => void;
    currentData: SpendingItem[];
}

export default function SpendingsTable({ activePeriod, setActivePeriod, currentData }: SpendingsTableProps) {
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
            <div className="w-full overflow-x-auto max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
                <table className="w-full border-separate border-spacing-0 text-left text-sm">
                    <thead className="sticky top-0 z-10">
                        <tr className="bg-gray-50">
                            <th className="rounded-l-xl px-6 py-4 font-medium text-gray-500">Person</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Type</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Date</th>
                            <th className="rounded-r-xl px-6 py-4 font-medium text-gray-500">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((item, index) => (
                            <tr key={index}>
                                <td className="border-gray-100 border-b px-6 py-4 font-medium text-gray-900">{item.person}</td>
                                <td className="border-gray-100 border-b px-6 py-4">
                                    <span className={`inline-flex items-center justify-center rounded-full px-4 py-1.5 text-xs font-medium ${item.typeColor}`}>
                                        {item.type}
                                    </span>
                                </td>
                                <td className="border-gray-100 border-b px-6 py-4 text-gray-800">{item.date}</td>
                                <td className="border-gray-100 border-b px-6 py-4 font-medium text-gray-900">{item.amount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
