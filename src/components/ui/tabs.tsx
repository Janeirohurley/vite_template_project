import * as React from "react"
import { cn } from "@/lib/utils"

interface TabsContextValue {
  value: string
  onValueChange: (value: string) => void
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined)

function useTabs() {
  const context = React.useContext(TabsContext)
  if (!context) {
    throw new Error("Tabs components must be used within Tabs")
  }
  return context
}

interface TabsProps {
  children: React.ReactNode
  value?: string
  onValueChange?: (value: string) => void
  defaultValue?: string
}

function Tabs({ children, value: controlledValue, onValueChange, defaultValue }: TabsProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue || '')

  const value = controlledValue !== undefined ? controlledValue : internalValue
  const handleValueChange = onValueChange || setInternalValue

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <div>{children}</div>
    </TabsContext.Provider>
  )
}

const TabsList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
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
          "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          isActive
            ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-100"
            : "text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700",
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
          "mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
          className
        )}
        {...props}
      />
    )
  }
)
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }
