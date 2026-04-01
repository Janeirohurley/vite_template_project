const StatsCardShimmer = () => {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <div className="space-y-4">
                {/* Title placeholder */}
                <div className="h-4 w-32 rounded-md bg-gray-200 animate-pulse dark:bg-gray-700" />

                {/* Main value placeholder */}
                <div className="h-9 w-48 rounded-lg bg-gray-300 animate-pulse dark:bg-gray-600" />

                {/* Subtitle placeholder */}
                <div className="h-3 w-24 rounded-md bg-gray-200 animate-pulse dark:bg-gray-700" />
            </div>
        </div>
    );
};

export default StatsCardShimmer;