export default function GuestProfileSkeleton() {
    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
            {/* Status banner */}
            <div className="h-14 rounded-lg bg-gray-200 dark:bg-gray-700" />

            {/* Alert */}
            <div className="p-4 rounded-lg border bg-gray-100 border-gray-200 dark:bg-gray-800 dark:border-gray-700 space-y-2">
                <div className="h-4 w-40 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-3 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="space-y-1">
                    <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
                    <div className="h-3 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
                </div>
            </div>

            {/* Header */}
            <div className="space-y-2">
                <div className="h-6 w-48 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-4 w-96 rounded bg-gray-200 dark:bg-gray-700" />
            </div>

            {/* Progress */}
            <div className="rounded-lg border p-4 space-y-3 bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700">
                <div className="flex justify-between">
                    <div className="h-4 w-40 rounded bg-gray-200 dark:bg-gray-700" />
                    <div className="h-4 w-10 rounded bg-gray-200 dark:bg-gray-700" />
                </div>
                <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700" />
                <div className="h-3 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Photo */}
                    <div className="rounded-lg border p-6 bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700 space-y-4">
                        <div className="h-5 w-40 rounded bg-gray-200 dark:bg-gray-700" />
                        <div className="flex gap-6">
                            <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-700" />
                            <div className="flex-1 space-y-2">
                                <div className="h-3 w-full rounded bg-gray-200 dark:bg-gray-700" />
                                <div className="h-3 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
                                <div className="space-y-1 pt-2">
                                    <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
                                    <div className="h-3 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="rounded-lg border p-6 bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700 space-y-6">
                        <div className="h-5 w-56 rounded bg-gray-200 dark:bg-gray-700" />

                        <div className="grid gap-4 sm:grid-cols-2">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-700" />
                                    <div className="h-10 rounded-lg bg-gray-200 dark:bg-gray-700" />
                                </div>
                            ))}

                            <div className="sm:col-span-2 space-y-2">
                                <div className="h-3 w-32 rounded bg-gray-200 dark:bg-gray-700" />
                                <div className="h-10 rounded-lg bg-gray-200 dark:bg-gray-700" />
                                <div className="h-3 w-48 rounded bg-gray-200 dark:bg-gray-700" />
                            </div>

                            <div className="sm:col-span-2 space-y-2">
                                <div className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-700" />
                                <div className="h-16 rounded-lg bg-gray-200 dark:bg-gray-700" />
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <div className="h-10 w-32 rounded-lg bg-gray-300 dark:bg-gray-600" />
                            <div className="h-10 w-48 rounded-lg bg-gray-300 dark:bg-gray-600" />
                        </div>

                        <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="rounded-lg border p-6 bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700 space-y-4">
                        <div className="h-5 w-40 rounded bg-gray-200 dark:bg-gray-700" />
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="rounded-lg border p-3 border-gray-200 dark:border-gray-700 space-y-2">
                                <div className="flex justify-between">
                                    <div className="h-3 w-40 rounded bg-gray-200 dark:bg-gray-700" />
                                    <div className="h-4 w-16 rounded-full bg-gray-300 dark:bg-gray-600" />
                                </div>
                                <div className="h-3 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
                                <div className="h-10 rounded-lg bg-gray-200 dark:bg-gray-700" />
                                <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
                            </div>
                        ))}
                    </div>

                    <div className="rounded-lg border p-4 bg-gray-100 border-gray-200 dark:bg-gray-800 dark:border-gray-700 space-y-2">
                        <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700" />
                        <div className="h-3 w-full rounded bg-gray-200 dark:bg-gray-700" />
                    </div>
                </div>
            </div>
        </div>
    );
}
