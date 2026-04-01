import * as React from "react"
import { cn } from "@/lib/utils"

// --- LOGIQUE (INCHANGÉE) ---
interface TabsContextValue {
  value: string
  onValueChange: (value: string) => void
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined)

function useTabs() {
  const context = React.useContext(TabsContext)
  if (!context) throw new Error("Tabs components must be used within Tabs")
  return context
}

interface TabsProps {
  children: React.ReactNode
  value?: string
  onValueChange?: (value: string) => void
  defaultValue?: string
  className?: string
}

function Tabs({ children, value: controlledValue, onValueChange, defaultValue, className }: TabsProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue || '')
  const value = controlledValue !== undefined ? controlledValue : internalValue
  const handleValueChange = onValueChange || setInternalValue

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <div className={cn("w-full space-y-2", className)}>{children}</div>
    </TabsContext.Provider>
  )
}

// --- DESIGN AMÉLIORÉ ---

const TabsList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "inline-flex h-11 items-center justify-center rounded-md bg-gray-100/80 p-1 text-gray-500 ring-1 ring-inset ring-gray-200/50 dark:bg-gray-800/80 dark:text-gray-400 dark:ring-gray-700/50 backdrop-blur-sm",
      className
    )}
    {...props}
  />
))
TabsList.displayName = "TabsList"

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value: triggerValue, onClick, ...props }, ref) => {
    const { value, onValueChange } = useTabs()
    const isActive = value === triggerValue

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onValueChange(triggerValue)
      onClick?.(e)
    }

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-semibold tracking-tight transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          isActive
            ? "bg-white text-gray-950 shadow-sm ring-1 ring-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:ring-gray-600"
            : "text-gray-500 hover:bg-gray-200/50 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700/50 dark:hover:text-gray-200",
          className
        )}
        onClick={handleClick}
        {...props}
      />
    )
  }
)
TabsTrigger.displayName = "TabsTrigger"

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value: contentValue, ...props }, ref) => {
    const { value } = useTabs()
    const isActive = value === contentValue

    if (!isActive) return null

    return (
      <div
        ref={ref}
        className={cn(
          "mt-2 rounded-md border border-gray-100 bg-white p-4 shadow-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-gray-800 dark:bg-gray-950 dark:ring-offset-gray-950 animate-in fade-in zoom-in-95 duration-200",
          className
        )}
        {...props}
      />
    )
  }
)
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }