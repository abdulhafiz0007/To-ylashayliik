import { type ButtonHTMLAttributes, forwardRef } from "react"
import { Loader2 } from "lucide-react"
import { cn } from "../../lib/utils"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "outline"
    size?: "sm" | "md" | "lg"
    loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", loading, children, disabled, ...props }, ref) => {
        return (
            <button
                ref={ref}
                disabled={disabled || loading}
                className={cn(
                    "inline-flex items-center justify-center rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 disabled:pointer-events-none disabled:opacity-50",
                    {
                        "bg-primary-600 text-white hover:bg-primary-700 shadow-md shadow-primary-200": variant === "primary",
                        "bg-gold-100 text-gold-900 hover:bg-gold-200": variant === "secondary",
                        "border border-gold-200 bg-transparent hover:bg-gold-50 text-gold-800": variant === "outline",
                        "hover:bg-primary-50 text-primary-700 hover:text-primary-800": variant === "ghost",
                        "h-8 px-4 text-sm": size === "sm",
                        "h-10 px-6 text-base": size === "md",
                        "h-12 px-8 text-lg": size === "lg",
                    },
                    className
                )}
                {...props}
            >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        )
    }
)

Button.displayName = "Button"

export { Button }
