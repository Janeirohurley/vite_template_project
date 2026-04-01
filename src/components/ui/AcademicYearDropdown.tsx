import { useEffect, useRef, useState, useMemo } from "react";
import { SlidersHorizontal, Check } from "lucide-react";
import { useAcademicYears } from "@/modules/admin/hooks/useAcademicEntities";
import { useAppStore } from "@/lib/store";
import type { AcademicYear } from "@/modules/admin/types/academicTypes";

const AcademicYearDropdown = () => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const { selectedAcademicYear, setSelectedAcademicYear } = useAppStore();
    const { data: academicYearsData, isLoading } = useAcademicYears();

    const academicYears = useMemo(() => academicYearsData?.results || [], [academicYearsData?.results]);

    // 👉 Click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Sélectionner automatiquement l'année académique courante si aucune n'est sélectionnée
    useEffect(() => {
        if (!selectedAcademicYear && academicYears.length > 0) {
            const currentYear = academicYears.find(year => year.is_current) || academicYears[0];
            setSelectedAcademicYear(currentYear);
        }
    }, [academicYears, selectedAcademicYear, setSelectedAcademicYear]);

    const handleYearSelect = (year: AcademicYear) => {
        setSelectedAcademicYear(year);
        setOpen(false);
    };

    if (isLoading) {
        return (
            <div className="hidden md:flex relative">
                <div className="bg-white/10 px-4 py-2 rounded-lg">
                    <span className="text-xs font-semibold text-gray-50">Chargement...</span>
                </div>
            </div>
        );
    }

    return (
        <div ref={ref} className="hidden md:flex relative">
            {/* Trigger */}
            <button
                onClick={() => setOpen((o) => !o)}
                className="
          group flex items-center gap-2
          bg-white/10 hover:bg-white/15
          px-4 py-2 rounded-lg
          transition-all duration-200
        "
            >
                <SlidersHorizontal
                    className={`
            w-4 h-4 text-white/60
            transition-transform duration-200
            ${open ? "rotate-90" : ""}
          `}
                />
                <div className={`w-2 h-2 rounded-full absolute top-0 right-0 ${selectedAcademicYear?.is_closed ? "bg-red-500" : "bg-green-500"
                    }`} />
                <span className="text-xs font-semibold text-gray-50 whitespace-nowrap">
                    Année académique: {selectedAcademicYear?.academic_year || "Aucune"}
                </span>
            </button>

            {/* Dropdown */}
            <div
                className={`
          absolute top-full mt-2 w-full
          bg-white dark:bg-gray-800 shadow-xl rounded-md
          p-1 flex flex-col gap-1
          transition-all duration-200 origin-top
          z-50
          ${open
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-95 pointer-events-none"
                    }
        `}
            >
                {academicYears.map((year) => (
                    <button
                        key={year.id}
                        onClick={() => handleYearSelect(year)}
                        className={`
              flex items-center justify-between
              text-xs font-semibold px-3 py-2 rounded
              transition-colors relative
              ${selectedAcademicYear?.id === year.id
                                ? "bg-black/5 text-black dark:bg-white/10 dark:text-white"
                                : "text-black/80 hover:bg-black/5 dark:text-gray-200 dark:hover:bg-white/10"
                            }
            `}
                    >
                        <div className="flex items-center gap-2 ">
                            <div className={`w-2 h-2 rounded-full absolute top-0 right-0 ${year.is_closed ? "bg-red-500" : "bg-green-500"
                                }`} />
                            <div className="flex flex-col items-start">
                                <span>Année académique: {year.academic_year}</span>
                                {year.is_current && (
                                    <span className="text-xs text-green-600 font-medium">(Courante)</span>
                                )}
                            </div>
                        </div>

                        {selectedAcademicYear?.id === year.id && (
                            <Check className="w-3.5 h-3.5 text-black/70 dark:text-white/70" />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default AcademicYearDropdown;
