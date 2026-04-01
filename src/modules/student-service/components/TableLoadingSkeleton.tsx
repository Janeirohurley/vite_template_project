interface TableLoaderProps {
    rows?: number;
    columns?: number;
}

const TableLoadingSkeleton = ({ rows = 6, columns = 5 }: TableLoaderProps) => {
    return (
        <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Header de la Table */}
            <div className="bg-slate-50/50 border-b border-slate-200 p-4 flex items-center justify-between">
                <div className="h-5 w-40 bg-slate-200 rounded-md animate-pulse" /> {/* Titre de la table */}
                <div className="flex gap-2">
                    <div className="h-9 w-24 bg-slate-200 rounded-lg animate-pulse" /> {/* Bouton Action 1 */}
                    <div className="h-9 w-32 bg-slate-200 rounded-lg animate-pulse" /> {/* Bouton Action 2 */}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-100">
                            {[...Array(columns)].map((_, i) => (
                                <th key={i} className="p-4">
                                    <div className="h-4 w-24 bg-slate-100 rounded animate-pulse" />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {[...Array(rows)].map((_, rowIndex) => (
                            <tr key={rowIndex} className="border-b border-slate-50 last:border-none">
                                {/* Colonne 1 : Souvent un Avatar + Texte */}
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-slate-200 animate-pulse" />
                                        <div className="space-y-2">
                                            <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
                                            <div className="h-3 w-20 bg-slate-100 rounded animate-pulse" />
                                        </div>
                                    </div>
                                </td>

                                {/* Colonnes de données classiques */}
                                {[...Array(columns - 2)].map((_, colIndex) => (
                                    <td key={colIndex} className="p-4">
                                        <div className={`h-4 bg-slate-100 rounded animate-pulse ${colIndex % 2 === 0 ? 'w-28' : 'w-20'
                                            }`} />
                                    </td>
                                ))}

                                {/* Dernière Colonne : Badge ou Action */}
                                <td className="p-4 text-right">
                                    <div className="flex justify-end items-center gap-2">
                                        <div className="h-6 w-16 bg-slate-100 rounded-full animate-pulse" />
                                        <div className="h-8 w-8 bg-slate-50 rounded animate-pulse" />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer / Pagination */}
            <div className="p-4 border-t border-slate-100 flex justify-between items-center">
                <div className="h-4 w-48 bg-slate-100 rounded animate-pulse" />
                <div className="flex gap-1">
                    <div className="h-8 w-8 bg-slate-100 rounded animate-pulse" />
                    <div className="h-8 w-8 bg-slate-100 rounded animate-pulse" />
                </div>
            </div>
        </div>
    );
};

export default TableLoadingSkeleton;