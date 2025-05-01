import { cn } from "@/lib/utils"


export function Spinner({ size = "md", className }) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  }

  return (
    <div className="flex justify-center items-center">
      <div
        className={cn(
          "animate-spin rounded-full border-solid border-t-transparent",
          sizeClasses[size],
          "border-primary",
          className,
        )}
      />
    </div>
  )
}
