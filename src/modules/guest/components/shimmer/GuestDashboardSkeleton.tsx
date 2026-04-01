export default function GuestDashboardSkeleton() {
    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <div className="h-6 w-64 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-4 w-80 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
                <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
            </div>

            {/* Status banner */}
            <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg" />

            {/* Alert */}
            <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3">
                <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-3 w-2/3 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>

            {/* Welcome card */}
            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg" />

            {/* Main grid */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Profile completion */}
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-4">
                        <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
                        <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                        <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                    </div>

                    {/* Requested role */}
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
                            <div className="space-y-2">
                                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                                <div className="h-3 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
                            </div>
                        </div>
                        <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                        <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
                    </div>

                    {/* Tips / missing items */}
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-3">
                        <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded-full" />
                                <div className="h-3 w-64 bg-gray-200 dark:bg-gray-700 rounded" />
                            </div>
                        ))}
                    </div>

                    {/* Action cards */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div
                                key={i}
                                className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"
                            />
                        ))}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Account status */}
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-3">
                        <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
                        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                    </div>

                    {/* Progress tracker */}
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-3">
                        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-3">
                        <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="flex justify-between">
                                <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                                <div className="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
                            </div>
                        ))}
                    </div>

                    {/* Permissions */}
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-3">
                        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
