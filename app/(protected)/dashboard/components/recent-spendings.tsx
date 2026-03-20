export default function RecentSpendings() {
    return (
        <div className="bg-white w-full rounded-xl shadow mt-5 p-4">
            <h2 className="text-2xl font-bold">Recent Spendings</h2>
            <div className='m-2 flex justify-center gap-6'>
                {/* Today */}
                <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full bg-green-100/60">
                    <span className="text-4xl font-extrabold tracking-tight text-green-500">
                        $12
                    </span>
                    <span className="mt-1 text-sm font-bold text-green-500">
                        Today
                    </span>
                </div>

                {/* This Week */}
                <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full bg-yellow-100/60">
                    <span className="text-4xl font-extrabold tracking-tight text-yellow-500">
                        $124
                    </span>
                    <span className="mt-1 text-sm font-bold text-yellow-500">
                        This Week
                    </span>
                </div>
            </div>
            <div className='m-2 flex justify-center gap-6'>
                {/* This Month */}
                <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full bg-red-100/60">
                    <span className="text-4xl font-extrabold tracking-tight text-pink-500">
                        $234
                    </span>
                    <span className="mt-1 text-sm font-bold text-pink-500">
                        This month
                    </span>
                </div>
            </div>
        </div>
    );
}
