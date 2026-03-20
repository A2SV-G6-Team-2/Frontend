import { debtData } from '../constants';

export default function DebtOverview({ className = "" }: { className?: string }) {
    return (
        <div className={`bg-white w-full rounded-xl shadow mt-5 p-4 ${className}`}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-black">Debt Overview</h2>
                <span className="text-sm font-medium text-slate-400">Net Debt : +$25</span>
            </div>
            
            <div className="w-full overflow-x-auto max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
                <table className="w-full border-separate border-spacing-0 text-left text-sm">
                    <thead className="sticky top-0 z-10">
                        <tr className="bg-gray-50">
                            <th className="rounded-l-xl px-6 py-4 font-medium text-gray-500">Person</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Type</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Date</th>
                            <th className="rounded-r-xl px-6 py-4 font-medium text-gray-500 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {debtData.map((item, index) => (
                            <tr key={index}>
                                <td className="border-gray-100 border-b px-6 py-4 font-medium text-gray-900">{item.person}</td>
                                <td className="border-gray-100 border-b px-6 py-4">
                                    <span className={`inline-flex items-center justify-center rounded-full px-8 py-1.5 text-xs font-medium ${
                                        item.type === 'Lent' 
                                        ? 'bg-blue-50 text-blue-500' 
                                        : 'bg-pink-50 text-pink-500'
                                    }`}>
                                        {item.type}
                                    </span>
                                </td>
                                <td className="border-gray-100 border-b px-6 py-4 text-gray-800">{item.date}</td>
                                <td className={`border-gray-100 border-b px-6 py-4 font-medium text-right ${
                                    item.type === 'Lent' ? 'text-blue-500' : 'text-pink-500'
                                }`}>
                                    {item.amount}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
