import { cn } from "@/lib/utils";
import React from "react";

interface SettingsHeaderProps {
    title: string;
    icon?: React.ReactNode;
    className?: string;
}

export default function SettingsHeader({
    title,
    icon,
    className = "",
}: SettingsHeaderProps) {
    return (

        <div className={cn("px-2 py-1 bg-linear-to-r from-primary/5 via-primary/10 to-transparent border-b border-gray-200 dark:border-gray-800", className)}>
            <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform">
                    {icon && <>{icon}</>}
                </div>
                <h3 className="text-md font-semibold text-gray-900 dark:text-white">
                    {title}
                </h3>
            </div>
        </div>
    );
}
