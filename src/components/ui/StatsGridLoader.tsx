// components/StatsGridLoader.tsx

import React from 'react';
import StatsCardShimmer from './StatsCardShimmer'; // ajuste le chemin si besoin

type StatsGridLoaderProps<T> = {
    isPending: boolean;
    data: T[];
    renderItem: (item: T, index: number) => React.ReactNode;
    shimmerCount?: number; // optionnel, par défaut 4
};

const StatsGridLoader = <T,>({
    isPending,
    data,
    renderItem,
    shimmerCount = 4,
}: StatsGridLoaderProps<T>) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {isPending
                ? Array.from({ length: shimmerCount }).map((_, index) => (
                    <StatsCardShimmer key={`shimmer-${index}`} />
                ))
                : data.map((item, index) => (
                    <div key={index}>
                        {renderItem(item, index)}
                    </div>
                ))}
        </div>
    );
};

export default StatsGridLoader;