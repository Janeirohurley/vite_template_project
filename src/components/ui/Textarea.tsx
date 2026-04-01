import * as React from "react"
import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
    ({ className, ...props }, ref) => {
        return (
            <textarea
                className={cn(
                    // On garde exactement les mêmes styles que ton Input
                    "flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400",
                    "focus:outline-none focus:ring-0.5 focus:ring-blue-400 focus:border-blue-400",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    "min-h-[100px] resize-y", // hauteur minimale + redimensionnable verticalement
                    // Dark mode (identique à ton Input)
                    "dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500",
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)

Textarea.displayName = "Textarea"

export { Textarea }