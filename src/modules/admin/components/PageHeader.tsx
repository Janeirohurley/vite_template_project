import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { useMemo, type ReactNode } from "react";
import { Link, useLocation } from "@tanstack/react-router";

interface BreadcrumbItem {
    label: string;
    href?: string;
    active?: boolean;
}

interface PageHeaderProps {
    title: string;
    description?: string;
    breadcrumbs?: BreadcrumbItem[];
    className?: string;
    rightElement?: ReactNode;
}

export function PageHeader({
    title,
    description,
    breadcrumbs,
    className,
    rightElement,
}: PageHeaderProps) {
    const location = useLocation();

    const autoBreadcrumbs = useMemo<BreadcrumbItem[]>(() => {
        const pathname = location.pathname || "/";
        const segments = pathname.split("/").filter(Boolean);

        if (segments.length === 0) {
            return [{ label: "Accueil", href: "/", active: true }];
        }

        let cumulativePath = "";

        return segments.map((segment, index) => {
            cumulativePath += `/${segment}`;
            const label = decodeURIComponent(segment)
                .replace(/[-_]+/g, " ")
                .replace(/\b\w/g, (char) => char.toUpperCase());

            return {
                label,
                href: cumulativePath,
                active: index === segments.length - 1,
            };
        });
    }, [location.pathname]);

    const breadcrumbItems = breadcrumbs && breadcrumbs.length > 0 ? breadcrumbs : autoBreadcrumbs;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }} // plus rapide
            className={cn("mb-4", className)} // moins de marge
        >
            {/* Breadcrumb */}
            {breadcrumbItems.length > 0 && (
                <nav className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-1" aria-label="Breadcrumb">
                    {breadcrumbItems.map((crumb, index) => (
                        <div key={index} className="flex items-center">
                            {crumb.href ? (
                                <Link
                                    to={crumb.href}
                                    className={cn(
                                        "hover:underline",
                                        crumb.active ? "text-blue-600 dark:text-blue-400" : ""
                                    )}
                                >
                                    {crumb.label}
                                </Link>
                            ) : (
                                <span className={crumb.active ? "text-blue-600 dark:text-blue-400" : ""}>
                                    {crumb.label}
                                </span>
                            )}
                            {index < breadcrumbItems.length - 1 && <ChevronRight className="h-3 w-3 mx-1 text-gray-400 dark:text-gray-500" />}
                        </div>
                    ))}
                </nav>
            )}

            <div className="flex items-start justify-between gap-3 mb-1">
                <h1 className="text-2xl sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {title}
                </h1>
                {rightElement && <div className="shrink-0">{rightElement}</div>}
            </div>

            {/* Description */}
            {description && (
                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                    {description}
                </p>
            )}
        </motion.div>
    );
}
