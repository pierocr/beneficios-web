import { cn } from "@/lib/utils"

export function PageShell({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-7xl flex-col px-4 sm:px-6 lg:px-8",
        className
      )}
    >
      {children}
    </div>
  )
}
