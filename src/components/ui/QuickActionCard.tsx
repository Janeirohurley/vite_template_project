// src/components/QuickActionCardVertical.tsx
import { motion } from "framer-motion";
import clsx from "clsx";
import type { LucideIcon } from "lucide-react";

interface QuickActionCardVerticalProps {
    title: string;
    description?: string;
    icon: LucideIcon;
    onClick?: () => void;
    color?: "blue" | "emerald" | "red" | "purple" | "orange" | "indigo" | "pink";
    disabled?: boolean;
    className?: string;
}

const colorVariants = {
    blue: {
        accent: "bg-blue-500",
        icon: "text-blue-600",
        ring: "focus-visible:ring-blue-500/40",
    },
    emerald: {
        accent: "bg-emerald-500",
        icon: "text-emerald-600",
        ring: "focus-visible:ring-emerald-500/40",
    },
    red: {
        accent: "bg-red-500",
        icon: "text-red-600",
        ring: "focus-visible:ring-red-500/40",
    },
    purple: {
        accent: "bg-purple-500",
        icon: "text-purple-600",
        ring: "focus-visible:ring-purple-500/40",
    },
    orange: {
        accent: "bg-orange-500",
        icon: "text-orange-600",
        ring: "focus-visible:ring-orange-500/40",
    },
    indigo: {
        accent: "bg-indigo-500",
        icon: "text-indigo-600",
        ring: "focus-visible:ring-indigo-500/40",
    },
    pink: {
        accent: "bg-pink-500",
        icon: "text-pink-600",
        ring: "focus-visible:ring-pink-500/40",
    },
} as const;

export function QuickActionCard({
    title,
    description,
    icon: Icon,
    onClick,
    color = "blue",
    disabled = false,
    className,
}: QuickActionCardVerticalProps) {
    const colors = colorVariants[color];

    return (
        <motion.button
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
            whileHover={!disabled ? { y: -3 } : {}}
            whileTap={!disabled ? { scale: 0.97 } : {}}
            className={clsx(
                "relative w-full rounded-xl border",
                "bg-white dark:bg-gray-900",
                "p-5 text-left transition-all",
                "border-gray-200 dark:border-gray-800",
                "hover:shadow-lg",
                "focus-visible:outline-none focus-visible:ring-2",
                colors.ring,
                disabled && "opacity-50 cursor-not-allowed",
                className
            )}
        >
            {/* Accent top */}
            <div
                className={clsx(
                    "absolute left-0 top-0 h-1 w-full rounded-t-xl",
                    colors.accent
                )}
            />

            <div className="flex flex-col items-start gap-4">
                {/* Icon */}
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                    <Icon className={clsx("h-5 w-5", colors.icon)} strokeWidth={2.2} />
                </div>

                {/* Content */}
                <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                        {title}
                    </h3>

                    {description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-3">
                            {description}
                        </p>
                    )}
                </div>

                {/* CTA */}
                {!disabled && (
                    <span className="mt-2 inline-flex items-center text-xs font-medium text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300">
                        Action →
                    </span>
                )}
            </div>
        </motion.button>
    );
}
