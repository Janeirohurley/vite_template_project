import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CollapsibleComponentProps {
    title: string;
    children: React.ReactNode;
    defaultCollapsed?: boolean;
    className?: string;
    headerClassName?: string;
    contentClassName?: string;
}

function CollapsibleComponent({
    title,
    children,
    defaultCollapsed = false,
    className = "",
    headerClassName = "",
    contentClassName = "",
}: CollapsibleComponentProps) {
    const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

    return (
        <div
            className={cn(
                "rounded-lg border transition-colors",
                "bg-gray-50 dark:bg-gray-900",
                "border-gray-200 dark:border-gray-700",
                className
            )}
        >
            {/* Header */}
            <button
                type="button"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={cn(
                    "w-full flex items-center justify-between p-4 text-left font-medium transition-colors",
                    "hover:bg-gray-100 dark:hover:bg-gray-800",
                    headerClassName
                )}
            >
                <h3 className="text-sm">{title}</h3>
                <motion.div
                    animate={{ rotate: isCollapsed ? 0 : 180 }}
                    transition={{ duration: 0.3 }}
                >
                    <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </motion.div>
            </button>

            {/* Content */}
            <AnimatePresence initial={false}>
                {!isCollapsed && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className={cn(
                            "overflow-hidden border-t border-gray-200 dark:border-gray-700",
                            contentClassName
                        )}
                    >
                        <div className="pt-3">{children}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default CollapsibleComponent;
