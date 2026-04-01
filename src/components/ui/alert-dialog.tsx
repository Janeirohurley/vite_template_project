import * as React from "react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

interface AlertDialogContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const AlertDialogContext = React.createContext<AlertDialogContextValue | undefined>(undefined)

function useAlertDialog() {
  const context = React.useContext(AlertDialogContext)
  if (!context) {
    throw new Error("AlertDialog components must be used within AlertDialog")
  }
  return context
}

interface AlertDialogProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

function AlertDialog({ children, open: controlledOpen, onOpenChange }: AlertDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const handleOpenChange = onOpenChange || setInternalOpen

  return (
    <AlertDialogContext.Provider value={{ open, onOpenChange: handleOpenChange }}>
      {children}
    </AlertDialogContext.Provider>
  )
}

interface AlertDialogTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

const AlertDialogTrigger = React.forwardRef<HTMLButtonElement, AlertDialogTriggerProps>(
  ({ className, onClick, children, asChild, ...props }, ref) => {
    const { onOpenChange } = useAlertDialog()

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onOpenChange(true)
      onClick?.(e)
    }

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, {
        onClick: handleClick,
      } as any)
    }

    return (
      <button
        ref={ref}
        className={className}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    )
  }
)
AlertDialogTrigger.displayName = "AlertDialogTrigger"

const AlertDialogPortal = ({ children }: { children: React.ReactNode }) => {
  const { open } = useAlertDialog()
  if (!open) return null
  return <>{children}</>
}

const AlertDialogOverlay = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { onOpenChange } = useAlertDialog()

  return (
    <div
      ref={ref}
      className={cn(
        "fixed inset-0 z-50 bg-black/80 backdrop-blur-sm transition-opacity duration-200",
        className
      )}
      onClick={() => onOpenChange(false)}
      {...props}
    />
  )
})
AlertDialogOverlay.displayName = "AlertDialogOverlay"

const AlertDialogContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <div
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-gray-200 bg-white p-6 shadow-lg rounded-lg dark:border-gray-700 dark:bg-gray-800",
        className
      )}
      onClick={(e) => e.stopPropagation()}
      {...props}
    />
  </AlertDialogPortal>
))
AlertDialogContent.displayName = "AlertDialogContent"

const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
AlertDialogHeader.displayName = "AlertDialogHeader"

const AlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
AlertDialogFooter.displayName = "AlertDialogFooter"

const AlertDialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn("text-lg font-semibold text-gray-900 dark:text-gray-100", className)}
    {...props}
  />
))
AlertDialogTitle.displayName = "AlertDialogTitle"

const AlertDialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-600 dark:text-gray-400", className)}
    {...props}
  />
))
AlertDialogDescription.displayName = "AlertDialogDescription"

const AlertDialogAction = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, onClick, ...props }, ref) => {
  const { onOpenChange } = useAlertDialog()

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e)
    onOpenChange(false)
  }

  return (
    <button
      ref={ref}
      className={cn(buttonVariants(), className)}
      onClick={handleClick}
      {...props}
    />
  )
})
AlertDialogAction.displayName = "AlertDialogAction"

const AlertDialogCancel = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, onClick, ...props }, ref) => {
  const { onOpenChange } = useAlertDialog()

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e)
    onOpenChange(false)
  }

  return (
    <button
      ref={ref}
      className={cn(
        buttonVariants({ variant: "outline" }),
        "mt-2 sm:mt-0",
        className
      )}
      onClick={handleClick}
      {...props}
    />
  )
})
AlertDialogCancel.displayName = "AlertDialogCancel"

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
